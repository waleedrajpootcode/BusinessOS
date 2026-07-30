function SalesTable({ sales }) {
  return (
    <div className="mt-8 bg-white rounded-xl shadow border overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Invoice</th>
            <th className="p-4 text-left">Customer</th>
            <th className="p-4 text-left">Date</th>
            <th className="p-4 text-left">Total</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>

          {sales.length === 0 ? (

            <tr>
              <td
                colSpan="6"
                className="text-center p-10 text-gray-500"
              >
                No Sales Found
              </td>
            </tr>

          ) : (

            sales.map((sale) => (

              <tr
                key={sale.id}
                className="border-t"
              >

                <td className="p-4">
                  {sale.invoice_no}
                </td>

                <td className="p-4">
                  {sale.customers?.full_name}
                </td>

                <td className="p-4">
                  {new Date(
                    sale.created_at
                  ).toLocaleDateString()}
                </td>

                <td className="p-4">
                  PKR {sale.total}
                </td>

                <td className="p-4">
                  {sale.status}
                </td>

                <td className="p-4">
                  Coming Soon
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default SalesTable;