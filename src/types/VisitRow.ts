import { TimeRange } from "./TimeRange";
import { Visit } from "./visit";
import { VisitOption } from "./visitOption";

export interface VisitRow {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    timeRange?: TimeRange;
    averageTimeForAPerson: number;
    visitorsPerRow: number;
    visitOption?: VisitOption;
    visits?: Visit[];
}
