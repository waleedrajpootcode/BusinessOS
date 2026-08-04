import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { globalSearch } from "../../services/search";
import { useNavigate } from "react-router-dom";

function GlobalSearch() {

  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const [results, setResults] = useState({
    products: [],
    customers: [],
    sales: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const timer = setTimeout(async () => {

      if (!query.trim()) {

        setResults({
          products: [],
          customers: [],
          sales: [],
        });

        return;
      }

      setLoading(true);

      const data = await globalSearch(query);

      setResults(data);

      setLoading(false);

    }, 300);

    return () => clearTimeout(timer);

  }, [query]);

  return (

    <div className="relative w-full max-w-lg">

      <div className="relative">

        <Search
          size={18}
          className="absolute left-3 top-3 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search products, customers, invoices..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {query && (

        <div className="absolute z-50 mt-2 w-full rounded-lg border bg-white shadow-xl max-h-96 overflow-y-auto">

          {loading && (

            <div className="p-4 text-gray-500">

              Searching...

            </div>

          )}

          {!loading && (

            <>

              {results.products.length > 0 && (

                <div className="p-3">

                  <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">

                    Products

                  </h3>

                  {results.products.map((item) => (

                    <div
                      key={item.id}
                      onClick={() => navigate("/products")}
                      className="p-2 rounded hover:bg-gray-100 cursor-pointer"
                    >

                      {item.product_name}

                    </div>

                  ))}

                </div>

              )}

              {results.customers.length > 0 && (

                <div className="p-3 border-t">

                  <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">

                    Customers

                  </h3>

                  {results.customers.map((item) => (

                    <div
                      key={item.id}
                      onClick={() => navigate("/customers")}
                      className="p-2 rounded hover:bg-gray-100 cursor-pointer"
                    >

                      {item.full_name}

                    </div>

                  ))}

                </div>

              )}

              {results.sales.length > 0 && (

                <div className="p-3 border-t">

                  <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">

                    Sales

                  </h3>

                  {results.sales.map((item) => (

                    <div
                      key={item.id}
                      onClick={() => navigate(`/invoice/${item.id}`)}
                      className="p-2 rounded hover:bg-gray-100 cursor-pointer flex justify-between"
                    >

                      <span>{item.invoice_no}</span>

                      <span className="font-semibold">

                        PKR {Number(item.total).toLocaleString()}

                      </span>

                    </div>

                  ))}

                </div>

              )}

              {!results.products.length &&
                !results.customers.length &&
                !results.sales.length && (

                  <div className="p-4 text-center text-gray-500">

                    No Results Found

                  </div>

                )}

            </>

          )}

        </div>

      )}

    </div>

  );

}

export default GlobalSearch;