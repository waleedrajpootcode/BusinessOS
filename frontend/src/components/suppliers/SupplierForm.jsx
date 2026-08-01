import { useState } from "react";
import Button from "../ui/Button";
import {
  addSupplier,
  updateSupplier,
} from "../../services/suppliers";

function SupplierForm({
  supplier,
  onSuccess,
}) {

  const [supplierName, setSupplierName] = useState(
    supplier?.supplier_name || ""
  );

  const [phone, setPhone] = useState(
    supplier?.phone || ""
  );

  const [email, setEmail] = useState(
    supplier?.email || ""
  );

  const [address, setAddress] = useState(
    supplier?.address || ""
  );

  async function handleSubmit(e) {

    e.preventDefault();

    if (!supplierName) {
      alert("Supplier Name is required.");
      return;
    }

    const supplierData = {
      supplier_name: supplierName,
      phone,
      email,
      address,
    };

    try {

      if (supplier) {

        await updateSupplier(
          supplier.id,
          supplierData
        );

        alert("Supplier Updated Successfully ✅");

      } else {

        await addSupplier(
          supplierData
        );

        alert("Supplier Added Successfully ✅");

      }

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {

      alert(error.message);

    }

  }

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <input
        type="text"
        placeholder="Supplier Name"
        value={supplierName}
        onChange={(e) =>
          setSupplierName(e.target.value)
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

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        className="w-full border rounded-lg p-3"
      />

      <textarea
        placeholder="Address"
        value={address}
        onChange={(e) =>
          setAddress(e.target.value)
        }
        className="w-full border rounded-lg p-3"
      />

      <div className="flex justify-end">

        <Button type="submit">

          {supplier
            ? "Update Supplier"
            : "Save Supplier"}

        </Button>

      </div>

    </form>

  );

}

export default SupplierForm;