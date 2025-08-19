import React, { useEffect, useState } from 'react'
import { VisitType } from '../../../types/visitType';
import { Center } from '../../common/Center';
import { FrontPageService } from '../../../frontServices/FrontPageSerivce';
import { OptionCard } from './OptionCart';
import { useNavigate } from 'react-router-dom';
import { LinkService } from '../../../frontServices/LinkService';
import { VisitOptionService } from '../../../services/visitOptionService';
import { VisitOption } from '../../../types/visitOption';

export const VisitOptionContainer = () => {
    const [visitType, setVisitType] = useState<VisitType | null>();
    const [loading, setLoading] = useState(true);
    const frontPage = FrontPageService.getInstance()
    const navigate = useNavigate()
    const links = LinkService.getInstance();
    const [options, setOptions] = useState<VisitOption[]>([]);

    useEffect(() => {
        const fetchType = async () => {
            const type = frontPage.getSelectedVisitType();
            if (type == null) {
                navigate(links.frontOffice.visitTypes);
            }


            //const op = await VisitOptionService.getActiveOptionsByType(type?.id || 0)
            const op = await VisitOptionService.getVisitOptionsByVisitType(type?.id || 0)
            console.log("visit Options :", op)
            setOptions(op)
            setVisitType(type);
            setLoading(false)
        }
        fetchType();
    }, [])

    return (
        <div className='w-100'>
            <div className="mt-2"></div>
            <div className="front-content">

                {options.map((visitOption, index) => (
                    <OptionCard visitOption={visitOption} key={index}></OptionCard>
                ))}


                {loading && <Center>
                    <p>Loading.....</p></Center>}
            </div>
        </div>
    )
}
