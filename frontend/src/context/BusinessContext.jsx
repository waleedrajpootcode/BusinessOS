import { createContext, useContext, useEffect, useState } from "react";
import { getBusinessSettings } from "../services/businessSettings";

const BusinessContext = createContext();

export function BusinessProvider({ children }) {

  const [business, setBusiness] = useState(null);

  async function loadBusiness() {

    const data = await getBusinessSettings();

    setBusiness(data);

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