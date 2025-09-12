import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";

export default function Home() {
  return (
    <div className="bg-white w-screen h-auto">
      <Navbar/>
      <Hero/>
      <AboutUs/>
    </div>
  );
}
