import React, { ReactNode } from 'react';


export const RightAlign = ({ children }: { children: ReactNode }) => {
    return (
        <div className="right-align">
            {children}
        </div>
    );
};