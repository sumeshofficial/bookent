import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { logout } from "../services/auth";
import { useDispatch } from "react-redux";
import { logoutUser } from "../Redux/authSlice";
import { persistor } from "../Redux/store";
// import { Search, Ticket, User } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await logout();
    dispatch(logoutUser());
    persistor.purge();
  };
  return (
    <Disclosure as="nav" className="relative bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-white/5 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full p-1 text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Your profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

// const Navbar = () => {
//   const dispatch = useDispatch();
//   const handleLogout = async () => {
//     await logout();
//     dispatch(logoutUser());
//     persistor.purge();
//   };

//   return (
//     <nav className="bg-white border-b border-gray-200">
//       <div className="px-6 lg:px-12">
//         {/* Top Section */}
//         <div className="flex justify-between items-center py-4">
//           {/* Left: Logo + Search */}
//           <div className="flex items-center gap-6 flex-1">
//             {/* Logo */}
//             <div className="flex items-center gap-2 flex-shrink-0">
//               <div className="w-14 h-14">
//                 <svg viewBox="0 0 100 100" className="w-full h-full">
//                   <defs>
//                     <linearGradient
//                       id="logoGradient"
//                       x1="0%"
//                       y1="0%"
//                       x2="100%"
//                       y2="100%"
//                     >
//                       <stop offset="0%" stopColor="#8B5CF6" />
//                       <stop offset="50%" stopColor="#EC4899" />
//                       <stop offset="100%" stopColor="#3B82F6" />
//                     </linearGradient>
//                   </defs>
//                   <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" />
//                   <path
//                     d="M35 30 L35 70 L55 70 C62 70 67 65 67 57 C67 52 64 48 60 46 C63 44 65 40 65 36 C65 28 60 30 53 30 Z M45 40 L52 40 C55 40 57 42 57 45 C57 48 55 50 52 50 L45 50 Z M45 57 L53 57 C56 57 58 59 58 62 C58 65 56 67 53 67 L45 67 Z"
//                     fill="white"
//                   />
//                 </svg>
//               </div>
//               <span className="text-2xl font-black text-gray-900 tracking-tight">
//                 BOOKENT
//               </span>
//             </div>

//             {/* Search Bar */}
//             <div className="flex-1 max-w-md">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="find your show..."
//                   className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-purple-400 text-sm"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Right: Sell Ticket + Profile */}
//           <div className="flex items-center gap-4">
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 text-gray-900 hover:text-purple-600 transition-colors"
//             >
//               <span className="font-semibold text-sm">Logout</span>
//             </button>
//             <button className="flex items-center gap-2 text-gray-900 hover:text-purple-600 transition-colors">
//               <Ticket className="w-5 h-5" />
//               <span className="font-semibold text-sm">Sell Ticket</span>
//             </button>
//             <button className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
//               <User className="w-5 h-5 text-white" />
//             </button>
//           </div>
//         </div>

//         {/* Navigation Links */}
//         <div className="flex gap-8 pb-3">
//           <button className="text-gray-600 hover:text-gray-900 font-medium text-sm">
//             Events
//           </button>
//           <button className="text-gray-600 hover:text-gray-900 font-medium text-sm">
//             Venues
//           </button>
//           <button className="text-gray-600 hover:text-gray-900 font-medium text-sm">
//             Teams
//           </button>
//           <button className="text-gray-600 hover:text-gray-900 font-medium text-sm">
//             Live
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

export default Navbar;
