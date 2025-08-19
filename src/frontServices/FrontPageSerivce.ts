import { AnswerType } from "../types/AnswerType";
import { UserDto } from "../types/UserDto";
import { Visit } from "../types/visit";
import { VisitOption } from "../types/visitOption";
import { VisitType } from "../types/visitType";

export class FrontPageService {

    private currentVisitId: number | null = null;
    private static instance: FrontPageService | null = null;
    private selectedVisitType: VisitType | null = null;
    private selectedVisitOption: VisitOption | null = null;
    private currentVisitor: UserDto | null = null;
    private currentAnswers: AnswerType[] = [];
    private photo: File | null = null;
    private currentVisit: any;
    private saving = false
    private PreRegVisit: Visit | undefined;

    setSaving(saving: boolean) {
        this.saving = saving;
    }
    isSaving() {
        return this.saving;
    }

    private constructor() { } // Private constructor to prevent direct instantiation

    // Get singleton instance
    public static getInstance(): FrontPageService {
        if (!FrontPageService.instance) {
            FrontPageService.instance = new FrontPageService();
        }
        return FrontPageService.instance;
    }

    public getCurrentVisitId() {
        return this.currentVisitId
    }
    public setCurrentVisitId(id: number) {
        this.currentVisitId = id;
    }

    public setSelectedVisitType(visitType: VisitType): void {
        this.selectedVisitType = visitType;
    }

    public getSelectedVisitType(): VisitType | null {
        return this.selectedVisitType;
    }

    public setSelectedVisitOption(visitOption: VisitOption): void {
        console.log(visitOption)
        this.selectedVisitOption = visitOption;
    }

    public getSelectedVisitOption(): VisitOption | null {
        return this.selectedVisitOption;
    }

    public clearFrontEndService(): void {
        this.selectedVisitType = null;
        this.selectedVisitOption = null;
        this.currentVisitor = null;
        this.currentVisit = null;
        this.currentVisitId = null;
        this.PreRegVisit = undefined;
    }

    public setCurrectVisitor(visitor: UserDto) {
        this.currentVisitor = visitor;
    }
    public getCurrectVisitor() {
        return this.currentVisitor;
    }

    setCurrentDynamicAnswers(answers: AnswerType[]) {
        this.currentAnswers = answers;
    }

    getCurrentVisitDetails(): Visit {
        if (this.selectedVisitOption != null && this.currentVisitor != null) {
            this.currentVisit = {
                dynamicAnswers: this.currentAnswers,
                visitOption: this.selectedVisitOption,
                visitor: this.currentVisitor
            }
        }
        return this.currentVisit;
    }

    setCurrentVisit(visit: Visit) {
        this.currentVisit = visit;
    }


    setVisitorPhoto(photo: File) {
        this.photo = photo;
    }
    getVisitorPhoto() {
        return this.photo;

    }

    // Pre Reg visit Printing

    setPreRegVisit(visit: Visit) {
        this.PreRegVisit = visit;
    }

    getPreRegVisit(): Visit | undefined {
        return this.PreRegVisit;
    }
}