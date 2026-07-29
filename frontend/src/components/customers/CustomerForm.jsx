import { useState, useEffect } from "react";
import Button from "../ui/Button";
import {
  addCustomer,
  updateCustomer,
} from "../../services/customers";

function CustomerForm({
  customer = null,
  onSuccess,
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (customer) {
      setFullName(customer.full_name || "");
      setPhone(customer.phone || "");
      setEmail(customer.email || "");
      setAddress(customer.address || "");
    } else {
      setFullName("");
      setPhone("");
      setEmail("");
      setAddress("");
    }
  }, [customer]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!fullName || !phone) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const customerData = {
        full_name: fullName,
        phone,
        email,
        address,
      };

      if (customer) {
        await updateCustomer(customer.id, customerData);

        alert("Customer Updated Successfully ✅");
      } else {
        await addCustomer(customerData);

        alert("Customer Added Successfully ✅");
      }

      setFullName("");
      setPhone("");
      setEmail("");
      setAddress("");

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        type="text"
        placeholder="Customer Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full border rounded-lg p-3"
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border rounded-lg p-3"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded-lg p-3"
      />

      <textarea
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border rounded-lg p-3"
      />

      <div className="flex justify-end">
        <Button type="submit">
          {customer ? "Update Customer" : "Save Customer"}
        </Button>
      </div>

    </form>
  );
}

export default CustomerForm;