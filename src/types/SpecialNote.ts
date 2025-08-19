import { ServicePoint } from "./ServicePoint";
import { UserDto } from "./UserDto";
import { Visit } from "./visit";

export interface SpecialNote {
    id: number;
    servicePoint: ServicePoint;
    officer: UserDto;
    visit: Visit;
    dateTime: string; // ISO 8601 string for LocalDateTime
    reviewedBy: UserDto[];
    noteContent: string;
}