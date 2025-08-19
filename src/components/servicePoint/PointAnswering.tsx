import React, { useEffect, useRef, useState } from 'react'
import { usePointContext } from '../../context/PointContext';
import { PointFrontService } from '../../frontServices/PointFrontService';
import { DynamicQuestion } from '../../types/dynamicQuestion';
import './css/point-answering.css'
import { PointProfile } from './pointComps/PointProfile';
import { PointSpecialNoteTitle } from './pointComps/PointSpecialNoteTitle';
import { VisitorAnswersSections } from './pointComps/VisitorAnswersSections';
import { AnswerType } from '../../types/AnswerType';
import { AnsweringToQuestion } from './pointComps/AnsweringToQuestion';
import { PointShowRefsAndAskOffQuestions } from './pointComps/PointShowRefsAndAskOffQuestions';
import { Visit } from '../../types/visit';
import { VisitService } from '../../services/visitService';
import { UNSAFE_AssetsManifest, useNavigate } from 'react-router-dom';
import { LinkService } from '../../frontServices/LinkService';
import { set } from 'react-hook-form';
import { ServicePoint } from '../../types/ServicePoint';
import { Center } from '../common/Center';

export const PointAnswering = () => {
    const { visit, setVisit, servicePoints, setServicePoints } = usePointContext();
    const [currentServicePint, setCurrentServicePoint] = useState<ServicePoint | undefined>(() =>
        servicePoints && servicePoints.length > 0 ? servicePoints[0] : undefined
    );
    const [pointQuestions, setPointQuestions] = useState<DynamicQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const currentQuestionIndexTEMP = useRef(0);
    const currentPointIndex = useRef(0);
    const navigate = useNavigate();
    const linkS = LinkService.getInstance();
    const [questionsFinished, setQuestionsFinished] = useState(false);

    const [pointAnswers, setPointAnswers] = useState<AnswerType[]>([]);

    const setAnswer = (answer: AnswerType) => {
        setPointAnswers(prev => [...prev, answer]);
    };

    useEffect(() => {
        if (visit)
            setVisit(PointFrontService.getFullyAnswerSetupVisit(visit!))
    }, [visit]);

    useEffect(() => {
        console.log("updated point answers :", pointAnswers)
        visit?.dynamicAnswers!.push(...pointAnswers);
    },
        [pointAnswers])

    const moveToNextServicePoint = () => {
        if (currentPointIndex.current < (servicePoints!.length - 1)) {
            currentPointIndex.current += 1;
            setCurrentServicePoint(servicePoints![currentPointIndex.current]);
            setPointQuestions(PointFrontService.getOfficerQuestionswithAnsweredReferences(visit!, servicePoints![currentPointIndex.current]));
            setCurrentQuestionIndex(0);
            currentQuestionIndexTEMP.current = 0;
            setQuestionsFinished(false);
            saveVisitWithOfficerAnswers(visit!);
            setPointAnswers([]);
        } else {
            navigate(linkS.servicePoint.scan);
        }
    }


    useEffect(() => {
        if (currentServicePint) {
            const questions = PointFrontService.getOfficerQuestionswithAnsweredReferences(visit!, currentServicePint!);
            setPointQuestions(questions);
        } else {
            console.error("no service points to show")
            navigate(linkS.preReg.base);
        }
    }, [visit, currentServicePint]);

    const saveVisitWithOfficerAnswers = async (visit: Visit) => {
        const res = await VisitService.updateVisit(visit);
        if (res) {
            setVisit(res);
        }
        console.log(res);
    }

    useEffect(() => {
        if (questionsFinished) {
            saveVisitWithOfficerAnswers(visit!);
        }
    }, [questionsFinished])


    const incerementCurrentQuestionIndex = () => {
        if (!questionsFinished) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            currentQuestionIndexTEMP.current += 1;
            if (currentQuestionIndexTEMP.current < pointQuestions.length) {
                console.log("Incrementing question index");
            } else {
                if (currentPointIndex.current < servicePoints!.length - 1) {
                    console.log("incrementing point index : ", currentPointIndex);
                    visit?.dynamicAnswers!.push(...pointAnswers);
                    console.log("point answers: ", pointAnswers);
                    console.log(" visit?.dynamicAnswers!: ", visit?.dynamicAnswers!);
                    console.log("saving visit : ", visit);
                    setQuestionsFinished(true)
                } else {
                    visit?.dynamicAnswers!.push(...pointAnswers); // I need to set these answers to visit you know this will happen after rendring, but I need to do it before going to the next line
                    console.log(" visit?.dynamicAnswers!: ", visit?.dynamicAnswers!);
                    visit?.dynamicAnswers!.push(...pointAnswers);
                    setQuestionsFinished(true)
                }
            }
        } else {

        }

    }

    return (

        <>
            {!questionsFinished ?
                <div className="point-answering-container mt-3">
                    {/* <!-- Profile Section --> */}
                    <PointProfile visitor={visit?.visitor!} visitId={visit?.id}></PointProfile>

                    {/* <!-- Special Notes Section --> */}
                    {/* <PointSpecialNoteTitle></PointSpecialNoteTitle> */}

                    {/* <!-- Visitor Request Section --> */}
                    {/* <!-- officer Answer Input Section --> */}
                    <PointShowRefsAndAskOffQuestions
                        officerQuestions={pointQuestions}
                        setAnswer={setAnswer}
                        dynamicAnswers={visit?.dynamicAnswers!}
                        incerementCurrentQuestionIndex={incerementCurrentQuestionIndex}
                        currentQuestionIndex={currentQuestionIndex}
                    ></PointShowRefsAndAskOffQuestions>

                    {/* <!-- Navigation --> */}
                    <div className="point-answering-footer">
                        <button onClick={() => navigate(linkS.servicePoint.scan)} className="point-answering-btn">Back To Scanner</button>
                    </div>
                </div>
                :
                <div className='m-5 container'>
                    <div className="m-5">
                        <Center>
                            <div className="m-5">
                                <h2 className="text-center">All Questions Answered in this SercrvicePoint</h2>
                                <Center>
                                    <button onClick={() => moveToNextServicePoint()} className="point-answering-btn m-5">Move Next</button>
                                </Center>
                            </div>
                        </Center>
                    </div>
                </div>}
        </>
    )


}
