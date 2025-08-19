// import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
// import { z } from 'zod';
// import { useForm, SubmitHandler, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import '../../../../components/common/css/form.css';
// import { VisitOption } from '../../../../types/visitOption';
// import { VisitOptionService } from '../../../../services/visitOptionService';
// import { getTypeDetails, TypeDtails } from '../../../../services/typeKeeper';
// import { useNavigate } from 'react-router-dom';
// import { IconHeader } from '../../../common/IconHeader';
// import { ModeratorService } from '../../../../frontServices/moderatorService';
// import { LinkService } from '../../../../frontServices/LinkService';
// import { DynamicQuestionSchema } from './AddDynamicQuestion';
// import { TimeRange } from '../../../../types/TimeRange';
// import { TimeRangeAdder } from '../../../test/TimeRangeAdder';
// import { SpecificDateAdder } from './smallComp/SpecificDateAdder';
// import { useFieldArray } from 'react-hook-form';

// // Define TimeRange schema separately for reuse
// const TimeRangeSchema = z.object({
//     startTime: z.string().min(1, 'Start time is required'),
//     endTime: z.string().min(1, 'End time is required'),
// });

// const SpecificDateSchema = z.object({
//     date: z.string()
// })

// // Create a standalone function for time range validation
// const validateTimeRanges = (ranges: { startTime: string; endTime: string }[], averageTime: number) => {
//     const timeToMinutes = (time: string) => {
//         if (!time) return 0;
//         const [hours, minutes] = time.split(':').map(Number);
//         return hours * 60 + minutes;
//     };

//     // Check each range's validity
//     for (const range of ranges) {
//         const start = timeToMinutes(range.startTime);
//         const end = timeToMinutes(range.endTime);

//         if (end <= start) {
//             return 'End time must be after start time';
//         }

//         if ((end - start) < averageTime) {
//             return `Duration must be at least ${averageTime} minutes`;
//         }
//     }

//     // Check for overlaps
//     for (let i = 0; i < ranges.length; i++) {
//         const current = ranges[i];
//         const start1 = timeToMinutes(current.startTime);
//         const end1 = timeToMinutes(current.endTime);

//         for (let j = i + 1; j < ranges.length; j++) {
//             const other = ranges[j];
//             const start2 = timeToMinutes(other.startTime);
//             const end2 = timeToMinutes(other.endTime);

//             if ((start1 < end2 && end1 > start2)) {
//                 return 'Time ranges must not overlap';
//             }
//         }
//     }

//     return true;
// };

// const VisitOptionSchema = z.object({
//     name: z.string().min(1, 'Visitor option name is required'),
//     description: z.string().min(1, 'Description is required'),
//     visitTypeId: z.number().min(1, 'Please select a visitor type'),
//     isPreRegistration: z.boolean(),
//     visitDateType: z.enum(["SPECIFIC_DATES", "ALL_WORKING_DATES"]),
//     specificDates: z.array(SpecificDateSchema),
//     averageTimeForAPerson: z.number().min(1, 'Must be at least 1 minute'),
//     visitorsPerRow: z.number().min(1, 'Must allow at least 1 per row'),
//     active: z.boolean(),
//     dynamicQuestions: z.array(DynamicQuestionSchema).optional(),
//     maxVisitors: z.number().min(1, 'Must allow at least 1 visitor'),
//     timeRanges: z.array(TimeRangeSchema)
//         .min(1, 'At least one time range is required')
//         .superRefine((ranges, ctx) => {
//             // Proper way to access parent data in Zod
//             const averageTime = ctx.addIssue === undefined
//                 ? 0 // Fallback value if context doesn't have parent
//                 : (ctx as any).parent?.averageTimeForAPerson as number;

//             const validationResult = validateTimeRanges(ranges, averageTime);

//             if (validationResult !== true) {
//                 ctx.addIssue({
//                     code: z.ZodIssueCode.custom,
//                     message: validationResult,
//                 });
//             }
//         }),
//     collectDetails: z.object({
//         email: z.boolean(),
//         whatsapp: z.boolean(),
//         visitorPhoto: z.boolean(),
//         photoOptional: z.boolean(),
//     }),
// }).superRefine((data, ctx) => {
//     if (data.visitDateType == "SPECIFIC_DATES" && data.specificDates.length == 0) {
//         ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             path: ["specificDates"],
//             message: "Please add specific dates to visit",
//         });

//     }
// });

// type VisitOptionForm = z.infer<typeof VisitOptionSchema>;

// export const CreateVisitOption = () => {
//     const fileInputRef = useRef<HTMLInputElement | null>(null);
//     const [imageFile, setImageFile] = useState<File | null>(null);
//     const [imagePreview, setImagePreview] = useState<string | null>(null);
//     const [generalError, setGeneralError] = useState<string | null>(null);
//     const [isSpecific, setIsSpecific] = useState(false)

//     const navigate = useNavigate();
//     const details: TypeDtails = getTypeDetails();



//     const {
//         register,
//         handleSubmit,
//         formState: { errors, isSubmitting },
//         setValue,
//         watch,
//         trigger,
//         control
//     } = useForm<VisitOptionForm>({
//         resolver: zodResolver(VisitOptionSchema),
//         defaultValues: {
//             name: '',
//             description: '',
//             visitTypeId: details.currentVisitType?.id,
//             isPreRegistration: false,
//             specificDates: [],
//             maxVisitors: 1,
//             averageTimeForAPerson: 30,
//             visitorsPerRow: 1,
//             active: true,
//             visitDateType: 'ALL_WORKING_DATES',
//             timeRanges: [{ startTime: '', endTime: '' }],
//             collectDetails: { email: false, whatsapp: false, visitorPhoto: false, photoOptional: false },
//             dynamicQuestions: []
//         },
//     });

//     const timeRanges = watch('timeRanges');
//     const watchVisitDateType = watch('visitDateType');
//     const isPreRegistration = watch('isPreRegistration');
//     const averageTimeForAPerson = watch('averageTimeForAPerson');



//     useEffect(() => {
//         if (details.currentVisitType == null) {
//             navigate('/moderatorDashboard/visitOptions');
//         }
//     }, [details, navigate]);

//     useEffect(() => {
//         trigger('timeRanges');
//     }, [averageTimeForAPerson, trigger]);

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setImageFile(file);
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImagePreview(reader.result as string);
//             };
//             reader.readAsDataURL(file);
//         } else {
//             setImageFile(null);
//             setImagePreview(null);
//         }
//     };

//     const triggerFileInput = () => {
//         fileInputRef.current?.click();
//     };

//     const handleTimeRangesChange = (ranges: { startTime: string; endTime: string }[]) => {
//         setValue('timeRanges', ranges);
//         trigger('timeRanges');
//     };

//     const onSubmit: SubmitHandler<VisitOptionForm> = async (data) => {
//         console.log("Submitted active", data.active); // this active field is always false, why
//         try {
//             const newVisitOption: VisitOption = {
//                 visitOptionName: data.name,
//                 description: data.description,
//                 visitType: details.currentVisitType,
//                 isPreRegistration: data.isPreRegistration,
//                 imageName: imageFile ? imageFile.name : undefined,
//                 isPhotoRequired: data.collectDetails.visitorPhoto,
//                 isPhotoOptional: data.collectDetails.photoOptional,
//                 isPhoneNumberRequired: data.collectDetails.whatsapp,
//                 isEmailRequired: data.collectDetails.email,
//                 dynamicQuestions: [],
//                 specificDates: data.specificDates,
//                 averageTimeForAPerson: data.averageTimeForAPerson,
//                 visitorsPerRow: data.visitorsPerRow,
//                 active: data.active,
//                 visitRows: [],
//                 timeRanges: data.timeRanges.map((range) => ({
//                     startTime: range.startTime,
//                     endTime: range.endTime
//                 } as TimeRange))
//             };

//             console.log(newVisitOption)

//             const savedVisitOption = await VisitOptionService.createVisitOption(newVisitOption, imageFile || undefined);
//             ModeratorService.setCurrentVisitOption(savedVisitOption);
//             navigate(LinkService.getInstance().moderatorDashboard.addDynamicQuestion);
//         } catch (error) {
//             console.error('Error saving visitor option:', error);
//             setGeneralError('Failed to save visitor option. Please try again.');
//         }
//     };

//     // Helper function to handle error message display
//     const getErrorMessage = (error: unknown): string => {
//         if (typeof error === 'string') return error;
//         if (error && typeof error === 'object' && 'message' in error) {
//             return String(error.message);
//         }
//         return 'Invalid value';
//     };

//     function toggleSpecific(event: ChangeEvent<HTMLSelectElement>): void {
//         if (event.target.value == 'SPECIFIC_DATES') {
//             setIsSpecific(true);
//         } else {
//             setIsSpecific(false);
//         }
//     }

//     const { fields, append, remove } = useFieldArray({ control, name: 'specificDates' })


//     return (
//         <div className="form-container">
//             <IconHeader icon="fa-sliders-h" title="Create Visit Options" />

//             <form onSubmit={handleSubmit(onSubmit)} className="form-content">
//                 {generalError && <span className="form-error-text">{generalError}</span>}

//                 <div className="form-group">
//                     <label className="form-label">Visitor Option Name :</label>
//                     <input
//                         type="text"
//                         className="form-input"
//                         placeholder="Visitor Option Name"
//                         {...register('name')}
//                     />
//                     {errors.name && <span className="form-error-text">{errors.name.message}</span>}
//                 </div>

//                 <div className="form-group">
//                     <label className="form-label">Cover Image :</label>
//                     <input
//                         type="file"
//                         accept="image/*"
//                         ref={fileInputRef}
//                         onChange={handleImageChange}
//                         style={{ display: 'none' }}
//                     />
//                     <button type="button" onClick={triggerFileInput} className="form-button">
//                         Choose Image
//                     </button>
//                     {imagePreview && <img src={imagePreview} alt="Preview" className="form-image" />}
//                 </div>

//                 <div className="form-group">
//                     <label className="form-label">Visitor Option Description :</label>
//                     <textarea
//                         className="form-textarea"
//                         placeholder="Describe the visitor option here"
//                         {...register('description')}
//                     ></textarea>
//                     {errors.description && <span className="form-error-text">{errors.description.message}</span>}
//                 </div>

//                 <div className="form-group">
//                     <label className="form-label">Visit Type :</label>
//                     <select
//                         className="form-select"
//                         {...register('visitTypeId', { valueAsNumber: true })}
//                     >
//                         <option value="">Select Visitor Type</option>
//                         {details.vistTypes.map((type) => (
//                             <option key={type.id} value={type.id}>
//                                 {type.visitTypeName}
//                             </option>
//                         ))}
//                     </select>
//                     {errors.visitTypeId && <span className="form-error-text">{errors.visitTypeId.message}</span>}
//                 </div>

//                 <div className="form-group">
//                     <label className="form-label">Average minutes per visitor:</label>
//                     <input
//                         type="number"
//                         className="form-input"
//                         placeholder="Minutes per visitor"
//                         {...register('averageTimeForAPerson', {
//                             valueAsNumber: true,
//                         })}
//                     />
//                     {errors.averageTimeForAPerson && (
//                         <span className="form-error-text">{errors.averageTimeForAPerson.message}</span>
//                     )}
//                 </div>

//                 <div className="form-group">
//                     <label className="form-label">Visitors At Once :</label>
//                     <input
//                         type="number"
//                         className="form-input"
//                         placeholder="Visitors per row"
//                         {...register('visitorsPerRow', {
//                             valueAsNumber: true,
//                         })}
//                     />
//                     {errors.visitorsPerRow && <span className="form-error-text">{errors.visitorsPerRow.message}</span>}
//                 </div>

//                 <div className="form-group">
//                     <label className="form-label">Available Time Ranges:</label>
//                     <TimeRangeAdder
//                         ranges={timeRanges}
//                         onChange={handleTimeRangesChange}
//                         minDuration={averageTimeForAPerson}
//                     />
//                     {errors.timeRanges && (
//                         <span className="form-error-text">{getErrorMessage(errors.timeRanges)}</span>
//                     )}
//                 </div>

//                 <div className="form-group">
//                     <label className="form-label">
//                         <input
//                             type="checkbox"
//                             {...register('active')}
//                             defaultChecked={true}
//                         />
//                         Active
//                     </label>
//                 </div>

//                 <div className="form-group">
//                     <label className="form-label">
//                         <input
//                             type="checkbox"
//                             {...register('isPreRegistration')}
//                         />
//                         Enable Pre-Registration
//                     </label>

//                     {isPreRegistration && (
//                         <div id="preregObj" className="form-group">
//                             <div className="form-subgroup">
//                                 <label className="form-sublabel">Pre Registration Visit Date Time :</label>
//                                 <div className="form-time-inputs">
//                                     <select className="formt-visitDateType" {...register('visitDateType')}>
//                                         <option value={"ALL_WORKING_DATES"}>All working Dates</option>
//                                         <option value={"SPECIFIC_DATES"}>Specific Dates</option>
//                                     </select>
//                                 </div>


//                             </div>
//                             {watchVisitDateType === "SPECIFIC_DATES" &&
//                                 <div className="form-subgroup">
//                                     <h3 >Set Specific Visit Dates :</h3>
//                                     <SpecificDateAdder finalDates={fields} append={append} remove={remove} ></SpecificDateAdder>

//                                     {errors.visitDateType && (
//                                         <span className="form-error-text">{errors.visitDateType.message}</span>
//                                     )}
//                                 </div>}
//                         </div>
//                     )}
//                 </div>

//                 <div className="form-group">
//                     <label className="form-label">About Collecting Basic Visitor Details :</label>
//                     <div className="form-checkbox-group">
//                         <label className="form-checkbox-label">
//                             <input
//                                 type="checkbox"
//                                 {...register('collectDetails.email')}
//                             />
//                             Email required
//                         </label>
//                         <label className="form-checkbox-label">
//                             <input
//                                 type="checkbox"
//                                 {...register('collectDetails.whatsapp')}
//                             />
//                             WhatsApp number required
//                         </label>
//                         <label className="form-checkbox-label">
//                             <input
//                                 type="checkbox"
//                                 {...register('collectDetails.visitorPhoto')}
//                             />
//                             Must take visitor photo
//                         </label>
//                         <label className="form-checkbox-label">
//                             <input
//                                 type="checkbox"
//                                 {...register('collectDetails.photoOptional')}
//                             />
//                             Photo optional
//                         </label>
//                     </div>
//                 </div>

//                 <div className="form-button-wrapper">
//                     <button
//                         type="submit"
//                         className="form-save-button"
//                         disabled={isSubmitting}
//                     >
//                         {isSubmitting ? 'Saving...' : 'Save'}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };


import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useForm, SubmitHandler, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import '../../../../components/common/css/form.css';
import { VisitOption } from '../../../../types/visitOption';
import { VisitOptionService } from '../../../../services/visitOptionService';
import { getTypeDetails, TypeDtails } from '../../../../services/typeKeeper';
import { useNavigate } from 'react-router-dom';
import { IconHeader } from '../../../common/IconHeader';
import { ModeratorService } from '../../../../frontServices/moderatorService';
import { LinkService } from '../../../../frontServices/LinkService';
import { DynamicQuestionSchema } from './AddDynamicQuestion';
import { TimeRangeAdder } from '../../../test/TimeRangeAdder';
import { SpecificDateAdder } from './smallComp/SpecificDateAdder';

// ---------- Schemas ----------
const TimeRangeSchema = z.object({
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
});

const SpecificDateSchema = z.object({
    date: z.string(),
});

const validateTimeRanges = (
    ranges: { startTime: string; endTime: string }[],
    averageTime: number
) => {
    const timeToMinutes = (time: string) => {
        if (!time) return 0;
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    for (const range of ranges) {
        const start = timeToMinutes(range.startTime);
        const end = timeToMinutes(range.endTime);

        if (end <= start) {
            return 'End time must be after start time';
        }
        if (end - start < averageTime) {
            return `Duration must be at least ${averageTime} minutes`;
        }
    }

    // Overlap check
    for (let i = 0; i < ranges.length; i++) {
        const start1 = timeToMinutes(ranges[i].startTime);
        const end1 = timeToMinutes(ranges[i].endTime);
        for (let j = i + 1; j < ranges.length; j++) {
            const start2 = timeToMinutes(ranges[j].startTime);
            const end2 = timeToMinutes(ranges[j].endTime);
            if (start1 < end2 && end1 > start2) {
                return 'Time ranges must not overlap';
            }
        }
    }
    return true;
};

const VisitOptionSchema = z
    .object({
        name: z.string().min(1, 'Visitor option name is required'),
        description: z.string().optional(),
        visitTypeId: z.number().min(1, 'Please select a visitor type'),
        isPreRegistration: z.boolean(),
        visitDateType: z.enum(['SPECIFIC_DATES', 'ALL_WORKING_DATES']),
        specificDates: z.array(SpecificDateSchema),
        averageTimeForAPerson: z.number().min(1, 'Must be at least 1 minute'),
        visitorsPerRow: z.number().min(1, 'Must allow at least 1 per row'),
        active: z.boolean(),
        dynamicQuestions: z.array(DynamicQuestionSchema).optional(),
        maxVisitors: z.number().min(1, 'Must allow at least 1 visitor'),
        timeRanges: z
            .array(TimeRangeSchema)
            .min(1, 'At least one time range is required')
            .superRefine((ranges, ctx) => {
                const averageTime =
                    (ctx as any).parent?.averageTimeForAPerson ?? 0;
                const validationResult = validateTimeRanges(ranges, averageTime);
                if (validationResult !== true) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: validationResult,
                    });
                }
            }),
        collectDetails: z.object({
            email: z.boolean(),
            whatsapp: z.boolean(),
            visitorPhoto: z.boolean(),
            photoOptional: z.boolean(),
        }),
    })
    .superRefine((data, ctx) => {
        if (data.visitDateType === 'SPECIFIC_DATES' && data.specificDates.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['specificDates'],
                message: 'Please add specific dates to visit',
            });
        }
    });

type VisitOptionForm = z.infer<typeof VisitOptionSchema>;

// ---------- Component ----------
export const CreateVisitOption = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [generalError, setGeneralError] = useState<string | null>(null);

    const navigate = useNavigate();
    const details: TypeDtails = getTypeDetails();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        trigger,
        control,
    } = useForm<VisitOptionForm>({
        resolver: zodResolver(VisitOptionSchema),
        defaultValues: {
            name: '',
            description: '',
            visitTypeId: details.currentVisitType?.id,
            isPreRegistration: false,
            specificDates: [],
            maxVisitors: 1,
            averageTimeForAPerson: 30,
            visitorsPerRow: 1,
            active: true, // ✅ default active true
            visitDateType: 'ALL_WORKING_DATES',
            timeRanges: [{ startTime: '', endTime: '' }],
            collectDetails: {
                email: false,
                whatsapp: false,
                visitorPhoto: false,
                photoOptional: false,
            },
            dynamicQuestions: [],
        },
    });

    const timeRanges = watch('timeRanges');
    const watchVisitDateType = watch('visitDateType');
    const isPreRegistration = watch('isPreRegistration');
    const averageTimeForAPerson = watch('averageTimeForAPerson');

    useEffect(() => {
        if (details.currentVisitType == null) {
            navigate('/moderatorDashboard/visitOptions');
        }
    }, [details, navigate]);

    useEffect(() => {
        trigger('timeRanges');
    }, [averageTimeForAPerson, trigger]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImagePreview(null);
        }
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    const handleTimeRangesChange = (ranges: { startTime: string; endTime: string }[]) => {
        setValue('timeRanges', ranges);
        trigger('timeRanges');
    };

    const onSubmit: SubmitHandler<VisitOptionForm> = async (data) => {
        console.log('Submitted active', data.active); // ✅ will now be correct
        try {
            const newVisitOption: VisitOption = {
                visitOptionName: data.name,
                description: data.description,
                visitType: details.currentVisitType,
                isPreRegistration: data.isPreRegistration,
                imageName: imageFile ? imageFile.name : undefined,
                isPhotoRequired: data.collectDetails.visitorPhoto,
                isPhotoOptional: data.collectDetails.photoOptional,
                isPhoneNumberRequired: data.collectDetails.whatsapp,
                isEmailRequired: data.collectDetails.email,
                dynamicQuestions: [],
                specificDates: data.specificDates,
                averageTimeForAPerson: data.averageTimeForAPerson,
                visitorsPerRow: data.visitorsPerRow,
                active: data.active,
                visitRows: [],
                timeRanges: data.timeRanges.map((range) => ({
                    startTime: range.startTime,
                    endTime: range.endTime,
                })),
            };

            console.log(newVisitOption);

            const savedVisitOption = await VisitOptionService.createVisitOption(
                newVisitOption,
                imageFile || undefined
            );
            ModeratorService.setCurrentVisitOption(savedVisitOption);
            navigate(LinkService.getInstance().moderatorDashboard.addDynamicQuestion);
        } catch (error) {
            console.error('Error saving visitor option:', error);
            setGeneralError('Failed to save visitor option. Please try again.');
        }
    };

    const getErrorMessage = (error: unknown): string => {
        if (typeof error === 'string') return error;
        if (error && typeof error === 'object' && 'message' in error) {
            return String((error as any).message);
        }
        return 'Invalid value';
    };

    const { fields, append, remove } = useFieldArray({ control, name: 'specificDates' });

    return (
        <div className="form-container">
            <IconHeader icon="fa-sliders-h" title="Create Visit Options" />

            <form onSubmit={handleSubmit(onSubmit)} className="form-content">
                {generalError && <span className="form-error-text">{generalError}</span>}

                {/* Visitor Option Name */}
                <div className="form-group">
                    <label className="form-label">Visitor Option Name :</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Visitor Option Name"
                        {...register('name')}
                    />
                    {errors.name && <span className="form-error-text">{errors.name.message}</span>}
                </div>

                {/* Cover Image */}
                <div className="form-group">
                    <label className="form-label">Cover Image :</label>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                    <button type="button" onClick={triggerFileInput} className="form-button">
                        Choose Image
                    </button>
                    {imagePreview && <img src={imagePreview} alt="Preview" className="form-image" />}
                </div>

                {/* Description */}
                <div className="form-group">
                    <label className="form-label">Visitor Option Description :</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Describe the visitor option here"
                        {...register('description')}
                    ></textarea>
                    {errors.description && (
                        <span className="form-error-text">{errors.description.message}</span>
                    )}
                </div>

                {/* Visit Type */}
                <div className="form-group">
                    <label className="form-label">Visit Type :</label>
                    <select
                        className="form-select"
                        {...register('visitTypeId', { valueAsNumber: true })}
                    >
                        <option value="">Select Visitor Type</option>
                        {details.vistTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.visitTypeName}
                            </option>
                        ))}
                    </select>
                    {errors.visitTypeId && (
                        <span className="form-error-text">{errors.visitTypeId.message}</span>
                    )}
                </div>

                {/* Average minutes per visitor */}
                <div className="form-group">
                    <label className="form-label">Average minutes per visitor:</label>
                    <input
                        type="number"
                        className="form-input"
                        placeholder="Minutes per visitor"
                        {...register('averageTimeForAPerson', { valueAsNumber: true })}
                    />
                    {errors.averageTimeForAPerson && (
                        <span className="form-error-text">
                            {errors.averageTimeForAPerson.message}
                        </span>
                    )}
                </div>

                {/* Visitors per row */}
                <div className="form-group">
                    <label className="form-label">Visitors At Once :</label>
                    <input
                        type="number"
                        className="form-input"
                        placeholder="Visitors per row"
                        {...register('visitorsPerRow', { valueAsNumber: true })}
                    />
                    {errors.visitorsPerRow && (
                        <span className="form-error-text">{errors.visitorsPerRow.message}</span>
                    )}
                </div>

                {/* Time Ranges */}
                <div className="form-group">
                    <label className="form-label">Available Time Ranges:</label>
                    <TimeRangeAdder
                        ranges={timeRanges}
                        onChange={handleTimeRangesChange}
                        minDuration={averageTimeForAPerson}
                    />
                    {errors.timeRanges && (
                        <span className="form-error-text">{getErrorMessage(errors.timeRanges)}</span>
                    )}
                </div>

                {/* ✅ Active Checkbox (Controller) */}
                <div className="form-group">
                    <label className="form-label">
                        <Controller
                            name="active"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                />
                            )}
                        />
                        Active
                    </label>
                </div>

                {/* Pre-registration */}
                <div className="form-group">
                    <label className="form-label">
                        <input type="checkbox" {...register('isPreRegistration')} />
                        Enable Pre-Registration
                    </label>

                    {isPreRegistration && (
                        <div id="preregObj" className="form-group">
                            <div className="form-subgroup">
                                <label className="form-sublabel">Pre Registration Visit Date Time :</label>
                                <div className="form-time-inputs">
                                    <select className="formt-visitDateType" {...register('visitDateType')}>

                                        <option value="ALL_WORKING_DATES">All Working Dates</option>
                                        <option value="SPECIFIC_DATES">Specific Dates</option>
                                    </select>
                                </div>
                            </div>

                            {watchVisitDateType === 'SPECIFIC_DATES' && (
                                <div className="form-subgroup">
                                    <h3>Set Specific Visit Dates :</h3>
                                    <SpecificDateAdder finalDates={fields} append={append} remove={remove} />
                                    {errors.visitDateType && (
                                        <span className="form-error-text">{errors.visitDateType.message}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {errors.specificDates && (
                    <span className="form-error-text">{errors.specificDates.message}</span>
                )}
                {/* Collect details */}
                <div className="form-group">
                    <label className="form-label">About Collecting Basic Visitor Details :</label>
                    <div className="form-checkbox-group">
                        <label className="form-checkbox-label">
                            <input type="checkbox" {...register('collectDetails.email')} />
                            Email required
                        </label>
                        <label className="form-checkbox-label">
                            <input type="checkbox" {...register('collectDetails.whatsapp')} />
                            WhatsApp number required
                        </label>
                        <label className="form-checkbox-label">
                            <input type="checkbox" {...register('collectDetails.visitorPhoto')} />
                            Must take visitor photo
                        </label>
                        <label className="form-checkbox-label">
                            <input type="checkbox" {...register('collectDetails.photoOptional')} />
                            Photo optional
                        </label>
                    </div>
                </div>

                {/* Save Button */}
                <div className="form-button-wrapper">
                    <button type="submit" className="form-save-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};
