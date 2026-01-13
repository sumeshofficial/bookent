import { UserCircle2 } from "lucide-react";
import logo from "../../assets/bookent-logo-white.png";
import { Link } from "react-router-dom";
const OrganizerNavbar = () => {
  return (
    <div className="bg-slate-800 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Bookent"
            className="h-8 sm:h-12 w-auto object-contain"
          />
        </div>
        <Link to={"organizer/profile"}>
          <UserCircle2 className="text-white w-8 h-8 sm:w-10 sm:h-10 " />
        </Link>
      </div>
    </div>
  );
};

export default OrganizerNavbar;
