import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '../../../assets/images/website/logo-navbar.png'
import { LiaAngleDownSolid } from "react-icons/lia";

import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigationItems = [
    {
      id: 1,
      name: "Home",
      href: "/",
      isActive: true,
      className: "nav-link ",
      ariaCurrent: "page",
      dataDiscover: true
    },
    {
      id: 2,
      name: "About",
      href: "/about",
      isActive: false,
      className: "nav-link",
      ariaCurrent: null,
      dataDiscover: true
    },
    {
      id: 3,
      name: "Hospital Partners",
      href: "/hospital-partners",
      isActive: false,
      className: "nav-link",
      ariaCurrent: null,
      dataDiscover: true
    },
    {
      id: 4,
      name: "Medical Board",
      href: "/medical-board",
      isActive: false,
      className: "nav-link",
      ariaCurrent: null,
      dataDiscover: true
    },
    {
      id: 5,
      name: "News & Articles",
      href: "/news-articles",
      isActive: false,
      className: "nav-link",
      ariaCurrent: null,
      dataDiscover: true
    },
    {
      id: 6,
      name: "Contact Us",
      href: "/contact",
      isActive: false,
      className: "nav-link",
      ariaCurrent: null,
      dataDiscover: true
    }
  ];

  return (
    <nav className="sticky top-0 bg-white shadow-sm border-b border-gray-200 py-2 z-[99]  flex items-center">
      <div className="container">
        <div className="mx-auto ">
          <div className="flex justify-between items-center  relative">
            <Link to={'/'}>
              <img src={Logo} alt="Logo" className="max-w-[100px] h-auto" />
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="ml-1 flex items-baseline space-x-3">
                {navigationItems.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    className="block px-2 py-2 rounded-md text-md hover:bg-websecondary hover:text-webprimary font-medium transition-colors duration-200 text-webPara"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </NavLink>
                ))}

              </div>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">

              <select appearance="none" className="min-w-[90px] px-2 py-3 rounded-md text-md font-medium  border-2 border-webprimary hover:border-webprimary focus:border-webprimary focus:outline-none transition-colors duration-200 text-webprimary"
              // style={{ backgroundImage: url(<LiaAngleDownSolid />) }}

              >
                <option value="" >Language</option>
                <option value="es">English</option>
                <option value="fr">Hindi</option>
              </select>

              <Link to={'/login'}>
                <button className="min-w-[90px] theme-btn">
                  Login
                </button>
              </Link>
              <Link to={'/signup'}>
                <button className="min-w-[90px] theme-btn">
                  Signup
                </button>
              </Link>

            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden absolute top-[72px] right-0 bg-white  w-[90%] h-screen border-gray-200 origin-top transition-all duration-500 ease-in-out ${isMenuOpen
            ? "animate-growDown opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
            }`}
        >
          <div className="px-2 pt-8 pb-3 space-y-1 flex items-center flex-col">
            {navigationItems.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-lg font-medium transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-4 px-8 w-full pt-6">
              <select className="min-w-[90px] px-2 py-3 rounded-md text-md font-medium  border-2 border-webprimary hover:border-webprimary focus:border-webprimary focus:outline-none transition-colors duration-200 text-webprimary">
                <option value="" >Language</option>
                <option value="es">English</option>
                <option value="fr">Hindi</option>
              </select>

              <Link to={'/login'}>
                <button className="min-w-[90px] theme-btn w-full">
                  Login
                </button>
              </Link>
              <Link to={'/signup'}>
                <button className="min-w-[90px] theme-btn w-full">
                  Signup
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
