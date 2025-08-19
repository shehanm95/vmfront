import React, { ReactNode } from 'react';


export const Center = ({ children }: { children: ReactNode }) => {
    return (
        <div className="center">
            {children}
        </div>
    );
};
