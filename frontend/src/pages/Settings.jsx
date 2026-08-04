import { useEffect, useState } from "react";
import Button from "../components/ui/Button";

import {
  getSettings,
  saveSettings,
} from "../services/settings";

function Settings() {

  const [companyName, setCompanyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("PKR");
  const [taxPercent, setTaxPercent] = useState(0);
  const [invoicePrefix, setInvoicePrefix] = useState("INV");

  useEffect(() => {

    loadSettings();

  }, []);

  async function loadSettings() {

    const data = await getSettings();

    if (!data) return;

    setCompanyName(data.company_name || "");
    setOwnerName(data.owner_name || "");
    setPhone(data.phone || "");
    setEmail(data.email || "");
    setWebsite(data.website || "");
    setAddress(data.address || "");
    setCurrency(data.currency || "PKR");
    setTaxPercent(data.tax_percent || 0);
    setInvoicePrefix(data.invoice_prefix || "INV");

  }

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      await saveSettings({

        company_name: companyName,
        owner_name: ownerName,
        phone,
        email,
        website,
        address,
        currency,
        tax_percent: Number(taxPercent),
        invoice_prefix: invoicePrefix,

      });

      alert("Settings Saved Successfully ✅");

    } catch (error) {

      alert(error.message);

    }

  }

  return (

    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold">

        Settings

      </h1>

      <p className="text-gray-500 mt-2 mb-8">

        Business Configuration

      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow border p-6 space-y-4"
      >

        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) =>
            setCompanyName(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="Owner Name"
          value={ownerName}
          onChange={(e) =>
            setOwnerName(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) =>
            setWebsite(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />

        <textarea
          placeholder="Business Address"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="Currency"
          value={currency}
          onChange={(e) =>
            setCurrency(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />

        <input
          type="number"
          placeholder="Tax %"
          value={taxPercent}
          onChange={(e) =>
            setTaxPercent(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="Invoice Prefix"
          value={invoicePrefix}
          onChange={(e) =>
            setInvoicePrefix(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />

        <div className="flex justify-end">

          <Button type="submit">

            Save Settings

          </Button>

        </div>

      </form>

    </div>

  );

}

export default Settings;