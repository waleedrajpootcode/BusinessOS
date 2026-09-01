import { useState, useEffect } from "react";

import Button from "../ui/Button";

import {
  getProductsForSale,
  getCustomersForSale,
  generateInvoiceNumber,
  saveSale,
} from "../../services/sales";

import { useBusiness } from "../../context/BusinessContext";

function SaleForm({ onSuccess }) {
  const { business } = useBusiness();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [saleMode, setSaleMode] = useState("quantity");
  const [saleAmount, setSaleAmount] = useState("");

  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

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
      (product) =>
        Number(product.id) === Number(selectedProduct)
    );
  }

  function isMeasurableProduct(product) {
    if (!product) {
      return false;
    }

    return ["weight", "volume", "length"].includes(
      product.unit_type
    );
  }

  function calculateQuantityFromAmount(product, amount) {
    if (!product) {
      return 0;
    }

    const price = Number(product.price || 0);
    const amountValue = Number(amount || 0);

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(amountValue)
    ) {
      return 0;
    }

    if (price <= 0 || amountValue <= 0) {
      return 0;
    }

    return amountValue / price;
  }

  function calculateAmountFromQuantity(
    product,
    quantityValue
  ) {
    if (!product) {
      return 0;
    }

    const price = Number(product.price || 0);
    const quantityNumber = Number(quantityValue || 0);

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(quantityNumber)
    ) {
      return 0;
    }

    if (price <= 0 || quantityNumber <= 0) {
      return 0;
    }

    return price * quantityNumber;
  }

  function getProductUnitLabel(product) {
    if (!product) {
      return "pcs";
    }

    return product.selling_unit || "pcs";
  }

  function formatNumber(value, maximumFractionDigits = 6) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "0";
    }

    return number.toLocaleString(undefined, {
      maximumFractionDigits,
    });
  }

  function formatMoney(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "0";
    }

    return number.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  }

  function formatQuantity(product, quantityValue) {
    const quantityNumber = Number(quantityValue || 0);

    if (!Number.isFinite(quantityNumber)) {
      return `0 ${getProductUnitLabel(product)}`;
    }

    const unit = getProductUnitLabel(product);

    /*
     * UI-only readable conversion.
     *
     * Stored stock/sale quantity remains in the product selling unit.
     * We do NOT change the database quantity here.
     */

    if (
      product?.unit_type === "weight" &&
      unit === "kg"
    ) {
      if (quantityNumber > 0 && quantityNumber < 1) {
        const grams = quantityNumber * 1000;

        return `${formatNumber(grams, 3)} g`;
      }

      if (
        quantityNumber >= 1 &&
        quantityNumber % 1 !== 0
      ) {
        const wholeKg = Math.floor(quantityNumber);
        const grams = Math.round(
          (quantityNumber - wholeKg) * 1000
        );

        if (grams === 0) {
          return `${formatNumber(wholeKg, 3)} kg`;
        }

        return `${formatNumber(
          wholeKg,
          3
        )} kg ${formatNumber(grams, 3)} g`;
      }
    }

    if (
      product?.unit_type === "volume" &&
      unit === "L"
    ) {
      if (quantityNumber > 0 && quantityNumber < 1) {
        const milliliters = quantityNumber * 1000;

        return `${formatNumber(milliliters, 3)} ml`;
      }

      if (
        quantityNumber >= 1 &&
        quantityNumber % 1 !== 0
      ) {
        const wholeLiters = Math.floor(quantityNumber);
        const milliliters = Math.round(
          (quantityNumber - wholeLiters) * 1000
        );

        if (milliliters === 0) {
          return `${formatNumber(
            wholeLiters,
            3
          )} L`;
        }

        return `${formatNumber(
          wholeLiters,
          3
        )} L ${formatNumber(milliliters, 3)} ml`;
      }
    }

    return `${formatNumber(
      quantityNumber,
      6
    )} ${unit}`;
  }

  function formatStock(product) {
    if (!product) {
      return "0 pcs";
    }

    return formatQuantity(
      product,
      Number(product.stock || 0)
    );
  }

  function formatPrice(product) {
    if (!product) {
      return "PKR 0/pcs";
    }

    const price = Number(product.price || 0);
    const unit = getProductUnitLabel(product);

    return `PKR ${formatMoney(price)}/${unit}`;
  }

  function getCalculatedAmount() {
    const product = getSelectedProduct();

    if (!product) {
      return 0;
    }

    if (saleMode === "amount") {
      return Number(saleAmount || 0);
    }

    return calculateAmountFromQuantity(
      product,
      quantity
    );
  }

  function getCalculatedQuantity() {
    const product = getSelectedProduct();

    if (!product) {
      return 0;
    }

    if (saleMode === "amount") {
      return calculateQuantityFromAmount(
        product,
        saleAmount
      );
    }

    return Number(quantity || 0);
  }

  function addItem() {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    const product = getSelectedProduct();

    if (!product) {
      alert("Selected product not found.");
      return;
    }

    let quantityValue = Number(quantity);

    /*
     * Measurable product + Amount mode:
     *
     * Customer Amount
     *        ↓
     * Amount / Price
     *        ↓
     * Quantity
     */
    if (
      isMeasurableProduct(product) &&
      saleMode === "amount"
    ) {
      const amountValue = Number(saleAmount);

      if (
        !Number.isFinite(amountValue) ||
        amountValue <= 0
      ) {
        alert("Amount must be greater than zero.");
        return;
      }

      quantityValue =
        calculateQuantityFromAmount(
          product,
          amountValue
        );
    }

    if (
      !Number.isFinite(quantityValue) ||
      quantityValue <= 0
    ) {
      alert("Quantity must be greater than zero.");
      return;
    }

    const availableStock = Number(
      product.stock || 0
    );

    if (
      !Number.isFinite(availableStock) ||
      availableStock < 0
    ) {
      alert("Invalid stock value.");
      return;
    }

    const existingItem = cart.find(
      (item) =>
        Number(item.product_id) ===
        Number(product.id)
    );

    const existingQuantity = existingItem
      ? Number(existingItem.quantity)
      : 0;

    const newQuantity =
      existingQuantity + quantityValue;

    if (newQuantity > availableStock) {
      alert(
        `Not enough stock.\nAvailable: ${formatStock(
          product
        )}\nRequested: ${formatQuantity(
          product,
          newQuantity
        )}`
      );
      return;
    }

    const item = {
      product_id: Number(product.id),
      product_name: product.product_name,
      quantity: quantityValue,
      price: Number(product.price || 0),
      cost_price: Number(
        product.cost_price || 0
      ),
      stock: availableStock,
      selling_unit:
        product.selling_unit || "pcs",
      unit_type:
        product.unit_type || "piece",
    };

    setCart((currentCart) => {
      const exists = currentCart.find(
        (cartItem) =>
          Number(cartItem.product_id) ===
          Number(product.id)
      );

      if (exists) {
        return currentCart.map(
          (cartItem) =>
            Number(cartItem.product_id) ===
            Number(product.id)
              ? {
                  ...cartItem,
                  quantity:
                    Number(
                      cartItem.quantity
                    ) + quantityValue,
                }
              : cartItem
        );
      }

      return [...currentCart, item];
    });

    setSelectedProduct("");
    setQuantity(1);
    setSaleAmount("");
    setSaleMode("quantity");
  }

  function removeItem(productId) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          Number(item.product_id) !==
          Number(productId)
      )
    );
  }

  function updateItemQuantity(
    productId,
    newQuantity
  ) {
    const quantityValue = Number(newQuantity);

    if (
      !Number.isFinite(quantityValue) ||
      quantityValue <= 0
    ) {
      removeItem(productId);
      return;
    }

    const product = products.find(
      (item) =>
        Number(item.id) === Number(productId)
    );

    if (!product) {
      return;
    }

    const availableStock = Number(
      product.stock || 0
    );

    if (quantityValue > availableStock) {
      alert(
        `Not enough stock.\nAvailable: ${formatStock(
          product
        )}`
      );
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        Number(item.product_id) ===
        Number(productId)
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
      sum +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  const totalProfit = cart.reduce(
    (sum, item) =>
      sum +
      (Number(item.price) -
        Number(item.cost_price)) *
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

    if (!business?.id) {
      alert(
        "Business information is not available. Please try again."
      );
      return;
    }

    if (cart.length === 0) {
      alert(
        "Please add at least one product."
      );
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

    if (total < 0) {
      alert(
        "Grand total cannot be negative."
      );
      return;
    }

    try {
      setLoading(true);

      const invoiceNo =
        await generateInvoiceNumber();

      /*
       * Existing saveSale / RPC flow is preserved.
       *
       * Quantity is sent as numeric so fractional
       * quantities remain supported.
       */
      const saleItems = cart.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
        cost_price: Number(
          item.cost_price
        ),
        price: Number(item.price),
      }));

      await saveSale(
        {
          invoice_no: invoiceNo,
          customer_id: Number(
            selectedCustomer
          ),
          subtotal: subtotal,
          discount: Number(
            discount || 0
          ),
          tax: Number(tax || 0),
          total: total,
          profit: totalProfit,
          payment_method: paymentMethod,
          status: paymentStatus,
        },
        saleItems
      );

      alert(
        `Sale Saved Successfully ✅\nInvoice: ${invoiceNo}\nItems: ${cart.length}`
      );

      setSelectedCustomer("");
      setSelectedProduct("");
      setQuantity(1);
      setSaleAmount("");
      setSaleMode("quantity");
      setDiscount(0);
      setTax(0);
      setCart([]);
      setPaymentStatus("Unpaid");
      setPaymentMethod("Cash");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(
        "Sale save error:",
        error
      );

      alert(
        error?.message ||
          "Something went wrong while saving the sale."
      );
    } finally {
      setLoading(false);
    }
  }

  const selectedProductData =
    getSelectedProduct();

  const calculatedAmount =
    getCalculatedAmount();

  const calculatedQuantity =
    getCalculatedQuantity();

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 w-full"
    >
      {/* Customer */}
      <div className="w-full">
        <label className="block font-medium mb-2">
          Customer
        </label>

        <select
          value={selectedCustomer}
          onChange={(e) =>
            setSelectedCustomer(
              e.target.value
            )
          }
          className="w-full border rounded-lg p-3 bg-white text-sm sm:text-base"
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
      <div className="border rounded-xl p-3 sm:p-4 bg-gray-50 w-full">
        <h2 className="font-semibold text-base sm:text-lg mb-4">
          Add Products
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Product */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium mb-2">
              Product
            </label>

            <select
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(
                  e.target.value
                );
                setSaleMode("quantity");
                setSaleAmount("");
                setQuantity(1);
              }}
              className="w-full border rounded-lg p-3 bg-white text-sm sm:text-base"
            >
              <option value="">
                Select Product
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.product_name} —{" "}
                  {formatPrice(product)} — Stock:{" "}
                  {formatStock(product)}
                </option>
              ))}
            </select>
          </div>

          {/* Selling Controls */}
          {selectedProductData &&
          isMeasurableProduct(
            selectedProductData
          ) ? (
            <div className="lg:col-span-1 space-y-2">
              <label className="block text-sm font-medium">
                Sell By
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSaleMode("amount")
                  }
                  className={`border rounded-lg p-3 text-sm font-medium transition ${
                    saleMode === "amount"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Amount
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSaleMode("quantity")
                  }
                  className={`border rounded-lg p-3 text-sm font-medium transition ${
                    saleMode === "quantity"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Quantity
                </button>
              </div>

              {saleMode === "amount" ? (
                <div className="space-y-2">
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    inputMode="decimal"
                    placeholder="Customer Amount"
                    value={saleAmount}
                    onChange={(e) =>
                      setSaleAmount(
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg p-3 bg-white"
                  />

                  {Number(saleAmount) >
                    0 && (
                    <div className="rounded-lg bg-white border p-3 text-sm">
                      <div className="text-gray-500">
                        Customer gets
                      </div>

                      <div className="font-semibold text-gray-800">
                        {formatQuantity(
                          selectedProductData,
                          calculatedQuantity
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0.000001"
                      step="any"
                      inputMode="decimal"
                      placeholder="Quantity"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          e.target.value
                        )
                      }
                      className="w-full border rounded-lg p-3 bg-white"
                    />

                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {getProductUnitLabel(
                        selectedProductData
                      )}
                    </span>
                  </div>

                  <div className="rounded-lg bg-white border p-3 text-sm">
                    <span className="text-gray-500">
                      Amount:{" "}
                    </span>

                    <strong>
                      PKR{" "}
                      {formatMoney(
                        calculatedAmount
                      )}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium mb-2">
                Quantity
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-lg p-3 bg-white"
                />

                <span className="text-sm text-gray-500 whitespace-nowrap">
                  pcs
                </span>
              </div>

              {selectedProductData && (
                <div className="mt-2 rounded-lg bg-white border p-3 text-sm">
                  <span className="text-gray-500">
                    Amount:{" "}
                  </span>

                  <strong>
                    PKR{" "}
                    {formatMoney(
                      calculateAmountFromQuantity(
                        selectedProductData,
                        quantity
                      )
                    )}
                  </strong>
                </div>
              )}
            </div>
          )}

          {/* Add Button */}
          <div className="lg:col-span-1 flex items-end">
            <Button
              type="button"
              onClick={addItem}
              disabled={!selectedProduct}
              className="w-full"
            >
              + Add Item
            </Button>
          </div>
        </div>

        {/* Selected Product Quick Info */}
        {selectedProductData && (
          <div className="mt-4 rounded-lg border bg-white p-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-500">
                  Price
                </p>

                <p className="font-semibold">
                  {formatPrice(
                    selectedProductData
                  )}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Available Stock
                </p>

                <p className="font-semibold">
                  {formatStock(
                    selectedProductData
                  )}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Selling Unit
                </p>

                <p className="font-semibold">
                  {getProductUnitLabel(
                    selectedProductData
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart / Invoice Items */}
      <div className="border rounded-xl overflow-hidden w-full">
        <div className="bg-gray-100 p-3 sm:p-4">
          <h2 className="font-semibold text-base sm:text-lg">
            Invoice Items
          </h2>
        </div>

        {cart.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm sm:text-base">
            No products added yet.
          </div>
        ) : (
          <>
            {/* Desktop / Tablet */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[700px]">
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
                  {cart.map((item) => {
                    const product =
                      products.find(
                        (product) =>
                          Number(
                            product.id
                          ) ===
                          Number(
                            item.product_id
                          )
                      );

                    return (
                      <tr
                        key={
                          item.product_id
                        }
                        className="border-t"
                      >
                        <td className="p-3">
                          <div className="font-medium">
                            {
                              item.product_name
                            }
                          </div>

                          <div className="text-xs text-gray-500">
                            {
                              item.selling_unit
                            }
                          </div>
                        </td>

                        <td className="p-3">
                          PKR{" "}
                          {formatMoney(
                            item.price
                          )}
                          /
                          {item.selling_unit ||
                            "pcs"}
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0.000001"
                              step="any"
                              inputMode="decimal"
                              max={
                                item.stock
                              }
                              value={
                                item.quantity
                              }
                              onChange={(
                                e
                              ) =>
                                updateItemQuantity(
                                  item.product_id,
                                  e.target
                                    .value
                                )
                              }
                              className="w-28 border rounded-lg p-2"
                            />

                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {
                                item.selling_unit
                              }
                            </span>
                          </div>

                          <div className="text-xs text-gray-500 mt-1">
                            {formatQuantity(
                              product ||
                                item,
                              item.quantity
                            )}
                          </div>
                        </td>

                        <td className="p-3 font-medium">
                          PKR{" "}
                          {formatMoney(
                            Number(
                              item.price
                            ) *
                              Number(
                                item.quantity
                              )
                          )}
                        </td>

                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() =>
                              removeItem(
                                item.product_id
                              )
                            }
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y">
              {cart.map((item) => {
                const product =
                  products.find(
                    (product) =>
                      Number(
                        product.id
                      ) ===
                      Number(
                        item.product_id
                      )
                  );

                return (
                  <div
                    key={
                      item.product_id
                    }
                    className="p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold break-words">
                          {
                            item.product_name
                          }
                        </p>

                        <p className="text-sm text-gray-500">
                          PKR{" "}
                          {formatMoney(
                            item.price
                          )}
                          /
                          {item.selling_unit ||
                            "pcs"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(
                            item.product_id
                          )
                        }
                        className="text-red-600 font-medium text-sm shrink-0"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Quantity
                        </label>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0.000001"
                            step="any"
                            inputMode="decimal"
                            max={
                              item.stock
                            }
                            value={
                              item.quantity
                            }
                            onChange={(
                              e
                            ) =>
                              updateItemQuantity(
                                item.product_id,
                                e.target
                                  .value
                              )
                            }
                            className="w-full border rounded-lg p-2"
                          />

                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {
                              item.selling_unit
                            }
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Total
                        </p>

                        <p className="font-semibold">
                          PKR{" "}
                          {formatMoney(
                            Number(
                              item.price
                            ) *
                              Number(
                                item.quantity
                              )
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      Quantity:
                      <span className="font-medium text-gray-700 ml-1">
                        {formatQuantity(
                          product ||
                            item,
                          item.quantity
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Discount & Tax */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-2">
            Discount
          </label>

          <input
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            placeholder="Discount"
            value={discount}
            onChange={(e) =>
              setDiscount(
                Number(e.target.value)
              )
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
            step="any"
            inputMode="decimal"
            placeholder="Tax"
            value={tax}
            onChange={(e) =>
              setTax(
                Number(e.target.value)
              )
            }
            className="w-full border rounded-lg p-3"
          />
        </div>
      </div>

      {/* Payment Status & Method */}
      <div className="border rounded-xl p-4 sm:p-5 bg-gray-50">
        <h2 className="font-semibold text-base sm:text-lg mb-4">
          Payment
        </h2>

        {/* Payment Status */}
        <div>
          <label className="block font-medium mb-2">
            Payment Status
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`border rounded-lg p-4 cursor-pointer ${
                paymentStatus ===
                "Unpaid"
                  ? "border-red-500 bg-red-50"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentStatus"
                  value="Unpaid"
                  checked={
                    paymentStatus ===
                    "Unpaid"
                  }
                  onChange={(e) =>
                    setPaymentStatus(
                      e.target.value
                    )
                  }
                />

                <div>
                  <p className="font-semibold">
                    Unpaid
                  </p>

                  <p className="text-sm text-gray-500">
                    Customer will pay later
                  </p>
                </div>
              </div>
            </label>

            <label
              className={`border rounded-lg p-4 cursor-pointer ${
                paymentStatus ===
                "Paid"
                  ? "border-green-500 bg-green-50"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentStatus"
                  value="Paid"
                  checked={
                    paymentStatus ===
                    "Paid"
                  }
                  onChange={(e) =>
                    setPaymentStatus(
                      e.target.value
                    )
                  }
                />

                <div>
                  <p className="font-semibold">
                    Paid
                  </p>

                  <p className="text-sm text-gray-500">
                    Customer has paid the full amount
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mt-4">
          <label className="block font-medium mb-2">
            Payment Method
          </label>

          <select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }
            className="w-full border rounded-lg p-3 bg-white"
          >
            <option value="Cash">
              Cash
            </option>

            <option value="Bank">
              Bank
            </option>

            <option value="Card">
              Card
            </option>

            <option value="Online">
              Online
            </option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-100 rounded-xl p-4 sm:p-5">
        <h2 className="font-semibold text-base sm:text-lg mb-3">
          Invoice Summary
        </h2>

        <div className="space-y-2 text-sm sm:text-base">
          <p>
            Items:{" "}
            <strong>
              {cart.length}
            </strong>
          </p>

          <p>
            Subtotal:{" "}
            <strong>
              PKR{" "}
              {formatMoney(subtotal)}
            </strong>
          </p>

          <p>
            Discount:{" "}
            <strong>
              PKR{" "}
              {formatMoney(
                Number(discount || 0)
              )}
            </strong>
          </p>

          <p>
            Tax:{" "}
            <strong>
              PKR{" "}
              {formatMoney(
                Number(tax || 0)
              )}
            </strong>
          </p>

          <div className="border-t pt-3 mt-3">
            <p className="text-lg sm:text-xl font-bold">
              Grand Total: PKR{" "}
              {formatMoney(total)}
            </p>

            <p className="text-green-600 font-semibold mt-1">
              Total Profit: PKR{" "}
              {formatMoney(totalProfit)}
            </p>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-stretch sm:justify-end">
        <Button
          type="submit"
          disabled={
            loading || cart.length === 0
          }
          className="w-full sm:w-auto"
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