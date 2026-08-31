import Button from "../ui/Button";
import AlertMessage from "../ui/AlertMessage";

import {
  addProduct,
  updateProduct,
  generateInternalBarcode,
  getProductUnit,
  saveProductUnit,
  deleteProductUnit,
} from "../../services/products";

import { useEffect, useState } from "react";
import { getCategories } from "../../services/categories";
import ProductUnitSettings from "./ProductUnitSettings";


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

  const [unitSettings, setUnitSettings] = useState({
  enabled: false,
  unit_type: "",
  base_unit: "",
  selling_unit: "",
  conversion_factor: 1,
});
  const [unitLoading, setUnitLoading] = useState(false);


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


  useEffect(() => {
    async function loadProductUnit() {
      if (!product?.id) {
        setUnitSettings({
  enabled: false,
  unit_type: "",
  base_unit: "",
  selling_unit: "",
  conversion_factor: 1,
});
        return;
      }

      try {
        setUnitLoading(true);

        const data = await getProductUnit(product.id);

        if (data) {
setUnitSettings({
  enabled: true,
  unit_type: data.unit_type || "",
  base_unit: data.base_unit || "",
  selling_unit: data.selling_unit || "",
  conversion_factor:
    Number(data.conversion_factor) || 1,
});
        } else {
setUnitSettings({
  enabled: false,
  unit_type: "",
  base_unit: "",
  selling_unit: "",
  conversion_factor: 1,
});
        }
      } catch (error) {
        console.error(
          "Load Product Unit Error:",
          error
        );

        setAlertType("error");

        setAlertMessage(
          error.message ||
          "Failed to load product unit settings."
        );
      } finally {
        setUnitLoading(false);
      }
    }

    loadProductUnit();
  }, [product?.id]);


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


    if (unitSettings.enabled) {
      if (!unitSettings.base_unit) {
        setAlertType("error");

        setAlertMessage(
          "Please select a base unit."
        );

        return;
      }

      if (!unitSettings.unit_type) {
        setAlertType("error");

        setAlertMessage(
          "Please select a default selling unit."
        );

        return;
      }

      if (
        unitSettings.conversion_factor === "" ||
        Number(unitSettings.conversion_factor) <= 0
      ) {
        setAlertType("error");

        setAlertMessage(
          "Conversion factor must be greater than zero."
        );

        return;
      }
    }


    setIsSubmitting(true);


    try {
      let finalBarcode = barcode.trim();

      if (!product && !finalBarcode) {
        finalBarcode =
          await generateInternalBarcode();
      }


      const productData = {
        product_name: productName.trim(),
        sku: sku.trim(),
        barcode: finalBarcode,
        category,
        cost_price: Number(costPrice),
        price: Number(price),
        stock: Number(stock),
        minimum_stock: Number(minimumStock),
      };


      let savedProductId;


      if (product) {
        const updatedData = await updateProduct(
          product.id,
          productData
        );

        savedProductId =
          Number(product.id);


        setAlertType("success");

        setAlertMessage(
          "Product Updated Successfully ✅"
        );
      } else {
        const addedData =
          await addProduct(productData);

        savedProductId =
          Number(addedData?.[0]?.id);


        setAlertType("success");

        setAlertMessage(
          "Product Added Successfully ✅"
        );
      }


      if (!savedProductId) {
        throw new Error(
          "Product was saved, but its ID could not be found."
        );
      }


      if (unitSettings.enabled) {
  await saveProductUnit(
    savedProductId,
    {
      unit_type:
        unitSettings.unit_type,

      base_unit:
        unitSettings.base_unit,

      selling_unit:
        unitSettings.selling_unit,

      conversion_factor:
        Number(
          unitSettings.conversion_factor
        ),
    }
  );
}
 else {
        await deleteProductUnit(
          savedProductId
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

  setUnitSettings({
  enabled: false,
  unit_type: "",
  base_unit: "",
  selling_unit: "",
  conversion_factor: 1,
});


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


        if (
          error.message?.includes(
            "product_units_product_id_unique"
          )
        ) {
          setAlertType("error");

          setAlertMessage(
            "Unit settings already exist for this product."
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


      {!unitLoading && (
        <ProductUnitSettings
          key={product?.id || "new-product"}
          value={unitSettings}
          onChange={(settings) =>
            setUnitSettings(settings)
          }
        />
      )}


      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            unitLoading
          }
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