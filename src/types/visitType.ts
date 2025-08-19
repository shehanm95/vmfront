import { VisitOption } from "./visitOption";

export interface VisitType {
    id?: number;
    visitTypeName: string;
    visitTypeDescription: string;
    imageName?: string;
    visitOptions: VisitOption[]
    isActive: boolean;
}