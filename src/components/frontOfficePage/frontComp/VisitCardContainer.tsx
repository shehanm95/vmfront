import React, { useEffect, useState } from 'react'

import { VisitCard } from './VisitCard'
import { toast } from 'react-toastify';
import { VisitTypeService } from '../../../services/visitTypeSerive';
import { VisitType } from '../../../types/visitType';
import { Center } from '../../common/Center';


export const VisitCardContainer = () => {
    const [visitTyeps, setVisitTypes] = useState<VisitType[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const types = await VisitTypeService.getAllVisitTypes();
                setVisitTypes(types);
                setLoading(false);

            } catch (e) {
                toast.error("Error loading Visit Types");
                console.log("visit Types loading error : ", e);
                setLoading(false);
            }
        }
        fetchTypes();
    }, [])

    return (
        <div className='w-100'>
            <div className="mt-2"></div>
            <div className="front-content">

                {visitTyeps.map((visitType) => (
                    <VisitCard key={visitType.id} vType={visitType} />
                ))}

                {loading && <Center>
                    <p>Loading.....</p></Center>}
            </div>
        </div>
    )
}
