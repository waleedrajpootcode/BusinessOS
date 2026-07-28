import { useState } from "react";
import Button from "../ui/Button";
import { addProduct, updateProduct } from "../../services/products";

function ProductForm({
  product = null,
  onSuccess,
}) {
const [productName, setProductName] = useState(product?.product_name || "");
const [sku, setSku] = useState(product?.sku || "");
const [barcode, setBarcode] = useState(product?.barcode || "");
const [category, setCategory] = useState(product?.category || "");
const [price, setPrice] = useState(product?.price || "");
const [stock, setStock] = useState(product?.stock || "");

 async function handleSubmit(e) {
  e.preventDefault();

  if (!productName || !price || !stock) {
    alert("Please fill all required fields.");
    return;
  }

try {
  const productData = {
    product_name: productName,
    sku,
    barcode,
    category,
    price: Number(price),
    stock: Number(stock),
  };

  if (product) {
    await updateProduct(product.id, productData);

    alert("Product Updated Successfully ✅");
  } else {
    await addProduct(productData);

    alert("Product Added Successfully ✅");
  }

  setProductName("");
  setSku("");
  setBarcode("");
  setCategory("");
  setPrice("");
  setStock("");

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
  {product ? "Update Product" : "Save Product"}
</Button>
      </div>

    </form>
  );
}

export default ProductForm;