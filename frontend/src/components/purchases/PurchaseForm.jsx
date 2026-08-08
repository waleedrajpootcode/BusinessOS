import { useState, useEffect } from "react";
import Button from "../ui/Button";
import {
  getProductsForPurchase,
  getSuppliersForPurchase,
  generatePurchaseNumber,
  savePurchase,
  savePurchaseItems,
  increaseStock,
} from "../../services/purchases";

function PurchaseForm({ onSuccess }) {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [price, setPrice] = useState(0);

  const [discount, setDiscount] = useState(0);

  const [tax, setTax] = useState(0);

  const subtotal = items.reduce(

    (sum, item) => sum + item.total,

    0

  );

  const total = subtotal - discount + tax;
  useEffect(() => {
    async function loadData() {
      const supplierData = await getSuppliersForPurchase();
      const productData = await getProductsForPurchase();

      setSuppliers(supplierData);
      setProducts(productData);
    }

    loadData();
  }, []);

  function addItem() {

    if (!selectedProduct) {

      alert("Select Product");

      return;

    }

    const product = products.find(

      (p) => p.id === Number(selectedProduct)

    );

    if (!product) return;

    const newItem = {

      product_id: product.id,

      product_name: product.product_name,

      quantity,

      price,

      total: quantity * price,

    };



    setItems([...items, newItem]);

    setSelectedProduct("");

    setQuantity(1);

    setPrice(0);

  }

  function removeItem(index) {

    const updated = [...items];

    updated.splice(index, 1);

    setItems(updated);

  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedSupplier) {
      alert("Please select a supplier.");
      return;
    }

    if (items.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    if (quantity <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    try {
      const purchaseNo = await generatePurchaseNumber();

      const purchase = await savePurchase({
        invoice_no: purchaseNo,
        supplier_id: Number(selectedSupplier),
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        total: total,
        payment_method: "Cash",
        status: "Pending",
      });

      console.log("Saved Purchase:", purchase);

      const purchaseItems = items.map((item) => ({

        purchase_id: purchase.id,

        product_id: item.product_id,

        quantity: item.quantity,

        price: item.price,

        total: item.total,

      }));

      await savePurchaseItems(purchaseItems);

      console.log("Purchase Items Saved");

      for (const item of items) {

        await increaseStock(

          item.product_id,

          item.quantity

        );

      }

      console.log("Stock Updated");

      // Reset Form
      setSelectedSupplier("");
      setSelectedProduct("");
      setQuantity(1);
      setPrice(0);
      setDiscount(0);
      setTax(0);
      setItems([]);

      alert("Purchase saved successfully!");

      // Refresh Parent Component (Future Use)
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      {/* Supplier */}

      <select
        value={selectedSupplier}
        onChange={(e) =>
          setSelectedSupplier(e.target.value)
        }
        className="w-full border rounded-lg p-3"
      >
        <option value="">
          Select Supplier
        </option>

        {suppliers.map((supplier) => (
          <option
            key={supplier.id}
            value={supplier.id}
          >
            {supplier.supplier_name}
          </option>
        ))}

      </select>

      {/* Product */}

      <select
        value={selectedProduct}
        onChange={(e) => {

          const id = Number(e.target.value);

          setSelectedProduct(id);
          setQuantity(1);

          const product =
            products.find(
              (p) => p.id === id
            );

          if (product) {

            setPrice(
              Number(product.cost_price)
            );

          } else {

            setPrice(0);

          }

        }}
        className="w-full border rounded-lg p-3"
      >
        <option value="">
          Select Product
        </option>

        {products.map((product) => (

          <option
            key={product.id}
            value={product.id}
          >
            {product.product_name}
          </option>

        ))}

      </select>

      {/* Quantity */}

      <input
        type="number"
        min="1"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) =>
          setQuantity(Number(e.target.value))
        }
        className="w-full border rounded-lg p-3"
      />

      <Button
        type="button"
        onClick={addItem}
      >
        + Add Item
      </Button>


      {/* Discount */}

      <input
        type="number"
        placeholder="Discount"
        value={discount}
        onChange={(e) =>
          setDiscount(Number(e.target.value))
        }
        className="w-full border rounded-lg p-3"
      />

      {/* Tax */}

      <input
        type="number"
        placeholder="Tax"
        value={tax}
        onChange={(e) =>
          setTax(Number(e.target.value))
        }
        className="w-full border rounded-lg p-3"
      />

      {/* Purchase Items */}

      <div className="mt-6">

        <h3 className="text-lg font-semibold mb-3">
          Purchase Items
        </h3>

        <div className="border rounded-lg overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-3 text-left">
                  Product
                </th>

                <th className="p-3 text-center">
                  Qty
                </th>

                <th className="p-3 text-right">
                  Price
                </th>

                <th className="p-3 text-right">
                  Total
                </th>

                <th className="p-3 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {items.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center p-6 text-gray-500"
                  >
                    No Items Added
                  </td>

                </tr>

              ) : (

                items.map((item, index) => (

                  <tr
                    key={index}
                    className="border-t"
                  >

                    <td className="p-3">
                      {item.product_name}
                    </td>

                    <td className="p-3 text-center">
                      {item.quantity}
                    </td>

                    <td className="p-3 text-right">
                      PKR {item.price}
                    </td>

                    <td className="p-3 text-right">
                      PKR {item.total}
                    </td>

                    <td className="p-3 text-center">

                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Remove
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* Total */}

      <div className="bg-gray-100 rounded-lg p-4">

        <h2 className="font-semibold">
          Total
        </h2>

        <div className="space-y-2">

          <p>
            Subtotal: PKR {subtotal}
          </p>
          <p className="text-2xl font-bold">
            Total: PKR {total}
          </p>

        </div>

      </div>

      <div className="flex justify-end">

        <Button type="submit">
          Save Purchase
        </Button>

      </div>

    </form>
  );
}

export default PurchaseForm;