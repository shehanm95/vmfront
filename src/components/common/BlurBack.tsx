import React from 'react';
import './css/blurBack.css';

interface BlurBackProps {
    zIndex?: number;
    children?: React.ReactNode;  // <-- Add children prop
}

export const BlurBack: React.FC<BlurBackProps> = ({ zIndex = 2, children }) => {
    return (
        <div
            className="blurBack flex centerH"
            style={{
                zIndex: zIndex,
            }}
        >
            {children} {/* <-- Render children here */}
        </div>
    );
};
