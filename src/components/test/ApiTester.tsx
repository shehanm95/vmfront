import React, { useEffect, useState } from 'react'
import { VisitService } from '../../services/visitService';

export const ApiTester = () => {
    const [person, setPerson] = useState<{ A: number }>({ A: 20 });

    useEffect(() => {
        const getPerson = async () => {
            const newp = await VisitService.samplePerson()
            console.log(newp)
            setPerson(newp)
        }
        getPerson();
    }, []);
    return (
        <div><h1>ApiTester</h1>

            <p>{person.A}</p>

        </div>

    )
}
