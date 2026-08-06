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

            await updateBusinessSettings(
                businessId,
                {
                    business_name: businessName,
                    business_type: businessType,
                    phone: phone,
                    email: email,
                    address: address,
                    logo: uploadedLogo,
                }
            );

            setLogoUrl(uploadedLogo);

            alert("Business Updated Successfully ✅");

        } catch (error) {

            alert(error.message);

        }

    }

    return (

        <Layout>

            <div className="p-6">

                <h1 className="text-3xl font-bold">

                    Business Settings

                </h1>

                <p className="text-gray-500 mt-2">

                    Manage your business information.

                </p>

                <div className="mt-8">

                    <label className="block mb-2 font-medium">

                        Business Name

                    </label>

                    <input
                        type="text"
                        value={businessName}
                        onChange={(e) =>
                            setBusinessName(e.target.value)
                        }
                        className="w-full md:w-[500px] border rounded-lg p-3"
                    />

                </div>

                <div className="mt-6">

                    <label className="block mb-2 font-medium">
                        Business Type
                    </label>

                    <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full md:w-[500px] border rounded-lg p-3"
                    >
                        <option value="">Select Business Type</option>
                        <option value="General Store">General Store</option>
                        <option value="Super Store">Super Store</option>
                        <option value="Wholesale">Wholesale</option>
                        <option value="Mobile Shop">Mobile Shop</option>
                        <option value="Garments">Garments</option>
                        <option value="Pharmacy">Pharmacy</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Other">Other</option>
                    </select>

                </div>

                <div className="mt-6">

                    <label className="block mb-2 font-medium">
                        Phone
                    </label>

                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full md:w-[500px] border rounded-lg p-3"
                    />

                </div>

                <div className="mt-6">

                    <label className="block mb-2 font-medium">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="info@yourbusiness.com"
                        className="w-full md:w-[500px] border rounded-lg p-3"
                    />

                </div>

                <div className="mt-6">

                    <label className="block mb-2 font-medium">
                        Address
                    </label>

                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter Business Address"
                        rows={3}
                        className="w-full md:w-[500px] border rounded-lg p-3"
                    />

                </div>



                <div className="mt-6">

                    <label className="block mb-2 font-medium">
                        Company Logo
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            setLogoFile(e.target.files[0]);
                        }}
                        className="w-full md:w-[500px] border rounded-lg p-3"
                    />

                    {logoUrl && (
                        <div className="mt-4">
                            <img
                                src={logoUrl}
                                alt="Business Logo"
                                className="w-32 h-32 object-contain border rounded-lg p-2"
                            />
                        </div>
                    )}

                    <p className="text-sm text-gray-500 mt-2">
                        JPG, PNG, WEBP (Max 2MB)
                    </p>

                </div>

                <div className="mt-6">

                    <Button onClick={handleSave}>

                        Save Changes

                    </Button>

                </div>

            </div>

        </Layout>

    );

}

export default BusinessSettings;