import Button from "../ui/Button";
import AlertMessage from "../ui/AlertMessage";
import { addProduct, updateProduct } from "../../services/products";
import { useEffect, useState } from "react";
import { getCategories } from "../../services/categories";

function ProductForm({
  product = null,
  onSuccess,
}) {
  const [productName, setProductName] = useState(
    product?.product_name || ""
  );

  const [sku, setSku] = useState(
    product?.sku || ""
  );

  const [barcode, setBarcode] = useState(
    product?.barcode || ""
  );

  const [category, setCategory] = useState(
    product?.category || ""
  );

  const [minimumStock, setMinimumStock] = useState(
    product?.minimum_stock || 5
  );

  const [price, setPrice] = useState(
    product?.price || ""
  );

  const [stock, setStock] = useState(
    product?.stock || ""
  );

  const [costPrice, setCostPrice] = useState(
    product?.cost_price || ""
  );

  const [categories, setCategories] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");

  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.error(
          "Load Categories Error:",
          error
        );

        setAlertType("error");

        setAlertMessage(
          error.message ||
            "Failed to load categories."
        );
      }
    }

    loadCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setAlertMessage("");

    if (isSubmitting) {
      return;
    }

    if (!productName.trim()) {
      setAlertType("error");

      setAlertMessage(
        "Product name is required."
      );

      return;
    }

    if (
      costPrice === "" ||
      Number(costPrice) < 0
    ) {
      setAlertType("error");

      setAlertMessage(
        "Cost price must be 0 or greater."
      );

      return;
    }

    if (
      price === "" ||
      Number(price) < 0
    ) {
      setAlertType("error");

      setAlertMessage(
        "Selling price must be 0 or greater."
      );

      return;
    }

    if (
      stock === "" ||
      Number(stock) < 0
    ) {
      setAlertType("error");

      setAlertMessage(
        "Stock must be 0 or greater."
      );

      return;
    }

    if (
      minimumStock === "" ||
      Number(minimumStock) < 0
    ) {
      setAlertType("error");

      setAlertMessage(
        "Minimum stock must be 0 or greater."
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        product_name: productName.trim(),
        sku: sku.trim(),
        barcode: barcode.trim(),
        category,
        cost_price: Number(costPrice),
        price: Number(price),
        stock: Number(stock),
        minimum_stock: Number(minimumStock),
      };

      if (product) {
        await updateProduct(
          product.id,
          productData
        );

        setAlertType("success");

        setAlertMessage(
          "Product Updated Successfully ✅"
        );
      } else {
        await addProduct(productData);

        setAlertType("success");

        setAlertMessage(
          "Product Added Successfully ✅"
        );
      }

      setProductName("");
      setSku("");
      setBarcode("");
      setCategory("");
      setPrice("");
      setStock("");
      setCostPrice("");
      setMinimumStock(5);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(
        "Product Error:",
        error
      );

      if (error.code === "23505") {
        if (
          error.message?.includes(
            "products_sku_unique"
          )
        ) {
          setAlertType("error");

          setAlertMessage(
            "SKU already exists. Please use a different SKU."
          );

          return;
        }

        if (
          error.message?.includes(
            "products_barcode_unique"
          )
        ) {
          setAlertType("error");

          setAlertMessage(
            "Barcode already exists. Please use a different barcode."
          );

          return;
        }

        setAlertType("error");

        setAlertMessage(
          "This product already exists."
        );

        return;
      }

      setAlertType("error");

      setAlertMessage(
        error.message ||
          "Failed to save product."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <AlertMessage
        type={alertType}
        message={alertMessage}
      />

      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) =>
          setProductName(e.target.value)
        }
        className="w-full border rounded-lg p-3"
      />

      <input
        type="text"
        placeholder="SKU"
        value={sku}
        onChange={(e) =>
          setSku(e.target.value)
        }
        className="w-full border rounded-lg p-3"
      />

      <input
        type="text"
        placeholder="Barcode"
        value={barcode}
        onChange={(e) =>
          setBarcode(e.target.value)
        }
        className="w-full border rounded-lg p-3"
      />

      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
        className="w-full border rounded-lg p-3"
      >
        <option value="">
          Select Category
        </option>

        {categories.map((item) => (
          <option
            key={item.id}
            value={item.category_name}
          >
            {item.category_name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Cost Price"
        value={costPrice}
        onChange={(e) =>
          setCostPrice(e.target.value)
        }
        className="w-full border rounded-lg p-3"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value)
        }
        className="w-full border rounded-lg p-3"
      />

      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) =>
          setStock(e.target.value)
        }
        className="w-full border rounded-lg p-3"
      />

      <input
        type="number"
        placeholder="Minimum Stock Alert"
        value={minimumStock}
        onChange={(e) =>
          setMinimumStock(e.target.value)
        }
        className="w-full border rounded-lg p-3"
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? product
              ? "Updating..."
              : "Saving..."
            : product
            ? "Update Product"
            : "Save Product"}
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
