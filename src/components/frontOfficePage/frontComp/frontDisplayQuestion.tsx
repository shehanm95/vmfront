import React from 'react';
import { useDynamicQuestions } from '../../customHooks/useDynamicQuestions';
import { FrontPageService } from '../../../frontServices/FrontPageSerivce';
import { LinkService } from '../../../frontServices/LinkService';
import { RightAlign } from '../../common/RightAlign';
import { DynamicQuestionService } from '../../../services/DyanmicQuestionService';
import './css/displayQuestion.css'

const FrontDisplayQuestion: React.FC = () => {
    const frontservice = FrontPageService.getInstance();
    const linkService = LinkService.getInstance();

    const {
        answers,
        currentIndex,
        haveAnswer,
        fieldValue,
        currentQuestion,
        setFieldValue,
        handleInputChange,
        handleButtonClick,
        handleNext,
        questions
    } = useDynamicQuestions({
        getQuestions: async () => {
            const option = frontservice.getSelectedVisitOption();
            const id = option?.id || 0;
            return await DynamicQuestionService.getQuestionsByVisitOptionId(id);
        },
        completeNavigationLink: linkService.frontOffice.takePhoto,
        onComplete: (answers) => {
            frontservice.setCurrentDynamicAnswers(answers);
        }
    });

    if (!currentQuestion) return <div>Loading...</div>;

    return (
        <div className='flex center column w-100'>
            <p className='m-3'>Question {currentIndex + 1} of {questions.length}</p>
            <h2>{currentQuestion.questionText}</h2>
            <div className="mt-3"></div>

            {currentQuestion.answerType === 'text' && (
                <input
                    className='f-form-input w-100 text-center'
                    value={fieldValue}
                    type="text"
                    onChange={e => handleInputChange(e.target.value)}
                />
            )}

            {currentQuestion.answerType === 'number' && (
                <input
                    className='f-form-input w-100 text-center'
                    type="number"
                    value={fieldValue}
                    onChange={e => handleInputChange(Number(e.target.value))}
                />
            )}

            {currentQuestion.answerType === 'button' && (
                <div>
                    {currentQuestion.buttonAnswers?.map(btn => {
                        const selected = answers
                            .find(a => a.dynamicQuestion.id === currentQuestion.id)
                            ?.selectedButtonAnswers?.some(b => b.id === btn.id);

                        return (
                            <button
                                key={btn.id}
                                className={`answer-button ${selected ? 'answer-button-selected' : ''}`}
                                onClick={() => handleButtonClick(btn)}
                            >
                                {btn.buttonText}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="m-5"></div>
            <div className="w-100 mt-5">
                <RightAlign>
                    <button
                        disabled={currentQuestion.isRequired && !haveAnswer}
                        className='front-Button'
                        onClick={handleNext}
                    >
                        {currentIndex < questions.length - 1 ? 'Next' : 'Finish'}
                    </button>
                </RightAlign>
            </div>
        </div>
    );
};

export default FrontDisplayQuestion;