import { VisitOption } from "../types/visitOption";

let currentVisitOption: VisitOption | undefined = undefined;

export const ModeratorService = {
    get currentVisitOption(): VisitOption | undefined {
        return currentVisitOption;
    },

    setCurrentVisitOption: (visitOption: VisitOption | undefined) => {
        currentVisitOption = visitOption;
        console.log("current visit Option set")
    },

    getCurrentVisitOption: (): VisitOption | undefined => {
        return currentVisitOption;
    },

    clearCurrentVisitOption: (): void => {
        currentVisitOption = undefined;
    }
};