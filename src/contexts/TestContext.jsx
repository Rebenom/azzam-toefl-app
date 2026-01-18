import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const TestContext = createContext(null);

const INITIAL_STATE = {
    currentSection: null, // 'listening', 'structure', 'reading'
    answers: {
        listening: {},
        structure: {},
        reading: {},
    },
    questions: {
        listening: [],
        structure: [],
        reading: [],
    },
    passages: [],
    startTime: null,
    sectionTimes: {
        listening: 35 * 60, // 35 minutes in seconds
        structure: 25 * 60, // 25 minutes
        reading: 55 * 60,   // 55 minutes
    },
    remainingTime: 0,
    isTestActive: false,
    testId: null,
    isLoading: false,
    error: null,
};

export function TestProvider({ children }) {
    const [testState, setTestState] = useState(() => {
        // Restore from localStorage if exists
        const saved = localStorage.getItem('toefl_test_state');
        return saved ? JSON.parse(saved) : INITIAL_STATE;
    });

    // Persist state to localStorage
    useEffect(() => {
        if (testState.isTestActive) {
            localStorage.setItem('toefl_test_state', JSON.stringify(testState));
        }
    }, [testState]);

    const startTest = async () => {
        setTestState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Try to fetch from API
            const response = await api.startTest();

            if (response.success) {
                const newState = {
                    ...INITIAL_STATE,
                    currentSection: 'listening',
                    startTime: Date.now(),
                    remainingTime: INITIAL_STATE.sectionTimes.listening,
                    isTestActive: true,
                    testId: response.data.testId,
                    questions: {
                        listening: response.data.questions.listening || [],
                        structure: response.data.questions.structure || [],
                        reading: response.data.questions.reading || [],
                    },
                    passages: response.data.passages || [],
                    isLoading: false,
                };
                setTestState(newState);
                localStorage.setItem('toefl_test_state', JSON.stringify(newState));
                return newState;
            }
        } catch (err) {
            console.log('API not available, using local mode:', err.message);
        }

        // Fallback to local mode with sample questions
        const newState = {
            ...INITIAL_STATE,
            currentSection: 'listening',
            startTime: Date.now(),
            remainingTime: INITIAL_STATE.sectionTimes.listening,
            isTestActive: true,
            testId: Date.now().toString(),
            isLoading: false,
        };
        setTestState(newState);
        localStorage.setItem('toefl_test_state', JSON.stringify(newState));
        return newState;
    };

    const setAnswer = async (section, questionId, answer) => {
        setTestState(prev => ({
            ...prev,
            answers: {
                ...prev.answers,
                [section]: {
                    ...prev.answers[section],
                    [questionId]: answer,
                },
            },
        }));

        // Try to submit to API in background
        if (testState.testId) {
            try {
                await api.submitAnswer(testState.testId, questionId, answer);
            } catch (err) {
                // Silently fail - answers are saved locally
                console.log('Failed to submit answer to API:', err.message);
            }
        }
    };

    const nextSection = async () => {
        const sections = ['listening', 'structure', 'reading'];
        const currentIndex = sections.indexOf(testState.currentSection);

        if (currentIndex < sections.length - 1) {
            const nextSectionName = sections[currentIndex + 1];

            // Try to notify API
            if (testState.testId) {
                try {
                    await api.nextSection(testState.testId, testState.remainingTime);
                } catch (err) {
                    console.log('Failed to update section in API:', err.message);
                }
            }

            setTestState(prev => ({
                ...prev,
                currentSection: nextSectionName,
                remainingTime: prev.sectionTimes[nextSectionName],
            }));
        }
    };

    const updateRemainingTime = (time) => {
        setTestState(prev => ({
            ...prev,
            remainingTime: time,
        }));
    };

    const finishTest = async () => {
        let result = null;

        // Try to finish via API
        if (testState.testId) {
            try {
                const response = await api.finishTest(testState.testId, testState.remainingTime);
                if (response.success) {
                    result = response.data;
                }
            } catch (err) {
                console.log('Failed to finish test via API:', err.message);
            }
        }

        const finalState = {
            ...testState,
            isTestActive: false,
            endTime: Date.now(),
            result,
        };

        // Save result for display
        localStorage.setItem('toefl_last_result', JSON.stringify(finalState));
        localStorage.removeItem('toefl_test_state');

        return finalState;
    };

    const resetTest = () => {
        setTestState(INITIAL_STATE);
        localStorage.removeItem('toefl_test_state');
    };

    const getQuestions = (section) => {
        return testState.questions[section] || [];
    };

    const value = {
        ...testState,
        startTest,
        setAnswer,
        nextSection,
        updateRemainingTime,
        finishTest,
        resetTest,
        getQuestions,
    };

    return (
        <TestContext.Provider value={value}>
            {children}
        </TestContext.Provider>
    );
}

export function useTest() {
    const context = useContext(TestContext);
    if (!context) {
        throw new Error('useTest must be used within a TestProvider');
    }
    return context;
}
