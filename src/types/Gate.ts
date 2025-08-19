import { Visit } from "./visit"

export interface Gate {
    id?: number
    gateName: string
    enteredVisits: Visit[]
    exitGate: Visit[]
}