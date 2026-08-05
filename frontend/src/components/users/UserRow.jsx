import UserRoleBadge from "./UserRoleBadge";

function UserRow({ user }) {

  return (

    <tr className="border-t">

      <td className="p-3">

        {user.full_name}

      </td>

      <td className="p-3">

        {user.email}

      </td>

      <td className="p-3">

        <UserRoleBadge
          role={user.role}
        />

      </td>

      <td className="p-3">

        {user.status}

      </td>

    </tr>

  );

}

export default UserRow;