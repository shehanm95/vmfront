import z, { number } from 'zod'

const ButtonAnswerSchema = z.object({
    id: z.number().optional(),
    buttonText: z.string().nonempty('Option text cannot be blank').max(255, 'Option text must not exceed 255 characters'),
});

export const OfficerQuestionSchema = z.object({
    questionText: z.string().nonempty('Question text must not be empty').max(100, 'Max length of a question is 100'),
    specialInstructions: z.string().max(100, 'Max length of special instructions is 100').optional(),
    isRequired: z.boolean(),
    answerType: z.enum(['button', 'number', 'text']),
    buttonAnswers: z.array(ButtonAnswerSchema).optional(),
    isActive: z.boolean(),
    //  referenceHolder: z.object({ referenceQuestions: z.array(z.any()) }).optional(),
    canSelectMoreThanOne: z.boolean(),

}).superRefine((data, ctx) => {
    if (data.answerType === 'button') {
        if (!data.buttonAnswers || data.buttonAnswers.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'A question with answerType "button" must have at least 1 button answer',
                path: ['buttonAnswers'],
            });
        }
    }
})



// .refine(
//     (data) => {
//         if (data.answerType === 'button') {
//             return data.buttonAnswers && data.buttonAnswers.length > 0;
//         }
//         return true;
//     },
//     {
//         message: 'A question with answerType "button" must have at least 1 button answer',
//         path: ['buttonAnswers'],
//     }
// );