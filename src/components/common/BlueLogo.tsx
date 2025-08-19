import React from 'react'
import './css/logos.css'
import BlueLogoImg from '../../assets/BlueLogoImg.svg'

export const BlueLogo = () => {
    return (
        <div className='flex center' >
            <img src={BlueLogoImg} className='blueLogo' alt="logoImg" />
            <div className="bluelogoText flex column">
                <h3>ZinCat Technologies</h3>
                <h4>Visitor Mnagement</h4>
            </div>
        </div>
    )
}
