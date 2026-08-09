import { useEffect, useRef } from "react";
import { X, Printer } from "lucide-react";
import JsBarcode from "jsbarcode";

function ProductBarcodeModal({
    product,
    onClose,
}) {
    const barcodeRef = useRef(null);

    useEffect(() => {
        if (!product?.barcode || !barcodeRef.current) {
            return;
        }

        JsBarcode(barcodeRef.current, String(product.barcode), {
            format: "CODE128",
            width: 2,
            height: 80,
            displayValue: true,
            fontSize: 18,
            margin: 10,
            background: "#ffffff",
            lineColor: "#000000",
        });
    }, [product]);

    if (!product) {
        return null;
    }

    function handlePrint() {
        window.print();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b p-5 print:hidden">

                    <div>
                        <h2 className="text-xl font-bold">
                            Product Barcode
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Scanner-compatible barcode
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        title="Close"
                        aria-label="Close"
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Printable Area */}
                <div
                    id="barcode-print-area"
                    className="p-6 text-center"
                >

                    {/* Product Name */}
                    <h3 className="text-xl font-bold">
                        {product.product_name}
                    </h3>

                    {/* SKU */}
                    <p className="mt-1 text-sm text-gray-500">
                        SKU: {product.sku || "N/A"}
                    </p>

                    {/* Real Barcode */}
                    <div className="mt-6 flex justify-center rounded-xl border bg-white p-5 print:border-black">

                        {product.barcode ? (
                            <svg
                                ref={barcodeRef}
                                className="max-w-full"
                            />
                        ) : (
                            <p className="py-8 text-red-600">
                                No barcode available
                            </p>
                        )}

                    </div>

                    {/* Price */}
                    <div className="mt-5">
                        <p className="text-lg font-bold">
                            PKR{" "}
                            {Number(
                                product.price || 0
                            ).toLocaleString()}
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t p-5 print:hidden">

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition font-medium"
                    >
                        Close
                    </button>

                    <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Printer size={18} />
                        Print Barcode
                    </button>

                </div>

            </div>
        </div>
    );
}

export default ProductBarcodeModal;