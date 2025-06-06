"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { FaHeartbeat, FaMapMarkedAlt, FaRobot, FaCalendarAlt } from "react-icons/fa";
import { MdOutlineHealthAndSafety } from "react-icons/md";

const navItems = [
  {
    name: "Diseases",
    icon: <MdOutlineHealthAndSafety className="inline-block mr-2" />,
    items: [
      { name: "Brain Tumor", link: "/braintumor", icon: <FaRobot className="inline-block mr-2" /> },
      { name: "Pneumonia", link: "/pneumonia", icon: <FaHeartbeat className="inline-block mr-2" /> },
      { name: "Covid", link: "/covid", icon: <FaHeartbeat className="inline-block mr-2" /> },
      { name: "Breast Cancer", link: "/breastcancer", icon: <FaHeartbeat className="inline-block mr-2" /> },
      { name: "Alzheimer", link: "/alzheimer", icon: <FaHeartbeat className="inline-block mr-2" /> },
      { name: "Diabetes", link: "/diabetes", icon: <FaHeartbeat className="inline-block mr-2" /> },
      { name: "Heart Disease", link: "/heartdisease", icon: <FaHeartbeat className="inline-block mr-2" /> },
    ],
  },
  {
    name: "Features",
    icon: <FaCalendarAlt className="inline-block mr-2" />,
    items: [
      { name: "Planner", link: "/planner", icon: <FaCalendarAlt className="inline-block mr-2" /> },
      { name: "SOS", link: "/sos", icon: <FaHeartbeat className="inline-block mr-2" /> },
      { name: "Map", link: "/map", icon: <FaMapMarkedAlt className="inline-block mr-2" /> },
      { name: "Chat", link: "/chat", icon: <FaRobot className="inline-block mr-2" /> },
    ],
  },
];

const Header = () => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside all tracked dropdown areas
      const isOutside = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target as Node)
      );

      if (isOutside) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // **NEW**: Effect to close menus on navigation
  useEffect(() => {
    if (openDropdown || isMobileMenuOpen) {
      setOpenDropdown(null);
      setMobileMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#2A5C99] dark:bg-[#4A89DC] flex justify-between items-center px-4 md:px-10 py-2 z-50 shadow-lg h-16">
      <Link href="/" className="text-3xl font-extrabold italic text-white animate-pulse">
        Cura<span className="text-yellow-300">AI</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-8 text-white font-medium">
        {navItems.map((menu) => (
          <div
            key={menu.name}
            className="relative"
            ref={(el) => (dropdownRefs.current[menu.name] = el)}
          >
            <button
              onClick={() => setOpenDropdown(openDropdown === menu.name ? null : menu.name)}
              className="hover:text-yellow-300 transition flex items-center gap-1"
            >
              {menu.icon} {menu.name}
            </button>
            {openDropdown === menu.name && (
              <div className="absolute top-12 left-0 bg-[#2A5C99] dark:bg-[#4A89DC] rounded-lg shadow-lg p-3 space-y-2 z-50 animate-fade-in-down">
                {menu.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.link}
                    // REMOVED onClick from here
                    className={`w-full text-left flex items-center px-4 py-2 rounded transition duration-200 hover:bg-[#1e4477] ${
                      pathname === item.link ? "bg-[#1e4477] text-yellow-300" : ""
                    }`}
                  >
                    {item.icon} {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <ThemeToggle />
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center gap-4">
        <ThemeToggle />
        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
          </div>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#2A5C99] dark:bg-[#4A89DC] flex flex-col items-center py-4 text-white space-y-4 font-medium shadow-md z-40 animate-fade-in-down">
          {navItems.map((menu) => (
            <div key={menu.name} className="w-full flex flex-col items-center">
              <button
                onClick={() => setOpenDropdown(openDropdown === menu.name ? null : menu.name)}
                className="text-lg hover:text-yellow-300 flex items-center gap-1"
              >
                {menu.icon} {menu.name}
              </button>
              {openDropdown === menu.name && (
                <div className="flex flex-col items-center mt-2 space-y-2">
                  {menu.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.link}
                      // REMOVED onClick from here
                      className={`text-sm flex items-center gap-1 hover:text-yellow-300 transition ${
                        pathname === item.link ? "text-yellow-300" : ""
                      }`}
                    >
                      {item.icon} {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Header;
