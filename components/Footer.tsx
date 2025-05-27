import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#2A5C99] dark:bg-[#4A89DC]  text-white text-center py-6 mt-auto">
      <p className="text-lg">
        &copy; {new Date().getFullYear()} Disease Detection. All rights reserved.
      </p>
      <div className="flex justify-center mt-4 space-x-6">
        <a href="/about" className="hover:text-cyan-400 transition-colors">
          About Us
        </a>
        <a href="/contact" className="hover:text-cyan-400 transition-colors">
          Contact
        </a>
        <a href="/privacy" className="hover:text-cyan-400 transition-colors">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
