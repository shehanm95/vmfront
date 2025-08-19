import { VisitOption } from "./visitOption";
import { VisitRow } from "./VisitRow";

export interface TimeRange {
    id: number;
    visitOption?: VisitOption;
    visitRows?: VisitRow[];
    startTime: string;
    endTime: string;
}
