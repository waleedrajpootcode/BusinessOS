import UserRoleBadge from "./UserRoleBadge";
import { updateUserRole } from "../../services/users";


function UserRow({ user }) {


async function changeRole(e) {

  const success = await updateUserRole(
    user.id,
    e.target.value
  );

  if (success) {

    window.location.reload();

  }

}

  return (

    <tr className="border-t">

      <td className="p-3">

        {user.full_name}

      </td>

      <td className="p-3">

        {user.email}

      </td>

      <td className="p-3">

        <select
  value={user.role}
  onChange={changeRole}
  className="border rounded px-2 py-1"
>

  <option value="admin">
    Admin
  </option>

  <option value="staff">
    Staff
  </option>

</select>

      </td>

      <td className="p-3">

        {user.status}

      </td>

    </tr>

  );

}

export default UserRow;