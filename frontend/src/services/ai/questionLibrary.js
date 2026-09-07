/**
 * BusinessOS AI Question Library
 *
 * Day 5 — Professional AI Intelligence
 *
 * Purpose:
 * - Centralized business questions
 * - Professional AI discovery experience
 * - Easy future expansion
 * - No hardcoded answers
 * - No database access
 * - No financial actions
 *
 * IMPORTANT:
 * Questions only describe what the user wants to know.
 * Actual answers must come from the existing AI Gateway
 * and authorized BusinessOS data/tools.
 */

export const AI_QUESTION_CATEGORIES = Object.freeze([
  {
    id: "overview",
    label: "Business Overview",
    description: "Understand the overall health and performance of the business.",
    icon: "LayoutDashboard",
  },
  {
    id: "sales",
    label: "Sales",
    description: "Understand sales performance and revenue.",
    icon: "TrendingUp",
  },
  {
    id: "profit",
    label: "Profit",
    description: "Understand profit, margins, and financial performance.",
    icon: "CircleDollarSign",
  },
  {
    id: "expenses",
    label: "Expenses",
    description: "Understand where business money is being spent.",
    icon: "Receipt",
  },
  {
    id: "inventory",
    label: "Inventory",
    description: "Understand stock levels and inventory risks.",
    icon: "Package",
  },
  {
    id: "customers",
    label: "Customers",
    description: "Understand customers and customer value.",
    icon: "Users",
  },
  {
    id: "payments",
    label: "Payments",
    description: "Understand outstanding customer payments and collections.",
    icon: "WalletCards",
  },
  {
    id: "suppliers",
    label: "Suppliers",
    description: "Understand supplier relationships and purchasing activity.",
    icon: "Truck",
  },
  {
    id: "growth",
    label: "Growth",
    description: "Find practical opportunities to improve and grow the business.",
    icon: "Rocket",
  },
  {
    id: "strategy",
    label: "Strategy",
    description: "Get data-informed business decisions and priorities.",
    icon: "Target",
  },
]);

export const AI_QUESTIONS = Object.freeze([
  /* =========================================================
     BUSINESS OVERVIEW
  ========================================================= */

  {
    id: "overview_001",
    category: "overview",
    label: "Overall business health",
    question: "Mere business ka overall haal kaisa hai?",
    priority: "high",
  },
  {
    id: "overview_002",
    category: "overview",
    label: "Business performance",
    question: "Mera business overall kaisa perform kar raha hai?",
    priority: "high",
  },
  {
    id: "overview_003",
    category: "overview",
    label: "Biggest business problem",
    question: "Mere business ki sabse badi problem kya hai?",
    priority: "high",
  },
  {
    id: "overview_004",
    category: "overview",
    label: "Business strengths",
    question: "Mere business ki sabse strong cheezen kya hain?",
    priority: "medium",
  },
  {
    id: "overview_005",
    category: "overview",
    label: "Business weaknesses",
    question: "Mere business mein kin areas ko improve karna chahiye?",
    priority: "high",
  },
  {
    id: "overview_006",
    category: "overview",
    label: "Business priorities",
    question: "Mujhe abhi business mein sabse pehle kis cheez par focus karna chahiye?",
    priority: "high",
  },

  /* =========================================================
     SALES
  ========================================================= */

  {
    id: "sales_001",
    category: "sales",
    label: "Sales performance",
    question: "Meri sales kaisi ja rahi hain?",
    priority: "high",
  },
  {
    id: "sales_002",
    category: "sales",
    label: "Revenue",
    question: "Meri total sales revenue kitni hai?",
    priority: "high",
  },
  {
    id: "sales_003",
    category: "sales",
    label: "Sales growth",
    question: "Kya meri sales grow kar rahi hain?",
    priority: "high",
  },
  {
    id: "sales_004",
    category: "sales",
    label: "Best selling products",
    question: "Mere sabse zyada bikne wale products kaun se hain?",
    priority: "high",
  },
  {
    id: "sales_005",
    category: "sales",
    label: "Sales improvement",
    question: "Meri sales improve karne ke liye kya karna chahiye?",
    priority: "high",
  },
  {
    id: "sales_006",
    category: "sales",
    label: "Sales opportunity",
    question: "Meri sales mein sabse badi opportunity kya hai?",
    priority: "medium",
  },

  /* =========================================================
     PROFIT
  ========================================================= */

  {
    id: "profit_001",
    category: "profit",
    label: "Current profit",
    question: "Mera current profit kitna hai?",
    priority: "high",
  },
  {
    id: "profit_002",
    category: "profit",
    label: "Net profit",
    question: "Mera net profit kitna hai?",
    priority: "high",
  },
  {
    id: "profit_003",
    category: "profit",
    label: "Profit performance",
    question: "Mera profit kaisa perform kar raha hai?",
    priority: "high",
  },
  {
    id: "profit_004",
    category: "profit",
    label: "Low profit reason",
    question: "Agar profit kam hai to uski main wajah kya hai?",
    priority: "high",
  },
  {
    id: "profit_005",
    category: "profit",
    label: "Increase profit",
    question: "Main apna profit kaise increase kar sakta hoon?",
    priority: "high",
  },
  {
    id: "profit_006",
    category: "profit",
    label: "Profit priorities",
    question: "Profit improve karne ke liye mujhe kis cheez par focus karna chahiye?",
    priority: "high",
  },

  /* =========================================================
     EXPENSES
  ========================================================= */

  {
    id: "expenses_001",
    category: "expenses",
    label: "Total expenses",
    question: "Mere total expenses kitne hain?",
    priority: "high",
  },
  {
    id: "expenses_002",
    category: "expenses",
    label: "Expense impact",
    question: "Mere expenses profit ko kitna affect kar rahe hain?",
    priority: "high",
  },
  {
    id: "expenses_003",
    category: "expenses",
    label: "Expense problem",
    question: "Kya mere expenses zyada hain?",
    priority: "high",
  },
  {
    id: "expenses_004",
    category: "expenses",
    label: "Reduce expenses",
    question: "Main apne business expenses kaise control kar sakta hoon?",
    priority: "high",
  },
  {
    id: "expenses_005",
    category: "expenses",
    label: "Expense strategy",
    question: "Mere expenses mein mujhe kis cheez ko review karna chahiye?",
    priority: "medium",
  },
  {
    id: "expenses_006",
    category: "expenses",
    label: "Expense and growth",
    question: "Kya mere current expenses business growth ko affect kar rahe hain?",
    priority: "medium",
  },

  /* =========================================================
     INVENTORY
  ========================================================= */

  {
    id: "inventory_001",
    category: "inventory",
    label: "Inventory health",
    question: "Meri inventory ki current situation kya hai?",
    priority: "high",
  },
  {
    id: "inventory_002",
    category: "inventory",
    label: "Low stock",
    question: "Kaun se products low stock mein hain?",
    priority: "high",
  },
  {
    id: "inventory_003",
    category: "inventory",
    label: "Stock risk",
    question: "Mere inventory mein sabse bada risk kya hai?",
    priority: "high",
  },
  {
    id: "inventory_004",
    category: "inventory",
    label: "Stock priority",
    question: "Mujhe kis product ka stock sabse pehle check karna chahiye?",
    priority: "high",
  },
  {
    id: "inventory_005",
    category: "inventory",
    label: "Inventory improvement",
    question: "Main apni inventory management kaise improve kar sakta hoon?",
    priority: "medium",
  },
  {
    id: "inventory_006",
    category: "inventory",
    label: "Inventory and sales",
    question: "Kya meri inventory meri sales ko affect kar rahi hai?",
    priority: "medium",
  },

  /* =========================================================
     CUSTOMERS
  ========================================================= */

  {
    id: "customers_001",
    category: "customers",
    label: "Customer count",
    question: "Mere total customers kitne hain?",
    priority: "medium",
  },
  {
    id: "customers_002",
    category: "customers",
    label: "Top customers",
    question: "Mere best customers kaun hain?",
    priority: "high",
  },
  {
    id: "customers_003",
    category: "customers",
    label: "Customer value",
    question: "Mere liye sabse valuable customers kaun se hain?",
    priority: "high",
  },
  {
    id: "customers_004",
    category: "customers",
    label: "Customer growth",
    question: "Customer base improve karne ke liye kya karna chahiye?",
    priority: "medium",
  },
  {
    id: "customers_005",
    category: "customers",
    label: "Customer risk",
    question: "Kya customer side par koi important risk hai?",
    priority: "high",
  },
  {
    id: "customers_006",
    category: "customers",
    label: "Customer strategy",
    question: "Customers ko retain aur grow karne ke liye kya karna chahiye?",
    priority: "medium",
  },

  /* =========================================================
     PAYMENTS
  ========================================================= */

  {
    id: "payments_001",
    category: "payments",
    label: "Outstanding payments",
    question: "Customers se total kitna outstanding lena hai?",
    priority: "high",
  },
  {
    id: "payments_002",
    category: "payments",
    label: "Customers with dues",
    question: "Kin customers ke payments outstanding hain?",
    priority: "high",
  },
  {
    id: "payments_003",
    category: "payments",
    label: "Payment risk",
    question: "Mere outstanding payments mein sabse bada risk kya hai?",
    priority: "high",
  },
  {
    id: "payments_004",
    category: "payments",
    label: "Collection strategy",
    question: "Customer payments recover karne ke liye mujhe kya karna chahiye?",
    priority: "high",
  },
  {
    id: "payments_005",
    category: "payments",
    label: "Receivables impact",
    question: "Outstanding payments mere business ko kaise affect kar rahe hain?",
    priority: "high",
  },
  {
    id: "payments_006",
    category: "payments",
    label: "Cash flow attention",
    question: "Payments ke hawale se mujhe abhi kis cheez par focus karna chahiye?",
    priority: "high",
  },

  /* =========================================================
     SUPPLIERS
  ========================================================= */

  {
    id: "suppliers_001",
    category: "suppliers",
    label: "Supplier overview",
    question: "Mere suppliers ka overall status kya hai?",
    priority: "medium",
  },
  {
    id: "suppliers_002",
    category: "suppliers",
    label: "Supplier activity",
    question: "Meri supplier purchasing activity kaisi hai?",
    priority: "medium",
  },
  {
    id: "suppliers_003",
    category: "suppliers",
    label: "Purchase performance",
    question: "Meri purchases business ko kaise affect kar rahi hain?",
    priority: "high",
  },
  {
    id: "suppliers_004",
    category: "suppliers",
    label: "Supplier strategy",
    question: "Supplier management improve karne ke liye kya karna chahiye?",
    priority: "medium",
  },
  {
    id: "suppliers_005",
    category: "suppliers",
    label: "Purchase control",
    question: "Mujhe purchases ko better control karne ke liye kya karna chahiye?",
    priority: "high",
  },

  /* =========================================================
     GROWTH
  ========================================================= */

  {
    id: "growth_001",
    category: "growth",
    label: "Business growth",
    question: "Mera business grow karne ke liye mujhe kya karna chahiye?",
    priority: "high",
  },
  {
    id: "growth_002",
    category: "growth",
    label: "Growth opportunity",
    question: "Mere business mein sabse badi growth opportunity kya hai?",
    priority: "high",
  },
  {
    id: "growth_003",
    category: "growth",
    label: "Revenue growth",
    question: "Revenue increase karne ke liye kya strategy honi chahiye?",
    priority: "high",
  },
  {
    id: "growth_004",
    category: "growth",
    label: "Profit growth",
    question: "Sales aur profit dono grow karne ke liye kya karna chahiye?",
    priority: "high",
  },
  {
    id: "growth_005",
    category: "growth",
    label: "Business improvement",
    question: "Agar mujhe business improve karna ho to sabse pehle kya karun?",
    priority: "high",
  },
  {
    id: "growth_006",
    category: "growth",
    label: "Growth priorities",
    question: "Mere business ki growth ke liye top priorities kya honi chahiye?",
    priority: "high",
  },

  /* =========================================================
     STRATEGY
  ========================================================= */

  {
    id: "strategy_001",
    category: "strategy",
    label: "Business decision",
    question: "Mere current data ke mutabiq mujhe kya decision lena chahiye?",
    priority: "high",
  },
  {
    id: "strategy_002",
    category: "strategy",
    label: "Business focus",
    question: "Mujhe abhi business ke kis area par focus karna chahiye?",
    priority: "high",
  },
  {
    id: "strategy_003",
    category: "strategy",
    label: "Business priorities",
    question: "Agle step ke liye meri top business priorities kya hain?",
    priority: "high",
  },
  {
    id: "strategy_004",
    category: "strategy",
    label: "Business risk",
    question: "Mere business mein abhi kaun se important risks nazar aa rahe hain?",
    priority: "high",
  },
  {
    id: "strategy_005",
    category: "strategy",
    label: "Business opportunity",
    question: "Mere current business data se kaun si opportunities nazar aa rahi hain?",
    priority: "high",
  },
  {
    id: "strategy_006",
    category: "strategy",
    label: "Business action plan",
    question: "Mere business ko improve karne ke liye ek practical action plan kya ho sakta hai?",
    priority: "high",
  },
]);

/**
 * Get all questions for a category.
 */
export function getQuestionsByCategory(categoryId) {
  return AI_QUESTIONS.filter(
    (question) =>
      question.category === categoryId
  );
}

/**
 * Get one question by ID.
 */
export function getAIQuestionById(questionId) {
  return (
    AI_QUESTIONS.find(
      (question) =>
        question.id === questionId
    ) || null
  );
}

/**
 * Get high-priority questions.
 */
export function getPriorityQuestions(
  priority = "high"
) {
  return AI_QUESTIONS.filter(
    (question) =>
      question.priority === priority
  );
}

/**
 * Get a limited set of questions for UI.
 *
 * This does not change the total question library.
 */
export function getSuggestedQuestions(
  limit = 6
) {
  return AI_QUESTIONS
    .filter(
      (question) =>
        question.priority === "high"
    )
    .slice(0, Math.max(0, Number(limit) || 0));
}

/**
 * Get category metadata.
 */
export function getAIQuestionCategory(
  categoryId
) {
  return (
    AI_QUESTION_CATEGORIES.find(
      (category) =>
        category.id === categoryId
    ) || null
  );
}