import { parseLocation } from "../../utils/parseLocation";
import Avatar from "./Avatar";
import EditButton from "./EditButton";

const Header = ({ user, imageUpdate, openEdit }) => {
  const location = parseLocation(user);

  return (
    <>
      <div className="relative inline-block mb-6">
        <div className="w-32 h-32 rounded-full flex items-center justify-center">
          <Avatar user={user} imageUpdate={imageUpdate} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{user.fullname}</h2>
        <EditButton onClick={openEdit} />
      </div>

      <div className="text-left space-y-3">
        <p className="text-gray-600 text-sm">{user.email}</p>
        <p className="text-gray-600 text-sm">{location.formattedLocation}</p>
      </div>
    </>
  );
};

export default Header;
