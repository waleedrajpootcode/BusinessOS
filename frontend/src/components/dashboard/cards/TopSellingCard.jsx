import { useEffect, useState } from "react";
import { getTopSellingProducts } from "../../../services/sales";

function TopSellingCard() {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    loadProducts();

  }, []);

  async function loadProducts() {

    const data =
      await getTopSellingProducts();

    setProducts(data);

  }

  return (

    <div className="bg-white rounded-xl shadow border p-6 mt-6">

      <h2 className="text-xl font-bold mb-4">
        🏆 Top Selling Products
      </h2>

      {products.length === 0 ? (

        <p className="text-gray-500">
          No Sales Data
        </p>

      ) : (

        <div className="space-y-4">

          {products.map((product, index) => (

            <div
              key={index}
              className="flex justify-between items-center border-b pb-3"
            >

              <div>

                <p className="font-semibold">
                  {product.product_name}
                </p>

                <p className="text-sm text-gray-500">
                  Sold:
                  {" "}
                  {product.quantity}
                </p>

              </div>

              <div className="text-right">

                <p className="font-bold">

                  PKR{" "}

                  {product.revenue.toLocaleString()}

                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default TopSellingCard;