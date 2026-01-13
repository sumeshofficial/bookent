import { ShieldCheck, ShieldX, MailCheck } from "lucide-react";

const UserAccountStatus = ({ user }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Account Status
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Account</span>
          <span className="flex items-center gap-2 font-medium">
            {user.isActive ? (
              <>
                <ShieldCheck className="w-4 h-4 text-green-600" />
                Active
              </>
            ) : (
              <>
                <ShieldX className="w-4 h-4 text-red-600" />
                Inactive
              </>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Email Verified</span>
          <span className="flex items-center gap-2 font-medium">
            {user.isVerified ? (
              <>
                <MailCheck className="w-4 h-4 text-green-600" />
                Verified
              </>
            ) : (
              "Not Verified"
            )}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Role</span>
          <span className="font-medium capitalize">{user.role}</span>
        </div>
      </div>
    </div>
  );
};

export default UserAccountStatus;
