import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { logout } from "../../../services/auth";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/userSlice";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, Search, Ticket, UserCircle2, X } from "lucide-react";
import toast from "react-hot-toast";
import { logoutOrganizer } from "../../../redux/organizerSlice";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { searchEvent } from "../../../services/user";
import BookentLogo from "../../BookentLogo";

const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const location = useLocation();
  const inputRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutUser());
      dispatch(logoutOrganizer());
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["events", debouncedSearch],
    queryFn: () => searchEvent({ searchQuery: debouncedSearch }),
    onError: () => toast.error("Failed to load events"),
    enabled: debouncedSearch.trim().length > 0,
  });

  const events = data?.events;

  const navLinks = [
    { title: "All Events", link: "/events/all-events" },
    // { title: "Venue", link: "/venue" },
  ];

  return (
    <>
      <Disclosure as="nav" className="bg-white relative z-50">
        {({ open }) => (
          <>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
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
                  <BookentLogo />

                  {/* Desktop search */}
                  <div
                    onClick={() => setIsSearchOpen(true)}
                    className="hidden sm:flex flex-1 max-w-md relative cursor-text"
                  >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <button
                      type="button"
                      className="w-full bg-gray-100 text-gray-700 rounded-full px-4 py-5"
                    />
                    <span className="absolute left-10 top-1/2 -translate-y-1/2">
                      Find your show, event, or sports...
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1">
                    <Ticket className="w-5 h-5 text-gray-600" />
                    <Link
                      to="/listmyshow"
                      className="text-base font-medium text-gray-700 hover:text-gray-900"
                    >
                      Sell Ticket
                    </Link>
                  </div>

                  <Menu as="div" className="relative ml-3">
                    <Menu.Button className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="sr-only">Open user menu</span>
                      {user?.profileImage ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.profileImage}
                          alt="User"
                        />
                      ) : (
                        <UserCircle2 className="w-8 h-8" />
                      )}
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

            <Disclosure.Panel className="sm:hidden px-3 pb-3">
              <div className="mb-2">
                <div
                  onClick={() => setIsSearchOpen(true)}
                  className="flex flex-1 max-w-md relative cursor-text"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    className="w-full bg-gray-100 text-gray-700 rounded-full px-4 py-5"
                  />
                  <span className="absolute left-10 top-1/2 -translate-y-1/2">
                    Find your show, event, or sports...
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2">
                <Ticket className="w-5 h-5 text-gray-600" />
                <Link
                  to="/listmyshow"
                  className="text-base font-medium text-gray-700 hover:text-gray-900"
                >
                  Sell Ticket
                </Link>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className="bg-gray-100 px-4 sm:px-6 lg:px-12">
        <div className="flex flex-wrap  gap-2 sm:gap-4 py-2">
          {navLinks.map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base px-2 py-1 rounded-md "
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 bg-gray-200 z-999 animate-fadeIn flex flex-col">
          <div>
            <div className="hidden bg-white p-3 sm:flex justify-end">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <div className="sm:hidden bg-white pt-5 px-4 pb-4 flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for events, shows, sports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-10 py-2 sm:py-3 text-gray-700 outline-none"
                />

                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      inputRef.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="sm:hidden mt-3 bg-white px-6 py-4 rounded-xl mx-4 max-h-120">
              <p className="text-sm text-gray-500 mb-2">Search results</p>

              <div className="space-y-2 overflow-y-auto">
                {isLoading && (
                  <>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-2/3"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-2/3"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-2/3"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-1/2"></div>
                  </>
                )}

                {!isLoading && events?.length === 0 && (
                  <div className="text-gray-500 text-sm py-4 text-center">
                    No matching events found.
                  </div>
                )}

                {!isLoading &&
                  events?.length > 0 &&
                  events.map((event) => (
                    <Link
                      key={event.id}
                      to={`/event/${event.id}`}
                      onClick={() =>
                        location.pathname === `/event/${event.id}` &&
                        setIsSearchOpen(false)
                      }
                      className="p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-opacity duration-700 opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards]"
                    >
                      {event.title}
                    </Link>
                  ))}
              </div>
            </div>

            <div className="hidden sm:flex bg-white flex-col items-center px-10 sm:px-6 -mt-10 pt-6 pb-5">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for events, shows, sports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-10 py-3 text-gray-700 outline-none"
                />

                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      inputRef.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="hidden sm:block bg-white mt-3 mx-auto w-full max-w-md px-6 py-4 rounded-xl max-h-150">
              <p className="text-sm text-gray-500 mb-2">Search results</p>

              <div className="space-y-5 overflow-y-auto">
                {isLoading && (
                  <div className="space-y-5">
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-2/3"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-2/3"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-2/3"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-2/3"></div>
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-2/3"></div>
                  </div>
                )}

                {!isLoading && events?.length === 0 && (
                  <div className="text-gray-500 text-sm py-4 text-center">
                    No events found.
                  </div>
                )}

                {!isLoading &&
                  events?.length > 0 &&
                  events.map((event) => (
                    <Link
                      key={event.id}
                      to={`/event/${event.id}`}
                      onClick={() =>
                        location.pathname === `/event/${event.id}` &&
                        setIsSearchOpen(false)
                      }
                      className="p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-opacity duration-700 opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards]"
                    >
                      {event.title}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
