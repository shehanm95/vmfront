import React from 'react'
import '../../../../../components/common/css/form.css';
import { DynamicQuestion } from '../../../../../types/dynamicQuestion';

type QuestionItemProps = {
    question: DynamicQuestion,
    edit: (question: DynamicQuestion) => void
    toggleActivate: (question: DynamicQuestion) => void
    index: number
}


export const QuestionItem: React.FC<QuestionItemProps> = ({ question, toggleActivate, edit, index }) => {
    return (
        <div className='from-question-item flex between centerV'>
            Question {index + 1}: {question?.questionText}
            <div className='form-button-holder'>
                <button onClick={() => { toggleActivate(question) }}>Activate</button>
                <button onClick={() => { edit(question) }}>Edit</button>
            </div>
        </div>

    )
}
