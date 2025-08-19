import React from 'react';
import './css/blurBack.css';

interface BlurBackProps {
    zIndex?: number;
    closeSideBar: () => void;
    children?: React.ReactNode;  // <-- Add children prop
}

export const SideBarBlurBack: React.FC<BlurBackProps> = ({ zIndex = 2, closeSideBar, children }) => {
    return (
        <div onClick={closeSideBar}
            className="blurBack"
            style={{
                zIndex: zIndex,
            }}
        >
            {children} {/* <-- Render children here */}
        </div>
    );
};