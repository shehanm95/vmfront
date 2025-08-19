import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DynamicQuestion } from '../../types/dynamicQuestion';
import { AnswerType } from '../../types/AnswerType';
import { ButtonAnswer } from '../../types/buttonAnswer';

interface UseDynamicQuestionsProps {
    getQuestions: () => Promise<DynamicQuestion[]>;
    onComplete?: (answers: AnswerType[]) => void;
    completeNavigationLink: string;
}

export const useDynamicQuestions = ({
    getQuestions,
    onComplete,
    completeNavigationLink
}: UseDynamicQuestionsProps) => {
    const [answers, setAnswers] = useState<AnswerType[]>([]);
    const [questions, setQuestions] = useState<DynamicQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [haveAnswer, setHaveAnswer] = useState(false);
    const [fieldValue, setFieldValue] = useState<any>('');
    const navigate = useNavigate();

    const currentQuestion = questions[currentIndex];

    const updateAnswer = useCallback((newAnswer: AnswerType) => {
        setAnswers(prev => {
            const existingIndex = prev.findIndex(a => a.dynamicQuestion.id === newAnswer.dynamicQuestion.id);
            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = newAnswer;
                return updated;
            }
            return [...prev, newAnswer];
        });
    }, []);

    const handleInputChange = useCallback((value: string | number) => {
        if (!currentQuestion || currentQuestion.id == null) return;

        if (value) {
            setFieldValue(value);
            setHaveAnswer(true);
        }

        updateAnswer({
            dynamicQuestion: currentQuestion,
            answerType: currentQuestion.answerType,
            selectedButtonAnswers: [],
            value,
        });
    }, [currentQuestion, updateAnswer]);

    const handleButtonClick = useCallback((button: ButtonAnswer) => {
        if (!currentQuestion || currentQuestion.id == null) return;

        const existing = answers.find(a => a.dynamicQuestion.id === currentQuestion.id);
        let selectedButtons: ButtonAnswer[] = [];

        if (existing?.selectedButtonAnswers) {
            setHaveAnswer(true);
        }

        if (currentQuestion.canSelectMoreThanOne) {
            const alreadySelected = existing?.selectedButtonAnswers || [];
            const isSelected = alreadySelected.some(b => b.id === button.id);
            selectedButtons = isSelected
                ? alreadySelected.filter(b => b.id !== button.id)
                : [...alreadySelected, button];
        } else {
            selectedButtons = [button];
        }

        updateAnswer({
            dynamicQuestion: currentQuestion,
            answerType: 'button',
            selectedButtonAnswers: selectedButtons,
        });
    }, [answers, currentQuestion, updateAnswer]);

    const handleNext = useCallback(() => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setFieldValue('');
        } else {
            if (onComplete) {
                onComplete(answers);
            }
            navigate(completeNavigationLink);
        }
        setHaveAnswer(false);
    }, [currentIndex, questions.length, onComplete, answers, navigate, completeNavigationLink]);

    useEffect(() => {
        const fetchQuestions = async () => {
            const fetchedQuestions = await getQuestions();
            if (fetchedQuestions.length > 0) {
                setQuestions(fetchedQuestions);
            } else {
                navigate(completeNavigationLink);
            }
        };
        fetchQuestions();
    }, [getQuestions, completeNavigationLink, navigate]);

    return {
        answers,
        questions,
        currentIndex,
        haveAnswer,
        fieldValue,
        currentQuestion,
        setFieldValue,
        handleInputChange,
        handleButtonClick,
        handleNext,
    };
};