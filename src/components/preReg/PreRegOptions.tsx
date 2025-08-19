import React, { useContext, useEffect, useState } from 'react'
import { VisitType } from '../../types/visitType'
import { VisitTypeService } from '../../services/visitTypeSerive'
import { PreRegTypeCard } from './subPreReg/PreRegTypeCard'
import '../../components/frontOfficePage/css/displayVisitTypes.css'
import { VisitOption } from '../../types/visitOption'
import { VisitOptionService } from '../../services/visitOptionService'
import { useVisit } from '../../context/preRegContext'
import { useNavigate } from 'react-router-dom'
import { LinkService } from '../../frontServices/LinkService'
import { PreRegOptionCard } from './subPreReg/PreRegOptionCard'
export const PreRegOptions = () => {
    const [options, setOptions] = useState<VisitOption[]>([])
    const { visit, setVisit, clearVisit } = useVisit()
    const navigate = useNavigate()
    const links = LinkService.getInstance()

    useEffect(() => {
        const getPreRegVisits = async () => {
            console.log(visit)
            if (visit.visitType && visit.visitType.id) {
                const ops = await VisitOptionService.getAllPreRegActiveOptionsByType(visit.visitType.id)
                setOptions(ops)
            } else {
                console.error("something error in fetching visit options")
                navigate(links.preReg.types)
            }
        }
        getPreRegVisits();
    }, [])
    return (
        <div className="front-content">
            {options ? options.map((option) =>
                <PreRegOptionCard key={option.id} vOption={option} ></PreRegOptionCard>
            ) : <p>No Visit Types To Show....</p>}

        </div>
    )
}
