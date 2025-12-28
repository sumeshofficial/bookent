import UserRow from "./UserRow";
import UsersSkeleton from "./UsersSkeleton";

const UsersTable = ({
  users,
  isLoading,
  onToggleStatus,
}) => {
  return (
    <div className="hidden md:block bg-white rounded-lg shadow">
      <table className="w-full divide-y">
        <thead className="bg-gray-50">
          <tr>
            {[
              "Customer",
              "Bookings",
              "Spending",
              "Status",
              "Action",
              "View",
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-sm font-medium"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y">
          {isLoading ? (
            <UsersSkeleton />
          ) : users.length ? (
            users.map((u) => (
              <UserRow
                key={u._id}
                user={u}
                handleToggleStatus={onToggleStatus}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-6">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;