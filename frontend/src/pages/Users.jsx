import Layout from "../components/dashboard/Layout";

function Users() {
  return (
    <Layout>
      <div className="p-6">

        <h1 className="text-3xl font-bold">
          User Management
        </h1>

        <p className="text-gray-500 mt-2">
          Manage system users and permissions
        </p>

      </div>
    </Layout>
  );
}

export default Users;