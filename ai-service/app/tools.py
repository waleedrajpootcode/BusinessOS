"""
BusinessOS AI Tool Contract

Day 5 — Step 8B-6

This module defines the only business-data capabilities
that the AI service is allowed to request.

IMPORTANT:
- Read-only only
- No arbitrary SQL
- No direct financial writes
- No delete actions
- No user-supplied business_id trust
- No secrets/API keys
"""


AI_READ_TOOLS = {
    "business_summary": {
        "description": "Read the current business summary.",
        "access": "read",
    },
    "sales_insights": {
        "description": "Read sales and revenue insights.",
        "access": "read",
    },
    "expense_insights": {
        "description": "Read expense insights.",
        "access": "read",
    },
    "profit_insights": {
        "description": "Read profit insights.",
        "access": "read",
    },
    "inventory_insights": {
        "description": "Read inventory and low-stock insights.",
        "access": "read",
    },
    "customer_insights": {
        "description": "Read customer insights.",
        "access": "read",
    },
    "supplier_insights": {
        "description": "Read supplier insights.",
        "access": "read",
    },
    "payment_insights": {
        "description": "Read customer payment and outstanding insights.",
        "access": "read",
    },
}


def is_allowed_read_tool(tool_name: str) -> bool:
    """Return True only for approved read-only tools."""
    return tool_name in AI_READ_TOOLS


def get_allowed_tools():
    """Return a safe copy of the approved AI tool registry."""
    return {
        name: details.copy()
        for name, details in AI_READ_TOOLS.items()
    }
def validate_tool_request(tool_name: str) -> dict:
    """
    Validate an AI tool request against the approved tool registry.

    Returns a controlled result instead of executing anything.
    """

    normalized_name = str(tool_name or "").strip()

    if not normalized_name:
        return {
            "allowed": False,
            "type": "invalid_tool",
            "message": "AI tool name is required.",
        }

    if not is_allowed_read_tool(normalized_name):
        return {
            "allowed": False,
            "type": "tool_not_allowed",
            "message": "This AI tool is not allowed.",
        }

    tool = AI_READ_TOOLS[normalized_name]

    if tool.get("access") != "read":
        return {
            "allowed": False,
            "type": "tool_access_denied",
            "message": "Only read-only AI tools are allowed.",
        }

    return {
        "allowed": True,
        "type": "tool_allowed",
        "tool": normalized_name,
        "access": "read",
    }
def execute_tool_request(tool_name: str, context: dict | None = None) -> dict:
    """
    Controlled execution boundary for AI tools.

    This function validates the requested tool and requires
    verified business context before any future data access.

    No database query is performed yet.
    """

    validation = validate_tool_request(tool_name)

    if not validation.get("allowed"):
        return validation

    if not isinstance(context, dict):
        return {
            "allowed": False,
            "type": "missing_context",
            "message": "Verified business context is required.",
        }

    user_id = str(context.get("user_id") or "").strip()
    business_id = str(context.get("business_id") or "").strip()

    if not user_id:
        return {
            "allowed": False,
            "type": "missing_user_context",
            "message": "Verified user context is required.",
        }

    if not business_id:
        return {
            "allowed": False,
            "type": "missing_business_context",
            "message": "Verified business context is required.",
        }

    return {
        "allowed": True,
        "type": "tool_execution_ready",
        "tool": validation["tool"],
        "access": "read",
        "user_id": user_id,
        "business_id": business_id,
        "executed": False,
    }