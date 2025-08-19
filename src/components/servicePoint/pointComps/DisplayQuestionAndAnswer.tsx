import { DynamicQuestion } from '../../../types/dynamicQuestion'

export const DisplayQuestionAndAnswer = ({ question, showReferences = false }: { question: DynamicQuestion, showReferences?: boolean }) => {
    return (
        <div className="point-answering-question">

            <div className="point-reference-questions">
                {showReferences && (question.referenceQuestions?.length! > 0) && <h3 className='point-title m-2'>Reference Questions</h3>}
                {showReferences && question.referenceQuestions?.map(q => (
                    <DisplayQuestionAndAnswer key={q.id} question={q}></DisplayQuestionAndAnswer>
                ))}
            </div>
            <h3> {question.questionText} ?</h3>
            {question.answer ?
                <>
                    {(question.answer.answerType === 'text' || question.answer.answerType === 'number') &&
                        <p className="point-answering-answer">{question.answer.value}</p>}
                    {question.answer.answerType === 'button' &&
                        <div className="point-answering-button-answers">
                            {question.answer!.selectedButtonAnswers && question.answer.selectedButtonAnswers?.map((buttonAnswer, buttonIndex) => (
                                <span key={buttonIndex} className="point-answering-button">{buttonAnswer.buttonText}</span>
                            ))}
                        </div>
                    }
                </>
                :
                <p className="point-answering-no-answer">No answer provided</p>
            }
        </div>
    )
}
