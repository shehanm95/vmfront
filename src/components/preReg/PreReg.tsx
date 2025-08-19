import React, { useEffect } from 'react'
import { NavBarContainer } from '../common/NavBarContainer'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { VisitProvider } from '../../context/preRegContext'
import { LinkService } from '../../frontServices/LinkService'

export const PreReg = () => {
    const path = useLocation().pathname;
    const links = LinkService.getInstance();
    const navigate = useNavigate()

    useEffect(() => {
        if (path === links.preReg.base || path === "/preReg") {
            console.log("forwored to types")
            navigate(links.preReg.types);
        } else {
            console.log(path)
            console.log("something wrong")
        }
    }, [])
    return (
        <>
            <NavBarContainer>
                <h1 className='text-center m-3'>Pre Registration</h1>
                <VisitProvider>
                    <Outlet />
                </VisitProvider>
            </NavBarContainer>
        </>
    )
}
