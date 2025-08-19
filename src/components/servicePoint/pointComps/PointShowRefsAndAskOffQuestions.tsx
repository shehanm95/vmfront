import React from 'react'
import { VisitorAnswersSections } from './VisitorAnswersSections';
import { AnsweringToQuestion } from './AnsweringToQuestion';
import { DynamicQuestion } from '../../../types/dynamicQuestion';
import { AnswerType } from '../../../types/AnswerType';

interface PointShowRefsAndAskOffQuestionsProps {
    officerQuestions: DynamicQuestion[];
    setAnswer: (answer: AnswerType) => void;
    dynamicAnswers: AnswerType[];
    incerementCurrentQuestionIndex: () => void;
    currentQuestionIndex: number;
}


export const PointShowRefsAndAskOffQuestions = ({ officerQuestions, setAnswer, dynamicAnswers, incerementCurrentQuestionIndex, currentQuestionIndex }: PointShowRefsAndAskOffQuestionsProps) => {

    console.log("Current question index in PointShowRefsAndAskOffQuestions: ", currentQuestionIndex);
    if (currentQuestionIndex == -1) {
        return <></>
    }

    return (
        <div>
            {officerQuestions.map((officerQuestion, index) => (
                <VisitorAnswersSections
                    key={index}
                    officerQuestion={officerQuestion}
                    dynamicAnswers={dynamicAnswers}
                />
            ))}

            {officerQuestions.length > 0 && (
                <AnsweringToQuestion
                    question={officerQuestions[currentQuestionIndex]}
                    setAnswer={setAnswer}
                    incerementCurrentQuestionIndex={incerementCurrentQuestionIndex}
                />
            )}
        </div>
    )
}
