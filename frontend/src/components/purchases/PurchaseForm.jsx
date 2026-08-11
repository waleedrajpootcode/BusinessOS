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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const supplierData = await getSuppliersForPurchase();
        const productData = await getProductsForPurchase();

        setSuppliers(supplierData || []);
        setProducts(productData || []);
      } catch (error) {
        console.error("Purchase data loading error:", error);
        alert(error.message || "Failed to load purchase data.");
      }
    }

    loadData();
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const total = Math.max(
    0,
    subtotal - Number(discount || 0) + Number(tax || 0)
  );

  const totalQuantity = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  function handleProductChange(value) {
    const id = Number(value);

    setSelectedProduct(value);
    setQuantity(1);

    const product = products.find((p) => Number(p.id) === id);

    if (product) {
      setPrice(Number(product.cost_price || 0));
    } else {
      setPrice(0);
    }
  }

  function addItem() {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    const quantityValue = Number(quantity);
    const priceValue = Number(price);

    if (!Number.isFinite(quantityValue) || quantityValue <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    if (!Number.isFinite(priceValue) || priceValue < 0) {
      alert("Purchase price cannot be negative.");
      return;
    }

    const product = products.find(
      (p) => Number(p.id) === Number(selectedProduct)
    );

    if (!product) {
      alert("Selected product was not found.");
      return;
    }

    const existingItem = items.find(
      (item) => Number(item.product_id) === Number(product.id)
    );

    if (existingItem) {
      const mergedQuantity =
        Number(existingItem.quantity) + quantityValue;

      const mergedTotal = mergedQuantity * priceValue;

      setItems((currentItems) =>
        currentItems.map((item) =>
          Number(item.product_id) === Number(product.id)
            ? {
                ...item,
                quantity: mergedQuantity,
                price: priceValue,
                total: mergedTotal,
              }
            : item
        )
      );
    } else {
      const newItem = {
        product_id: product.id,
        product_name: product.product_name,
        quantity: quantityValue,
        price: priceValue,
        total: quantityValue * priceValue,
      };

      setItems((currentItems) => [...currentItems, newItem]);
    }

    setSelectedProduct("");
    setQuantity(1);
    setPrice(0);
  }

  function updateItemQuantity(productId, newQuantity) {
    const quantityValue = Number(newQuantity);

    if (!Number.isFinite(quantityValue) || quantityValue <= 0) {
      removeItem(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        Number(item.product_id) === Number(productId)
          ? {
              ...item,
              quantity: quantityValue,
              total: quantityValue * Number(item.price),
            }
          : item
      )
    );
  }

  function updateItemPrice(productId, newPrice) {
    const priceValue = Number(newPrice);

    if (!Number.isFinite(priceValue) || priceValue < 0) {
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        Number(item.product_id) === Number(productId)
          ? {
              ...item,
              price: priceValue,
              total: Number(item.quantity) * priceValue,
            }
          : item
      )
    );
  }

  function removeItem(productId) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => Number(item.product_id) !== Number(productId)
      )
    );
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

    const hasInvalidItem = items.some(
      (item) =>
        Number(item.quantity) <= 0 ||
        Number(item.price) < 0
    );

    if (hasInvalidItem) {
      alert("Please check product quantities and prices.");
      return;
    }

    if (Number(discount) < 0) {
      alert("Discount cannot be negative.");
      return;
    }

    if (Number(tax) < 0) {
      alert("Tax cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      const purchaseNo = await generatePurchaseNumber();

      const purchase = await savePurchase({
        invoice_no: purchaseNo,
        supplier_id: Number(selectedSupplier),
        subtotal,
        discount: Number(discount || 0),
        tax: Number(tax || 0),
        total,
        payment_method: "Cash",
        status: "Pending",
      });

      const purchaseItems = items.map((item) => ({
        purchase_id: purchase.id,
        product_id: item.product_id,
        quantity: Number(item.quantity),
        price: Number(item.price),
        total: Number(item.total),
      }));

      await savePurchaseItems(purchaseItems);

      for (const item of items) {
        await increaseStock(
          item.product_id,
          Number(item.quantity)
        );
      }

      alert(
        `Purchase saved successfully!\nPurchase: ${purchaseNo}\nItems: ${items.length}`
      );

      setSelectedSupplier("");
      setSelectedProduct("");
      setQuantity(1);
      setPrice(0);
      setDiscount(0);
      setTax(0);
      setItems([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Purchase save error:", error);
      alert(
        error?.message ||
          "Something went wrong while saving the purchase."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Supplier */}
      <div>
        <label className="block font-medium mb-2">
          Supplier
        </label>

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
      </div>

      {/* Add Products */}
      <div className="border rounded-xl p-4 bg-gray-50">
        <h2 className="font-semibold text-lg mb-4">
          Add Products
        </h2>

        <div className="grid md:grid-cols-4 gap-3">
          <select
            value={selectedProduct}
            onChange={(e) =>
              handleProductChange(e.target.value)
            }
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

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Purchase Price"
            value={price}
            onChange={(e) =>
              setPrice(Number(e.target.value))
            }
            className="w-full border rounded-lg p-3"
          />

          <Button
            type="button"
            onClick={addItem}
          >
            + Add Item
          </Button>
        </div>
      </div>

      {/* Purchase Items */}
      <div className="border rounded-xl overflow-hidden">
        <div className="bg-gray-100 p-4">
          <h2 className="font-semibold text-lg">
            Purchase Items
          </h2>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No products added yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">
                    Product
                  </th>

                  <th className="p-3 text-center">
                    Quantity
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
                {items.map((item) => (
                  <tr
                    key={item.product_id}
                    className="border-t"
                  >
                    <td className="p-3 font-medium">
                      {item.product_name}
                    </td>

                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItemQuantity(
                            item.product_id,
                            e.target.value
                          )
                        }
                        className="w-24 border rounded-lg p-2 text-center"
                      />
                    </td>

                    <td className="p-3 text-right">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) =>
                          updateItemPrice(
                            item.product_id,
                            e.target.value
                          )
                        }
                        className="w-32 border rounded-lg p-2 text-right"
                      />
                    </td>

                    <td className="p-3 text-right font-medium">
                      PKR{" "}
                      {Number(item.total).toFixed(2)}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.product_id)
                        }
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Discount & Tax */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-2">
            Discount
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={discount}
            onChange={(e) =>
              setDiscount(Number(e.target.value))
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Tax
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={tax}
            onChange={(e) =>
              setTax(Number(e.target.value))
            }
            className="w-full border rounded-lg p-3"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-100 rounded-xl p-5">
        <h2 className="font-semibold text-lg mb-3">
          Purchase Summary
        </h2>

        <div className="space-y-2">
          <p>
            Products:{" "}
            <strong>{items.length}</strong>
          </p>

          <p>
            Total Quantity:{" "}
            <strong>{totalQuantity}</strong>
          </p>

          <p>
            Subtotal:{" "}
            <strong>
              PKR {subtotal.toFixed(2)}
            </strong>
          </p>

          <p>
            Discount:{" "}
            <strong>
              PKR {Number(discount || 0).toFixed(2)}
            </strong>
          </p>

          <p>
            Tax:{" "}
            <strong>
              PKR {Number(tax || 0).toFixed(2)}
            </strong>
          </p>

          <p className="text-xl font-bold">
            Grand Total: PKR {total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving Purchase..."
            : "Save Purchase"}
        </Button>
      </div>
    </form>
  );
}

export default PurchaseForm;