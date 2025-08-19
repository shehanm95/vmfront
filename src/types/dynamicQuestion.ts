import { AnswerType } from "./AnswerType";
import { ButtonAnswer } from "./buttonAnswer";
import { ReferenceHolder } from "./ReferenceHolder";
import { VisitOption } from "./visitOption";

export interface DynamicQuestion {
    id?: number;
    visitOption?: VisitOption;
    questionText: string;
    specialInstructions?: string;
    isRequired: boolean;
    answerType: 'button' | 'number' | 'text';
    buttonAnswers?: ButtonAnswer[];
    isActive: boolean;
    canSelectMoreThanOne: boolean;
    referenceQuestions?: DynamicQuestion[];
    answer?: AnswerType;
}