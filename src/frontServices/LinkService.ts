import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export class LinkService {
    private static instance: LinkService | null = null;


    // Public readonly properties for all routes
    public readonly login: string = "/login";
    public readonly register: string = "/register";
    public readonly home: string = "/homea"; // Note: Consider renaming to "/home" for clarity
    public readonly unauthorized: string = "/unauthorized";
    public readonly root: string = "/";
    public readonly test: string = "/test";
    public readonly frontOffice: {
        PreRegTakePhotoPage: string;
        preRegShowDetailsMethod(id: string): string
        toPreRegPrintInput: string;
        preRegShowDetails: string;
        thankyouAndInstructions: string;
        showVisitDetails: string;
        takePhoto: string;
        answerQuestions: string;
        verifyEmail: string;
        forgotPass: string;
        login: string;
        register: string;
        visitTypes: string;
        visitOptions: string;
    } = {
            visitTypes: "/frontOffice/visitTypes",
            visitOptions: "/frontOffice/visitOptions",
            register: "/frontOffice/reigster",
            login: "/frontOffice/login",
            forgotPass: "/frontOffice/forgotpass",
            verifyEmail: "/frontOffice/verifyEmail",
            answerQuestions: "/frontOffice/answerQuestions",
            takePhoto: "/frontOffice/takePhoto",
            showVisitDetails: "/frontOffice/showVisitDetails",
            thankyouAndInstructions: "/frontOffice/thankyou",
            toPreRegPrintInput: "/frontOffice/toPreRegInputId",

            preRegShowDetailsMethod: (id: string): string => {
                return "/frontOffice/showDetails/" + id;
            },
            preRegShowDetails: "/frontOffice/showDetails/:id",
            PreRegTakePhotoPage: "/frontOffice/PreRegTakePhotoPage"
        };
    public readonly user: string = "/user";
    public readonly visitorDashboard: string = "/visitorDashboard";
    public readonly moderatorDashboard: {
        allVisits: string;
        addServicePoint: string;
        addDynamicQuestion: string;
        base: string;
        visitOptions: string;
        goToOptions: string;
        createVisitOption: string;
        visitOptionDetails: string;
        visitOptionDetailsMethod: (id: number) => string;
        allVisitors: string;
    } = {
            base: "/moderatorDashboard",
            visitOptions: "/moderatorDashboard/visitOptions",
            goToOptions: "/moderatorDashboard/goToOptions",
            createVisitOption: "/moderatorDashboard/visitOptions/create",
            allVisitors: "/moderatorDashboard/allvisitors",
            addDynamicQuestion: "/moderatorDashboard/dynamicQ",
            addServicePoint: "/moderatorDashboard/addServicePoint",
            allVisits: "/moderatorDashboard/allVisits",
            visitOptionDetails: "/moderatorDashboard/visitOptions/details/:id",
            visitOptionDetailsMethod: (id: number): string => {
                if (!id) {
                    toast.error("visitOption not found")
                    return "/moderatorDashboard/visitOptions"
                }
                return "/moderatorDashboard/visitOptions/details/" + String(id)
            }
        };
    public readonly officerDashboard: string = "/officerDashboard";

    public readonly preReg: {
        thankyou: string;
        setRow: string;
        base: string;
        questions: string;
        preRegOptions: string;
        types: string
        verifyEmail: string

    } = {
            base: "/preReg/",
            types: "/preReg/types",
            preRegOptions: "/preReg/options",
            questions: "/preReg/questions",
            setRow: "/preReg/setVisitRow",
            thankyou: "/preReg/thankyou",
            verifyEmail: "/preReg/verifyEmail"
        };
    profile: {
        checkVisitor: string;
        base: string,
        checkVisitorMethod: (id: number) => string
    } = {
            base: '/profile',
            checkVisitor: "/profile/checkVisitor/:id",
            checkVisitorMethod: function (id: number): string {
                return "/profile/checkVisitor/" + String(id)
            }
        };


    servicePoint: {
        showFullVisit: string;
        answerQuestions: string;
        scan: string;
        base: string
    } = {
            base: '/servicePoint',
            scan: '/servicePoint/scan',
            showFullVisit: "/servicePoint/showFullVisit",
            answerQuestions: "/servicePoint/answerQuestions"
        };
    visit: {
        fullVisit: string
        fullVisitMethod: (id: number) => string
    } = {
            fullVisit: "/visit/:id",
            fullVisitMethod: (id: number): string => {
                return "/visit/" + String(id)
            }
        }

    // Private constructor to prevent direct instantiation
    private constructor() { }

    // Get singleton instance
    public static getInstance(): LinkService {
        if (!LinkService.instance) {
            LinkService.instance = new LinkService();
        }
        return LinkService.instance;
    }
}