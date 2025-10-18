import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { Account, Profile, User } from "next-auth";

declare module "next-auth" {
  interface User {
    jwt?: string;
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    photoUrl?: string | null;
  }
  interface Session {
    jwt?: string;
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Email/username and password are required");
        }

        try {
          const strapiRes = await fetch(
            `${process.env.STRAPI_URL}/api/auth/local`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                identifier: credentials.identifier,
                password: credentials.password,
              }),
            },
          );

          if (!strapiRes.ok) {
            const errorData = await strapiRes.json();
            throw new Error(errorData.error?.message || "Login failed");
          }

          const data = await strapiRes.json();
          return {
            id: data.user.id.toString(),
            name: data.user.username,
            email: data.user.email,
            photoUrl: data.user.photoUrl?.url || data.user.photoUrl || null,
            jwt: data.jwt,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          given_name: profile.given_name,
          family_name: profile.family_name,
        };
      },
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope:
            "openid email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User & { jwt?: string };
      account: (Account & { access_token?: string }) | null;
      profile?: Profile & {
        picture?: string;
        given_name?: string;
        family_name?: string;
      };
    }) {
      if (account?.provider === "google" && profile?.email) {
        try {
          const registerRes = await fetch(
            `${process.env.STRAPI_URL}/api/auth/google/callback?access_token=${account.access_token}`,
            {
              method: "GET",
              headers: { Accept: "application/json" },
            },
          );

          const registerData = await registerRes.json();

          if (!registerRes.ok) {
            console.error("Strapi Google registration error:", registerData);
            return `/login?error=RegistrationFailed&message=${encodeURIComponent(registerData.error?.message || "Registration failed")}`;
          }

          user.id = registerData.user.id.toString();
          user.name = registerData.user.username || profile.name;
          user.email = registerData.user.email || profile.email;
          user.image = profile.picture || registerData.user.photoUrl;
          user.jwt = registerData.jwt;

          const updateRes = await fetch(
            `${process.env.STRAPI_URL}/api/users/${user.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.jwt}`,
              },
              body: JSON.stringify({
                firstName: profile.given_name,
                lastName: profile.family_name,
                photoUrl: profile.picture,
              }),
            },
          );
          const updateData = await updateRes.json();

          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.jwt = user.jwt;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image || user.photoUrl || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.jwt) {
        session.jwt = token.jwt as string;
        session.user = {
          id: token.id as string,
          name: token.name || null,
          email: token.email || null,
          image: typeof token.image === "string" ? token.image : null,
        };
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
