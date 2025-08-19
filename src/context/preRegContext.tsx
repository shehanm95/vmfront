// contexts/VisitContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { VisitType } from '../types/visitType';
import { VisitOption } from '../types/visitOption';
import { UserDto } from '../types/UserDto';
import { Visit } from '../types/visit';

export type SimpleVisit = {
    id: number | undefined;
    visitType: VisitType | undefined;
    visitOption: VisitOption | undefined;
    visitor: UserDto | undefined | null;
    imageName: string | undefined;
    badgePrintDate: Date | undefined;
    dynamicAnswers: Record<string, any> | undefined;
    visitRow: { id: number } | undefined;
    isPrinted: boolean | undefined;
    realVisit: Visit | undefined;
};

export type VisitContextType = {
    visit: SimpleVisit;
    setVisit: (visit: SimpleVisit) => void;
    clearVisit: () => void;

};

// Create the context with proper typing
export const VisitContext = createContext<VisitContextType | undefined>(undefined);

// Create a provider component
export const VisitProvider = ({ children }: { children: ReactNode }) => {
    const [visit, setVisit] = useState<SimpleVisit>({
        id: undefined,
        visitType: undefined,
        visitOption: undefined,
        visitor: undefined,
        imageName: undefined,
        badgePrintDate: undefined,
        dynamicAnswers: undefined,
        visitRow: undefined,
        isPrinted: undefined,
        realVisit: undefined,
    });

    const clearVisit = () => {
        setVisit({
            id: undefined,
            visitType: undefined,
            visitOption: undefined,
            visitor: undefined,
            imageName: undefined,
            badgePrintDate: undefined,
            dynamicAnswers: undefined,
            visitRow: undefined,
            isPrinted: undefined,
            realVisit: undefined
        });
    };

    return (
        <VisitContext.Provider value={{ visit, setVisit, clearVisit }}>
            {children}
        </VisitContext.Provider>
    );
};

// Custom hook for using the visit context
export const useVisit = () => {
    const context = useContext(VisitContext);
    if (context === undefined) {
        throw new Error('useVisit must be used within a VisitProvider');
    }
    return context;
};