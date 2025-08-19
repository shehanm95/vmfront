import { DynamicQuestion } from "../types/dynamicQuestion";

export const DummyService = {
    getQuestions: (): DynamicQuestion[] => {
        return [
            {
                id: 1,
                questionText: 'What is your favorite color?',
                isRequired: true,
                answerType: 'button',
                buttonAnswers: [
                    { id: 1, buttonText: 'Red' },
                    { id: 2, buttonText: 'Blue' },
                    { id: 3, buttonText: 'Green' },
                ],
                isActive: true,
                canSelectMoreThanOne: false,
                referenceQuestions: []
            },
            {
                id: 2,
                questionText: 'How old are you?',
                isRequired: true,
                answerType: 'number',
                isActive: true,
                canSelectMoreThanOne: false,
                referenceQuestions: []
            },
            {
                id: 3,
                questionText: 'Describe your ideal vacation.',
                isRequired: false,
                answerType: 'text',
                specialInstructions: 'You can write a short paragraph.',
                isActive: true,
                canSelectMoreThanOne: false,
                referenceQuestions: []
            },
            {
                id: 4,
                questionText: 'Select your preferred meal type.',
                isRequired: true,
                answerType: 'button',
                buttonAnswers: [
                    { id: 1, buttonText: 'Vegetarian' },
                    { id: 2, buttonText: 'Non-Vegetarian' },
                    { id: 3, buttonText: 'Vegan' },
                ],
                isActive: true,
                canSelectMoreThanOne: false,
                referenceQuestions: []
            },
            {
                id: 5,
                questionText: 'Rate your energy level today (1-10).',
                isRequired: true,
                answerType: 'number',
                isActive: true,
                canSelectMoreThanOne: false,
                referenceQuestions: []
            },
            {
                id: 6,
                questionText: 'What are your hobbies?',
                isRequired: false,
                answerType: 'text',
                isActive: true,
                canSelectMoreThanOne: true,
                referenceQuestions: []
            },
            {
                id: 7,
                questionText: 'Choose your favorite sports.',
                isRequired: false,
                answerType: 'button',
                buttonAnswers: [
                    { id: 1, buttonText: 'Football' },
                    { id: 2, buttonText: 'Basketball' },
                    { id: 3, buttonText: 'Tennis' },
                    { id: 4, buttonText: 'Cricket' },
                ],
                isActive: true,
                canSelectMoreThanOne: true,
                referenceQuestions: []
            },
            {
                id: 8,
                questionText: 'Enter your height (in cm).',
                isRequired: true,
                answerType: 'number',
                isActive: true,
                canSelectMoreThanOne: false,
                referenceQuestions: []
            },
            {
                id: 9,
                questionText: 'What languages do you speak?',
                isRequired: true,
                answerType: 'text',
                isActive: true,
                canSelectMoreThanOne: true,
                referenceQuestions: []
            },
            {
                id: 10,
                questionText: 'Choose your preferred travel method.',
                isRequired: true,
                answerType: 'button',
                buttonAnswers: [
                    { id: 1, buttonText: 'Car' },
                    { id: 2, buttonText: 'Train' },
                    { id: 3, buttonText: 'Plane' },
                ],
                isActive: true,
                canSelectMoreThanOne: false,
                referenceQuestions: []
            },
            {
                id: 11,
                questionText: 'How many hours do you sleep?',
                isRequired: true,
                answerType: 'number',
                isActive: true,
                canSelectMoreThanOne: false,
                referenceQuestions: []
            },
            {
                id: 12,
                questionText: 'Write about a memorable moment.',
                isRequired: false,
                answerType: 'text',
                isActive: true,
                canSelectMoreThanOne: false,
                referenceQuestions: []
            },
            {
                id: 13,
                questionText: 'Select your favorite season.',
                isRequired: true,
                answerType: 'button',
                buttonAnswers: [
                    { id: 1, buttonText: 'Spring' },
                    { id: 2, buttonText: 'Summer' },
                    { id: 3, buttonText: 'Autumn' },
                    { id: 4, buttonText: 'Winter' },
                ],
                isActive: true,
                canSelectMoreThanOne: false,
                referenceQuestions: []
            },
            {
                id: 14,
                questionText: 'What is your weight (in kg)?',
                isRequired: true,
                answerType: 'number',
                isActive: true,
                canSelectMoreThanOne: false,
                referenceQuestions: []
            },
            {
                id: 15,
                questionText: 'Choose the fruits you like.',
                isRequired: false,
                answerType: 'button',
                buttonAnswers: [
                    { id: 1, buttonText: 'Apple' },
                    { id: 2, buttonText: 'Banana' },
                    { id: 3, buttonText: 'Grapes' },
                    { id: 4, buttonText: 'Mango' },
                ],
                isActive: true,
                canSelectMoreThanOne: true,
                referenceQuestions: []
            },
        ];

    }
}