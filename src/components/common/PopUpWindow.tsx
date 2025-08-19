import React, { ReactNode } from 'react'

import '../dashboard/dashboardComponents/visitOptions/visitType.css'
import { BlurBack } from './BlurBack';

interface PopUpProps {
    onClose: () => void;
    children: ReactNode
    title: string
}

export const PopUpWindow: React.FC<PopUpProps> = ({ title, onClose, children }) => {
    return (
        <BlurBack>
            <div className="popup-form">
                <button onClick={onClose} className="popup-form-close" aria-label="Close">
                    ×
                </button>
                <h2 className="popup-form-title">{title}</h2>
                <div className='pop-up-body'>
                    {children}
                </div>

            </div>
        </BlurBack>
    );
};
