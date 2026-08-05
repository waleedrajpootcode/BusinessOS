import Layout from "../components/dashboard/Layout";
import { useEffect, useState } from "react";
import { getUsers } from "../services/users";
import UserTable from "../components/users/UserTable";

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
  loadUsers();
}, []);

async function loadUsers() {

  const data = await getUsers();

  setUsers(data);

}
  return (
    <Layout>
      <div className="p-6">

        <h1 className="text-3xl font-bold">
          User Management
        </h1>

        <UserTable users={users} />

        <p className="text-gray-500 mt-2">
          Manage system users and permissions
        </p>

      </div>
    </Layout>
  );
}

export default Users;