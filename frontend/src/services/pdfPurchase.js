import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

async function loadImageAsDataURL(url) {
  if (!url) return null;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Unable to load business logo.");
    }

    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;

      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn(
      "Purchase PDF logo could not be loaded:",
      error
    );

    return null;
  }
}

export async function generatePurchasePDF(
  purchase,
  business
) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth =
    pdf.internal.pageSize.getWidth();

  const pageHeight =
    pdf.internal.pageSize.getHeight();

  // =====================================================
  // BASIC DATA
  // =====================================================

  const businessName =
    business?.business_name ||
    "BusinessOS";

  const address =
    business?.address || "";

  const email =
    business?.email || "";

  const phone =
    business?.phone || "";

  const supplierName =
    purchase?.suppliers?.supplier_name ||
    "Supplier";

  const supplierPhone =
    purchase?.suppliers?.phone || "";

  const supplierEmail =
    purchase?.suppliers?.email || "";

  const invoiceNumber =
    purchase?.invoice_no || "N/A";

  const purchaseDate =
    purchase?.created_at
      ? new Date(
          purchase.created_at
        ).toLocaleDateString()
      : new Date().toLocaleDateString();

  const status =
    purchase?.status || "Pending";

  const subtotal =
    Number(purchase?.subtotal || 0);

  const discount =
    Number(purchase?.discount || 0);

  const tax =
    Number(purchase?.tax || 0);

  const grandTotal =
    Number(purchase?.total || 0);

  // =====================================================
  // BUSINESS LOGO
  // =====================================================

  let logoData = null;

  if (business?.logo) {
    logoData =
      await loadImageAsDataURL(
        business.logo
      );
  }

  if (logoData) {
    try {
      pdf.addImage(
        logoData,
        "AUTO",
        14,
        10,
        24,
        24
      );
    } catch (error) {
      console.warn(
        "Could not add purchase PDF logo:",
        error
      );
    }
  }

  // =====================================================
  // BUSINESS INFORMATION
  // =====================================================

  const businessTextX =
    logoData ? 43 : 14;

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(18);

  pdf.text(
    businessName,
    businessTextX,
    17
  );

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(9);

  let businessY = 23;

  if (address) {
    const addressLines =
      pdf.splitTextToSize(
        address,
        80
      );

    pdf.text(
      addressLines,
      businessTextX,
      businessY
    );

    businessY +=
      addressLines.length * 4;
  }

  if (email) {
    pdf.text(
      email,
      businessTextX,
      businessY
    );

    businessY += 5;
  }

  if (phone) {
    pdf.text(
      phone,
      businessTextX,
      businessY
    );
  }

  // =====================================================
  // PURCHASE DOCUMENT TITLE
  // =====================================================

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(23);

  pdf.text(
    "PURCHASE",
    pageWidth - 14,
    18,
    {
      align: "right",
    }
  );

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(10);

  pdf.text(
    `Purchase No: ${invoiceNumber}`,
    pageWidth - 14,
    27,
    {
      align: "right",
    }
  );

  pdf.text(
    `Date: ${purchaseDate}`,
    pageWidth - 14,
    33,
    {
      align: "right",
    }
  );

  pdf.text(
    `Status: ${status}`,
    pageWidth - 14,
    39,
    {
      align: "right",
    }
  );

  // =====================================================
  // DIVIDER
  // =====================================================

  pdf.setDrawColor(
    210,
    210,
    210
  );

  pdf.line(
    14,
    45,
    pageWidth - 14,
    45
  );

  // =====================================================
  // SUPPLIER
  // =====================================================

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(11);

  pdf.text(
    "Supplier",
    14,
    54
  );

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(10);

  pdf.text(
    supplierName,
    14,
    61
  );

  let supplierY = 67;

  if (supplierPhone) {
    pdf.text(
      `Phone: ${supplierPhone}`,
      14,
      supplierY
    );

    supplierY += 5;
  }

  if (supplierEmail) {
    pdf.text(
      `Email: ${supplierEmail}`,
      14,
      supplierY
    );
  }

  // =====================================================
  // PURCHASE ITEMS
  // =====================================================

  const purchaseItems =
    purchase?.purchase_items || [];

  const rows =
    purchaseItems.map(
      (item) => {
        const quantity =
          Number(
            item.quantity || 0
          );

        const price =
          Number(
            item.price || 0
          );

        const total =
          Number(
            item.total ||
              quantity * price
          );

        return [
          item.products
            ?.product_name ||
            "Product",

          quantity,

          `PKR ${price.toLocaleString()}`,

          `PKR ${total.toLocaleString()}`,
        ];
      }
    );

  autoTable(pdf, {
    startY: 82,

    head: [
      [
        "Product",
        "Qty",
        "Purchase Price",
        "Total",
      ],
    ],

    body: rows,

    theme: "grid",

    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 3,
      valign: "middle",
    },

    headStyles: {
      fontStyle: "bold",
      halign: "center",
    },

    columnStyles: {
      0: {
        halign: "left",
      },

      1: {
        halign: "center",
      },

      2: {
        halign: "right",
      },

      3: {
        halign: "right",
      },
    },

    margin: {
      left: 14,
      right: 14,
    },
  });

  // =====================================================
  // SUMMARY
  // =====================================================

  const finalY =
    (pdf.lastAutoTable?.finalY ||
      82) + 10;

  const summaryX =
    pageWidth - 75;

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(10);

  pdf.text(
    "Subtotal:",
    summaryX,
    finalY
  );

  pdf.text(
    `PKR ${subtotal.toLocaleString()}`,
    pageWidth - 14,
    finalY,
    {
      align: "right",
    }
  );

  pdf.text(
    "Discount:",
    summaryX,
    finalY + 7
  );

  pdf.text(
    `PKR ${discount.toLocaleString()}`,
    pageWidth - 14,
    finalY + 7,
    {
      align: "right",
    }
  );

  pdf.text(
    "Tax:",
    summaryX,
    finalY + 14
  );

  pdf.text(
    `PKR ${tax.toLocaleString()}`,
    pageWidth - 14,
    finalY + 14,
    {
      align: "right",
    }
  );

  pdf.setDrawColor(
    180,
    180,
    180
  );

  pdf.line(
    summaryX,
    finalY + 19,
    pageWidth - 14,
    finalY + 19
  );

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(13);

  pdf.text(
    "Grand Total:",
    summaryX,
    finalY + 27
  );

  pdf.text(
    `PKR ${grandTotal.toLocaleString()}`,
    pageWidth - 14,
    finalY + 27,
    {
      align: "right",
    }
  );

  // =====================================================
  // FOOTER
  // =====================================================

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(8);

  pdf.setTextColor(
    100,
    100,
    100
  );

  pdf.text(
    "Purchase record generated by BusinessOS.",
    14,
    pageHeight - 18
  );

  pdf.text(
    "BusinessOS",
    pageWidth - 14,
    pageHeight - 18,
    {
      align: "right",
    }
  );

  pdf.setTextColor(
    0,
    0,
    0
  );

  // =====================================================
  // SAVE PDF
  // =====================================================

  pdf.save(
    `Purchase-${invoiceNumber}.pdf`
  );
}