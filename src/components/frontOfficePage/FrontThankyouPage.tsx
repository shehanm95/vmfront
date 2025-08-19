import './css/displayVisitTypes.css'
import { WhiteLogo } from '../common/WhiteLogo'
import { DateTimeLoc } from './frontComp/DateTimeLoc'
import { useNavigate } from 'react-router-dom'
import { LinkService } from '../../frontServices/LinkService'
import { FrontPageService } from '../../frontServices/FrontPageSerivce'
import { useEffect, useState } from 'react'
import { FrontContinueAs } from './frontComp/FrontContinueAs'

export const FrontThankyouPage = () => {
    const [vistOtionName, setVisitOptionName] = useState('')
    const links = LinkService.getInstance()
    const frontServices = FrontPageService.getInstance();
    const navigate = useNavigate()
    const [count, setCount] = useState<number>(9);

    useEffect(() => {
        const timer = setInterval(() => {
            setCount(prevCount => {
                if (prevCount <= 1) {
                    clearInterval(timer);
                    navigate(links.frontOffice.visitTypes)
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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

    function backToTypes(): void {
        navigate(links.frontOffice.visitTypes)
    }

    return (

        <div className='frontPage'>
            <div className="topBar">

                <div className='flex column centerV pb-2'>
                    <h1>Wellcome</h1>
                    <h2>{vistOtionName}</h2>
                    <h3>You are Going To Enter From Gate A</h3>
                </div>

            </div>

            <div className="front-content">

                <div className="flex column centerV">
                    <h1>
                        Thank You For Submitting Your Details,
                    </h1>
                    <h2>
                        take the printed pass before entering to the premisses
                    </h2>
                    <h3>if need ferther more clarification please contact a front officer</h3>
                    <h3 className="m-2">0{count}</h3>
                    <button onClick={backToTypes} className='front-Button m-2'>Back To the Front Page</button>
                </div>
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
