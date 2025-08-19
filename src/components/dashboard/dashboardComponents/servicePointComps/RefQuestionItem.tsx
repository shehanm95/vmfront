import React from 'react'
import { DynamicQuestion } from '../../../../types/dynamicQuestion'

export interface RefQuestionItemProp {
    question: DynamicQuestion,
    remove: (index: number) => void
    index: number;
}


export const RefQuestionItem = ({ question, remove, index }: RefQuestionItemProp) => {
    return (
        <div className='from-question-item flex between centerV'>
            Question 01: {question?.questionText}
            <div className='form-button-holder'>
                <button className='outline_button' onClick={() => remove(index)}>Remove</button>
            </div>
        </div>
    )
}
