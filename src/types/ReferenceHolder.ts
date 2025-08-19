import { DynamicQuestion } from "./dynamicQuestion";

export interface ReferenceHolder {
    id: number;
    referenceQuestions: DynamicQuestion[];
}