import { DynamicQuestion } from "./dynamicQuestion";
import { ServicePoint } from "./ServicePoint";
import { SpecificDate } from "./SpecificDate";
import { VisitType } from "./visitType";

export interface VisitOption {
    id?: number;
    visitOptionName: string;
    visitType: VisitType | null;
    description?: string;
    isPreRegistration: boolean;
    imageName?: string;
    isPhotoRequired: boolean;
    isPhotoOptional: boolean;
    isPhoneNumberRequired: boolean;
    isEmailRequired: boolean;
    dynamicQuestions: DynamicQuestion[];
    averageTimeForAPerson: number;
    visitorsPerRow: number;
    active: boolean;
    visitRows: any[];
    timeRanges: any[];
    specificDates: SpecificDate[]
    servicePoints?: ServicePoint[];
}