import React, { useState } from 'react'
import { RightAlign } from '../../common/RightAlign'

export const EmailChecker = ({ setEnteredEmail }: { setEnteredEmail: (email: string) => void }) => {
    const [email, setEmail] = useState('')


    return (
        <div className="point-container" >
            <h3>Enter Your Email Address to identify visitor</h3>
            <input className="point-input" type="email" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
            <RightAlign>
                <button className="point-button point-scan-btn" onClick={() => setEnteredEmail(email)}>Confirm</button>
            </RightAlign>

        </div>
    )
}
