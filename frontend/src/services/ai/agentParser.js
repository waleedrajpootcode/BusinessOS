/**
 * BusinessOS AI Agent Parser
 *
 * Purpose:
 * - Interpret natural-language business operations.
 * - Extract safe, structured entities.
 * - Never writes to Supabase.
 * - Never creates sales/purchases.
 * - Never changes stock or financial records.
 *
 * Current scope:
 * SALE
 * PURCHASE
 * PRODUCT SEARCH
 * CUSTOMER
 *
 * This is intentionally lightweight and deterministic.
 */

const SALE_KEYWORDS = [
  "sale",
  "sales",
  "sold",
  "sell",
  "becha",
  "bechi",
  "bech diya",
  "bech dia",
  "bik gaya",
  "bik gya",
  "farokht",
  "farokht ki",
  "sale kiya",
  "sale ki",
  "sale hui",
  "sale ho gayi",
  "dena hai",
  "dena hain",
  "deni hai",
  "deni hain",
  "de deni",
  "de deni hain",
];

const PURCHASE_KEYWORDS = [
  "purchase",
  "purchases",
  "buy",
  "bought",
  "buying",
  "kharida",
  "khareeda",
  "khareedi",
  "liya",
  "li hai",
  "liye",
  "liay",
  "le li",
  "le liya",
  "le liye",
  "mangwaya",
  "mangwai",
  "mangwaya hai",
  "purchase ki",
  "purchase kiya",
];

const PRODUCT_KEYWORDS = [
  "product",
  "products",
  "item",
  "items",
  "maal",
  "cheez",
  "stock item",
];

const CUSTOMER_KEYWORDS = [
  "customer",
  "customers",
  "client",
  "clients",
  "grahak",
];

const SUPPLIER_KEYWORDS = [
  "supplier",
  "suppliers",
  "vendor",
  "vendors",
  "supplier ka",
  "supplier ka naam",
  "vendor ka",
  "vendor ka naam",
];

const SEARCH_KEYWORDS = [
  "find",
  "search",
  "show",
  "dikhao",
  "batao",
  "btao",
  "dhoondo",
  "dhundo",
  "check",
  "dekho",
];

const UNIT_PATTERN =
  "(?:kg|kilo|kilos|gram|grams|g|liter|litre|litres|l|ml|meter|metre|m|cm|pcs?|pieces?|piece|units?|unit)";

const NUMBER_PATTERN = "\\d+(?:\\.\\d+)?";

const PRICE_PATTERNS = [
  /(?:rs\.?|pkr|rupees?|rupay|rupaye)\s*[:=]?\s*(\d+(?:\.\d+)?)/i,
  /(\d+(?:\.\d+)?)\s*(?:rs\.?|pkr|rupees?|rupay|rupaye)\b/i,
  /(\d+(?:\.\d+)?)\s*(?:wali|wala)\b/i,
];

const PAYMENT_PAID_PATTERNS = [
  /\bpaid\b/i,
  /\bpaisa\s+(?:de|diya|diye|de\s+diye|de\s+dia|day|diye\s+hain|diya\s+hai)\b/i,
  /\bpaise\s+(?:de|diya|diye|de\s+diye|de\s+dia|day|diye\s+hain|diya\s+hai)\b/i,
  /\bpaisay\s+(?:de|diya|diye|de\s+diye|de\s+dia|day|diye\s+hain|diya\s+hai)\b/i,
  /\bpassay\s+(?:de|diya|diye|de\s+diye|de\s+dia|day|diye\s+hain|diya\s+hai)\b/i,
  /\bpaisa\s+(?:bhi\s+)?(?:de|diya|diye)\s*(?:hain|hai)?\b/i,
  /\bpaise\s+(?:bhi\s+)?(?:de|diya|diye)\s*(?:hain|hai)?\b/i,
  /\bpaisay\s+(?:bhi\s+)?(?:de|diya|diye)\s*(?:hain|hai)?\b/i,
  /\bpassay\s+(?:bhi\s+)?(?:de|diya|diye)\s*(?:hain|hai)?\b/i,
  /\bpayment\s+(?:de|di|paid)\b/i,
  /\bpay\s+kar(?:\s+diya|\s+dia)?\b/i,
  /\bpayment\s+kar(?:\s+diya|\s+dia)?\b/i,
];

const PAYMENT_UNPAID_PATTERNS = [
  /\bunpaid\b/i,
  /\budhaar\b/i,
  /\budhar\b/i,
  /\bbaad\s+mein\s+dene\b/i,
  /\blater\s+pay\b/i,
  /\bpaisa\s+nahi\s+diya\b/i,
  /\bpaise\s+nahi\s+diye\b/i,
];

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[،،]/g, ",")
    .replace(/\s+/g, " ");
}

function containsKeyword(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function detectIntent(text) {
  if (containsKeyword(text, SALE_KEYWORDS)) {
    return "sale";
  }

  if (containsKeyword(text, PURCHASE_KEYWORDS)) {
    return "purchase";
  }

  if (containsKeyword(text, CUSTOMER_KEYWORDS)) {
    return "customer";
  }

  if (containsKeyword(text, SUPPLIER_KEYWORDS)) {
    return "supplier";
  }

  const hasProductKeyword = containsKeyword(
    text,
    PRODUCT_KEYWORDS,
  );

  const hasSearchKeyword = containsKeyword(
    text,
    SEARCH_KEYWORDS,
  );

  if (hasProductKeyword || hasSearchKeyword) {
    return "product";
  }

  return "unknown";
}

function extractQuantityAndUnit(text) {
  const normalized = normalizeText(text);

  // IMPORTANT:
  // Prefer a quantity at the START of the item.
  // This prevents product sizes like "1.5L" inside
  // "2 Coca Cola 1.5L" from being mistaken for quantity.
  const leadingQuantityMatch = normalized.match(
    new RegExp(
      `^\\s*(${NUMBER_PATTERN})\\s*(?:(${UNIT_PATTERN})\\b|x\\b|Ã—\\b|pcs?\\b|pieces?\\b|units?\\b|qty\\b|quantity\\b)?`,
      "i",
    ),
  );

  if (leadingQuantityMatch) {
    const quantity = Number(leadingQuantityMatch[1]);

    if (Number.isFinite(quantity) && quantity > 0) {
      return {
        quantity,
        unit: leadingQuantityMatch[2] || null,
      };
    }
  }

  const wordQuantity = normalized.match(
    /^\s*(ek|aik|one)\b/i,
  );

  if (wordQuantity) {
    return {
      quantity: 1,
      unit: null,
      quantityWord: wordQuantity[1],
    };
  }

  return {
    quantity: null,
    unit: null,
  };
}

function extractPrice(text) {
  for (const pattern of PRICE_PATTERNS) {
    const match = text.match(pattern);

    if (!match) {
      continue;
    }

    const price = Number(match[1]);

    if (Number.isFinite(price) && price >= 0) {
      return price;
    }
  }

  return null;
}

function stripQuantityPrefix(text) {
  let result = String(text || "");

  const numericQuantity = result.match(
    new RegExp(
      `^\\s*${NUMBER_PATTERN}\\s*(?:${UNIT_PATTERN}\\b|x\\b|Ã—\\b|pcs?\\b|pieces?\\b|piece|units?\\b|unit|qty|quantity)?\\s*`,
      "i",
    ),
  );

  if (numericQuantity) {
    result = result.slice(numericQuantity[0].length);
    return result;
  }

  const wordQuantity = result.match(
    /^\s*(?:ek|aik|one)\s+/i,
  );

  if (wordQuantity) {
    result = result.slice(wordQuantity[0].length);
  }

  return result;
}

function cleanProductText(value) {
  let result = String(value || "");

  result = result
    .replace(
      /\b(?:rs\.?|pkr|rupees?|rupay|rupaye)\s*[:=]?\s*\d+(?:\.\d+)?/gi,
      "",
    )
    .replace(
      /\b\d+(?:\.\d+)?\s*(?:rs\.?|pkr|rupees?|rupay|rupaye)\b/gi,
      "",
    )
    .replace(
      /\b\d+(?:\.\d+)?\s*(?:wali|wala)\b/gi,
      "",
    )
    .replace(
      /\b(?:sale|sales|sold|sell|becha|bechi|purchase|bought|buy|buying|kharida|khareeda|khareedi)\b/gi,
      "",
    )
    .replace(
      /\b(?:kiya|ki|hui|ho\s+gayi|kar\s+diya|kar\s+dia)\b/gi,
      "",
    )
.replace(
      /\b(?:li|liye|liya|liay|le\s+li|le\s+liye)\b/gi,
    "",
  )
    .replace(
      /\b(?:deni|dena|de\s+deni)\s+(?:hain|hai)?\b/gi,
      "",
    )
    .replace(
      /\b(?:hai|hain|tha|thi|the)\b/gi,
      "",
    )
    .replace(
      /^\s*(?:aur|and|or)\s+/i,
      "",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();

  return result;
}

function extractSingleItem(text) {
  const quantityData = extractQuantityAndUnit(text);
  const unitPrice = extractPrice(text);

  let productText = stripQuantityPrefix(text);

  productText = cleanProductText(productText);

  return {
    productText: productText || null,
    quantity: quantityData.quantity,
    unit: quantityData.unit,
    unitPrice,
  };
}

function splitPotentialItems(text) {
  const normalized = normalizeText(text);

  /*
   * Protect price expressions before detecting item boundaries.
   *
   * Example:
   * "2 kg moongi daal 500 wali sale ki"
   *
   * The "500" is a price, NOT a new item quantity.
   *
   * We temporarily replace price expressions with placeholders,
   * split actual items, then restore the original price text.
   */
  const protectedPrices = [];
  let protectedText = normalized;

  const protectPrice = (match) => {
    const index = protectedPrices.length;
    protectedPrices.push(match);
    return `__PRICE_${index}__`;
  };

  protectedText = protectedText
    .replace(
      /(?:rs\.?|pkr|rupees?|rupay|rupaye)\s*[:=]?\s*\d+(?:\.\d+)?/gi,
      protectPrice,
    )
    .replace(
      /\d+(?:\.\d+)?\s*(?:rs\.?|pkr|rupees?|rupay|rupaye)\b/gi,
      protectPrice,
    )
    .replace(
      /\d+(?:\.\d+)?\s*(?:wali|wala)\b/gi,
      protectPrice,
    );

  const restorePrices = (value) =>
    value.replace(
      /__PRICE_(\d+)__/g,
      (_, index) => protectedPrices[Number(index)] || "",
    );

  const parts = protectedText
    .split(/\s*,\s*|\s+and\s+|\s+aur\s+/i)
    .map((part) => part.trim())
    .filter(Boolean)
    .map(restorePrices);

  if (parts.length > 1) {
    return parts;
  }

  /*
   * Fallback:
   * Support compact multi-item commands such as:
   *
   * "2 Coke 100 wali 1 Chips 50 wali sale"
   *
   * Because prices are protected above, 100 and 50
   * cannot accidentally become new item boundaries.
   */
  const itemParts = protectedText
    .split(
      /\s+(?=(?:\d+(?:\.\d+)?|ek|aik|one)\s+)/i,
    )
    .map((part) => part.trim())
    .filter(Boolean)
    .map(restorePrices);

  return itemParts.length > 1
    ? itemParts
    : [restorePrices(protectedText)];
}

function parseSaleOrPurchaseItems(text, intent) {
  let workingText = normalizeText(text);

  // Remove natural customer prefix before parsing items.
  // Example:
  // "ali na 1 kg moongi daal li hai"
  // "ali ne 1 kg moongi daal li hai"
  // "rana ko 2 coca cola deni hain"
  // -> "2 coca cola deni hain"
  if (intent === "sale") {
    workingText = workingText.replace(
      /^([a-z][a-z\s'-]{1,40}?)\s+(?:ne|na|ko)\s+/i,
      "",
    );
  }

  // Payment phrases are not separate sale items.
  // Example:
  // "aur paisay bhi diye hain"
  // must not become a second item.
  workingText = workingText
    .replace(
      /\s+(?:aur|and)\s+(?:paisa|paise|paisay|passay|payment)\b.*$/i,
      "",
    )
    .replace(
      /\b(?:paisa|paise|paisay|passay|payment)\s+(?:bhi\s+)?(?:de|diya|diye|de\s+diye|de\s+dia|day|diye\s+hain|diya\s+hai)\b.*$/i,
      "",
    )
    .trim();

  const parts = splitPotentialItems(workingText);

  return parts
    .map((part) => extractSingleItem(part))
    .filter((item) => item.productText);
}

function extractCustomerName(text) {
  const patterns = [
    /\b(?:customer|client|grahak)\s+(?:ka\s+)?(?:naam|name)\s*[:=-]?\s*(.+)$/i,
    /\b(?:customer|client|grahak)\s*[:=-]?\s+(.+)$/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      return cleanPersonName(match[1]);
    }
  }

  /*
   * Natural Roman Urdu pattern:
   *
   * "Ali ne 1 kg moongi daal li hai"
   * "Ali na 1 kg moongi daal li hai"
   * "Rana ko 2 coca cola deni hain"
   */
  const naturalMatch = text.match(
    /^([a-z][a-z\s'-]{1,40}?)\s+(?:ne|na|ko)\s+/i,
  );

  if (naturalMatch?.[1]) {
    const candidate = cleanPersonName(
      naturalMatch[1],
    );

    if (
      candidate &&
      !containsKeyword(candidate, [
        "customer",
        "client",
        "grahak",
      ])
    ) {
      return candidate;
    }
  }

  return null;
}

function cleanPersonName(value) {
  return String(value || "")
    .replace(
      /\b(?:ki|ka|ko|se|ne|na|hai|hain)\b.*$/i,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function extractSupplierName(text) {
  const patterns = [
    /\b(?:supplier|vendor|suppliers|vendor ka|supplier ka)\s+(?:naam|name)?\s*[:=-]?\s*(.+)$/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      return cleanPersonName(match[1]);
    }
  }

  return null;
}

function extractPaymentStatus(text) {
  if (
    PAYMENT_PAID_PATTERNS.some((pattern) =>
      pattern.test(text),
    )
  ) {
    return "Paid";
  }

  if (
    PAYMENT_UNPAID_PATTERNS.some((pattern) =>
      pattern.test(text),
    )
  ) {
    return "Unpaid";
  }

  return null;
}

function extractPaymentMethod(text) {
  const methodPatterns = [
    {
      method: "Cash",
      patterns: [
        /\bcash\b/i,
        /\bcash\s+mein\b/i,
        /\bnakd\b/i,
      ],
    },
    {
      method: "Bank",
      patterns: [
        /\bbank\b/i,
        /\bbank\s+transfer\b/i,
        /\btransfer\b/i,
      ],
    },
    {
      method: "Card",
      patterns: [
        /\bcard\b/i,
        /\bcredit\s+card\b/i,
        /\bdebit\s+card\b/i,
      ],
    },
  ];

  for (const entry of methodPatterns) {
    if (
      entry.patterns.some((pattern) =>
        pattern.test(text),
      )
    ) {
      return entry.method;
    }
  }

  return null;
}

function extractSearchTerm(text) {
  let value = normalizeText(text);

  value = value
    .replace(
      /^\s*(?:find|search|show|dikhao|batao|btao|dhoondo|dhundo|check|dekho)\s+/i,
      "",
    )
    .replace(
  /\s+(?:product|products|item|items|maal)\s+(?=(?:dikhao|batao|btao|dhoondo|dhundo|show|find|search|check|dekho)\b)/i,
  " ",
)
    .replace(
      /\s+(?:product|products|item|items|maal)\s*$/i,
      "",
    )
    .replace(
      /^\s*(?:product|products|item|items|maal)\s+(?:ka|ki|ko)\s+/i,
      "",
    )
    .replace(
      /^\s*(?:product|products|item|items|maal)\s+/i,
      "",
    )
    .replace(
      /\s+(?:dikhao|batao|btao|dhoondo|dhundo|show|find|search|check|dekho)\s*$/i,
      "",
    )
    .replace(
      /\b(?:hai|hain|chahiye|please)\b/gi,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();

  return value || null;
}

function buildBaseResult(
  rawText,
  normalizedText,
  intent,
) {
  return {
    success: true,
    parserVersion: "1.1.1",
    source: "local_deterministic_parser",
    rawText,
    normalizedText,
    intent,
    entities: {
      items: [],
      customerName: null,
      supplierName: null,
      searchTerm: null,
      paymentStatus: null,
      paymentMethod: null,
    },
    draft: null,
    requiresConfirmation: false,
    missingFields: [],
    ambiguity: [],
    confidence:
      intent === "unknown"
        ? "low"
        : "medium",
  };
}

export function parseAgentRequest(input) {
  const rawText = String(input || "").trim();

  if (!rawText) {
    return {
      success: false,
      parserVersion: "1.1.1",
      source: "local_deterministic_parser",
      error: "EMPTY_INPUT",
      message: "Agent request cannot be empty.",
    };
  }

  const normalizedText = normalizeText(rawText);
  const intent = detectIntent(normalizedText);

  const result = buildBaseResult(
    rawText,
    normalizedText,
    intent,
  );

  if (
    intent === "sale" ||
    intent === "purchase"
  ) {
    const items =
  parseSaleOrPurchaseItems(
    normalizedText,
    intent,
  );

    result.entities.items = items;
    result.requiresConfirmation = true;

    if (items.length === 0) {
      result.missingFields.push("items");
      result.confidence = "low";
    }

    items.forEach((item, index) => {
      if (item.quantity === null) {
        result.missingFields.push(
          `items[${index}].quantity`,
        );
      }

      if (!item.productText) {
        result.missingFields.push(
          `items[${index}].productText`,
        );
      }

      /*
       * Price is intentionally NOT a hard parser
       * requirement.
       *
       * Existing BusinessOS workflow can resolve
       * sale price from the validated product.
       *
       * We never invent a price here.
       */
    });

    result.entities.paymentStatus =
      extractPaymentStatus(
        normalizedText,
      );

    result.entities.paymentMethod =
      extractPaymentMethod(
        normalizedText,
      );

    result.draft = {
      operation: intent,
      items,
      customerName: null,
      supplierName: null,
      paymentStatus:
        result.entities.paymentStatus,
      paymentMethod:
        result.entities.paymentMethod,
      subtotal: null,
      total: null,
      status: "needs_validation",
    };

    if (intent === "sale") {
      const customerName =
        extractCustomerName(
          normalizedText,
        );

      result.entities.customerName =
        customerName;

      result.draft.customerName =
        customerName;

      /*
       * A natural sale can still be valid
       * without a customer name if the
       * existing workflow later allows a
       * default/selection path.
       *
       * We do not fabricate a customer.
       */
    }

    if (intent === "purchase") {
      const supplierName =
        extractSupplierName(
          normalizedText,
        );

      result.entities.supplierName =
        supplierName;

      result.draft.supplierName =
        supplierName;
    }

    if (
      result.entities.paymentStatus ===
      "Paid"
    ) {
      result.draft.paymentStatus =
        "Paid";
    }

    return result;
  }

  if (intent === "product") {
    result.entities.searchTerm =
      extractSearchTerm(
        normalizedText,
      );

    if (!result.entities.searchTerm) {
      result.missingFields.push(
        "searchTerm",
      );
      result.confidence = "low";
    }

    return result;
  }

  if (intent === "customer") {
    result.entities.customerName =
      extractCustomerName(
        normalizedText,
      );

    if (!result.entities.customerName) {
      result.missingFields.push(
        "customerName",
      );
      result.confidence = "low";
    }

    return result;
  }

  if (intent === "supplier") {
    result.entities.supplierName =
      extractSupplierName(
        normalizedText,
      );

    if (!result.entities.supplierName) {
      result.missingFields.push(
        "supplierName",
      );
      result.confidence = "low";
    }

    return result;
  }

  result.ambiguity.push(
    "No supported BusinessOS Agent operation was detected.",
  );

  return result;
}

export function isAgentOperation(input) {
  const result =
    parseAgentRequest(input);

  return (
    result.success &&
    [
      "sale",
      "purchase",
      "product",
      "customer",
      "supplier",
    ].includes(result.intent)
  );
}

export function getAgentIntent(input) {
  return parseAgentRequest(input).intent;
}

export function hasRequiredAgentFields(
  parsedRequest,
) {
  if (!parsedRequest?.success) {
    return false;
  }

  return (
    Array.isArray(
      parsedRequest.missingFields,
    ) &&
    parsedRequest.missingFields.length === 0
  );
}

export default parseAgentRequest;