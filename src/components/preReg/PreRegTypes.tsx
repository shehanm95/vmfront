import React, { useContext, useEffect, useState } from 'react'
import { VisitType } from '../../types/visitType'
import { VisitTypeService } from '../../services/visitTypeSerive'
import { PreRegTypeCard } from './subPreReg/PreRegTypeCard'
import '../../components/frontOfficePage/css/displayVisitTypes.css'
import { useVisit } from '../../context/preRegContext'
import { getCurrentUser } from '../../api/axios'
import { useMyNavigator } from '../customHooks/useMyNavigator'


export const PreRegTypes = () => {
    const [types, setTypes] = useState<VisitType[]>([])
    const { visit, setVisit } = useVisit()
    const { navigate, links } = useMyNavigator()

    useEffect(() => {
        const getPreRegVisits = async () => {
            const ts = await VisitTypeService.getAllPreRegVisitTypes()
            if (ts && ts.length > 0) {
                setTypes(ts);
            } else if (ts && ts.length === 0) {
                console.log("No pre-registration visit types found.")
                navigate(links.profile.base);
            }
        }

        const setVisitor = async () => {
            const v = await getCurrentUser()
            setVisit({ ...visit, visitor: v })
            console.log("visit ", visit)
        }
        setVisitor()

        getPreRegVisits();
    }, [])
    return (
        <div className="front-content">
            {types ? types.map((type) =>
                <PreRegTypeCard key={type.id} vType={type}></PreRegTypeCard>
            ) : <p>No Visit Types To Show....</p>}

        </div>
    )
}
