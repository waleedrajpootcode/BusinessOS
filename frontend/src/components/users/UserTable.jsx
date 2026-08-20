import UserRow from "./UserRow";

function UserTable({ users }) {
  return (
    <div className="mt-8 w-full min-w-0">

      {/* =========================
          DESKTOP TABLE
      ========================== */}
      <div className="hidden md:block w-full bg-white rounded-xl shadow-sm border overflow-hidden">

        <div className="w-full overflow-x-auto">

          <table className="w-full min-w-[760px]">

            <thead className="bg-gray-100">
              <tr>

                <th className="p-4 text-left whitespace-nowrap">
                  Name
                </th>

                <th className="p-4 text-left whitespace-nowrap">
                  Email
                </th>

                <th className="p-4 text-left whitespace-nowrap">
                  Role
                </th>

                <th className="p-4 text-left whitespace-nowrap">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {users.length === 0 ? (

                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-10 text-gray-500"
                  >
                    No Users Found
                  </td>
                </tr>

              ) : (

                users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                  />
                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =========================
          MOBILE CARDS
      ========================== */}
      <div className="md:hidden w-full space-y-4">

        {users.length === 0 ? (

          <div className="bg-white rounded-xl border shadow-sm p-8 text-center text-gray-500">
            No Users Found
          </div>

        ) : (

          users.map((user) => (

            <MobileUserCard
              key={user.id}
              user={user}
            />

          ))

        )}

      </div>

    </div>
  );
}


/* =========================
   MOBILE USER CARD
========================= */

function MobileUserCard({ user }) {

  return (
    <div className="w-full bg-white border rounded-xl shadow-sm p-4">

      <div className="min-w-0">

        <p className="text-xs text-gray-500 mb-1">
          Name
        </p>

        <p className="font-semibold text-lg break-words">
          {user.full_name || "-"}
        </p>

      </div>


      <div className="mt-4 min-w-0">

        <p className="text-xs text-gray-500 mb-1">
          Email
        </p>

        <p className="text-sm text-gray-700 break-words">
          {user.email || "-"}
        </p>

      </div>


      <div className="mt-4">

        <p className="text-xs text-gray-500 mb-2">
          Role
        </p>

        <div className="w-full">
          <MobileRoleSelect user={user} />
        </div>

      </div>


      <div className="mt-4">

        <p className="text-xs text-gray-500 mb-2">
          Status
        </p>

        <div className="w-full">
          <MobileStatusSelect user={user} />
        </div>

      </div>

    </div>
  );
}


/* =========================
   MOBILE ROLE
========================= */

function MobileRoleSelect({ user }) {

  const handleChange = async (e) => {

    const { updateUserRole } = await import(
      "../../services/users"
    );

    const success = await updateUserRole(
      user.id,
      e.target.value
    );

    if (success) {
      window.location.reload();
    }

  };

  return (
    <select
      value={user.role || "staff"}
      onChange={handleChange}
      className="w-full border rounded-lg px-3 py-2.5 bg-white"
    >
      <option value="admin">
        Admin
      </option>

      <option value="staff">
        Staff
      </option>
    </select>
  );
}


/* =========================
   MOBILE STATUS
========================= */

function MobileStatusSelect({ user }) {

  const handleChange = async (e) => {

    const { updateUserStatus } = await import(
      "../../services/users"
    );

    const success = await updateUserStatus(
      user.id,
      e.target.value
    );

    if (success) {
      window.location.reload();
    }

  };

  return (
    <select
      value={user.status || "active"}
      onChange={handleChange}
      className="w-full border rounded-lg px-3 py-2.5 bg-white"
    >
      <option value="active">
        Active
      </option>

      <option value="inactive">
        Inactive
      </option>
    </select>
  );
}

export default UserTable;