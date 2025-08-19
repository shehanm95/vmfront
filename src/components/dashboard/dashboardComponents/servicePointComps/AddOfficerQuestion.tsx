
import React, { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { OfficerQuestionSchema } from '../../../../types/OfficerQuestionSchema'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonAnswer } from '../../../../types/buttonAnswer'
import { DynamicQuestion } from '../../../../types/dynamicQuestion'
import { RefQuestionItem } from './RefQuestionItem'
import { PopUpWindow } from '../../../common/PopUpWindow'
import { RefWindow } from './RefWindow'
import { constrainedMemory } from 'process'

type OfficerQuestionSchemaType = z.infer<typeof OfficerQuestionSchema>

export interface AddOfficerQuestionProp {
    append: (question: OfficerQuestionSchemaType) => void;
    dynamicQuestions: DynamicQuestion[]
    referenceDynamicQues: DynamicQuestion[]
    setReferenceDynamicQues: (AddedDynamicQ: DynamicQuestion[]) => void
    close: () => void
}

export const AddOfficerQuestion = ({ close, append, dynamicQuestions, referenceDynamicQues: addedReferenceDynamicQues, setReferenceDynamicQues: setAddedReferenceDynamicQues }: AddOfficerQuestionProp) => {
    const [addingButtonValue, setAddingButtonValue] = useState('')
    const [refWindowOpened, setRefWindowOpened] = useState(false)

    const { handleSubmit, register, control, formState: { errors }, watch, reset } = useForm<OfficerQuestionSchemaType>({
        resolver: zodResolver(OfficerQuestionSchema),
        defaultValues: {
            questionText: '',
            specialInstructions: '',
            isRequired: false,
            answerType: 'text',
            buttonAnswers: [],
            isActive: true,
            //referenceHolder: { referenceQuestions: [] },
            canSelectMoreThanOne: false
        },
    })

    const answerType = watch('answerType')
    const buttonArray = watch('buttonAnswers')
    const { fields: buttonAnserFiled, append: appendButtonAnswer, remove: removeButtonAnswer } = useFieldArray({ control, name: 'buttonAnswers' })

    const onSubmit = (data: any) => {
        data.referenceQuestions = addedReferenceDynamicQues
        data = { ...data, id: undefined }
        console.log(data)
        setAddedReferenceDynamicQues([])
        append(data)
        reset();
        close();
    }

    function addButton() {
        if (addingButtonValue == "") return;
        let sampleButton: ButtonAnswer = {
            buttonText: addingButtonValue
        }
        setAddingButtonValue('')
        appendButtonAnswer(sampleButton);
    }
    function removeFromButtonArray(index: number) {
        removeButtonAnswer(index)
    }


    function removeAddedRefQues(id: number | undefined): void {
        const newAddedRefQue = addedReferenceDynamicQues.filter(d => d.id !== id)
        setAddedReferenceDynamicQues(newAddedRefQue)
    }

    return (
        <div>

            <form onSubmit={handleSubmit(onSubmit)} className="form-content p-5">
                {/* Question */}
                <div className="form-group">
                    <label className="form-label">Question:</label>
                    <input className="form-input" {...register('questionText')} />
                    {errors.questionText && <p className="form-error">{errors.questionText.message}</p>}
                </div>

                {/* Special Instructions */}
                <div className="form-group">
                    <label className="form-label">Special Instructions:</label>
                    <textarea className="form-textarea" {...register('specialInstructions')} />
                    {errors.specialInstructions && <p className="form-error">{errors.specialInstructions.message}</p>}
                </div>

                {/* Required Checkbox */}
                <div className="form-checkbox-group">
                    <label className="form-checkbox-label">
                        <input type="checkbox" {...register('isRequired')} />
                        This is a required question
                    </label>
                </div>

                <div className="form-checkbox-group">
                    <label className="form-checkbox-label">
                        <input type="checkbox" {...register('isActive')} />
                        This is a active question
                    </label>
                </div>

                {/* Answer Type */}
                <div className="form-group">
                    <label className="form-label">Answer Type:</label>
                    <select className="form-select" {...register('answerType')}>
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="button">Button Answers</option>
                    </select>
                </div>

                {/* Button Answers (Conditional) */}
                {answerType === 'button' && (
                    <div className="form-group">
                        <div className="form-checkbox-group">
                            <label className="form-checkbox-label">
                                <input type="checkbox" {...register('canSelectMoreThanOne')} />
                                Visitor can select more then one button answer
                            </label>
                        </div>
                        <label className="form-label">Button Answers:</label>
                        <div className="flex">
                            <input
                                value={addingButtonValue}
                                onChange={(e) => setAddingButtonValue(e.target.value)}
                                className='form-input w-300px me-2' type="text" />
                            <button type="button" className='px-3 radius50 ' onClick={() => addButton()}>
                                +
                            </button>
                        </div>
                        {errors.buttonAnswers && <p className="form-error">{errors.buttonAnswers.message as string}</p>}

                        <div className="flex">
                            {buttonArray?.map((button, index) =>
                                <div key={index} className="sampleButton me-2">
                                    <p className='p-2'>{button.buttonText}</p>
                                    <div onClick={() => removeFromButtonArray(index)} className="sampleClose">
                                        <p>x</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="form-action-buttons">
                    <button type="button" className="form-cancel-button" onClick={close}>
                        Cancel
                    </button>
                    <button type="submit" className="form-save-button">
                        Save
                    </button>
                </div>


                {/* Reference Questions List */}

                {addedReferenceDynamicQues &&
                    <div className='flex cenverV'>
                        <label >Reference Questions :{"  "} </label>
                        <button onClick={() => setRefWindowOpened(true)} type='button' className='outline_button'>Add Reference Quest</button>
                    </div>
                }

                {addedReferenceDynamicQues &&

                    <div>
                        {addedReferenceDynamicQues.length > 0 ? addedReferenceDynamicQues.map((rq, index) =>
                            <RefQuestionItem key={index}
                                question={rq as unknown as DynamicQuestion}
                                remove={() => removeAddedRefQues(rq.id)} index={index}>

                            </RefQuestionItem>
                        ) : <h5 className='center'>No Reference Questions Added</h5>}

                    </div>
                }
                {/* <hr /> */}
                {/* {JSON.stringify(addedReferenceDynamicQues)} */}
                {/* <hr /> */}
                {/* {JSON.stringify(errors)} */}
            </form>

            {refWindowOpened &&
                <PopUpWindow onClose={() => setRefWindowOpened(false)} title={'Add Reference Questions'}>
                    <RefWindow
                        dynamicQuestions={dynamicQuestions}
                        referenceDynamicQues={addedReferenceDynamicQues}
                        setReferenceDynamicQues={setAddedReferenceDynamicQues}
                    >
                    </RefWindow>
                </PopUpWindow>}
        </div >
    )
}
