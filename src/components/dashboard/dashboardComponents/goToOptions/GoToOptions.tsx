import React from 'react'
import { IconHeader } from '../../../common/IconHeader'
import Header from '../../../common/Header'
import { Center } from '../../../common/Center'
import { useNavigate } from 'react-router-dom'
import { LinkService } from '../../../../frontServices/LinkService'

export const GoToOptions = () => {
    const navigate = useNavigate()
    return (
        <>
            <IconHeader icon={'fa-external-link'} title={'Go To Display Visitor Options'}></IconHeader>
            <div className="mt-3"></div>
            <Header title={'I am all set with visitor options'}
                tooltipText={'If you click the button below it will open the display visitor option page.'}></Header>
            <div className="m-5"></div>
            <Center>
                <button onClick={() => navigate(LinkService.getInstance().frontOffice.visitTypes)} className='roundBlueButton'>Go To Display Visit Options</button>
            </Center>
        </>

    )
}
