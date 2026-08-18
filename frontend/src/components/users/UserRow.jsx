import { updateUserRole } from "../../services/users";
import { useAuth } from "../../context/AuthContext";
import { updateUserStatus } from "../../services/users";

function UserRow({ user }) {

  // ✅ Hook yahan use hoga
  const { user: currentUser } = useAuth();

  async function changeRole(e) {

    // ✅ Owner apna role change nahi kar sakta
    if (currentUser?.id === user.id) {
      alert("You cannot change your own role.");
      return;
    }

    const success = await updateUserRole(
      user.id,
      e.target.value
    );

    if (success) {
      window.location.reload();
    }

  }

async function changeStatus(e) {

  const success =
    await updateUserStatus(
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
          disabled={currentUser?.id === user.id}
          className="border rounded px-2 py-1 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
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
 <select
  value={user.status}
  onChange={changeStatus}
  disabled={currentUser?.id === user.id}
  className="border rounded px-2 py-1 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
>

  <option value="active">
    Active
  </option>

  <option value="inactive">
    Inactive
  </option>

</select>
      </td>

    </tr>

  );

}

export default UserRow;