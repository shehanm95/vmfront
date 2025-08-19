import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import '../../../../components/common/css/form.css';
import { DynamicQuestion } from '../../../../types/dynamicQuestion';
import { ModeratorService } from '../../../../frontServices/moderatorService';
import { VisitOption } from '../../../../types/visitOption';
import { ButtonAnswer } from '../../../../types/buttonAnswer';
import { DynamicQuestionService } from '../../../../services/DyanmicQuestionService';
import { QuestionItem } from './smallComp/QuestionItem';
import { IconHeader } from '../../../common/IconHeader';
import { Center } from '../../../common/Center';
import { RightAlign } from '../../../common/RightAlign';
import { useNavigate } from 'react-router-dom';
import { LinkService } from '../../../../frontServices/LinkService';

// Zod schema

const ButtonAnswerSchema = z.object({
    id: z.number().optional(),
    buttonText: z.string().nonempty('Option text cannot be blank').max(255, 'Option text must not exceed 255 characters'),
});

export const DynamicQuestionSchema = z.object({
    questionText: z.string().nonempty('Question text must not be empty').max(100, 'Max length of a question is 100'),
    specialInstructions: z.string().max(100, 'Max length of special instructions is 100').optional(),
    isRequired: z.boolean(),
    answerType: z.enum(['button', 'number', 'text']),
    buttonAnswers: z.array(ButtonAnswerSchema).optional(),
    isActive: z.boolean(),
    canSelectMoreThanOne: z.boolean(),
}).refine(
    (data) => {
        if (data.answerType === 'button') {
            return data.buttonAnswers && data.buttonAnswers.length > 0;
        }
        return true;
    },
    {
        message: 'A question with answerType "button" must have at least 1 button answer',
        path: ['buttonAnswers'],
    }
);

export type DynamicQuestionForm = z.infer<typeof DynamicQuestionSchema>;

const AddDynamicQuestionForm = () => {
    // const [buttonArray, setButtonArray] = useState<ButtonAnswer[]>([])
    const [addingButtonValue, setAddingButtonValue] = useState("");
    const [currentVisitOption, setCurrentVisitOption] = useState<VisitOption | undefined>(ModeratorService.getCurrentVisitOption());
    const navigate = useNavigate()
    console.log(currentVisitOption);

    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<DynamicQuestionForm>({
        resolver: zodResolver(DynamicQuestionSchema),
        defaultValues: {
            questionText: '',
            specialInstructions: '',
            isRequired: false,
            answerType: 'text',
            buttonAnswers: [],
            canSelectMoreThanOne: false

        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'buttonAnswers'
    });

    const answerType = watch('answerType');

    useEffect(() => {
        if (answerType !== 'button') {
            // Reset button answers if not "button" type
            reset((prev) => ({
                ...prev,
                buttonAnswers: [],
            }));
        }
    }, [answerType, reset]);

    const buttonArray = watch('buttonAnswers')



    const onSubmit = async (data: DynamicQuestionForm) => {
        try {
            const vo = ModeratorService.currentVisitOption;
            if (!vo) {
                console.error("visit option cannot be null when saving a dynamic question");
                return;
            }

            const newQuestion: DynamicQuestion = {
                ...data,
                visitOption: vo,
                referenceQuestions: []
            };

            // Save to server
            const savedQ = await DynamicQuestionService.createQuestion(newQuestion);

            // Update local state
            if (currentVisitOption) {
                const updatedVisitOption: VisitOption = {
                    ...currentVisitOption,
                    dynamicQuestions: [...currentVisitOption.dynamicQuestions, savedQ],
                };
                setCurrentVisitOption(updatedVisitOption);
            }

            // Proper reset with default values
            reset({
                questionText: '',
                specialInstructions: '',
                isRequired: false,
                answerType: 'text',
                buttonAnswers: [],
                isActive: true, // Assuming you want this default
                canSelectMoreThanOne: false
            });

            // Also clear the local button input
            setAddingButtonValue('');

        } catch (error) {
            console.error("Error saving question:", error);
        }
    };

    const onCancel = () => {
        reset();
    };

    const edit = (question: DynamicQuestion) => {
        // Future: Load data into form for editing
    };

    function addButton() {
        let sampleButton: ButtonAnswer = {
            buttonText: addingButtonValue
        }
        setAddingButtonValue('')
        append(sampleButton);
    }
    function removeFromButtonArray(index: number) {
        remove(index)
    }


    function toggleActivate(question: DynamicQuestion): void {
        throw new Error('Function not implemented.');
    }

    function goToServicePoint(): void {
        navigate(LinkService.getInstance().moderatorDashboard.addServicePoint)
    }

    return (
        <div className="form-container">
            <IconHeader icon="fa-sliders-h" title="Add Dynamic Questions" />
            <h3>If any dynamic questions to ask</h3>

            <div className="form-question-header">
                {currentVisitOption?.description && currentVisitOption?.dynamicQuestions.length ? (
                    currentVisitOption.dynamicQuestions.map((q, index) => (
                        <QuestionItem key={q.id} index={index} question={q} edit={edit} toggleActivate={toggleActivate} />
                    ))
                ) : (
                    <Center>
                        <p className="from-question-item">No questions to show</p>
                    </Center>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="form-content">
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
                    <button type="button" className="form-cancel-button" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="form-save-button">
                        Save
                    </button>
                </div>

                {/* Add New Dynamic Question Button */}
            </form>
            <hr className='mt-5' />
            <RightAlign>
                <button onClick={goToServicePoint} type="button" className="form-save-button mt-5">
                    Next : Add service point
                </button>
            </RightAlign>
        </div>
    );
};

export default AddDynamicQuestionForm;
