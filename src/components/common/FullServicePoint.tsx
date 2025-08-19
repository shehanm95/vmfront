import React from 'react'
import { ServicePoint } from '../../types/ServicePoint'
import './css/point.css'
import { PersonItem } from '../dashboard/dashboardComponents/servicePointComps/PersonItem'
import { Duty } from '../../types/Duty'
import { DisplayQuestionAndAnswer } from '../servicePoint/pointComps/DisplayQuestionAndAnswer'

export const FullServicePoint = ({ servicePoint }: { servicePoint: ServicePoint }) => {
    return (
        <div className='mt-4'>
            <h3 className='m-2 point-title'>Serive Point Name</h3>
            <h3 className='p-4 point-duty-holder'>{servicePoint.pointName}</h3>
            <h3 className='m-2 point-title'>Location</h3>
            <h3 className='p-4 point-duty-holder'>{servicePoint.location}</h3>
            <h3 className='m-2 point-title'>Duties</h3>
            <div className='point-duty-holder'>
                {servicePoint.duties && servicePoint.duties.map((duty: Duty) =>
                    <div key={duty.id} className="point-duty-slot">
                        <PersonItem user={duty.officer} ></PersonItem>
                    </div>)}

            </div>
            <h3 className='m-2 point-title'>Officer Questions : </h3>
            {servicePoint.officerQuestions && servicePoint.officerQuestions.map((oq) =>
                <DisplayQuestionAndAnswer key={oq.id} question={oq} showReferences={true} />)
            }
            <hr></hr>
        </div>
    )
}
