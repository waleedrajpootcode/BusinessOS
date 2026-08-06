import { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import {
  saveBusinessSettings,
  getBusinessSettings,
  updateBusinessSettings,
} from "../services/businessSettings";
import { useNavigate } from "react-router-dom";

function BusinessSetup() {

  const [businessName, setBusinessName] = useState("");
  const [businessId, setBusinessId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {

    async function loadBusiness() {

      const settings = await getBusinessSettings();

      if (settings) {

        setBusinessId(settings.id);

        setBusinessName(settings.business_name || "");

      }

    }

    loadBusiness();

  }, []);

  async function handleNext() {

    if (!businessName.trim()) {

      alert("Please enter business name");

      return;

    }

    try {

      await saveBusinessSettings({
        business_name: businessName,
      });

      alert("Business Saved Successfully ✅");

      navigate("/dashboard");

    } catch (error) {

      alert(error.message);

    }

  }

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

        <Button onClick={handleNext}>
          Next
        </Button>

      </div>

    </div>
  );
}

export default BusinessSetup;