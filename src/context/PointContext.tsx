
import { createContext, useState } from "react";
import { Visit } from "../types/visit";
import React, { ReactNode } from "react";
import { ServicePoint } from "../types/ServicePoint";

type PointContextType = {
    visit: Visit | undefined;
    setVisit: React.Dispatch<React.SetStateAction<Visit | undefined>>;

    servicePoints: ServicePoint[] | undefined;
    // serServicePoints: React.Dispatch<React.SetStateAction<ServicePoint[] | undefined>>;
    setServicePoints: (servicePoints: ServicePoint[]) => void;

};

export const PointContext = createContext<PointContextType | undefined>(undefined);

export const PointProvider = ({ children }: { children: ReactNode }) => {
    const [visit, setVisit] = useState<Visit | undefined>(undefined);
    const [servicePoints, setServicePoints] = useState<ServicePoint[] | undefined>(undefined);
    return (
        <PointContext.Provider value={{ visit, setVisit, servicePoints, setServicePoints }}>
            {children}
        </PointContext.Provider>
    )
}

export const usePointContext = () => {
    const context = React.useContext(PointContext);
    if (context === undefined) {
        throw new Error("usePointContext must be used within a PointProvider");
    }
    return context;
};