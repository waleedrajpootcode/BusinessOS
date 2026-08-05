function UserRoleBadge({ role }) {

  return (

    <span
      className={
        role === "admin"
          ? "px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm"
          : "px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm"
      }
    >

      {role}

    </span>

  );

}

export default UserRoleBadge;