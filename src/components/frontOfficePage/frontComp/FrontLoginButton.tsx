import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LinkService } from '../../../frontServices/LinkService';
import './css/footerButtons.css'

export const FrontLoginButton = () => {
    const navigate = useNavigate();
    return (
        <div className='flex column'>
            <h2 className='footer-h2'>I have an account</h2>

            <button onClick={() => navigate(LinkService.getInstance().frontOffice.login)} className='light-button'>Login</button>
        </div>
    )
}
