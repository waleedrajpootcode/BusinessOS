import Button from "../components/ui/Button";
function Products() {
  return (
    <div className="p-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all your business products.
          </p>
        </div>

        <Button>
          + Add Product
        </Button>
        <div className="mt-8">

          <input
            type="text"
            placeholder="Search Products..."
            className="w-full border rounded-lg p-3"
          />

        </div>
        <div className="mt-8 bg-white rounded-xl shadow border">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Product
                </th>

                <th className="p-4 text-left">
                  SKU
                </th>

                <th className="p-4 text-left">
                  Category
                </th>

                <th className="p-4 text-left">
                  Price
                </th>

                <th className="p-4 text-left">
                  Stock
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td
                  colSpan="5"
                  className="text-center p-10 text-gray-500"
                >
                  No Products Found
                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Products;