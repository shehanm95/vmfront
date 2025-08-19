import { Outlet, useNavigate } from 'react-router-dom'
import './css/displayVisitTypes.css'
import { useState } from 'react'
import { SideBarBlurBack } from '../common/SideBarBlurBack'
import { FrontSideBar } from './frontComp/FrontSideBar'
import { WhiteLogo } from '../common/WhiteLogo'
import { DateTimeLoc } from './frontComp/DateTimeLoc'
import { TouchFreeSign } from './frontComp/TouchFreeSign'
import { VisitOptionContainer } from './frontComp/VisitOptionContainer'
import { LinkService } from '../../frontServices/LinkService'

export const DisplayVisitOptions = () => {
    const navigate = useNavigate()


    function backToTypes(): void {
        navigate(LinkService.getInstance().frontOffice.visitTypes);
    }

    return (

        <div className='frontPage'>
            <div className="topBar">
                <div onClick={() => backToTypes()} className="backButton"> <i className="fa fa-arrow-left"></i></div>
                <div className='flex column centerV pb-2'>
                    <h1>Wellcome</h1>
                    <h2>Select Your Visit Option</h2>
                    <h3>You are Going To Enter From Gate A</h3>
                </div>

            </div>
            <div className="front-content">
                <VisitOptionContainer></VisitOptionContainer>
            </div>



            <div className="footer">
                <div className="footerbox">
                    <TouchFreeSign></TouchFreeSign>
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
