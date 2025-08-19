import React, { useEffect } from 'react'
import { DynamicQuestion } from '../../../types/dynamicQuestion';
import { AnswerType } from '../../../types/AnswerType';
import { DisplayQuestionAndAnswer } from './DisplayQuestionAndAnswer';

export interface VisitorAnsweringSectionsPorps {
    officerQuestion: DynamicQuestion;
    dynamicAnswers: AnswerType[];
}

export const VisitorAnswersSections = ({ officerQuestion, dynamicAnswers }: VisitorAnsweringSectionsPorps) => {
    const referenceQuestions = officerQuestion.referenceQuestions;

    //take officer question, and dynamic answers,
    // and then access the reference questions of it
    // set the dynamic answer to the questions - if not keep them <P>No answered</P>

    useEffect(() => {
        for (const question of referenceQuestions || []) {
            const answer = dynamicAnswers.find(answer => answer.dynamicQuestion.id === question.id);
            if (answer) {
                question.answer = answer;
            }
        }
    }, []);


    return (
        <div className="point-answering-section">
            <label className="point-answering-section-title">Visitor Request :</label>
            <div className="point-answering-section-content">
                {referenceQuestions && referenceQuestions.length > 0 ? (
                    referenceQuestions.map((question, index) => (
                        <DisplayQuestionAndAnswer
                            key={index}
                            question={question}></DisplayQuestionAndAnswer>
                    ))
                ) : (
                    <p>No reference questions available.</p>
                )}
            </div>
        </div>
    )
}
