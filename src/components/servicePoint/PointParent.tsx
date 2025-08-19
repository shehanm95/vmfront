import React from "react";
import { Outlet } from "react-router-dom";
import './css/point.css';
import { NavBarContainer } from "../common/NavBarContainer";


const PointParent: React.FC = () => {
    return (
        <div className="cernterContainer">
            <NavBarContainer>
                <Outlet />
            </NavBarContainer>
        </div>
    );
};

export default PointParent;