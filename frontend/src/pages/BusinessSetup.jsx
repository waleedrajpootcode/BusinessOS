import { useState } from "react";
import Button from "../components/ui/Button";

function BusinessSetup() {

  const [businessName, setBusinessName] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">

        <h1 className="text-3xl font-bold mb-2">
          Welcome to BusinessOS
        </h1>

        <p className="text-gray-500 mb-6">
          Let's set up your business.
        </p>

        <label className="block mb-2 font-medium">
          Business Name
        </label>

        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Enter your business name"
          className="w-full border rounded-lg p-3 mb-6"
        />

        <Button>
          Next
        </Button>

      </div>

    </div>
  );
}

export default BusinessSetup;