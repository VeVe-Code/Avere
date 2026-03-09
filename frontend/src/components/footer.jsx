import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebookF, FaGooglePlusG, FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 pt-10 pb-6 mt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap -mx-4 ">
          <div className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8 items-center justify-center">
            <h4 className="text-3xl font-semibold mb-4 text-gray-100">Bislator</h4>
            
          </div>

          <div className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-100">Solutions and service</h4>
            <ul className="space-y-2">
              <li><Link to="/system" className="hover:text-white">Systems</Link></li>
              <li><Link to="/service" className="hover:text-white">Services</Link></li>
              <li><Link to="/network" className="hover:text-white">Network</Link></li>
              <li><Link to="/security" className="hover:text-white">Security</Link></li>
            </ul>
          </div>

          <div className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-100">Quick links</h4>
            <ul className="space-y-2">
              <li><Link to="/knowledge" className="hover:text-white">News</Link></li>
              <li><Link to="/about" className="hover:text-white">About us</Link></li>
              <li><Link to="/contactus" className="hover:text-white">Contactus</Link></li>
            </ul>
          </div>

          <div className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-100">Contact info</h4>
            <p className="text-gray-400 mb-4">Lorem ipsum dolor info combine with great information</p>
            <div className="flex space-x-4">
              <a href="/" aria-label="Twitter" className="text-gray-400 hover:text-white"><FaTwitter /></a>
              <a href="/" aria-label="Facebook" className="text-gray-400 hover:text-white"><FaFacebookF /></a>
              <a href="/" aria-label="Google" className="text-gray-400 hover:text-white"><FaGooglePlusG /></a>
              <a href="/" aria-label="Instagram" className="text-gray-400 hover:text-white"><FaInstagram /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Raaz Das, All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;