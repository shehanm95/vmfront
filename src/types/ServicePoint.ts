import { Duty } from "./Duty";
import { DynamicQuestion } from "./dynamicQuestion";
import { ServicePointStatus } from "./ServicePointStatus";
import { SpecialNote } from "./SpecialNote";
import { Visit } from "./visit";
import { VisitOption } from "./visitOption";

export interface ServicePoint {
    id?: number;
    pointName: string;
    location: string;
    pointDescription: string;
    officerInstructions: string;
    visitorInstructions: string;
    visitOption: VisitOption;
    duties: Duty[] | any[];
    visits: Visit[];
    servicePointStatus: ServicePointStatus;
    officerQuestions: DynamicQuestion[] | any[];
    specialNotes: SpecialNote[];
    isFrontOffice: boolean;
    isHost: boolean;
}