import { ButtonAnswer } from "./buttonAnswer";
import { DynamicQuestion } from "./dynamicQuestion";



export interface AnswerType {
    dynamicQuestion: DynamicQuestion
    answerType: 'number' | 'text' | 'button';
    value?: string | number;
    selectedButtonAnswers?: ButtonAnswer[];
}
