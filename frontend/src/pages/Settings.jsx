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
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">

      {/* =========================
          PAGE HEADER
      ========================== */}
      <div className="mb-6 sm:mb-8">

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Manage your business profile, financial preferences and invoice configuration.
        </p>

      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* =========================
            BUSINESS INFORMATION
        ========================== */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          <div className="p-5 sm:p-6 border-b bg-gray-50">

            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Business Information
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Basic information about your business.
            </p>

          </div>

          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>

              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name
              </label>

              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Enter owner name"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>

              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter business email"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Website */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>

              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address
              </label>

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete business address"
                rows="4"
                className="w-full border rounded-lg p-3 outline-none resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

          </div>

        </div>

        {/* =========================
            FINANCIAL SETTINGS
        ========================== */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          <div className="p-5 sm:p-6 border-b bg-gray-50">

            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Financial Settings
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Configure currency and default tax settings.
            </p>

          </div>

          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>

              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="PKR"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <p className="text-xs text-gray-500 mt-2">
                Example: PKR, USD, EUR
              </p>
            </div>

            {/* Tax */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Percentage
              </label>

              <div className="relative">

                <input
                  type="number"
                  min="0"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                  placeholder="0"
                  className="w-full border rounded-lg p-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  %
                </span>

              </div>

              <p className="text-xs text-gray-500 mt-2">
                Default tax applied to your business transactions.
              </p>

            </div>

          </div>

        </div>

        {/* =========================
            INVOICE SETTINGS
        ========================== */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          <div className="p-5 sm:p-6 border-b bg-gray-50">

            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Invoice Settings
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Configure how your invoices are numbered.
            </p>

          </div>

          <div className="p-5 sm:p-6">

            <div className="max-w-md">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Prefix
              </label>

              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                placeholder="INV"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <p className="text-xs text-gray-500 mt-2">
                Example invoice number:{" "}
                <span className="font-medium text-gray-700">
                  {invoicePrefix || "INV"}-00001
                </span>
              </p>

            </div>

          </div>

        </div>

        {/* =========================
            SAVE BAR
        ========================== */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <h3 className="font-semibold text-gray-900">
                Save Changes
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Save your latest business configuration.
              </p>

            </div>

            <Button type="submit">
              Save Settings
            </Button>

          </div>

        </div>

      </form>

    </div>
  );
}

export default Settings;