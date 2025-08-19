import React, { useEffect, useState } from 'react'
import { DynamicQuestion } from '../../../types/dynamicQuestion'
import { AnswerType } from '../../../types/AnswerType';
import { ButtonAnswer } from '../../../types/buttonAnswer';
import { DisplayQuestionAndAnswer } from './DisplayQuestionAndAnswer';
import { RightAlign } from '../../common/RightAlign';

export interface AnsweringToQuestionProps {
    question: DynamicQuestion;
    setAnswer: (answer: AnswerType) => void;
    incerementCurrentQuestionIndex: () => void;

}

export const AnsweringToQuestion = ({ question, setAnswer, incerementCurrentQuestionIndex }: AnsweringToQuestionProps) => {
    const [selectedButtonAnswers, setSelectedButtonAnswers] = useState<ButtonAnswer[]>([]);
    const [answerField, setAnswerFiled] = useState<string | number>('');
    const [hasAnswer, setHasAnswer] = useState<boolean>(false);

    function addToButtonAnswersArray(button: ButtonAnswer): void {
        if (question.canSelectMoreThanOne) {
            if (selectedButtonAnswers.includes(button)) {
                setSelectedButtonAnswers(selectedButtonAnswers.filter(b => b !== button));
            } else {
                setSelectedButtonAnswers([...selectedButtonAnswers, button]);
            }
        } else {
            if (selectedButtonAnswers.includes(button)) {
                setSelectedButtonAnswers([])
            }
            else {
                setSelectedButtonAnswers([button])
            }
        }
    }

    useEffect(() => {
        if (question.answerType === 'button' && selectedButtonAnswers.length > 0) {
            setHasAnswer(true);
        } else if (question.answerType !== 'button' && answerField) {
            setHasAnswer(true);
        } else {
            setHasAnswer(false);
        }
    }, [answerField, selectedButtonAnswers]);

    const isButtonSelected = (buttonId: number) => {
        return selectedButtonAnswers.some(a => a.id == buttonId)
    }


    const settingFinalAnswer = (): void => {
        console.log("Setting final answer for question: ", question.questionText);
        const finalAnswer = {
            dynamicQuestion: question,
            answerType: question.answerType,
            value: answerField,
            selectedButtonAnswers: selectedButtonAnswers
        };
        setAnswer(finalAnswer!);
        setAnswerFiled('');
        incerementCurrentQuestionIndex()
    }


    return (
        <>
            {question &&

                <>
                    {!question.answer ? <div className="point-answering-input-box">
                        <label className="point-answering-input-label">{question.questionText}:</label>
                        {question.answerType === 'text' && <input value={answerField} onChange={(e) => setAnswerFiled(e.target.value)} type="text" className="point-answering-input-field" />}
                        {question.answerType === 'number' && <input value={answerField} onChange={(e) => setAnswerFiled(e.target.value)} type="number" className="point-answering-input-field" />}

                        {question.answerType === 'button' &&
                            <div className="point-answering-button-group">
                                {question.buttonAnswers?.map((button, index) => (
                                    <button
                                        key={button.id!}
                                        className={`point-answering-button ${isButtonSelected(button.id!) ? "point-answering-button-slected" : ""}`}
                                        onClick={() => addToButtonAnswersArray(button)}
                                    >
                                        {button.buttonText}
                                    </button>
                                ))}
                            </div>}
                        <RightAlign>
                            <div className='flex'>
                                <button onClick={() => incerementCurrentQuestionIndex()} className="point-answering-small-btn m-1">Next Question</button>
                                <button disabled={question.isRequired && !hasAnswer} style={question.isRequired ? { "backgroundColor": "gray !important" } : {}} onClick={() => settingFinalAnswer()} className="point-answering-small-btn">Set Answer</button>

                            </div>
                        </RightAlign>
                    </div>

                        :

                        <div className="answered-Officer-question">
                            <h3 className='m-1'>Question Already Answered </h3>
                            <DisplayQuestionAndAnswer question={question}></DisplayQuestionAndAnswer>
                            <RightAlign>
                                <button onClick={() => incerementCurrentQuestionIndex()} className="point-answering-small-btn m-1">Next Question</button>
                            </RightAlign>
                        </div>
                    }
                </>

            }
        </>

    )
}
