import { VisitType } from "../types/visitType"

export interface TypeDtails {
    vistTypes: VisitType[];
    currentVisitType: VisitType | null;

}

let currentTypeDetails: TypeDtails = {
    vistTypes: [],
    currentVisitType: null
}


export const setTypeDetails = (typeDetail: TypeDtails) => {
    currentTypeDetails = typeDetail;
}

export const getTypeDetails = (): TypeDtails => {
    return currentTypeDetails
}

