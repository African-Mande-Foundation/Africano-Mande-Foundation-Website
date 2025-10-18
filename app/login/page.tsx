"use-client";
import { Suspense } from "react";
import LoadingBar from "../components/LoadingBar";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingBar />}>
      <LoginForm />
    </Suspense>
  );
}
