import UsersHeader from "./components/UsersHeader";
import UsersTable from "./components/UsersTable";
import UsersMobileCard from "./components/UsersMobileCard";

import { useUsers } from "./hooks/useUsers";
import { useToggleUserStatus } from "./hooks/useToggleUserStatus";
import Pagination from "../../../sharedComponents/Pagination";

const UsersList = () => {
  const { data, isLoading } = useUsers();

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;

  const { toggleStatus } = useToggleUserStatus();

  return (
    <main className="p-4 md:p-8">
      <UsersHeader />

      <UsersTable
        users={users}
        isLoading={isLoading}
        onToggleStatus={toggleStatus}
      />

      <div className="md:hidden space-y-4 mt-4">
        {users.map((u) => (
          <UsersMobileCard key={u._id} user={u} onToggle={toggleStatus} />
        ))}
      </div>

      <Pagination meta={{ totalPages: totalPages }} />
    </main>
  );
};

export default UsersList;
