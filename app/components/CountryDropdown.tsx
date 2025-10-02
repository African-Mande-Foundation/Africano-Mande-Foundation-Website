"use client";
import { useState } from "react";

interface Country {
  name: string;
  code: string;
  initials: string;
}

interface CountryDropdownProps {
  countryCodes: Country[];
  selectedCode: string;
  setSelectedCode: (code: string) => void;
  countrySearch: string;
}

export default function CountryDropdown({ countryCodes, selectedCode, setSelectedCode, countrySearch }: CountryDropdownProps) {
  const [open, setOpen] = useState(false);

  const filtered = countryCodes.filter(
    c =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch)
  );
  
  const selectedCountry = filtered.find(c => c.code === selectedCode);

  return (
    <div className="relative w-1/3">
      <button
        type="button"
        className="border border-gray-300 h-10 px-2 bg-white text-[#6f6f6f] text-sm md:text-base rounded-l w-full text-left"
        onClick={() => setOpen(!open)}
      >
        {selectedCountry
          ? `${selectedCountry.initials} (${selectedCountry.code})`
          : "Select"}
      </button>
      {open && (
        <ul
          className="absolute left-0 top-full w-[200px] z-50 bg-white border border-gray-300 max-h-56 overflow-y-auto shadow-lg text-[#6f6f6f]"
          style={{ maxHeight: "224px" }}
        >
          {filtered.map(c => (
            <li
              key={c.code + c.name}
              className="px-3 py-2 hover:bg-[#dfefd2] cursor-pointer text-sm"
              onClick={() => {
                setSelectedCode(c.code);
                setOpen(false);
              }}
            >
              {c.initials} ({c.code})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}