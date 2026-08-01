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

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [price, setPrice] = useState(0);

  const [discount, setDiscount] = useState(0);

  const [tax, setTax] = useState(0);

  const subtotal = price * quantity;

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

  return (
  <form className="space-y-4">

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

        const product =
          products.find(
            (p) => p.id === id
          );

        if (product) {

          setPrice(
            Number(product.price)
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

    {/* Total */}

    <div className="bg-gray-100 rounded-lg p-4">

      <h2 className="font-semibold">
        Total
      </h2>

      <div className="space-y-2">

        <p>
          Price: PKR {price}
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