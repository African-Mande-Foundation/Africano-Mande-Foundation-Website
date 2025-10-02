"use client";
import Image from "next/image";
import { ChevronDown, Menu} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import CountryDropdown from "../components/CountryDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone, faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {faChrome} from "@fortawesome/free-brands-svg-icons";

const countryCodes = [
  { code: "+93", name: "Afghanistan", initials: "AF" },
  { code: "+355", name: "Albania", initials: "AL" },
  { code: "+213", name: "Algeria", initials: "DZ" },
  { code: "+1-684", name: "American Samoa", initials: "AS" },
  { code: "+376", name: "Andorra", initials: "AD" },
  { code: "+244", name: "Angola", initials: "AO" },
  { code: "+1-264", name: "Anguilla", initials: "AI" },
  { code: "+672", name: "Antarctica", initials: "AQ" },
  { code: "+1-268", name: "Antigua and Barbuda", initials: "AG" },
  { code: "+54", name: "Argentina", initials: "AR" },
  { code: "+374", name: "Armenia", initials: "AM" },
  { code: "+297", name: "Aruba", initials: "AW" },
  { code: "+61", name: "Australia", initials: "AU" },
  { code: "+43", name: "Austria", initials: "AT" },
  { code: "+994", name: "Azerbaijan", initials: "AZ" },
  { code: "+1-242", name: "Bahamas", initials: "BS" },
  { code: "+973", name: "Bahrain", initials: "BH" },
  { code: "+880", name: "Bangladesh", initials: "BD" },
  { code: "+1-246", name: "Barbados", initials: "BB" },
  { code: "+375", name: "Belarus", initials: "BY" },
  { code: "+32", name: "Belgium", initials: "BE" },
  { code: "+501", name: "Belize", initials: "BZ" },
  { code: "+229", name: "Benin", initials: "BJ" },
  { code: "+1-441", name: "Bermuda", initials: "BM" },
  { code: "+975", name: "Bhutan", initials: "BT" },
  { code: "+591", name: "Bolivia", initials: "BO" },
  { code: "+387", name: "Bosnia and Herzegovina", initials: "BA" },
  { code: "+267", name: "Botswana", initials: "BW" },
  { code: "+55", name: "Brazil", initials: "BR" },
  { code: "+246", name: "British Indian Ocean Territory", initials: "IO" },
  { code: "+1-284", name: "British Virgin Islands", initials: "VG" },
  { code: "+673", name: "Brunei", initials: "BN" },
  { code: "+359", name: "Bulgaria", initials: "BG" },
  { code: "+226", name: "Burkina Faso", initials: "BF" },
  { code: "+257", name: "Burundi", initials: "BI" },
  { code: "+855", name: "Cambodia", initials: "KH" },
  { code: "+237", name: "Cameroon", initials: "CM" },
  { code: "+1", name: "Canada", initials: "CA" },
  { code: "+238", name: "Cape Verde", initials: "CV" },
  { code: "+1-345", name: "Cayman Islands", initials: "KY" },
  { code: "+236", name: "Central African Republic", initials: "CF" },
  { code: "+235", name: "Chad", initials: "TD" },
  { code: "+56", name: "Chile", initials: "CL" },
  { code: "+86", name: "China", initials: "CN" },
  { code: "+61", name: "Christmas Island", initials: "CX" },
  { code: "+61", name: "Cocos Islands", initials: "CC" },
  { code: "+57", name: "Colombia", initials: "CO" },
  { code: "+269", name: "Comoros", initials: "KM" },
  { code: "+682", name: "Cook Islands", initials: "CK" },
  { code: "+506", name: "Costa Rica", initials: "CR" },
  { code: "+385", name: "Croatia", initials: "HR" },
  { code: "+53", name: "Cuba", initials: "CU" },
  { code: "+599", name: "Curacao", initials: "CW" },
  { code: "+357", name: "Cyprus", initials: "CY" },
  { code: "+420", name: "Czech Republic", initials: "CZ" },
  { code: "+243", name: "Democratic Republic of the Congo", initials: "CD" },
  { code: "+45", name: "Denmark", initials: "DK" },
  { code: "+253", name: "Djibouti", initials: "DJ" },
  { code: "+1-767", name: "Dominica", initials: "DM" },
  { code: "+1-809", name: "Dominican Republic", initials: "DO" },
  { code: "+1-829", name: "Dominican Republic", initials: "DO" },
  { code: "+1-849", name: "Dominican Republic", initials: "DO" },
  { code: "+670", name: "East Timor", initials: "TL" },
  { code: "+593", name: "Ecuador", initials: "EC" },
  { code: "+20", name: "Egypt", initials: "EG" },
  { code: "+503", name: "El Salvador", initials: "SV" },
  { code: "+240", name: "Equatorial Guinea", initials: "GQ" },
  { code: "+291", name: "Eritrea", initials: "ER" },
  { code: "+372", name: "Estonia", initials: "EE" },
  { code: "+251", name: "Ethiopia", initials: "ET" },
  { code: "+500", name: "Falkland Islands", initials: "FK" },
  { code: "+298", name: "Faroe Islands", initials: "FO" },
  { code: "+679", name: "Fiji", initials: "FJ" },
  { code: "+358", name: "Finland", initials: "FI" },
  { code: "+33", name: "France", initials: "FR" },
  { code: "+594", name: "French Guiana", initials: "GF" },
  { code: "+689", name: "French Polynesia", initials: "PF" },
  { code: "+241", name: "Gabon", initials: "GA" },
  { code: "+220", name: "Gambia", initials: "GM" },
  { code: "+995", name: "Georgia", initials: "GE" },
  { code: "+49", name: "Germany", initials: "DE" },
  { code: "+233", name: "Ghana", initials: "GH" },
  { code: "+350", name: "Gibraltar", initials: "GI" },
  { code: "+30", name: "Greece", initials: "GR" },
  { code: "+299", name: "Greenland", initials: "GL" },
  { code: "+1-473", name: "Grenada", initials: "GD" },
  { code: "+590", name: "Guadeloupe", initials: "GP" },
  { code: "+1-671", name: "Guam", initials: "GU" },
  { code: "+502", name: "Guatemala", initials: "GT" },
  { code: "+44", name: "Guernsey", initials: "GG" },
  { code: "+224", name: "Guinea", initials: "GN" },
  { code: "+245", name: "Guinea-Bissau", initials: "GW" },
  { code: "+592", name: "Guyana", initials: "GY" },
  { code: "+509", name: "Haiti", initials: "HT" },
  { code: "+504", name: "Honduras", initials: "HN" },
  { code: "+852", name: "Hong Kong", initials: "HK" },
  { code: "+36", name: "Hungary", initials: "HU" },
  { code: "+354", name: "Iceland", initials: "IS" },
  { code: "+91", name: "India", initials: "IN" },
  { code: "+62", name: "Indonesia", initials: "ID" },
  { code: "+98", name: "Iran", initials: "IR" },
  { code: "+964", name: "Iraq", initials: "IQ" },
  { code: "+353", name: "Ireland", initials: "IE" },
  { code: "+44", name: "Isle of Man", initials: "IM" },
  { code: "+972", name: "Israel", initials: "IL" },
  { code: "+39", name: "Italy", initials: "IT" },
  { code: "+225", name: "Ivory Coast", initials: "CI" },
  { code: "+1-876", name: "Jamaica", initials: "JM" },
  { code: "+81", name: "Japan", initials: "JP" },
  { code: "+44", name: "Jersey", initials: "JE" },
  { code: "+962", name: "Jordan", initials: "JO" },
  { code: "+7", name: "Kazakhstan", initials: "KZ" },
  { code: "+254", name: "Kenya", initials: "KE" },
  { code: "+686", name: "Kiribati", initials: "KI" },
  { code: "+850", name: "North Korea", initials: "KP" },
  { code: "+82", name: "South Korea", initials: "KR" },
  { code: "+965", name: "Kuwait", initials: "KW" },
  { code: "+996", name: "Kyrgyzstan", initials: "KG" },
  { code: "+856", name: "Laos", initials: "LA" },
  { code: "+371", name: "Latvia", initials: "LV" },
  { code: "+961", name: "Lebanon", initials: "LB" },
  { code: "+266", name: "Lesotho", initials: "LS" },
  { code: "+231", name: "Liberia", initials: "LR" },
  { code: "+218", name: "Libya", initials: "LY" },
  { code: "+423", name: "Liechtenstein", initials: "LI" },
  { code: "+370", name: "Lithuania", initials: "LT" },
  { code: "+352", name: "Luxembourg", initials: "LU" },
  { code: "+853", name: "Macau", initials: "MO" },
  { code: "+389", name: "Macedonia", initials: "MK" },
  { code: "+261", name: "Madagascar", initials: "MG" },
  { code: "+265", name: "Malawi", initials: "MW" },
  { code: "+60", name: "Malaysia", initials: "MY" },
  { code: "+960", name: "Maldives", initials: "MV" },
  { code: "+223", name: "Mali", initials: "ML" },
  { code: "+356", name: "Malta", initials: "MT" },
  { code: "+692", name: "Marshall Islands", initials: "MH" },
  { code: "+596", name: "Martinique", initials: "MQ" },
  { code: "+222", name: "Mauritania", initials: "MR" },
  { code: "+230", name: "Mauritius", initials: "MU" },
  { code: "+262", name: "Mayotte", initials: "YT" },
  { code: "+52", name: "Mexico", initials: "MX" },
  { code: "+691", name: "Micronesia", initials: "FM" },
  { code: "+373", name: "Moldova", initials: "MD" },
  { code: "+377", name: "Monaco", initials: "MC" },
  { code: "+976", name: "Mongolia", initials: "MN" },
  { code: "+382", name: "Montenegro", initials: "ME" },
  { code: "+1-664", name: "Montserrat", initials: "MS" },
  { code: "+212", name: "Morocco", initials: "MA" },
  { code: "+258", name: "Mozambique", initials: "MZ" },
  { code: "+95", name: "Myanmar", initials: "MM" },
  { code: "+264", name: "Namibia", initials: "NA" },
  { code: "+674", name: "Nauru", initials: "NR" },
  { code: "+977", name: "Nepal", initials: "NP" },
  { code: "+31", name: "Netherlands", initials: "NL" },
  { code: "+599", name: "Netherlands Antilles", initials: "AN" },
  { code: "+687", name: "New Caledonia", initials: "NC" },
  { code: "+64", name: "New Zealand", initials: "NZ" },
  { code: "+505", name: "Nicaragua", initials: "NI" },
  { code: "+227", name: "Niger", initials: "NE" },
  { code: "+234", name: "Nigeria", initials: "NG" },
  { code: "+683", name: "Niue", initials: "NU" },
  { code: "+672", name: "Norfolk Island", initials: "NF" },
  { code: "+1-670", name: "Northern Mariana Islands", initials: "MP" },
  { code: "+47", name: "Norway", initials: "NO" },
  { code: "+968", name: "Oman", initials: "OM" },
  { code: "+92", name: "Pakistan", initials: "PK" },
  { code: "+680", name: "Palau", initials: "PW" },
  { code: "+970", name: "Palestine", initials: "PS" },
  { code: "+507", name: "Panama", initials: "PA" },
  { code: "+675", name: "Papua New Guinea", initials: "PG" },
  { code: "+595", name: "Paraguay", initials: "PY" },
  { code: "+51", name: "Peru", initials: "PE" },
  { code: "+63", name: "Philippines", initials: "PH" },
  { code: "+64", name: "Pitcairn", initials: "PN" },
  { code: "+48", name: "Poland", initials: "PL" },
  { code: "+351", name: "Portugal", initials: "PT" },
  { code: "+1-787", name: "Puerto Rico", initials: "PR" },
  { code: "+1-939", name: "Puerto Rico", initials: "PR" },
  { code: "+974", name: "Qatar", initials: "QA" },
  { code: "+242", name: "Republic of the Congo", initials: "CG" },
  { code: "+262", name: "Reunion", initials: "RE" },
  { code: "+40", name: "Romania", initials: "RO" },
  { code: "+7", name: "Russia", initials: "RU" },
  { code: "+250", name: "Rwanda", initials: "RW" },
  { code: "+590", name: "Saint Barthelemy", initials: "BL" },
  { code: "+290", name: "Saint Helena", initials: "SH" },
  { code: "+1-869", name: "Saint Kitts and Nevis", initials: "KN" },
  { code: "+1-758", name: "Saint Lucia", initials: "LC" },
  { code: "+590", name: "Saint Martin", initials: "MF" },
  { code: "+508", name: "Saint Pierre and Miquelon", initials: "PM" },
  { code: "+1-784", name: "Saint Vincent and the Grenadines", initials: "VC" },
  { code: "+685", name: "Samoa", initials: "WS" },
  { code: "+378", name: "San Marino", initials: "SM" },
  { code: "+239", name: "Sao Tome and Principe", initials: "ST" },
  { code: "+966", name: "Saudi Arabia", initials: "SA" },
  { code: "+221", name: "Senegal", initials: "SN" },
  { code: "+381", name: "Serbia", initials: "RS" },
  { code: "+248", name: "Seychelles", initials: "SC" },
  { code: "+232", name: "Sierra Leone", initials: "SL" },
  { code: "+65", name: "Singapore", initials: "SG" },
  { code: "+1-721", name: "Sint Maarten", initials: "SX" },
  { code: "+421", name: "Slovakia", initials: "SK" },
  { code: "+386", name: "Slovenia", initials: "SI" },
  { code: "+677", name: "Solomon Islands", initials: "SB" },
  { code: "+252", name: "Somalia", initials: "SO" },
  { code: "+27", name: "South Africa", initials: "ZA" },
  { code: "+211", name: "South Sudan", initials: "SS" },
  { code: "+34", name: "Spain", initials: "ES" },
  { code: "+94", name: "Sri Lanka", initials: "LK" },
  { code: "+249", name: "Sudan", initials: "SD" },
  { code: "+597", name: "Suriname", initials: "SR" },
  { code: "+47", name: "Svalbard and Jan Mayen", initials: "SJ" },
  { code: "+268", name: "Swaziland", initials: "SZ" },
  { code: "+46", name: "Sweden", initials: "SE" },
  { code: "+41", name: "Switzerland", initials: "CH" },
  { code: "+963", name: "Syria", initials: "SY" },
  { code: "+886", name: "Taiwan", initials: "TW" },
  { code: "+992", name: "Tajikistan", initials: "TJ" },
  { code: "+255", name: "Tanzania", initials: "TZ" },
  { code: "+66", name: "Thailand", initials: "TH" },
  { code: "+228", name: "Togo", initials: "TG" },
  { code: "+690", name: "Tokelau", initials: "TK" },
  { code: "+676", name: "Tonga", initials: "TO" },
  { code: "+1-868", name: "Trinidad and Tobago", initials: "TT" },
  { code: "+216", name: "Tunisia", initials: "TN" },
  { code: "+90", name: "Turkey", initials: "TR" },
  { code: "+993", name: "Turkmenistan", initials: "TM" },
  { code: "+1-649", name: "Turks and Caicos Islands", initials: "TC" },
  { code: "+688", name: "Tuvalu", initials: "TV" },
  { code: "+256", name: "Uganda", initials: "UG" },
  { code: "+380", name: "Ukraine", initials: "UA" },
  { code: "+971", name: "United Arab Emirates", initials: "AE" },
  { code: "+44", name: "United Kingdom", initials: "GB" },
  { code: "+1", name: "United States", initials: "US" },
  { code: "+598", name: "Uruguay", initials: "UY" },
  { code: "+998", name: "Uzbekistan", initials: "UZ" },
  { code: "+678", name: "Vanuatu", initials: "VU" },
  { code: "+58", name: "Venezuela", initials: "VE" },
  { code: "+84", name: "Vietnam", initials: "VN" },
  { code: "+1-284", name: "Virgin Islands, British", initials: "VG" },
  { code: "+1-340", name: "Virgin Islands, U.S.", initials: "VI" },
  { code: "+681", name: "Wallis and Futuna", initials: "WF" },
  { code: "+212", name: "Western Sahara", initials: "EH" },
  { code: "+967", name: "Yemen", initials: "YE" },
  { code: "+260", name: "Zambia", initials: "ZM" },
  { code: "+263", name: "Zimbabwe", initials: "ZW" },
];

export default function Navbar() {
    const [dropAbout, setDropAbout] = useState(false);
    const [dropService, setDropService] = useState(false);
    const [dropArchive, setDropArchive] = useState(false);
    const [dropProject, setDropProject] = useState(false);
    const [dropLocation, setDropLocation] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [countrySearch, setCountrySearch] = useState("");
    const [selectedCode, setSelectedCode] = useState(countryCodes.find(c => c.code === "+211")?.code || countryCodes[0].code);
    const dropAboutRef = useRef<HTMLDivElement>(null);
    const dropServiceRef = useRef<HTMLDivElement>(null);
    const dropArchiveRef = useRef<HTMLDivElement>(null);
    const dropProjectRef = useRef<HTMLDivElement>(null);
    const dropLocationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropAboutRef.current && !dropAboutRef.current.contains(event.target as Node)) {
                setDropAbout(false);
            }
            if (dropServiceRef.current && !dropServiceRef.current.contains(event.target as Node)) {
                setDropService(false);
            }
            if (dropArchiveRef.current && !dropArchiveRef.current.contains(event.target as Node)) {
                setDropArchive(false);
            }
            if (dropProjectRef.current && !dropProjectRef.current.contains(event.target as Node)) {
                setDropProject(false);
            }
            if (dropLocationRef.current && !dropLocationRef.current.contains(event.target as Node)) {
                setDropLocation(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <div className="lg:hidden w-screen fixed h-20 z-50 bg-[#3b6907]">
                <div className="w-full h-full p-2 lg:px-10 items-center justify-between flex ">
                    <div className="w-15 h-15 cursor-pointer">
                        <Image
                            src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Flogo4.png?alt=media&token=f3c0fb24-3911-4151-a50d-c41656b1d2ea"
                            alt="logo"
                            width={100}
                            height={200}
                        />
                    </div>
                    <button onClick={() => {setIsMobileMenuOpen(!isMobileMenuOpen)}}>
                        <Menu className="w-10 h-10 text-white cursor-pointer" />
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="lg:hidden fixed h-screen w-screen inset-0 bg-black/40 z-60" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute right-0 top-0 z-30 w-64 h-full bg-[#3b6907]" onClick={(e) => e.stopPropagation()}>
                <div className="w-full h-full gap-y-5 flex flex-col p-2 items-center justify-start">
                    <div className="text-center text-sm font-bold border-0 border-amber-400">                        
                            <span>AFRICANO MANDE FOUNDATION</span>
                        </div>

                        
                    <div className="w-full h-200 items-center justify-start flex flex-col gap-y-2 border-0 border-amber-500 overflow-y-scroll">

                        {/* About Us */}
                        <div className="border w-full border-gray rounded-4xl py-3 px-4" ref={dropAboutRef}>
                            <button
                                className="items-center flex-col justify-between w-full text-white text-sm"
                                onClick={() => setDropAbout(!dropAbout)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>About us</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${dropAbout ? 'rotate-180' : ''}`} />
                                </div>
                                
                            </button>
                            {dropAbout && (
                                <div className="w-full text-sm">
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white" onClick={() => {
                                        const el = document.getElementById("about-us");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>Our Mission</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white" onClick={() => {
                                        const el = document.getElementById("about-us");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>Our Vision</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white" onClick={() => {
                                        const el = document.getElementById("about-us");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>Core Values</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Governance and Management</button>
                                </div>
                            )}
                            
                        </div>

                        {/* Services */}
                        <div className="border w-full border-gray rounded-4xl py-3 px-4" ref={dropServiceRef}>
                            <button
                                className="items-center flex-col justify-between w-full text-white text-sm text-left"
                                onClick={() => setDropService(!dropService)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>Our Services</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${dropService ? 'rotate-180' : ''}`} />
                                </div>
                                
                            </button>
                            {dropService && (
                                <div className="w-full text-sm">
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white" onClick={() => {
                                        const el = document.getElementById("service-1");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>Health Services</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white" onClick={() => {
                                        const el = document.getElementById("service-2");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>Education Services</button>
                                    <button className="w-full py-3 px-2 flex items-center text-left justify-start border-b border-white text-white" onClick={() => {
                                        const el = document.getElementById("service-3");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>Production and Livelihood Services</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white" onClick={() => {
                                        const el = document.getElementById("service-4");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>Media and ICT Services</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white" onClick={() => {
                                        const el = document.getElementById("service-5");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>Technical Services</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white" onClick={() => {
                                        const el = document.getElementById("service-6");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>Volunteer Services</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white" onClick={() => {
                                        const el = document.getElementById("service-7");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>Corporate Services</button>
                                </div>
                            )}
                            
                        </div>

                        {/* Archive */}
                        <div className="border w-full border-gray rounded-4xl py-3 px-4" ref={dropArchiveRef}>
                            <button
                                className="items-center flex-col justify-between w-full text-white text-sm"
                                onClick={() => setDropArchive(!dropArchive)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>Archives</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${dropArchive ? 'rotate-180' : ''}`} />
                                </div>
                                
                            </button>
                            {dropArchive && (
                                <div className="w-full text-sm text-left">
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Project Documents</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Historical Documents</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white" onClick={() => {
                                        const el = document.getElementById("gallery");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>Project Pictorial</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white" onClick={() => {
                                        const el = document.getElementById("video");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>Project Videos</button>
                                </div>
                            )}
                            
                        </div>


                        {/* Project */}
                        <div className="border w-full border-gray rounded-4xl py-3 px-4" ref={dropProjectRef}>
                            <button
                                className="items-center flex-col justify-between w-full text-white text-sm"
                                onClick={() => setDropProject(!dropProject)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>Projects</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${dropProject ? 'rotate-180' : ''}`} />
                                </div>
                            </button>
                            {dropProject && (
                                <div className="w-full text-sm">
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white" onClick={() => {
                                        const el = document.getElementById("organics");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>Maridi Organics</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white" onClick={() => {
                                        const el = document.getElementById("fm");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>Foundation FM</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white" onClick={() => {
                                        const el = document.getElementById("medical");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>Foundation Medical Center</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white" onClick={() => {
                                        const el = document.getElementById("university");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>Maridi International University</button>
                                </div>
                            )}
                        </div>


                        {/* Location */}
                        <div className="border w-full border-gray rounded-4xl py-3 px-4" ref={dropLocationRef}>
                            <button
                                className="items-center flex-col justify-between w-full text-white text-sm"
                                onClick={() => setDropLocation(!dropLocation)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>Location</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${dropLocation ? 'rotate-180' : ''}`} />
                                </div>
                                
                            </button>
                            {dropLocation && (
                                <div className="w-full text-sm">
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Google Map</button>
                                    <button className="w-full py-3 px-2 flex items-center justify-start text-left border-b border-white text-white">Maridi State Link</button>
                                </div>
                            )}
                            
                        </div>

                        {/* Contact */}
                        <div className="border w-full border-gray rounded-4xl py-3 px-4">
                            <button
                                className="items-center flex-col justify-between w-full text-white text-sm" onClick={() => {setShowContactModal(true)}}
                                
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span>Contact Us</span>
                                </div>
                                
                            </button>
                          </div>  
                        

                        <div className="w-full h-auto mt-2 items-center justify-center flex flex-col text-sm text-center font-bold gap-y-2">
                            <Link href="" className="w-full py-3 px-4 rounded-4xl bg-[#fff] text-[#005e84]">Become a Member</Link>
                            <Link href="" className="w-full py-3 px-4 rounded-4xl bg-[#005e84] text-[#fff]">Login</Link>

                        </div>
                    </div>

                    
                    
                </div>
            </div>

                </div>)}

        
        {/* Desktop Navbar */}
        <div className="hidden lg:block fixed z-50 w-full h-30 bg-[#3b6907]">

            <div className="w-full h-full items-center justify-center gap-x-2 xl:gap-x-10 2xl:justify-center  flex">
                <div className="items-center justify-center flex flex-col text-sm border-0 border-amber-500 cursor-pointer gap-y-1">
                        <Image
                            src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/AMF%20Website%20Media%2Flogo4.png?alt=media&token=f3c0fb24-3911-4151-a50d-c41656b1d2ea"
                            alt="logo"
                            width={100}
                            height={200}
                            className="w-18"
                        />
                        <span className="text-center text-xs">AFRICANO MANDE FOUNDATION</span>
                    </div>

        {/* About Us Dropdown */}
        <div className=" items-center justify-center flex gap-x-1">
            <div className="dropdown ">
            <button className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out" onClick={() => {
                                        const el = document.getElementById("about-us");
                                        if (el) {
                                            el.scrollIntoView({behavior: "smooth", block: "center"});
                                        }
                                        setDropAbout(false);
                                        setIsMobileMenuOpen(false);
                                    }}>
                About Us
                <ChevronDown className="ml-2 w-4 h-4" />
            </button>
            <div className="small-menu">
                <div className="cursor-pointer" 
                onClick={() => {
                                const el = document.getElementById("about-us");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Our Mission</div>
                <div className="cursor-pointer" onClick={() => {
                                const el = document.getElementById("about-us");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth" , block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Our Vision</div>
                <div className="cursor-pointer" onClick={() => {
                                const el = document.getElementById("about-us");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Core Values</div>
                <div className="cursor-pointer">Governance and Management</div>
            </div>
            </div>

            <div className="dropdown ">
            <button className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out" onClick={() => {
                                const el = document.getElementById("service-1");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>
                Services
                <ChevronDown className="ml-2 w-4 h-4" />
            </button>
            <div className="small-menu">
                <div className="cursor-pointer" onClick={() => {
                                const el = document.getElementById("service-1");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Health Services</div>
                <div className="cursor-pointer" onClick={() => {
                                const el = document.getElementById("service-2");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Education Services</div>
                <div className="cursor-pointer" onClick={() => {
                                const el = document.getElementById("service-3");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Production and Livelihood Services</div>
                <div className="cursor-pointer" onClick={() => {
                                const el = document.getElementById("service-4");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Media and ICT services</div>
                <div className="cursor-pointer" onClick={() => {
                                const el = document.getElementById("service-5");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Technical Services</div>
                <div className="cursor-pointer" onClick={() => {
                                const el = document.getElementById("service-6");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Volunteer Services</div>
                <div className="cursor-pointer" onClick={() => {
                                const el = document.getElementById("service-7");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Corporate Services</div>
            </div>
            </div>


            <div className="dropdown ">
            <button className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out" onClick={() => {
                                const el = document.getElementById("gallery");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>
                Archives
                <ChevronDown className="ml-2 w-4 h-4" />
            </button>
            <div className="small-menu">
                <div className="cursor-pointer">Project documents</div>
                <div className="cursor-pointer">Historic documents</div>
                <div className="cursor-pointer" onClick={() => {
                                const el = document.getElementById("gallery");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Project pictorials</div>
                <div className="cursor-pointer" onClick={() => {
                                const el = document.getElementById("video");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Project videos</div>
            </div>
            </div>


            <div className="dropdown ">
            <button className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out" onClick={() => {
                                const el = document.getElementById("projects");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>
                Projects
                <ChevronDown className="ml-2 w-4 h-4" />
            </button>
            <div className="small-menu">
                <div className="cursor-pointer" onClick={() => {
                                const el = document.getElementById("organics");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Maridi Organics</div>
                <div className="cursor-pointer" onClick={() => {
                                const el = document.getElementById("fm");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Foundation FM</div>
                <div className="cursor-pointer" onClick={() => {
                                const el = document.getElementById("medical");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Foundation Medical Center</div>
                <div className="cursor-pointer" onClick={() => {
                                const el = document.getElementById("university");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Maridi International University</div>
            </div>
            </div>


            <div className="dropdown ">
            <button className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out" onClick={() => {
                                const el = document.getElementById("location");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>
                Location
                <ChevronDown className="ml-2 w-4 h-4" />
            </button>
            <div className="small-menu">
                <div className="cursor-pointer" onClick={() => {
                                const el = document.getElementById("location");
                                if (el) {
                                    el.scrollIntoView({behavior: "smooth", block: "center"});
                                }
                                setDropAbout(false);
                                setIsMobileMenuOpen(false);
                                }}>Google Map</div>
                <div className="cursor-pointer">Maridi State Link</div>
            </div>
            </div>

            <div>
                <button className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-white text-white cursor-pointer hover:bg-[#7eaf58] hover:text-[#032303] hover:border-[#032303] font-light text-xs xl:text-sm focus:outline-none transition-all duration-300 ease-in-out" onClick={() => {setShowContactModal(true)}}>
                    Contact Us
                </button>
            </div>


        </div>
        <div className=" items-center justify-center flex gap-x-2">
            <button className="flex items-center xl:px-4 xl:py-2 px-2 py-2 rounded-4xl border border-[#fff] bg-[#fff] text-[#005e84] cursor-pointer hover:bg-[#005e84] hover:text-[#fff] hover:border-[#005e84] text-xs xl:text-base font-bold focus:outline-none transition-all duration-300 ease-in-out">
                    Become a Member
                </button>
            <button className="flex items-center xl:px-6 xl:py-2 px-3 py-2 rounded-4xl border border-[#005e84] bg-[#005e84] text-white cursor-pointer hover:bg-[#fff] hover:text-[#005e84] hover:border-[#fff] text-xs xl:text-base font-bold focus:outline-none transition-all duration-300 ease-in-out">
                    Log In
                </button>

        </div>
        
        
    </div>
</div>

{showContactModal && (
            <div className="fixed inset-0 w-screen h-screen bg-black/40 z-70 flex items-center justify-center" onClick={() => setShowContactModal(false)}>
                <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex items-center justify-center h-auto">
                <div className="bg-white rounded w-full" onClick={e => e.stopPropagation()}>
                    <div className="border-b border-gray-300 flex items-center justify-between p-2 lg:px-5 lg:py-3">
                        <div><p className="text-[#032303] font-bold">Contact Us</p></div>
                        <button
                            className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300"
                            onClick={() => setShowContactModal(false)}
                        >
                            close
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 p-2 gap-y-10 gap-x-5 lg:p-5 max-h-[600px] overflow-y-scroll">
                        <div className="items-center justify-start flex flex-col">
                            <p className="text-[#032303] font-bold">Get In Touch</p>
                            <form className="w-full flex flex-col gap-y-4">
                                <div className="w-full flex flex-col gap-y-2">
                                    <p className="text-[#6f6f6f] text-sm md:text-base font-bold">Name</p>
                                    <input type="text" className="text-[#6f6f6f] text-sm md:text-base border border-gray-300 h-10 w-full p-2"/>
                                </div>
                                <div className="w-full flex flex-col gap-y-2">
                                    <p className="text-[#6f6f6f] text-sm md:text-base font-bold">Email</p>
                                    <input type="email" className="text-[#6f6f6f] text-sm md:text-base border border-gray-300 h-10 w-full p-2"/>
                                </div>
                                <div className="w-full flex flex-col gap-y-2">
                                    <p className="text-[#6f6f6f] text-sm md:text-base font-bold">Contact Number</p>
                                    <div className="flex flex-col w-full">
                                        <input
                                        type="text"
                                        placeholder="Search country or code"
                                        value={countrySearch}
                                        onChange={e => setCountrySearch(e.target.value)}
                                        className="border border-gray-300 h-8 px-2 mb-1 text-sm text-[#6f6f6f]"
                                        />
                                        <div className="flex">
                                        <CountryDropdown
                                          countryCodes={countryCodes}
                                          selectedCode={selectedCode}
                                          setSelectedCode={setSelectedCode}
                                          countrySearch={countrySearch}
                                        />
                                        <input
                                            type="number"
                                            className="text-[#6f6f6f] text-sm md:text-base border border-gray-300 h-10 w-2/3 p-2 rounded-r"
                                            placeholder="Contact Number"
                                            style={{ borderLeft: "none" }}
                                            name="contactNumber"
                                        />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-y-2">
                                    <p className="text-[#6f6f6f] text-sm md:text-base font-bold">Message</p>
                                    <textarea
                                    required
                                    maxLength={1000}
                                    placeholder="Enter your message (max 250 words)" 
                                    className="text-[#6f6f6f] text-sm md:text-base border border-gray-300 h-32 resize-none w-full p-2"/>
                                </div>
                                <button
                                type="submit" className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300">Submit</button>
                            </form>
                        </div>
                        <div className="w-full">
                            <p className="text-[#032303] font-bold mb-5">Contact Details</p>
                            <div className="w-full border-t border-gray-300 flex items-center justify-start gap-x-4 px-3 py-5">
                                <FontAwesomeIcon
                                icon={faLocationDot}
                                className="w-5 text-[#6f6f6f]"
                                style={{ fontSize: "2rem" }}
                                />
                                <div className="text-[#6f6f6f] w-full">
                                    Address: Hillside, Maridi, South Sudan
                                </div>
                            </div>
                            <div className="w-full border-y border-gray-300 flex items-center justify-start gap-x-4 px-3 py-5">
                                <FontAwesomeIcon
                                icon={faPhone}
                                className="w-5 text-[#6f6f6f]"
                                style={{ fontSize: "2rem" }}
                                />
                                <div className="text-[#6f6f6f] w-full">
                                    Contact : +211 92 436 0010
                                </div>
                            </div>
                            <div className="w-full border-b border-gray-300 flex items-center justify-start gap-x-4 px-3 py-5">
                                <FontAwesomeIcon
                                icon={faEnvelope}
                                className="w-5 text-[#6f6f6f]"
                                style={{ fontSize: "2rem" }}
                                />
                                <div className="text-[#6f6f6f] break-all w-full">
                                    Email: info@africanomandefoundation.org
                                </div>
                            </div>
                            <div className="w-full border-b border-gray-300 flex items-center overfl justify-start gap-x-4 px-3 py-5">
                                <FontAwesomeIcon
                                icon={faChrome}
                                className="w-5 text-[#6f6f6f]"
                                style={{ fontSize: "2rem" }}
                                />
                                <div className="text-[#6f6f6f] break-all w-full">
                                    Website: www.africanomandefoundation.org
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-7 border-t border-gray-300"></div>
                </div>
                </div>
            </div>
            )}


            
        </>
    );
}