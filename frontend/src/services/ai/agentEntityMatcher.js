/**
 * BusinessOS AI Agent Entity Matcher
 *
 * Purpose:
 * - Resolve parsed natural-language entities against the current business data.
 * - Product / customer / supplier matching only.
 * - Never writes to Supabase.
 * - Never creates sales or purchases.
 * - Never changes stock or financial records.
 *
 * Matching policy:
 * - Exact normalized match first.
 * - Unique partial match second.
 * - Multiple matches => ambiguity.
 * - No match => unresolved.
 * - Never guess between multiple records.
 */

import {
  getProductsForSale,
  getCustomersForSale,
} from "../sales.js";

import {
  getProductsForPurchase,
  getSuppliersForPurchase,
} from "../purchases.js";

function normalizeValue(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[،،]/g, ",")
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s.-]/gu, "");
}

function createExactMatch(items, searchValue, nameKey) {
  const normalizedSearch = normalizeValue(searchValue);

  if (!normalizedSearch) {
    return null;
  }

  const matches = items.filter(
    (item) =>
      normalizeValue(item?.[nameKey]) === normalizedSearch
  );

  if (matches.length === 1) {
    return {
      status: "matched",
      matchType: "exact",
      item: matches[0],
      candidates: [matches[0]],
    };
  }

  if (matches.length > 1) {
    return {
      status: "ambiguous",
      matchType: "exact",
      item: null,
      candidates: matches,
    };
  }

  return null;
}

function createPartialMatch(items, searchValue, nameKey) {
  const normalizedSearch = normalizeValue(searchValue);

  if (!normalizedSearch) {
    return null;
  }

  const matches = items.filter((item) => {
    const normalizedName = normalizeValue(item?.[nameKey]);

    return (
      normalizedName.includes(normalizedSearch) ||
      normalizedSearch.includes(normalizedName)
    );
  });

  if (matches.length === 1) {
    return {
      status: "matched",
      matchType: "partial",
      item: matches[0],
      candidates: [matches[0]],
    };
  }

  if (matches.length > 1) {
    return {
      status: "ambiguous",
      matchType: "partial",
      item: null,
      candidates: matches,
    };
  }

  return {
    status: "unresolved",
    matchType: "none",
    item: null,
    candidates: [],
  };
}

function matchEntity(items, searchValue, nameKey) {
  const exactResult = createExactMatch(
    items,
    searchValue,
    nameKey
  );

  if (exactResult) {
    return exactResult;
  }

  return createPartialMatch(
    items,
    searchValue,
    nameKey
  );
}

function toProductMatch(result) {
  if (!result) {
    return {
      status: "unresolved",
      matchType: "none",
      item: null,
      candidates: [],
    };
  }

  return {
    ...result,
    item: result.item
      ? {
          id: Number(result.item.id),
          product_name: result.item.product_name,
          cost_price: Number(result.item.cost_price || 0),
          price: Number(result.item.price || 0),
          stock: Number(result.item.stock || 0),
          unit_type: result.item.unit_type || "piece",
          selling_unit: result.item.selling_unit || "pcs",
          base_unit: result.item.base_unit || "pcs",
          conversion_factor:
            Number(result.item.conversion_factor) || 1,
        }
      : null,
    candidates: (result.candidates || []).map(
      (candidate) => ({
        id: Number(candidate.id),
        product_name: candidate.product_name,
        cost_price: Number(candidate.cost_price || 0),
        price: Number(candidate.price || 0),
        stock: Number(candidate.stock || 0),
        unit_type: candidate.unit_type || "piece",
        selling_unit:
          candidate.selling_unit || "pcs",
      })
    ),
  };
}

function toCustomerMatch(result) {
  if (!result) {
    return {
      status: "unresolved",
      matchType: "none",
      item: null,
      candidates: [],
    };
  }

  return {
    ...result,
    item: result.item
      ? {
          id: Number(result.item.id),
          full_name: result.item.full_name,
        }
      : null,
    candidates: (result.candidates || []).map(
      (candidate) => ({
        id: Number(candidate.id),
        full_name: candidate.full_name,
      })
    ),
  };
}

function toSupplierMatch(result) {
  if (!result) {
    return {
      status: "unresolved",
      matchType: "none",
      item: null,
      candidates: [],
    };
  }

  return {
    ...result,
    item: result.item
      ? {
          id: Number(result.item.id),
          supplier_name: result.item.supplier_name,
        }
      : null,
    candidates: (result.candidates || []).map(
      (candidate) => ({
        id: Number(candidate.id),
        supplier_name: candidate.supplier_name,
      })
    ),
  };
}

/**
 * Match one product against the current business.
 *
 * Sale and purchase product lists intentionally use
 * the existing BusinessOS service functions.
 */
export async function matchProduct(
  productName,
  operation = "sale"
) {
  if (!productName?.trim()) {
    return {
      status: "unresolved",
      matchType: "none",
      item: null,
      candidates: [],
      error: "PRODUCT_NAME_REQUIRED",
    };
  }

  try {
    const products =
      operation === "purchase"
        ? await getProductsForPurchase()
        : await getProductsForSale();

    return toProductMatch(
      matchEntity(
        products,
        productName,
        "product_name"
      )
    );
  } catch (error) {
    console.error(
      "Agent Product Matching Error:",
      error
    );

    return {
      status: "error",
      matchType: "none",
      item: null,
      candidates: [],
      error: "PRODUCT_LOOKUP_FAILED",
    };
  }
}

/**
 * Match a customer against the current business.
 */
export async function matchCustomer(customerName) {
  if (!customerName?.trim()) {
    return {
      status: "unresolved",
      matchType: "none",
      item: null,
      candidates: [],
      error: "CUSTOMER_NAME_REQUIRED",
    };
  }

  try {
    const customers =
      await getCustomersForSale();

    return toCustomerMatch(
      matchEntity(
        customers,
        customerName,
        "full_name"
      )
    );
  } catch (error) {
    console.error(
      "Agent Customer Matching Error:",
      error
    );

    return {
      status: "error",
      matchType: "none",
      item: null,
      candidates: [],
      error: "CUSTOMER_LOOKUP_FAILED",
    };
  }
}

/**
 * Match a supplier against the current business.
 */
export async function matchSupplier(supplierName) {
  if (!supplierName?.trim()) {
    return {
      status: "unresolved",
      matchType: "none",
      item: null,
      candidates: [],
      error: "SUPPLIER_NAME_REQUIRED",
    };
  }

  try {
    const suppliers =
      await getSuppliersForPurchase();

    return toSupplierMatch(
      matchEntity(
        suppliers,
        supplierName,
        "supplier_name"
      )
    );
  } catch (error) {
    console.error(
      "Agent Supplier Matching Error:",
      error
    );

    return {
      status: "error",
      matchType: "none",
      item: null,
      candidates: [],
      error: "SUPPLIER_LOOKUP_FAILED",
    };
  }
}

/**
 * Resolve all entities required by a parsed Agent request.
 *
 * This function is read-only.
 */
export async function resolveAgentEntities(
  parsedRequest
) {
  if (!parsedRequest?.success) {
    return {
      success: false,
      status: "invalid_request",
      parsedRequest,
      entities: null,
      errors: ["INVALID_PARSED_REQUEST"],
      ambiguities: [],
    };
  }

  const {
    intent,
    entities = {},
  } = parsedRequest;

  const resolvedEntities = {
    items: [],
    customer: null,
    supplier: null,
  };

  const errors = [];
  const ambiguities = [];

  if (
    intent === "sale" ||
    intent === "purchase"
  ) {
    const items = Array.isArray(entities.items)
      ? entities.items
      : [];

    for (
      let index = 0;
      index < items.length;
      index += 1
    ) {
      const parsedItem = items[index];

      const productMatch =
        await matchProduct(
          parsedItem.productText,
          intent
        );

      resolvedEntities.items.push({
        index,
        parsed: parsedItem,
        product: productMatch,
      });

      if (productMatch.status === "unresolved") {
        errors.push(
          `items[${index}].product`
        );
      }

      if (productMatch.status === "error") {
        errors.push(
          `items[${index}].product_lookup`
        );
      }

      if (productMatch.status === "ambiguous") {
        ambiguities.push({
          field: `items[${index}].product`,
          value: parsedItem.productText,
          candidates:
            productMatch.candidates,
        });
      }
    }

    if (intent === "sale") {
      if (entities.customerName) {
        const customerMatch =
          await matchCustomer(
            entities.customerName
          );

        resolvedEntities.customer =
          customerMatch;

        if (
          customerMatch.status ===
          "unresolved"
        ) {
          errors.push("customer");
        }

        if (
          customerMatch.status === "error"
        ) {
          errors.push(
            "customer_lookup"
          );
        }

        if (
          customerMatch.status ===
          "ambiguous"
        ) {
          ambiguities.push({
            field: "customer",
            value:
              entities.customerName,
            candidates:
              customerMatch.candidates,
          });
        }
      }
    }

    if (intent === "purchase") {
      if (entities.supplierName) {
        const supplierMatch =
          await matchSupplier(
            entities.supplierName
          );

        resolvedEntities.supplier =
          supplierMatch;

        if (
          supplierMatch.status ===
          "unresolved"
        ) {
          errors.push("supplier");
        }

        if (
          supplierMatch.status === "error"
        ) {
          errors.push(
            "supplier_lookup"
          );
        }

        if (
          supplierMatch.status ===
          "ambiguous"
        ) {
          ambiguities.push({
            field: "supplier",
            value:
              entities.supplierName,
            candidates:
              supplierMatch.candidates,
          });
        }
      }
    }
  }

  if (intent === "product") {
    const productMatch =
      await matchProduct(
        entities.searchTerm,
        "sale"
      );

    resolvedEntities.productSearch =
      productMatch;

    if (
      productMatch.status === "error"
    ) {
      errors.push("product_lookup");
    }

    if (
      productMatch.status === "ambiguous"
    ) {
      ambiguities.push({
        field: "productSearch",
        value: entities.searchTerm,
        candidates:
          productMatch.candidates,
      });
    }

    if (
      productMatch.status === "unresolved"
    ) {
      errors.push("productSearch");
    }
  }

  if (intent === "customer") {
    if (entities.customerName) {
      const customerMatch =
        await matchCustomer(
          entities.customerName
        );

      resolvedEntities.customer =
        customerMatch;

      if (
        customerMatch.status ===
        "unresolved"
      ) {
        errors.push("customer");
      }

      if (
        customerMatch.status === "error"
      ) {
        errors.push(
          "customer_lookup"
        );
      }

      if (
        customerMatch.status ===
        "ambiguous"
      ) {
        ambiguities.push({
          field: "customer",
          value: entities.customerName,
          candidates:
            customerMatch.candidates,
        });
      }
    }
  }

  if (intent === "supplier") {
    if (entities.supplierName) {
      const supplierMatch =
        await matchSupplier(
          entities.supplierName
        );

      resolvedEntities.supplier =
        supplierMatch;

      if (
        supplierMatch.status ===
        "unresolved"
      ) {
        errors.push("supplier");
      }

      if (
        supplierMatch.status === "error"
      ) {
        errors.push(
          "supplier_lookup"
        );
      }

      if (
        supplierMatch.status ===
        "ambiguous"
      ) {
        ambiguities.push({
          field: "supplier",
          value: entities.supplierName,
          candidates:
            supplierMatch.candidates,
        });
      }
    } else {
      errors.push("supplier");
    }
  }



  const hasErrors = errors.length > 0;
  const hasAmbiguities =
    ambiguities.length > 0;

  return {
    success: !hasErrors && !hasAmbiguities,
    status: hasAmbiguities
      ? "ambiguous"
      : hasErrors
        ? "unresolved"
        : "resolved",
    parsedRequest,
    entities: resolvedEntities,
    errors,
    ambiguities,
  };
}

export default resolveAgentEntities;