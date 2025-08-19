import React, { useState } from 'react';
import './css/header.css';

interface HeaderProps {
    title: string;
    tooltipText: string;
}

const Header: React.FC<HeaderProps> = ({ title, tooltipText }) => {
    const [isTooltipVisible, setTooltipVisible] = useState<boolean>(false);

    return (
        <div className="header-container">
            <h2 className="header-title">{title}</h2>
            <div
                className="info-icon-wrapper"
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
            >
                <i className="fas fa-info-circle info-icon"></i>
                {isTooltipVisible && (
                    <div className="tooltip">
                        {tooltipText}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;