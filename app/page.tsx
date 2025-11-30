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
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  return (
    <div className="bg-white w-full h-full overflow-y-scroll">
      <Navbar showContactModal={showContactModal}
        setShowContactModal={setShowContactModal}/>
      <Hero/>
      <AboutUs/>
      <Services/>
      <Donation showDonateModal={showDonateModal}
        setShowDonateModal={setShowDonateModal}/>
      <Volunteer/>
      <Archives/>
      <Projects/>
      <Location/>
      <Footer/>
    </div>
  );
}
