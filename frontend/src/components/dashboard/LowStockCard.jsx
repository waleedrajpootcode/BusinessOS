import { useEffect, useState } from "react";
import { getLowStockProducts } from "../../services/products";

function LowStockCard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getLowStockProducts();
      setProducts(data);
    }

    loadProducts();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow border p-6 mt-6">

      <h2 className="text-xl font-bold mb-4">
        ⚠ Low Stock Products
      </h2>

      {products.length === 0 ? (

        <p className="text-green-600">
          All products are well stocked ✅
        </p>

      ) : (

        <div className="space-y-3">

          {products.map((product) => (

            <div
              key={product.id}
              className="flex justify-between border-b pb-2"
            >

              <span>
                {product.product_name}
              </span>

              <span className="text-red-600 font-bold">
                {product.stock} Left
              </span>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default LowStockCard;