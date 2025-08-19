import { AnswerType } from "./AnswerType";
import { Gate } from "./Gate";
import { UserDto } from "./UserDto";
import { VisitOption } from "./visitOption";
import { VisitRow } from "./VisitRow";

export interface Visit {
    id?: number;
    visitOption: VisitOption;
    visitor: UserDto;
    imageName?: string;
    badgePrintDate?: Date;
    dynamicAnswers: AnswerType[];
    visitRow: VisitRow;
    printed: boolean;
    enteredGate?: Gate;
    exitGate?: Gate;
    exitTime?: string;
    canceled?: boolean;
}