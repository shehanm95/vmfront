import React, { useEffect } from 'react'
import { DynamicQuestion } from '../../../../types/dynamicQuestion'

export interface RefWindowProf {
    dynamicQuestions: DynamicQuestion[]

    referenceDynamicQues: DynamicQuestion[]
    setReferenceDynamicQues: (AddedDynamicQ: DynamicQuestion[]) => void
}


export const RefWindow = ({ dynamicQuestions, referenceDynamicQues, setReferenceDynamicQues }: RefWindowProf) => {

    useEffect(() => {
        console.log(dynamicQuestions)
        console.log(referenceDynamicQues)
    }, [referenceDynamicQues])


    const isAdded = (id: number): boolean => {
        return referenceDynamicQues.some(rq => rq.id === id)
    }

    function addToSelectedRefList(d: DynamicQuestion): void {
        if (isAdded(d.id!)) return;
        setReferenceDynamicQues([...referenceDynamicQues, d])
    }

    return (
        <div className='p-4'>
            {dynamicQuestions.map(d =>
                <div className='flex justify-content-between mt-2' key={d.id}>
                    <h4>{d.questionText}</h4>
                    {d.id && <button onClick={() => addToSelectedRefList(d)} className='outline_button'>{isAdded(d.id!) ? 'Added' : 'Add'}</button>
                    }
                </div>
            )}
        </div>
    )
}
