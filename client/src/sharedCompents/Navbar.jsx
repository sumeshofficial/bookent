import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { logout } from "../services/auth";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../Redux/userSlice";
import { persistor } from "../Redux/store";

import logo from "../assets/bookent-logo-black.png";
import { Link } from "react-router-dom";
import { Search, Ticket } from "lucide-react";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logout();
    dispatch(logoutUser());
    persistor.purge();
  };

  const navLinks = ["Events", "Venues", "Teams", "Live"];

  return (
    <>
      <Disclosure as="nav" className="bg-white relative z-50">
        {({ open }) => (
          <>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Left side: Mobile menu button + Logo + Search */}
                <div className="flex items-center gap-4 flex-1">
                  {/* Mobile menu button */}
                  <div className="flex sm:hidden">
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>

                  {/* Logo */}
                  <Link to="/" className="flex-shrink-0">
                    <img className="h-10 sm:h-12 w-auto" src={logo} alt="Bookent" />
                  </Link>

                  {/* Desktop search */}
                  <div className="hidden sm:flex flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Find your show, event, or sports..."
                      className="w-full bg-gray-100 text-gray-700 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 shadow-inner"
                    />
                  </div>
                </div>

                {/* Right side: Sell Ticket + Profile */}
                <div className="flex items-center gap-3">
                  {/* Sell Ticket */}
                  <div className="hidden sm:flex items-center gap-1">
                    <Ticket className="w-5 h-5 text-gray-600" />
                    <Link
                      to="/listmyShow"
                      className="text-base font-medium text-gray-700 hover:text-gray-900"
                    >
                      Sell Ticket
                    </Link>
                  </div>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <Menu.Button className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user?.profileImage}
                        alt="User"
                      />
                    </Menu.Button>

                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-50">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={`block px-4 py-2 text-sm ${
                                active ? "bg-gray-100" : ""
                              } text-gray-700`}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`w-full text-left px-4 py-2 text-sm text-gray-700 ${
                                active ? "bg-gray-100" : ""
                              }`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Menu>
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            <Disclosure.Panel className="sm:hidden px-3 pb-3">
              {/* Mobile search first */}
              <div className="mb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Find your show, event, or sports..."
                    className="w-full bg-gray-100 text-gray-700 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 shadow-inner"
                  />
                </div>
              </div>

              {/* Nav links */}
              <div className="px-1 space-y-1 mb-2">
                {navLinks.map((link) => (
                  <Link
                    key={link}
                    to={`/${link.toLowerCase()}`}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    {link}
                  </Link>
                ))}
              </div>

              {/* Mobile Sell Ticket */}
              <div className="flex items-center gap-2 px-3 py-2">
                <Ticket className="w-5 h-5 text-gray-600" />
                <Link
                  to="/listmyShow"
                  className="text-base font-medium text-gray-700 hover:text-gray-900"
                >
                  Sell Ticket
                </Link>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Secondary nav */}
      <div className="bg-gray-200 px-4 sm:px-6 lg:px-12">
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 py-2">
          {navLinks.map((link) => (
            <Link
              key={link}
              to={`/${link.toLowerCase()}`}
              className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base px-2 py-1 rounded-md"
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
