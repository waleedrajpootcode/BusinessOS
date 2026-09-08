const assert = require("node:assert/strict");
const express = require("express");
const http = require("node:http");
const test = require("node:test");

const {
  createBusinessIntelligenceRouter,
} = require("../src/routes/businessIntelligence");
const {
  createResult,
  executeGuidedQuestion,
  getHandler,
  validateResult,
} = require("../src/services/businessIntelligence");

function passAuth(req, _res, next) {
  req.user = { id: "user-1" };
  next();
}

function passBusinessContext(req, _res, next) {
  req.businessId = "business-1";
  next();
}

function passAdmin(req, _res, next) {
  req.userRole = "admin";
  next();
}

async function sendRequest(targetApp, path, headers = {}) {
  const server = http.createServer(targetApp);
  await new Promise((resolve) =>
    server.listen(0, "127.0.0.1", resolve)
  );

  try {
    const response = await fetch(
      `http://127.0.0.1:${server.address().port}${path}`,
      {
        method: "GET",
        headers: {
          authorization: "Bearer test-token",
          ...headers,
        },
      }
    );

    return {
      response,
      json: await response.json(),
    };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

function createTestApp(executeQuestion, middleware = {}) {
  const app = express();
  app.use(
    "/api/business-intelligence",
    createBusinessIntelligenceRouter({
      requireAuth: middleware.requireAuth || passAuth,
      requireBusinessContext:
        middleware.requireBusinessContext || passBusinessContext,
      requireAdmin: middleware.requireAdmin || passAdmin,
      executeGuidedQuestion: executeQuestion,
    })
  );
  return app;
}

const validResult = createResult({
  questionId: "sales_002",
  handlerId: "sales.overview",
  resultType: "sales_overview",
  facts: { revenue: 0 },
  availability: "available",
});

test("rejects unauthenticated requests", async () => {
  const app = createTestApp(
    async () => ({ success: true, data: validResult }),
    {
      requireAuth: (_req, res) =>
        res.status(401).json({ success: false }),
    }
  );

  const { response } = await sendRequest(
    app,
    "/api/business-intelligence/question/sales_002"
  );

  assert.equal(response.status, 401);
});

test("rejects missing business context", async () => {
  const app = createTestApp(
    async () => ({ success: true, data: validResult }),
    {
      requireBusinessContext: (_req, res) =>
        res.status(401).json({ success: false }),
    }
  );

  const { response } = await sendRequest(
    app,
    "/api/business-intelligence/question/sales_002"
  );

  assert.equal(response.status, 401);
});

test("rejects unauthorized roles", async () => {
  const app = createTestApp(
    async () => ({ success: true, data: validResult }),
    {
      requireAdmin: (_req, res) =>
        res.status(403).json({ success: false }),
    }
  );

  const { response } = await sendRequest(
    app,
    "/api/business-intelligence/question/sales_002"
  );

  assert.equal(response.status, 403);
});

test("rejects unknown question IDs", async () => {
  const app = createTestApp(async () => ({
    success: false,
    status: 404,
    code: "GUIDED_HANDLER_NOT_FOUND",
    message: "The requested Guided Intelligence question is not available.",
  }));

  const { response, json } = await sendRequest(
    app,
    "/api/business-intelligence/question/not_registered"
  );

  assert.equal(response.status, 404);
  assert.equal(json.error.code, "GUIDED_HANDLER_NOT_FOUND");
});

test("accepts a registered question without client tenant or provider authority", async () => {
  let received;
  const app = createTestApp(async (input) => {
    received = input;
    return { success: true, data: validResult };
  });

  const { response, json } = await sendRequest(
    app,
    "/api/business-intelligence/question/sales_002"
  );

  assert.equal(response.status, 200);
  assert.equal(json.data.questionId, "sales_002");
  assert.equal(received.businessId, "business-1");
  assert.equal(received.questionId, "sales_002");
});

test("rejects client business, user, provider, and model fields", async () => {
  const app = createTestApp(async () => ({
    success: true,
    data: validResult,
  }));

  for (const field of [
    "business_id",
    "businessId",
    "userId",
    "provider",
    "model",
  ]) {
    const { response } = await sendRequest(
      app,
      `/api/business-intelligence/question/sales_002?${field}=attacker`
    );
    assert.equal(response.status, 400);
  }
});

test("validates structured results and sensitive fields", () => {
  assert.equal(validateResult(validResult), true);
  assert.equal(
    validateResult({
      ...validResult,
      availability: "unavailable",
      facts: {},
    }),
    true
  );
  assert.equal(
    validateResult({
      ...validResult,
      facts: { business_id: "wrong" },
    }),
    false
  );
  assert.equal(
    validateResult({
      ...validResult,
      availability: "invalid",
    }),
    false
  );
});

test("preserves valid zero and unavailable results", async () => {
  const zero = await executeGuidedQuestion({
    questionId: "sales_002",
    businessId: "business-1",
    accessToken: "token",
    client: {},
  });

  assert.equal(zero.success, true);
  assert.equal(zero.data.availability, "unavailable");

  const unavailable = createResult({
    questionId: "sales_002",
    handlerId: "sales.overview",
    resultType: "sales_overview",
    facts: { revenue: 0 },
    availability: "unavailable",
  });

  assert.equal(unavailable.facts.revenue, 0);
  assert.equal(unavailable.availability, "unavailable");
});

test("registered handlers resolve explicitly and unknown handlers fail closed", () => {
  assert.equal(getHandler("sales_002").handlerId, "sales.overview");
  assert.equal(getHandler("not_registered"), null);
});

test("low-stock query is bounded and read-only", async () => {
  let limitValue;
  const client = {
    from(table) {
      assert.equal(table, "products");
      return this;
    },
    select() {
      return this;
    },
    eq() {
      return this;
    },
    lte() {
      return this;
    },
    order() {
      return this;
    },
    limit(value) {
      limitValue = value;
      return Promise.resolve({
        data: [],
        error: null,
      });
    },
  };

  const result = await executeGuidedQuestion({
    questionId: "inventory_002",
    businessId: "business-1",
    client,
  });

  assert.equal(result.success, true);
  assert.equal(result.data.availability, "empty");
  assert.equal(limitValue, 50);
});
