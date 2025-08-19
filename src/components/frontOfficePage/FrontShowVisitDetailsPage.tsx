import './css/displayVisitTypes.css'
import { WhiteLogo } from '../common/WhiteLogo'
import { DateTimeLoc } from './frontComp/DateTimeLoc'
import { useNavigate } from 'react-router-dom'
import { LinkService } from '../../frontServices/LinkService'
import { FrontPageService } from '../../frontServices/FrontPageSerivce'
import { useEffect, useState } from 'react'
import { FrontContinueAs } from './frontComp/FrontContinueAs'
import FrontShowVisitDetails from './frontComp/FrontShowVisitDetails'

export const FrontShowVisitDetailsPage = () => {
    const [vistOtionName, setVisitOptionName] = useState('')
    const links = LinkService.getInstance()
    const frontServices = FrontPageService.getInstance();
    const navigate = useNavigate()




    useEffect(() => {
        const setVisitOptionOrBack = () => {
            const currentOption = frontServices.getSelectedVisitOption();
            const oName = currentOption?.visitOptionName
            if (!oName) navigate(links.frontOffice.visitOptions);
            else setVisitOptionName(oName);


            if (!currentOption) {
                console.log("redirect to visit Option")
            }
        }
        setVisitOptionOrBack()
    }, [])


    function navigateToOptions(): void {
        navigate(links.frontOffice.visitOptions)
    }

    return (

        <div className='frontPage'>
            <div className="topBar">
                <div onClick={() => navigateToOptions()} className="backButton">
                    <i className="fa fa-arrow-left"></i></div>
                <div className='flex column centerV pb-2'>
                    <h1>Wellcome</h1>
                    <h2>{vistOtionName}</h2>
                    <h3>You are Going To Enter From Gate A</h3>
                </div>

            </div>

            <div className="front-content">

                <FrontShowVisitDetails></FrontShowVisitDetails>

            </div>
            <div className="footer">
                <div className="footerbox">
                    <FrontContinueAs></FrontContinueAs>
                </div>
                <div className="footerbox middle">
                    <DateTimeLoc></DateTimeLoc>
                </div>
                <div className="footerbox">
                    <WhiteLogo></WhiteLogo>
                </div>
            </div>


        </div>
    )
}
