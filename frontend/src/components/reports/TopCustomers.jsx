function TopCustomers({ customers }) {

  return (

    <div className="bg-white rounded-xl shadow border p-6">

      <h2 className="text-xl font-bold mb-6">

        👥 Top Customers

      </h2>

      <div className="space-y-3">

        {customers.map((customer, index) => (

          <div
            key={index}
            className="flex justify-between border-b pb-2"
          >

            <span>

              {customer.name}

            </span>

            <span className="font-bold text-blue-600">

              PKR {customer.total.toLocaleString()}

            </span>

          </div>

        ))}

      </div>

    </div>

  );

}

export default TopCustomers;