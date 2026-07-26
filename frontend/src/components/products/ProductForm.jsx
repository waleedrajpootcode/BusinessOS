import { useState } from "react";
import Button from "../ui/Button";
import { addProduct } from "../../services/products";

function ProductForm() {
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

 async function handleSubmit(e) {
  e.preventDefault();

  if (!productName || !price || !stock) {
    alert("Please fill all required fields.");
    return;
  }

  try {
    await addProduct({
      product_name: productName,
      sku,
      barcode,
      category,
      price: Number(price),
      stock: Number(stock),
    });

    alert("Product Added Successfully ✅");

    setProductName("");
    setSku("");
    setBarcode("");
    setCategory("");
    setPrice("");
    setStock("");

  } catch (error) {
    alert(error.message);
  }
}

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        className="w-full border rounded-lg p-3"
      />

      <input
        type="text"
        placeholder="SKU"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
        className="w-full border rounded-lg p-3"
      />

      <input
        type="text"
        placeholder="Barcode"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        className="w-full border rounded-lg p-3"
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border rounded-lg p-3"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border rounded-lg p-3"
      />

      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="w-full border rounded-lg p-3"
      />

      <div className="flex justify-end">
        <Button type="submit">
          Save Product
        </Button>
      </div>

    </form>
  );
}

export default ProductForm;