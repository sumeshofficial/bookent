import { User, Mail } from "lucide-react";

const UserProfileCard = ({ user }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center text-4xl font-semibold text-gray-600">
          {user.fullname?.charAt(0)}
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          {user.fullname}
        </h2>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex items-center gap-3 text-gray-700">
          <User className="w-4 h-4 text-gray-400" />
          {user.fullname}
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <Mail className="w-4 h-4 text-gray-400" />
          {user.email}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;