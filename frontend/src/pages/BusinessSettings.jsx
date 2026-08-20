import { useEffect, useState } from "react";
import Layout from "../components/dashboard/Layout";
import Button from "../components/ui/Button";
import { uploadBusinessLogo } from "../services/storage";

import {
  getBusinessSettings,
  updateBusinessSettings,
} from "../services/businessSettings";

function BusinessSettings() {
  const [businessId, setBusinessId] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    async function loadBusiness() {
      const settings = await getBusinessSettings();

      if (settings) {
        setBusinessId(settings.id);
        setBusinessName(settings.business_name || "");
        setBusinessType(settings.business_type || "");
        setPhone(settings.phone || "");
        setEmail(settings.email || "");
        setAddress(settings.address || "");
        setLogoUrl(settings.logo || "");
      }
    }

    loadBusiness();
  }, []);

  async function handleSave() {
    try {
      let uploadedLogo = logoUrl;

      if (logoFile) {
        uploadedLogo = await uploadBusinessLogo(logoFile);
      }

      await updateBusinessSettings(businessId, {
        business_name: businessName,
        business_type: businessType,
        phone: phone,
        email: email,
        address: address,
        logo: uploadedLogo,
      });

      setLogoUrl(uploadedLogo);
      setLogoFile(null);

      alert("Business Updated Successfully ✅");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* =========================
            PAGE HEADER
        ========================== */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Business Settings
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Manage your business profile, contact information and branding.
          </p>
        </div>

        <div className="space-y-6">

          {/* =========================
              BUSINESS INFORMATION
          ========================== */}
          <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">

            <div className="p-5 sm:p-6 border-b bg-gray-50">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Business Information
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Keep your core business information up to date.
              </p>
            </div>

            <div className="p-5 sm:p-6">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Business Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Business Name
                  </label>

                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter business name"
                    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Business Type */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Business Type
                  </label>

                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full border rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">
                      Select Business Type
                    </option>

                    <option value="General Store">
                      General Store
                    </option>

                    <option value="Super Store">
                      Super Store
                    </option>

                    <option value="Wholesale">
                      Wholesale
                    </option>

                    <option value="Mobile Shop">
                      Mobile Shop
                    </option>

                    <option value="Garments">
                      Garments
                    </option>

                    <option value="Pharmacy">
                      Pharmacy
                    </option>

                    <option value="Electronics">
                      Electronics
                    </option>

                    <option value="Restaurant">
                      Restaurant
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Phone
                  </label>

                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@yourbusiness.com"
                    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Address */}
                <div className="lg:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Business Address
                  </label>

                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter complete business address"
                    rows={4}
                    className="w-full border rounded-lg p-3 resize-y outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

              </div>

            </div>
          </section>

          {/* =========================
              BUSINESS BRANDING
          ========================== */}
          <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">

            <div className="p-5 sm:p-6 border-b bg-gray-50">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Business Branding
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Upload your business logo for use across your BusinessOS account.
              </p>
            </div>

            <div className="p-5 sm:p-6">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* Upload */}
                <div>

                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Company Logo
                  </label>

                  <label className="flex flex-col items-center justify-center w-full min-h-[190px] border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition">

                    <div className="text-3xl mb-3">
                      🖼️
                    </div>

                    <p className="font-medium text-gray-700">
                      Click to upload logo
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      JPG, PNG or WEBP
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Maximum size: 2MB
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setLogoFile(e.target.files?.[0] || null);
                      }}
                      className="hidden"
                    />

                  </label>

                  {logoFile && (
                    <p className="mt-3 text-sm text-blue-600 break-all">
                      Selected: {logoFile.name}
                    </p>
                  )}

                </div>

                {/* Preview */}
                <div>

                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Current Logo
                  </label>

                  <div className="min-h-[190px] border rounded-xl bg-gray-50 flex items-center justify-center p-6">

                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Business Logo"
                        className="max-w-full max-h-40 object-contain"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <div className="text-4xl mb-2">
                          🏢
                        </div>

                        <p className="text-sm">
                          No business logo uploaded
                        </p>
                      </div>
                    )}

                  </div>

                </div>

              </div>

            </div>
          </section>

          {/* =========================
              SAVE SECTION
          ========================== */}
          <section className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>
                <h2 className="font-semibold text-gray-900">
                  Save Business Changes
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Save your latest business information and branding.
                </p>
              </div>

              <div className="w-full sm:w-auto">
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>

            </div>

          </section>

        </div>
      </div>
    </Layout>
  );
}

export default BusinessSettings;