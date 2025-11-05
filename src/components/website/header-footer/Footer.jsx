import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { MdPhone, MdEmail, MdLanguage } from "react-icons/md";
import logo from "@assets/images/website/logo-footer.png";

export default function Footer() {
  const socialLinks = [
    { icon: <FaFacebookF />, href: "https://facebook.com" },
    { icon: <FaInstagram />, href: "https://instagram.com" },
    { icon: <FaLinkedinIn />, href: "https://linkedin.com" },
    { icon: <FaTwitter />, href: "https://twitter.com" },
    { icon: <FaYoutube />, href: "https://youtube.com" },
  ];

  const companyLinks = [
    { name: "About Us", to: "/about" },
    { name: "FAQs", to: "/faqs" },
    { name: "Contact Us", to: "/contact" },
  ];

  const policyLinks = [
    { name: "Privacy Policy", to: "/privacy-policy" },
    { name: "Terms of Use", to: "/terms" },
    { name: "Legal", to: "/legal" },
  ];

  return (
    <footer className="bg-[#ebeaf4] pt-10 mt-10 md:mt-20">
      <div className="container">
        <div className="mx-auto flex flex-col md:flex-row md:justify-between">

          {/* Logo & About */}
          <div className="flex-1 mb-8 md:mb-0">
            <img src={logo} alt="BIZAARIO Logo" className="max-w-[140px] mb-2" />

            <p className="mb-6 text-gray-700">
              High level experience in web design and development knowledge,
              producing quality work.
            </p>

            <div>
              <p className="font-semibold mb-1">Follow us</p>

              <div className="flex space-x-4 text-2xl text-[#222]">
                {socialLinks.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#3161b9] transition"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="flex-1 mb-8 md:mb-0 md:pl-10">
            <ul>
              <li className="flex items-center font-semibold text-lg mb-2">
                <MdPhone className="mr-2 text-xl" />
                Phone Number
              </li>
              <li className="ml-7 mb-4 text-[#3161b9]">+91 5252525252</li>

              <li className="flex items-center font-semibold text-lg mb-2">
                <MdEmail className="mr-2 text-xl" />
                Email ID
              </li>
              <li className="ml-7 mb-4 text-[#3161b9]">rjvijs42@gmail.com</li>

              <li className="flex items-center font-semibold text-lg mb-2">
                <MdLanguage className="mr-2 text-xl" />
                Website
              </li>
              <li className="ml-7 mb-4 text-[#3161b9]">
                <a
                  href="https://www.papayapalette.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.papayapalette.com
                </a>
              </li>
            </ul>
          </div>

          {/* Links Section */}
          <div className="flex flex-1 justify-between md:pl-10">

            {/* Company */}
            <div>
              <p className="font-semibold text-lg mb-4">Company</p>
              <ul className="space-y-3 text-gray-700">
                {companyLinks.map((item, i) => (
                  <li key={i}>
                    <Link
                      to={item.to}
                      className="hover:text-[#3161b9] transition"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use Cases */}
            <div className="ml-10">
              <p className="font-semibold text-lg mb-4">Use Cases</p>
              <ul className="space-y-3 text-gray-700">
                {policyLinks.map((item, i) => (
                  <li key={i}>
                    <Link
                      to={item.to}
                      className="hover:text-[#3161b9] transition"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="w-full bg-[#121a52] text-white text-center mt-10 py-4 text-sm">
        ©2021 BIZAARIO CONNECT All Rights Reserved
      </div>
    </footer>
  );
}
