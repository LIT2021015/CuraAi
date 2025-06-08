"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useSession, signOut } from "next-auth/react";
import { FaHeartbeat, FaMapMarkedAlt, FaRobot, FaCalendarAlt, FaUserCircle } from "react-icons/fa";
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
  const router = useRouter();

  const { data: session } = useSession(); // the proper way!
  const user = session?.user;

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  // Close dropdown on route change
  useEffect(() => {
    if (openDropdown || isMobileMenuOpen) {
      setOpenDropdown(null);
      setMobileMenuOpen(false);
    }
  }, [pathname]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#2A5C99] dark:bg-[#4A89DC] flex justify-between items-center px-4 md:px-10 py-2 z-50 shadow-lg h-16">
      {/* Logo */}
      <div className="text-3xl font-extrabold italic text-white animate-pulse">
        Smart<span className="text-yellow-300">Diagnose</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-8 text-white font-medium">
        {navItems.map((menu) => (
          <div
            key={menu.name}
            className="relative"
            ref={(el) => {
              dropdownRefs.current[menu.name] = el;
            }}
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

        {/* Auth Section */}
        <div
          className="relative"
          ref={(el) => {
            dropdownRefs.current["auth"] = el;
          }}
        >
          {user ? (
            // Logged In Avatar
            <>
              <button
                onClick={() => setOpenDropdown(openDropdown === "auth" ? null : "auth")}
                className="hover:text-yellow-300 transition flex items-center gap-1"
              >
                <FaUserCircle className="text-2xl" />
              </button>
              {openDropdown === "auth" && (
                <div className="absolute top-12 right-0 bg-[#2A5C99] dark:bg-[#4A89DC] rounded-lg shadow-lg p-3 space-y-2 z-50 animate-fade-in-down w-56">
                  <Link href="/user/dashboard" className="block px-4 py-2 hover:bg-[#1e4477] rounded">
                    User Dashboard
                  </Link>
                  <Link href="/search_hospital" className="block px-4 py-2 hover:bg-[#1e4477] rounded">
                    Search Hospitals
                  </Link>
                  <Link href="/vlogs" className="block px-4 py-2 hover:bg-[#1e4477] rounded">
                    Vlogs
                  </Link>
                  <Link href="/vlogs/upload" className="block px-4 py-2 hover:bg-[#1e4477] rounded">
                    Upload Vlog
                  </Link>
                  <Link href="/reminders" className="block px-4 py-2 hover:bg-[#1e4477] rounded">
                    Set Reminder
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-600 bg-red-500 rounded text-white mt-2"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            // Not Logged In - Login Button
            <>
              <button
                onClick={() => setOpenDropdown(openDropdown === "auth" ? null : "auth")}
                className="hover:text-yellow-300 transition flex items-center gap-1 px-4 py-2 bg-yellow-500 text-black rounded font-bold"
              >
                Login
              </button>
              {openDropdown === "auth" && (
                <div className="absolute top-12 right-0 bg-[#2A5C99] dark:bg-[#4A89DC] rounded-lg shadow-lg p-3 space-y-2 z-50 animate-fade-in-down w-56">
                  <Link href="/user_registration" className="block px-4 py-2 hover:bg-[#1e4477] rounded">
                    Login/Register as User
                  </Link>
                  <Link href="/hospital_registration" className="block px-4 py-2 hover:bg-[#1e4477] rounded">
                    Login/Register as Hospital
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        <ThemeToggle />
      </div>

      {/* Mobile Menu */}
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

          {/* Auth Section in Mobile */}
          {user ? (
            <>
              <Link href="/user/dashboard" className="text-lg hover:text-yellow-300">
                User Dashboard
              </Link>
              <Link href="/search_hospital" className="text-lg hover:text-yellow-300">
                Search Hospitals
              </Link>
              <Link href="/vlogs" className="text-lg hover:text-yellow-300">
                Vlogs
              </Link>
              <Link href="/vlogs/upload" className="text-lg hover:text-yellow-300">
                Upload Vlog
              </Link>
              <Link href="/reminders" className="text-lg hover:text-yellow-300">
                Set Reminder
              </Link>
              <button onClick={handleLogout} className="mt-2 text-red-400 font-bold">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/user_registration" className="text-lg hover:text-yellow-300">
                Login/Register as User
              </Link>
              <Link href="/hospital_registration" className="text-lg hover:text-yellow-300">
                Login/Register as Hospital
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
