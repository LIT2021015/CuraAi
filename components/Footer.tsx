import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-black text-white text-center py-6 mt-12">
        <p className="text-lg">&copy; {new Date().getFullYear()} Disease Detection. All rights reserved.</p>
        <div className="flex justify-center mt-4 space-x-6">
          <a href="/about" className="hover:text-gray-400">About Us</a>
          <a href="/contact" className="hover:text-gray-400">Contact</a>
          <a href="/privacy" className="hover:text-gray-400">Privacy Policy</a>
        </div>
      </footer>
  )
}

export default Footer