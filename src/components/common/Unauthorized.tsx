import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css';
import { getRole } from '../../api/axios';
import { LinkService } from '../../frontServices/LinkService';

export const Unauthorized = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        getRole();
        navigate(LinkService.getInstance().preReg.types);
    };

    return (
        <div className="unauthorized-container">
            <div className="unauthorized-box">
                <h1>Oops! Something went wrong…</h1>
                <p>You don't have permission to view this page.</p>
                <button onClick={handleBack}>← Go Back</button>
            </div>
            <footer className="unauthorized-footer">
                Need help? <a href="mailto:support@example.com">Contact Support</a>
            </footer>
        </div>
    );
};
