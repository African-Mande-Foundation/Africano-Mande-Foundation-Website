"use client";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import AboutUs from "./sections/AboutUs";
import Services from "./sections/Services";
import Donation from "./sections/Donation";
import Archives from "./sections/Archives";
import Volunteer from "./sections/Volunteer";
import Projects from "./sections/Projects";
import Location from "./sections/Location";
import Footer from "./sections/Footer";
import { useState } from "react";

export default function Home() {
  const [showDonateModal, setShowDonateModal] = useState(true);
  return (
    <div className="bg-white w-auto h-auto">
      <Navbar/>
      <Hero setShowDonateModal={setShowDonateModal}/>
      <AboutUs/>
      <Services/>
      <Donation showDonateModal={showDonateModal}
        setShowDonateModal={setShowDonateModal}/>
      <Volunteer/>
      <Archives/>
      <Projects/>
      <Location/>
      <Footer setShowDonateModal={setShowDonateModal} />
    </div>
  );
}
