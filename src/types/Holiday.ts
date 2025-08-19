import { VisitOption } from "./visitOption"

export interface Holiday {
    id: number
    visitOption: VisitOption
    date: string
    forAll: boolean
}