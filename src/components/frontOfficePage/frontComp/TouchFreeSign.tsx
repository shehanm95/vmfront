import React from 'react'
import Sign from './signInQR.png'
import './css/touchFreeSign.css'

export const TouchFreeSign = () => {
    return (
        <div className='TouchFree' >
            <img src={Sign} alt="touch free sign in" />
            <div className="text">
                <div>Touch Free</div>
                <div>Sign in</div>
            </div>
        </div>
    )
}
