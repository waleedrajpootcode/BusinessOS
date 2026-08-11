import { useState, useEffect } from "react";

import Button from "../ui/Button";

import {
  getProductsForSale,
  getCustomersForSale,
  generateInvoiceNumber,
  saveSale,
  saveSaleItems,
  updateProductStock,
} from "../../services/sales";

function SaleForm({ onSuccess }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      const customerData = await getCustomersForSale();
      const productData = await getProductsForSale();

      setCustomers(customerData);
      setProducts(productData);
    }

    loadData();
  }, []);

  function getSelectedProduct() {
    return products.find(
      (product) => Number(product.id) === Number(selectedProduct)
    );
  }

  function addItem() {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    if (quantity <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    const product = getSelectedProduct();

    if (!product) {
      alert("Selected product not found.");
      return;
    }

    const availableStock = Number(product.stock || 0);

    const existingItem = cart.find(
      (item) => Number(item.product_id) === Number(product.id)
    );

    const existingQuantity = existingItem
      ? Number(existingItem.quantity)
      : 0;

    const newQuantity = existingQuantity + Number(quantity);

    if (newQuantity > availableStock) {
      alert(
        `Not enough stock. Available stock: ${availableStock}`
      );
      return;
    }

    const item = {
      product_id: Number(product.id),
      product_name: product.product_name,
      quantity: Number(quantity),
      price: Number(product.price || 0),
      cost_price: Number(product.cost_price || 0),
      stock: availableStock,
    };

    setCart((currentCart) => {
      const exists = currentCart.find(
        (cartItem) =>
          Number(cartItem.product_id) === Number(product.id)
      );

      if (exists) {
        return currentCart.map((cartItem) =>
          Number(cartItem.product_id) === Number(product.id)
            ? {
                ...cartItem,
                quantity:
                  Number(cartItem.quantity) + Number(quantity),
              }
            : cartItem
        );
      }

      return [...currentCart, item];
    });

    setSelectedProduct("");
    setQuantity(1);
  }

  function removeItem(productId) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => Number(item.product_id) !== Number(productId)
      )
    );
  }

  function updateItemQuantity(productId, newQuantity) {
    const quantityValue = Number(newQuantity);

    if (quantityValue <= 0) {
      removeItem(productId);
      return;
    }

    const product = products.find(
      (item) => Number(item.id) === Number(productId)
    );

    if (!product) {
      return;
    }

    const availableStock = Number(product.stock || 0);

    if (quantityValue > availableStock) {
      alert(
        `Not enough stock. Available stock: ${availableStock}`
      );
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        Number(item.product_id) === Number(productId)
          ? {
              ...item,
              quantity: quantityValue,
            }
          : item
      )
    );
  }

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const totalProfit = cart.reduce(
    (sum, item) =>
      sum +
      (Number(item.price) - Number(item.cost_price)) *
        Number(item.quantity),
    0
  );

  const total =
    subtotal -
    Number(discount || 0) +
    Number(tax || 0);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }

    if (cart.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    if (Number(discount || 0) < 0) {
      alert("Discount cannot be negative.");
      return;
    }

    if (Number(tax || 0) < 0) {
      alert("Tax cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      const invoiceNo = await generateInvoiceNumber();

      // One sale/header for the complete invoice
      const sale = await saveSale({
        invoice_no: invoiceNo,
        customer_id: Number(selectedCustomer),
        subtotal: subtotal,
        discount: Number(discount || 0),
        tax: Number(tax || 0),
        total: total,
        profit: totalProfit,
        payment_method: "Cash",
        status: "Pending",
      });

      // Multiple products/items under the same sale
      const saleItems = cart.map((item) => {
        const profitPerUnit =
          Number(item.price) - Number(item.cost_price);

        const itemTotal =
          Number(item.price) * Number(item.quantity);

        const itemProfit =
          profitPerUnit * Number(item.quantity);

        return {
          sale_id: sale.id,
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
          cost_price: Number(item.cost_price),
          price: Number(item.price),
          profit_per_unit: profitPerUnit,
          total_profit: itemProfit,
          total: itemTotal,
        };
      });

      await saveSaleItems(saleItems);

      // Reduce stock for every product in this invoice
      for (const item of cart) {
        await updateProductStock(
          Number(item.product_id),
          Number(item.quantity)
        );
      }

      alert(
        `Sale Saved Successfully ✅\nInvoice: ${invoiceNo}\nItems: ${cart.length}`
      );

      setSelectedCustomer("");
      setSelectedProduct("");
      setQuantity(1);
      setDiscount(0);
      setTax(0);
      setCart([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Sale save error:", error);

      alert(
        error?.message ||
          "Something went wrong while saving the sale."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Customer */}
      <div>
        <label className="block font-medium mb-2">
          Customer
        </label>

        <select
          value={selectedCustomer}
          onChange={(e) =>
            setSelectedCustomer(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        >
          <option value="">
            Select Customer
          </option>

          {customers.map((customer) => (
            <option
              key={customer.id}
              value={customer.id}
            >
              {customer.full_name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Selection */}
      <div className="border rounded-xl p-4 bg-gray-50">
        <h2 className="font-semibold text-lg mb-4">
          Add Products
        </h2>

        <div className="grid md:grid-cols-3 gap-3">
          <select
            value={selectedProduct}
            onChange={(e) =>
              setSelectedProduct(e.target.value)
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
                {product.product_name} — Stock:{" "}
                {product.stock}
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

          <Button
            type="button"
            onClick={addItem}
          >
            + Add Item
          </Button>
        </div>
      </div>

      {/* Cart / Invoice Items */}
      <div className="border rounded-xl overflow-hidden">
        <div className="bg-gray-100 p-4">
          <h2 className="font-semibold text-lg">
            Invoice Items
          </h2>
        </div>

        {cart.length === 0 ? (
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

                  <th className="p-3 text-left">
                    Price
                  </th>

                  <th className="p-3 text-left">
                    Quantity
                  </th>

                  <th className="p-3 text-left">
                    Total
                  </th>

                  <th className="p-3 text-left">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {cart.map((item) => (
                  <tr
                    key={item.product_id}
                    className="border-t"
                  >
                    <td className="p-3">
                      {item.product_name}
                    </td>

                    <td className="p-3">
                      PKR {item.price}
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItemQuantity(
                            item.product_id,
                            e.target.value
                          )
                        }
                        className="w-24 border rounded-lg p-2"
                      />
                    </td>

                    <td className="p-3 font-medium">
                      PKR{" "}
                      {Number(item.price) *
                        Number(item.quantity)}
                    </td>

                    <td className="p-3">
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
            placeholder="Discount"
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
            placeholder="Tax"
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
          Invoice Summary
        </h2>

        <div className="space-y-2">
          <p>
            Items:{" "}
            <strong>{cart.length}</strong>
          </p>

          <p>
            Total Quantity:{" "}
            <strong>
              {cart.reduce(
                (sum, item) =>
                  sum + Number(item.quantity),
                0
              )}
            </strong>
          </p>

          <p>
            Subtotal:{" "}
            <strong>
              PKR {subtotal}
            </strong>
          </p>

          <p>
            Discount:{" "}
            <strong>
              PKR {Number(discount || 0)}
            </strong>
          </p>

          <p>
            Tax:{" "}
            <strong>
              PKR {Number(tax || 0)}
            </strong>
          </p>

          <p className="text-lg font-bold">
            Grand Total: PKR {total}
          </p>

          <p className="text-green-600 font-semibold">
            Total Profit: PKR {totalProfit}
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
            ? "Saving Sale..."
            : "Save Sale & Create Invoice"}
        </Button>
      </div>
    </form>
  );
}

export default SaleForm;