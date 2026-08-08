import { useEffect, useState } from "react";
import {
  addEmployee,
  updateEmployee,
} from "../../services/employees";


function AddEmployeeModal({

  open,

  onClose,

  onSaved,

  employee = null,

}) {

  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [role, setRole] = useState("staff");

  const [status, setStatus] = useState("active");

useEffect(() => {

  if (employee) {

    setFullName(employee.full_name || "");

    setEmail(employee.email || "");

    setPhone(employee.phone || "");

    setRole(employee.role || "staff");

    setStatus(employee.status || "active");

  }

}, [employee]);

  async function handleSave() {

  try {

    const payload = {

      full_name: fullName,

      email,

      phone,

      role,

      status,

    };

    if (employee) {

      await updateEmployee(employee.id, payload);

      alert("Employee Updated Successfully ✅");

    } else {

      await addEmployee(payload);

      alert("Employee Added Successfully ✅");

    }

    onSaved();

    onClose();

    setFullName("");

    setEmail("");

    setPhone("");

    setRole("staff");

    setStatus("active");

  } catch (error) {

    alert(error.message);

  }

}


  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

<h2 className="text-2xl font-bold mb-6">

  {employee ? "Edit Employee" : "Add Employee"}

</h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            className="w-full border rounded-lg p-3"
          >

            <option value="admin">
              Admin
            </option>

            <option value="manager">
              Manager
            </option>

            <option value="cashier">
              Cashier
            </option>

            <option value="staff">
              Staff
            </option>

          </select>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="w-full border rounded-lg p-3"
          >

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

          </select>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-lg border"
          >

            Cancel

          </button>

          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
          >

            {employee ? "Update Employee" : "Save Employee"}

          </button>

        </div>

      </div>

    </div>

  );

}

export default AddEmployeeModal;