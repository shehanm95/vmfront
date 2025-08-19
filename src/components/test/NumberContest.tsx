import React, { useState } from "react";
import { createContext, useContext } from "react";

interface NumberContextType {
    num: number;
    setNumber: (num: number) => void;
}

const NumberContext = createContext<NumberContextType | undefined>(undefined)

export const userNumberContext = () => {
    const context = useContext(NumberContext);
    if (!context) {
        throw new Error('use number context should be within provider')
    }
    return context;
}

export const NumberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [num, setNumber] = useState<number>(0)
    return (
        <NumberContext.Provider value={{ num, setNumber }}>
            {children}
        </NumberContext.Provider>
    )
}

export const T1 = () => {
    return (
        <div>NumberContest</div>
    )
}
