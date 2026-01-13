import logo from "../assets/bookent-logo-black.png";
import { Link } from "react-router-dom";

const BookentLogo = () => {
  return (
    <div>
      <Link to="/" className="shrink-0">
        <img className="h-10 sm:h-12 w-auto" src={logo} alt="Bookent" />
      </Link>
    </div>
  );
};

export default BookentLogo;
