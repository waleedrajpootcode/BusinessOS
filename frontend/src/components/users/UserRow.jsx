import { updateUserRole, updateUserStatus } from "../../services/users";
import { useAuth } from "../../context/AuthContext";

function UserRow({ user, mobile = false }) {
  const { user: currentUser } = useAuth();

  const isCurrentUser = currentUser?.id === user.id;

  async function changeRole(e) {
    if (isCurrentUser) {
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
    if (isCurrentUser) {
      alert("You cannot change your own status.");
      return;
    }

    const success = await updateUserStatus(
      user.id,
      e.target.value
    );

    if (success) {
      window.location.reload();
    }
  }

  const roleSelect = (
    <select
      value={user.role || "staff"}
      onChange={changeRole}
      disabled={isCurrentUser}
      className="w-full sm:w-auto border rounded-lg px-3 py-2 bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
      aria-label={`Role for ${user.full_name || "user"}`}
    >
      <option value="admin">Admin</option>
      <option value="staff">Staff</option>
    </select>
  );

  const statusSelect = (
    <select
      value={user.status || "active"}
      onChange={changeStatus}
      disabled={isCurrentUser}
      className="w-full sm:w-auto border rounded-lg px-3 py-2 bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
      aria-label={`Status for ${user.full_name || "user"}`}
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  );

  {/* =========================
      MOBILE CARD CONTENT
  ========================== */}
  if (mobile) {
    return (
      <div className="w-full">

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg break-words">
              {user.full_name || "-"}
            </h3>

            <p className="text-sm text-gray-500 mt-1 break-words">
              {user.email || "-"}
            </p>
          </div>

          {isCurrentUser && (
            <span className="shrink-0 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              You
            </span>
          )}
        </div>

        <div className="mt-5 space-y-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-sm text-gray-500">
              Role
            </span>

            {roleSelect}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-sm text-gray-500">
              Status
            </span>

            {statusSelect}
          </div>

        </div>

      </div>
    );
  }

  {/* =========================
      DESKTOP TABLE ROW
  ========================== */}
  return (
    <tr className="border-t">

      <td className="p-4 align-middle">
        <div className="min-w-0">
          <span className="font-medium break-words">
            {user.full_name || "-"}
          </span>

          {isCurrentUser && (
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              You
            </span>
          )}
        </div>
      </td>

      <td className="p-4 align-middle">
        <div className="max-w-[280px] break-words">
          {user.email || "-"}
        </div>
      </td>

      <td className="p-4 align-middle">
        {roleSelect}
      </td>

      <td className="p-4 align-middle">
        {statusSelect}
      </td>

    </tr>
  );
}

export default UserRow;