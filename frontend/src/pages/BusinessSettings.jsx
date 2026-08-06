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
    const [logoFile, setLogoFile] = useState(null);


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

    async function handleSave() {

        try {

            await updateBusinessSettings(
                businessId,
                {
                    business_name: businessName,
                }
            );

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