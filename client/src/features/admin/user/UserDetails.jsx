import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import UserProfileCard from "./components/UserProfileCard";
import UserAccountInfo from "./components/UserAccountInfo";
import UserSkeleton from "./components/UserSkeleton";
import { useUserDetails } from "./hooks/useUserDetails";
import UserAccountStatus from "./components/UserAccountStatus";
import UserWalletInfo from "./components/UserWalletInfo";
import UserPreferences from "./components/UserPreferences";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useUserDetails(id);
  const user = data?.user;

  if (isLoading) return <UserSkeleton />;

  if (!user)
    return (
      <div className="flex justify-center items-center h-96 text-gray-600">
        User not found
      </div>
    );

  return (
    <main className="flex-1 p-4 lg:p-8 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </button>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">User Details</h1>
        <p className="text-sm text-gray-500">
          Overview of user account and activity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UserProfileCard user={user} />

        <div className="lg:col-span-2 space-y-6">
          <UserAccountInfo user={user} />
          <UserAccountStatus user={user} />
          <UserWalletInfo wallet={user.wallet} />
          <UserPreferences preferences={user.preferences} />
        </div>
      </div>
    </main>
  );
};

export default UserDetails;
