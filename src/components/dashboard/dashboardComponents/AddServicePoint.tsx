import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { number, z } from 'zod';
import { ServicePoint } from '../../../types/ServicePoint';
import { ServicePointStatus } from '../../../types/ServicePointStatus';
import { ServicePointService } from '../../../services/ServicePointService';
import '../../common/css/form.css';
import { IconHeader } from '../../common/IconHeader';
import { toast } from 'react-toastify';
import { PopUpWindow } from '../../common/PopUpWindow';
import { AddOfficerDuty } from './servicePointComps/AddOfficerDuty';
import { PersonItem } from './servicePointComps/PersonItem';
import { UserDto } from '../../../types/UserDto';
import { AddOfficerQuestion } from './servicePointComps/AddOfficerQuestion';
import { OfficerQuestionSchema } from '../../../types/OfficerQuestionSchema';
import { DynamicQuestion } from '../../../types/dynamicQuestion';
import { ModeratorService } from '../../../frontServices/moderatorService';
import { DynamicQuestionService } from '../../../services/DyanmicQuestionService';
import { useMyNavigator } from '../../customHooks/useMyNavigator';
import { RightAlign } from '../../common/RightAlign';


const dutySchema = z.object({
    // id: z.number(),
    officer: z.object({ id: z.any() }),
    dutyState: z.enum(['PENDING', 'ACCEPTED', 'DECLINED']),
    AcceptedTime: z.string().optional()
})

export type DutySchemaType = z.infer<typeof dutySchema>

// Define Zod schema for form validation
const servicePointSchema = z.object({
    pointName: z.string().min(1, 'Name is required'),
    location: z.string(),
    pointDescription: z.string().optional(),
    officerInstructions: z.string().optional(),
    visitorInstructions: z.string().optional(),
    isFrontOffice: z.boolean(),
    isHost: z.boolean(),
    servicePointStatus: z.nativeEnum(ServicePointStatus),
    visitOption: z.object({ id: z.number() }),
    duties: z.array(dutySchema),
    officerQuestions: z.array(OfficerQuestionSchema)
});

type ServicePointFormData = z.infer<typeof servicePointSchema>;

export const AddServicePoint = () => {
    const servicePointService = new ServicePointService();
    const visitOption = ModeratorService.getCurrentVisitOption()
    const [dynamicQuestions, setDynamicQuestions] = useState<DynamicQuestion[]>([])
    const [addOfficerQuestion, setAddOfficerQuestion] = useState(false)
    const [addOfficer, setAddOfficer] = useState(false)
    const [addedDynamicRefQustion, setAddedDynamicRefQuestions] = useState<DynamicQuestion[]>([])
    const { navigate, links } = useMyNavigator()

    useEffect(() => {
        const getQ = async () => {
            const dq = await DynamicQuestionService.getQuestionsByVisitOptionId(visitOption?.id!)
            setDynamicQuestions(dq)
        }
        getQ()
    }, [])
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        control
    } = useForm<ServicePointFormData>({
        resolver: zodResolver(servicePointSchema),
        defaultValues: {
            isFrontOffice: false,
            isHost: false,
            servicePointStatus: ServicePointStatus.ACTIVE,
            visitOption: { id: 0 },
            duties: [],
            officerQuestions: []
        }
    });

    const { fields: dutyList, append: appendDuty, remove: removeDuty } = useFieldArray({ control, name: 'duties' });
    const { fields: OffQuestionList, append: appendOffQuestion, remove: removeOffQuestion } = useFieldArray({ control, name: 'officerQuestions' });

    const onSubmit = async (data: ServicePointFormData) => {
        if (data.duties.length === 0) {
            toast.error("you must add duties to a visit")
            return;
        }
        console.log('data', data)
        const newServicePoint: ServicePoint = {
            pointName: data.pointName,
            pointDescription: data.pointDescription || '',
            officerInstructions: data.officerInstructions || '',
            visitorInstructions: data.visitorInstructions || '',
            visitOption: visitOption!,
            duties: data.duties,
            visits: [],
            servicePointStatus: ServicePointStatus.ACTIVE,
            officerQuestions: OffQuestionList,
            specialNotes: [],
            isFrontOffice: data.isFrontOffice,
            isHost: data.isHost,
            location: data.location
        }
        newServicePoint.officerQuestions.map(q => q.id = undefined)
        console.log(newServicePoint)
        try {
            const createdServicePoint = await servicePointService.createServicePoint(newServicePoint);
            console.log(createdServicePoint)
            reset();
            // You might want to redirect or update state here
        } catch (error) {
            toast.error('Failed to create service point');
            console.error('Error creating service point:', error);
        }
    };

    return (
        <div className="form-container">
            <IconHeader icon="fa-sliders-h" title="Service Point" />

            <form onSubmit={handleSubmit(onSubmit)} className="form-content">
                <div className="form-group">
                    <label className="form-label">Service Point Name*</label>
                    <input
                        type="text"
                        className={`form-input ${errors.pointName ? 'error' : ''}`}
                        placeholder="Enter service point name"
                        {...register('pointName')}
                    />
                    {errors.pointName && (
                        <span className="form-error">{errors.pointName.message}</span>
                    )}
                </div>
                <div className="form-group">
                    <label className="form-label">Point Location*</label>
                    <input
                        type="text"
                        className={`form-input ${errors.location ? 'error' : ''}`}
                        placeholder="Enter service point location"
                        {...register('location')}
                    />
                    {errors.location && (
                        <span className="form-error">{errors.location.message}</span>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">
                        <input
                            type="checkbox"
                            {...register('isFrontOffice')}
                        />{" "}
                        Is This A Front Office
                    </label>
                    <label className="form-label">
                        <input
                            type="checkbox"
                            {...register('isHost')}
                        />{" "}
                        Is This A Host
                    </label>
                </div>

                <div className="form-group">
                    <label className="form-label">Service Point Description</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Service point description here"
                        {...register('pointDescription')}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Officer Instructions</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Officer instructions here"
                        {...register('officerInstructions')}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Visitor Instructions</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Visitor instructions here"
                        {...register('visitorInstructions')}
                    />
                </div>

                <hr />
                <div className="form-group">
                    <div>
                        <label className="form-label w-150px">Duty Officers:</label>
                        <button onClick={() => setAddOfficer(true)} type="button" className="vO-add-button">
                            <i className="fas fa-plus-circle"></i> Add Officer
                        </button>
                    </div>
                    <div className="form-subgroup">
                        {/* Officers will be added here */}
                    </div>
                </div>
                {/* Duty Officers Area - To be implemented */}
                {dutyList.length > 0 && <h4 className='mb-4'>Already added officers</h4>}
                {dutyList.length > 0 &&
                    dutyList.map((d, index) =>
                        <div key={index} className='ms-1 flex centerV w-50 justify-content-between'>
                            <PersonItem user={d.officer as UserDto}></PersonItem>
                            <button onClick={() => removeDuty(index)} key={index} className='outline_button'>Remove</button>
                        </div>

                    )}

                <hr />

                {/* Officer Questions Area - To be implemented */}
                <div className="form-group">
                    <div>
                        <label className="form-label">Officer Questions:</label>
                        <button type="button" onClick={() => setAddOfficerQuestion(true)} className="vO-add-button">
                            <i className="fas fa-plus-circle"></i> Add Question
                        </button>
                    </div>
                    <div className="form-subgroup">
                        {OffQuestionList.length > 0 && <h4 className='mb-4'>Already added officers</h4>}
                        {OffQuestionList.length > 0 &&
                            OffQuestionList.map((oQ, index) =>
                                <div key={index} className='ms-1 flex centerV w-50 justify-content-between'>
                                    <h4>{oQ.questionText}</h4>
                                    <button type='button' onClick={() => removeOffQuestion(index)} key={index} className='outline_button'>Remove</button>
                                </div>

                            )}
                    </div>
                </div>

                <div className="form-button-wrapper">

                    <button
                        type="submit"
                        className="form-save-button form-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
            <RightAlign>
                <button onClick={() => navigate(links.moderatorDashboard.goToOptions)} type="button" className="me-2 form-save-button form-button ms-3">
                    Go to Dashboard
                </button>
            </RightAlign>


            {addOfficerQuestion &&
                <PopUpWindow
                    title='Add Officer Question'
                    onClose={() => setAddOfficerQuestion(false)}>
                    <AddOfficerQuestion
                        append={appendOffQuestion}
                        dynamicQuestions={dynamicQuestions}
                        referenceDynamicQues={addedDynamicRefQustion}
                        setReferenceDynamicQues={setAddedDynamicRefQuestions}
                        close={() => setAddOfficerQuestion(false)}>
                    </AddOfficerQuestion>
                </PopUpWindow>
            }

            {addOfficer &&
                <PopUpWindow
                    title='Add Officer Duty'
                    onClose={() => setAddOfficer(false)} >
                    <AddOfficerDuty
                        close={() => setAddOfficer(false)} dutyList={dutyList}
                        appendDuty={appendDuty}
                        removeDuty={removeDuty}>
                    </AddOfficerDuty>
                </PopUpWindow>}

        </div>
    );
};