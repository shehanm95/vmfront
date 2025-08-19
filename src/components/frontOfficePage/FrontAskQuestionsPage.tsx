import './css/displayVisitTypes.css'
import { WhiteLogo } from '../common/WhiteLogo'
import { DateTimeLoc } from './frontComp/DateTimeLoc'
import { useNavigate } from 'react-router-dom'
import { LinkService } from '../../frontServices/LinkService'
import { FrontPageService } from '../../frontServices/FrontPageSerivce'
import { useEffect, useState } from 'react'
import { FrontContinueAs } from './frontComp/FrontContinueAs'
import FrontDisplayQuestion from './frontComp/frontDisplayQuestion'

export const FrontAskQuestionsPage = () => {
    const navigate = useNavigate()
    const frontServices = FrontPageService.getInstance();
    const [vistOtionName, setVisitOptionName] = useState('')
    const links = LinkService.getInstance()


    useEffect(() => {
        const setVisitOptionOrBack = () => {
            const currentOption = frontServices.getSelectedVisitOption();
            const oName = currentOption?.visitOptionName
            if (!oName) navigate(links.frontOffice.visitOptions);
            else setVisitOptionName(oName);


            if (currentOption?.dynamicQuestions.length && currentOption?.dynamicQuestions.length <= 0) {
                // stay in this page,
            } else {
                // navigate(links.frontOffice.takePhoto);
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
                <div onClick={() => navigateToOptions()} className="backButton"> <i className="fa fa-arrow-left"></i></div>
                <div className='flex column centerV pb-2'>
                    <h1>Wellcome</h1>
                    <h2>{vistOtionName}</h2>
                    <h3>You are Going To Enter From Gate A</h3>
                </div>

            </div>

            <div className="front-content">

                <FrontDisplayQuestion></FrontDisplayQuestion>

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
