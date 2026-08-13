import { createContext, useContext, useEffect, useState } from "react";
import { getBusinessSettings } from "../services/businessSettings";

const BusinessContext = createContext();

export function BusinessProvider({ children }) {
  const [business, setBusiness] = useState(null);

  async function loadBusiness() {
    try {
      const data = await getBusinessSettings();

      setBusiness(data);
    } catch (error) {
      console.error("Load Business Error:", error);
      setBusiness(null);
    }
  }

  useEffect(() => {
    loadBusiness();
  }, []);

  return (
    <BusinessContext.Provider
      value={{
        business,
        loadBusiness,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}