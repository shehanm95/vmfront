import React from 'react'
import { useMyNavigator } from '../../customHooks/useMyNavigator'

export const ToPregPrint = () => {
    const { links, navigate } = useMyNavigator();
    return (
        <div className='flex column'>
            <h2 className='footer-h2'>Give Visit ID And</h2>

            <button onClick={() => navigate(links.frontOffice.toPreRegPrintInput)} className='light-button'>Print Your Pass</button>
        </div>
    )
}
