import { useNavigate } from 'react-router-dom'
import { LinkService } from '../../../frontServices/LinkService';
import './css/footerButtons.css'

export const FrontRegisterButton = () => {
    const navigate = useNavigate();
    return (
        <div className='flex column'>
            <h2 className='footer-h2'>I do not have an account</h2>
            <button onClick={() => navigate(LinkService.getInstance().frontOffice.register)} className='light-button'>Register</button>
        </div>
    )
}
