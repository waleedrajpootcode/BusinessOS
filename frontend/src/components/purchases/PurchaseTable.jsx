function PurchaseTable({ purchases }) {
  return (
    <table className="w-full">

      <thead className="bg-gray-100">
        <tr>
          <th className="p-4 text-left">Invoice</th>
          <th className="p-4 text-left">Supplier</th>
          <th className="p-4 text-left">Date</th>
          <th className="p-4 text-left">Total</th>
          <th className="p-4 text-left">Status</th>
        </tr>
      </thead>

      <tbody>

        {purchases.length === 0 ? (

          <tr>

            <td
              colSpan="5"
              className="text-center p-10 text-gray-500"
            >
              No Purchases Found
            </td>

          </tr>

        ) : (

          purchases.map((purchase) => (

            <tr
              key={purchase.id}
              className="border-t"
            >

              <td className="p-4">
                {purchase.invoice_no}
              </td>

              <td className="p-4">
                {purchase.suppliers?.supplier_name}
              </td>

              <td className="p-4">
                {new Date(
                  purchase.created_at
                ).toLocaleDateString()}
              </td>

              <td className="p-4">
                PKR {Number(purchase.total).toLocaleString()}
              </td>

              <td className="p-4">
                {purchase.status}
              </td>

            </tr>

          ))

        )}

      </tbody>

    </table>
  );
}

export default PurchaseTable;