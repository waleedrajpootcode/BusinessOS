import Layout from "../components/dashboard/Layout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPurchaseDetails } from "../services/purchaseDetails";
import { useNavigate } from "react-router-dom";
import {
  updatePurchase,
  updatePurchaseItemSafe,
} from "../services/purchaseDetails";
import AlertMessage from "../components/ui/AlertMessage";

function EditPurchase() {
  const { id } = useParams();

  const [purchase, setPurchase] = useState(null);
    const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    async function loadPurchase() {
      const data = await getPurchaseDetails(id);

      setPurchase(data);
    }

    loadPurchase();
  }, [id]);

  if (!purchase) {
    return (
      <Layout>
        <div className="p-6">
          Loading Purchase...
        </div>
      </Layout>
    );
  }

const subtotal = purchase.purchase_items?.reduce(
  (sum, item) => {
    return sum + Number(item.total);
  },
  0
);

const discount = Number(purchase.discount || 0);
const tax = Number(purchase.tax || 0);

const grandTotal =
  subtotal - discount + tax;


async function handleUpdatePurchase() {

  if (isUpdating) {
    return;
  }

  setIsUpdating(true);

  try {

    // Validate purchase items
    for (const item of purchase.purchase_items) {

      const itemQuantity = Number(item.quantity);
      const itemPrice = Number(item.price);

      if (!Number.isFinite(itemQuantity) || itemQuantity <= 0) {
        alert(
          `Quantity must be greater than zero for ${
            item.products?.product_name || "this product"
          }.`
        );
        return;
      }

      if (!Number.isFinite(itemPrice) || itemPrice < 0) {
        alert(
          `Price cannot be negative for ${
            item.products?.product_name || "this product"
          }.`
        );
        return;
      }

    }

    // Validate discount
    if (!Number.isFinite(discount) || discount < 0) {
      alert("Discount cannot be negative.");
      return;
    }

    // Validate tax
    if (!Number.isFinite(tax) || tax < 0) {
      alert("Tax cannot be negative.");
      return;
    }

    // 1. Purchase header update
    await updatePurchase(id, {
      subtotal,
      discount,
      tax,
      total: grandTotal,
    });

    // 2. Purchase items update + stock adjustment
    for (const item of purchase.purchase_items) {

      await updatePurchaseItemSafe(
        item.id,
        Number(item.quantity),
        Number(item.price)
      );

    }

setAlertType("success");
setAlertMessage("Purchase updated successfully ✅");

setTimeout(() => {
  navigate("/purchases");
}, 800);

  } catch (error) {

  console.error("Update Purchase Error:", error);

setAlertType("error");
setAlertMessage(
  error.message ||
  "Failed to update purchase."
);

} finally {

  setIsUpdating(false);

}

}


  return (
    <Layout>
      <AlertMessage
  type={alertType}
  message={alertMessage}
/>

      <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">
          Edit Purchase
        </h1>

        <div className="bg-white rounded-xl shadow p-6">

          <p>
            <strong>Invoice:</strong>{" "}
            {purchase.invoice_no}
          </p>

          <p className="mt-2">
            <strong>Supplier:</strong>{" "}
            {purchase.suppliers?.supplier_name}
          </p>

          <p className="mt-2">
            <strong>Total:</strong>{" "}
            PKR {Number(purchase.total).toLocaleString()}
          </p>

        </div>

<div className="mt-6 bg-white rounded-xl shadow overflow-hidden">

  <div className="p-6 border-b">
    <h2 className="text-xl font-bold">
      Purchase Items
    </h2>
  </div>

  <table className="w-full">


<tbody>

  {purchase.purchase_items?.map((item) => (

    <tr
      key={item.id}
      className="border-b"
    >

      {/* Product */}
      <td className="p-4 font-medium">
        {item.products?.product_name}
      </td>

      {/* Quantity */}
      <td className="p-4 text-center">

        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => {

            const value = Number(e.target.value);

            setPurchase((prev) => ({
              ...prev,

              purchase_items:
                prev.purchase_items.map(
                  (currentItem) =>
                    currentItem.id === item.id
                      ? {
                          ...currentItem,
                          quantity: value,
                          total:
                            value *
                            Number(currentItem.price),
                        }
                      : currentItem
                ),
            }));

          }}
          className="w-24 border rounded-lg p-2 text-center"
        />

      </td>

      {/* Price */}
      <td className="p-4 text-right">

        <input
          type="number"
          min="0"
          value={item.price}
          onChange={(e) => {

            const value = Number(e.target.value);

            setPurchase((prev) => ({
              ...prev,

              purchase_items:
                prev.purchase_items.map(
                  (currentItem) =>
                    currentItem.id === item.id
                      ? {
                          ...currentItem,
                          price: value,
                          total:
                            Number(currentItem.quantity) * value,
                        }
                      : currentItem
                ),
            }));

          }}
          className="w-32 border rounded-lg p-2 text-right"
        />

      </td>

      {/* Total */}
      <td className="p-4 text-right font-semibold">
        PKR {Number(item.total).toLocaleString()}
      </td>

    </tr>

  ))}

</tbody>


  </table>

</div>

<div className="mt-8 flex justify-end">

  <div className="w-96 bg-white rounded-xl shadow p-6">

    <div className="flex justify-between py-2">
      <span>Subtotal</span>

      <span>
        PKR {subtotal.toLocaleString()}
      </span>
    </div>

<div className="flex justify-between items-center py-2">

  <span>Discount</span>

  <input
    type="number"
    min="0"
    value={discount}
    onChange={(e) => {

      const value = Number(e.target.value);

      setPurchase((prev) => ({
        ...prev,
        discount: value,
      }));

    }}
    className="w-32 border rounded-lg p-2 text-right"
  />

</div>

<div className="flex justify-between items-center py-2">

  <span>Tax</span>

  <input
    type="number"
    min="0"
    value={tax}
    onChange={(e) => {

      const value = Number(e.target.value);

      setPurchase((prev) => ({
        ...prev,
        tax: value,
      }));

    }}
    className="w-32 border rounded-lg p-2 text-right"
  />

</div>

    <hr className="my-4" />

    <div className="flex justify-between text-xl font-bold text-blue-600">

      <span>Grand Total</span>

      <span>
        PKR {grandTotal.toLocaleString()}
      </span>

    </div>

    <div className="mt-8 flex justify-end">


<button
  type="button"
  onClick={handleUpdatePurchase}
  disabled={isUpdating}
  className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
    isUpdating
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-500 hover:bg-blue-600"
  }`}
>
  {isUpdating ? "Updating..." : "Update Purchase"}
</button>


</div>

  </div>

</div>


      </div>
    </Layout>
  );
}

export default EditPurchase;
