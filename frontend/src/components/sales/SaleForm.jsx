import { useState, useEffect } from "react";
import Button from "../ui/Button";
import {
    getProductsForSale,
    getCustomersForSale,
} from "../../services/sales";

function SaleForm() {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const subtotal = price * quantity;

const total =
  subtotal
  - discount
  + tax;
    const [selectedProduct, setSelectedProduct] = useState("");
    useEffect(() => {
        async function loadData() {
            const customerData = await getCustomersForSale();
            const productData = await getProductsForSale();

            setCustomers(customerData);
            setProducts(productData);
        }

        loadData();
    }, []);
    return (
        <form className="space-y-4">

            <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full border rounded-lg p-3"
            >
                <option value="">
                    Select Customer
                </option>

                {customers.map((customer) => (
                    <option
                        key={customer.id}
                        value={customer.id}
                    >
                        {customer.full_name}
                    </option>
                ))}

            </select>

            <select
                value={selectedProduct}
                onChange={(e) => {
                    const id = Number(e.target.value);

                    console.log("Selected ID:", id);
                    console.log(products);

                    setSelectedProduct(id);

                    const product = products.find(
                        (p) => p.id === id
                    );

                    console.log("Selected Product:", product);

                    if (product) {
                        setPrice(Number(product.price));
                    } else {
                        setPrice(0);
                    }
                }}
                className="w-full border rounded-lg p-3"
            >
                <option value="">
                    Select Product
                </option>

                {products.map((product) => (
                    <option
                        key={product.id}
                        value={product.id}
                    >
                        {product.product_name}
                    </option>
                ))}

            </select>

            <input
                type="number"
                min="1"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) =>
                    setQuantity(Number(e.target.value))
                }
                className="w-full border rounded-lg p-3"
            />

            <input
                type="number"
                placeholder="Discount"
                value={discount}
                onChange={(e) =>
                    setDiscount(Number(e.target.value))
                }
                className="w-full border rounded-lg p-3"
            />

            <input
                type="number"
                placeholder="Tax"
                value={tax}
                onChange={(e) =>
                    setTax(Number(e.target.value))
                }
                className="w-full border rounded-lg p-3"
            />

            <div className="bg-gray-100 rounded-lg p-4">

                <h2 className="font-semibold">
                    Total:
                </h2>

                <div className="space-y-2">

                    <p className="text-lg">
                        Price: PKR {price}
                    </p>

                    <p className="text-2xl font-bold">
                        Total: PKR {total}
                    </p>

                </div>

            </div>

            <div className="flex justify-end">

                <Button type="submit">
                    Save Sale
                </Button>

            </div>

        </form>
    );
}

export default SaleForm;