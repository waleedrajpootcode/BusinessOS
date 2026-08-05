import UserRow from "./UserRow";

function UserTable({ users }) {

  return (

    <div className="mt-8 overflow-x-auto">

      <table className="w-full border border-gray-200 rounded-lg">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-3 text-left">
              Name
            </th>

            <th className="p-3 text-left">
              Email
            </th>

            <th className="p-3 text-left">
              Role
            </th>

            <th className="p-3 text-left">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {users.map(user => (

            <UserRow
              key={user.id}
              user={user}
            />

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default UserTable;