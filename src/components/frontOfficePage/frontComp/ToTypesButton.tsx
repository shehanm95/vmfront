import React from 'react'
import { useMyNavigator } from '../../customHooks/useMyNavigator'

export const ToTypesButton = () => {
    const { links, navigate } = useMyNavigator();
    return (
        <div className='flex column'>
            <h2 className='footer-h2'>Show Visit Types</h2>

            <button onClick={() => navigate(links.frontOffice.visitTypes)} className='light-button'>Visit Types</button>
        </div>
    )
}
