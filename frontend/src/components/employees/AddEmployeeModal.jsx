import { useEffect, useState } from "react";
import Button from "../ui/Button";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setFullName(employee.full_name || "");
      setEmail(employee.email || "");
      setPhone(employee.phone || "");
      setRole(employee.role || "staff");
      setStatus(employee.status || "active");
    } else {
      setFullName("");
      setEmail("");
      setPhone("");
      setRole("staff");
      setStatus("active");
    }
  }, [employee]);

  async function handleSave(e) {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        status,
      };

      if (employee) {
        await updateEmployee(employee.id, payload);
        alert("Employee Updated Successfully");
      } else {
        await addEmployee(payload);
        alert("Employee Added Successfully");
      }

      await onSaved();
      onClose();

      setFullName("");
      setEmail("");
      setPhone("");
      setRole("staff");
      setStatus("active");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <form
      onSubmit={handleSave}
      className="space-y-4"
    >
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="
          w-full
          rounded-lg
          border
          border-slate-300
          bg-white
          p-3
          outline-none
          transition
          focus:border-[var(--bos-brand-primary)]
          focus:ring-2
          focus:ring-[var(--bos-brand-primary)]/20
        "
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="
          w-full
          rounded-lg
          border
          border-slate-300
          bg-white
          p-3
          outline-none
          transition
          focus:border-[var(--bos-brand-primary)]
          focus:ring-2
          focus:ring-[var(--bos-brand-primary)]/20
        "
      />

      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="
          w-full
          rounded-lg
          border
          border-slate-300
          bg-white
          p-3
          outline-none
          transition
          focus:border-[var(--bos-brand-primary)]
          focus:ring-2
          focus:ring-[var(--bos-brand-primary)]/20
        "
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="
          w-full
          rounded-lg
          border
          border-slate-300
          bg-white
          p-3
          outline-none
          transition
          focus:border-[var(--bos-brand-primary)]
          focus:ring-2
          focus:ring-[var(--bos-brand-primary)]/20
        "
      >
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="cashier">Cashier</option>
        <option value="staff">Staff</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="
          w-full
          rounded-lg
          border
          border-slate-300
          bg-white
          p-3
          outline-none
          transition
          focus:border-[var(--bos-brand-primary)]
          focus:ring-2
          focus:ring-[var(--bos-brand-primary)]/20
        "
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? employee
              ? "Updating..."
              : "Saving..."
            : employee
              ? "Update Employee"
              : "Save Employee"}
        </Button>
      </div>
    </form>
  );
}

export default AddEmployeeModal;
