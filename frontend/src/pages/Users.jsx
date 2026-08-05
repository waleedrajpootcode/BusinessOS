import Layout from "../components/dashboard/Layout";
import { useEffect, useState } from "react";
import { getUsers } from "../services/users";
import UserTable from "../components/users/UserTable";

function Users() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");


    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {

        const data = await getUsers();

        setUsers(data);

    }
    const filteredUsers = users.filter((user) => {

        const name = user.full_name || "";
        const email = user.email || "";

        return (
            name.toLowerCase().includes(search.toLowerCase()) ||
            email.toLowerCase().includes(search.toLowerCase())
        );

    });

    return (
        <Layout>
            <div className="p-6">

                <h1 className="text-3xl font-bold">
                    User Management
                </h1>

                <div className="mt-6">

                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-96 border rounded-lg px-4 py-2"
                    />

                </div>

                <UserTable users={filteredUsers} />

                <p className="text-gray-500 mt-2">
                    Manage system users and permissions
                </p>

            </div>
        </Layout>
    );
}

export default Users;