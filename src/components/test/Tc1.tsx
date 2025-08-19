import React from 'react'
import { useState } from 'react'

interface Tc1P {
    changeNum: () => void
}

export const Tc1 = ({ changeNum }: Tc1P) => {




    function func(): void {
        changeNum();
    }

    return (
        <div>

            <button onClick={func}>changeNum</button>

        </div>
    )
}
