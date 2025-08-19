import { VisitOption } from "./visitOption";

export interface VisitRowReq {
    date: string;
    visitOption: { id: number } | VisitOption;
}