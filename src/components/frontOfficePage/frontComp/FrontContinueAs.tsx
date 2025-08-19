import React from 'react'
import { FrontPageService } from '../../../frontServices/FrontPageSerivce'

export const FrontContinueAs = () => {

    const currentUser = FrontPageService.getInstance().getCurrectVisitor();
    const full_name = currentUser?.firstName + " " + currentUser?.lastName;
    return (
        <div className='flex column'>
            <h3>You Are Continue As</h3>
            <p className='light-button center mt-2 p-1'>{full_name}</p>
        </div>
    )
}
