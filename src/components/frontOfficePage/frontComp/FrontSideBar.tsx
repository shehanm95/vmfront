import React, { useState } from 'react'
import './css/frontSideBar.css'
import { WhiteLogo } from '../../common/WhiteLogo';
import { useNavigate } from 'react-router-dom';

interface FrontSideBarProps {
    close: () => void;
    childran?: React.ReactNode;
}

export const FrontSideBar: React.FC<FrontSideBarProps> = ({ close, childran }) => {
    const navigate = useNavigate();
    const stopPropergation = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }

    const navigateTo = (path: string) => {
        navigate(path);
        close();
    }



    function toggleFullScreen(): void {
        const elem = document.documentElement;

        const currentlyFullScreen =
            document.fullscreenElement ||
            (document as any).webkitFullscreenElement ||
            (document as any).msFullscreenElement;

        if (!currentlyFullScreen) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if ((elem as any).webkitRequestFullscreen) {
                (elem as any).webkitRequestFullscreen();
            } else if ((elem as any).msRequestFullscreen) {
                (elem as any).msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
                (document as any).webkitExitFullscreen();
            } else if ((document as any).msExitFullscreen) {
                (document as any).msExitFullscreen();
            }
        }

        close(); // Optional: depends on your desired behavior
    }

    return (
        <div onClick={stopPropergation} className='frontSideBar'>
            <div onClick={() => close()} className="backButton"> <i className="fa fa-arrow-left"></i></div>
            <div className='pt-5'></div>
            <div className='pt-4'></div>
            <WhiteLogo></WhiteLogo>
            <h2 className='pt-4 pt-2 center'>Front Officer Options</h2>
            <hr />
            <div className="sideBarButton" onClick={() => navigateTo('')}>
                <i className='fa fa-home'></i> <p>Stay In This Page</p>
            </div>
            <div className="sideBarButton" onClick={() => navigateTo('/moderatorDashBoard')}>
                <i className='fa fa-external-link'></i><p> Go To Dashboard</p>
            </div>
            <div className="sideBarButton" onClick={toggleFullScreen}>
                <i className="fas fa-expand"></i> <p>Toggle Full Screen</p>
            </div>

        </div >
    )
}
