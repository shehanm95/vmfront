import { off } from "process";
import { Duty } from "../types/Duty";
import { DynamicQuestion } from "../types/dynamicQuestion";
import { ServicePoint } from "../types/ServicePoint";
import { UserDto } from "../types/UserDto";
import { Visit } from "../types/visit";
import { AnswerType } from "../types/AnswerType";


export const PointFrontService = {
    fetchServicePointsByOfficer: (visit: Visit, officer: UserDto): ServicePoint[] => {
        const officerId: number = officer.id!;
        const allServicePoints: ServicePoint[] = visit.visitOption.servicePoints!;

        const relatedServicePoints: ServicePoint[] = allServicePoints.filter((s: ServicePoint) => {
            return s.duties.some((d: Duty) => {
                return d.officer.id === officerId;
            });
        });

        return relatedServicePoints;
    },

    getOfficerQuestionswithAnsweredReferences: (visit: Visit, servicePoint: ServicePoint): DynamicQuestion[] => {
        const answers = visit.dynamicAnswers || [];
        const officerQuestions = servicePoint.officerQuestions || [];
        for (const question of officerQuestions) {
            for (const referenceQuestion of question.referenceQuestions || []) {
                const answer = answers.find(a => a.dynamicQuestion.id === referenceQuestion.id);
                if (answer) {
                    referenceQuestion.answer = answer;
                } else {
                    referenceQuestion.answer = undefined;
                }
            }
        }
        return officerQuestions;
    },

    getFullyAnswerSetupVisit(visit: Visit) {
        const answers: AnswerType[] = visit.dynamicAnswers || [];
        //loop service points
        visit.visitOption.servicePoints?.map((servicePoint: ServicePoint) => {
            servicePoint.officerQuestions.map((officerQuestion: DynamicQuestion) => {
                officerQuestion.answer = answers.find((answer: AnswerType) => answer.dynamicQuestion.id == officerQuestion.id)
                officerQuestion.referenceQuestions?.map((refQ) => refQ.answer = answers.find(an => an.dynamicQuestion.id == refQ.id))
                // return officerQuestion;
            })
        })
        // console.log("answered visit :", visit)
        return visit;
    },



};