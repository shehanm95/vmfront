import './css/logos.css'
import BlueLogoImg from '../../assets/WhiteLogo.svg'
import { useNavigate } from 'react-router-dom'
import { LinkService } from '../../frontServices/LinkService'

export const WhiteLogo = () => {
    const navigate = useNavigate()

    return (
        <div onClick={() => navigate(LinkService.getInstance().preReg.types)} className='flex center' >
            <img src={BlueLogoImg} className='blueLogo' alt="logoImg" />
            <div className="bluelogoText flex column">
                <h3 className='light-font'>ZinCat Technologies</h3>
                <h4 className='light-font'>Visitor Mnagement</h4>
            </div>
        </div>
    )
}