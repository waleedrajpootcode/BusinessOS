function TopSellingProducts({ products }) {

  return (

    <div className="bg-white rounded-xl shadow border p-6">

      <h2 className="text-xl font-bold mb-6">

        Top Selling Products

      </h2>

      <div className="space-y-4">

        {products.map((item, index) => (

          <div
            key={index}
            className="flex justify-between border-b pb-2"
          >

            <span>

              {item.name}

            </span>

            <span className="font-bold">

              {item.qty}

            </span>

          </div>

        ))}

      </div>

    </div>

  );

}

export default TopSellingProducts;