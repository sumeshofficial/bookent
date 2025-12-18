import { useModal } from "../../../../../utils/constants";
import { parseLocation } from "../../utils/parseLocation";
import Avatar from "./Avatar";
import EditButton from "./EditButton";

const Header = ({ user, imageUpdate, openEdit }) => {
  const location = parseLocation(user);
  const { openModal, closeModal } = useModal();

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

      {user.authProvider === "email" && <div className="flex justify-center mt-5">
        <button
          type="button"
          onClick={() =>
            openModal("change-password", {
              onClose: () => closeModal(),
            })
          }
          className="inline-flex items-center gap-2
               px-4 py-2 rounded-lg
               bg-indigo-600 text-white text-sm font-medium
               hover:bg-indigo-700 transition
               focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Change Password
        </button>
      </div>}
    </>
  );
};

export default Header;
