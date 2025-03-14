import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Question, Quizz } from "@/lib/types";

interface State {
  quizzes: Quizz[];
  questions: Question[];
  selectedQuizz: Quizz | null;
  currentQuestion: number;
  hasCompleteAll: boolean;
  score: number;
  resultSummary: string;
  selectQuizz: (quizz: Quizz) => void;
  fetchQuizzes: () => Promise<void>;
  selectAnswer: (questionId: number, selectedAnswer: string) => void;
  goNextQuestion: () => void;
  goPreviousQuestion: () => void;
  onCompleteQuestions: () => void;
  reset: () => void;
}

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://frontend-quizz-app-five.vercel.app/"
    : "http://localhost:3000/";

export const useQuestionStore = create<State>()(
  persist(
    (set, get) => {
      return {
        quizzes: [],
        questions: [],
        score: 0,
        resultSummary: "",
        selectedQuizz: null,
        currentQuestion: 0,
        hasCompleteAll: false,
        selectQuizz: (quizz: Quizz) => {
          set({ selectedQuizz: quizz, questions: quizz.questions });
        },
        fetchQuizzes: async () => {
          try {
            const res = await fetch(`${API_URL}/data.json`);
            const json = await res.json();
            const quizzes = json.quizzes as Quizz[];
            set({ quizzes, hasCompleteAll: false }, false);
          } catch (error) {
            console.log(error);
          }
        },

        selectAnswer: (questionId: number, selectedAnswer: string) => {
          const { questions } = get();
          // usar el structuredClone para clonar el objeto
          const newQuestions = structuredClone(questions);
          // encontramos el índice de la pregunta
          const questionIndex = newQuestions.findIndex(
            (q) => q.id === questionId
          );
          // obtenemos la información de la pregunta
          const questionInfo = newQuestions[questionIndex];
          // averiguamos si el usuario ha seleccionado la respuesta correcta
          // const isCorrectUserAnswer = questionInfo.answer === selectedAnswer;
          const answerIndex = questionInfo.options.findIndex(
            (a) => a === selectedAnswer
          );
          const answerPoint = answerIndex === 0 ? 3 : answerIndex === 1 ? 2 : 1;

          // cambiar esta información en la copia de la pregunta
          newQuestions[questionIndex] = {
            ...questionInfo,
            isCorrectUserAnswer: true,
            point: answerPoint,
            userSelectedAnswer: selectedAnswer,
          };
          // actualizamos el estado
          set({ questions: newQuestions }, false);
        },
        onCompleteQuestions: () => {
          const { questions } = get();
          // const score = questions.filter((q) => q.isCorrectUserAnswer).length;
          const score = questions.reduce((acc, q) => acc + (q.point || 0), 0);

          let resultSummary = "";
          if (score <= 17) {
            resultSummary =
              "Anda cenderung kurang berusaha dan lebih banyak bergantung pada keadaan. Perlu membangun semangat untuk lebih giat berusaha dan tidak hanya berharap tanpa tindakan.";
          } else if (score >= 18 && score <= 24) {
            resultSummary =
              "Anda cukup berusaha, tetapi kadang masih ragu atau mudah menyerah dalam beberapa situasi. Perlu lebih meningkatkan ketekunan dan keyakinan.";
          } else if (score >= 25) {
            resultSummary =
              "Anda adalah seseorang yang memiliki semangat ikhtiar luar biasa. Anda percaya pada usaha maksimal dan doa sebagai kunci kesuksesan.";
          }

          set({
            hasCompleteAll: true,
            currentQuestion: 0,
            score,
            resultSummary,
          });
        },
        goNextQuestion: () => {
          const { currentQuestion, questions } = get();
          const nextQuestion = currentQuestion + 1;
          if (nextQuestion < questions.length) {
            set({ currentQuestion: nextQuestion }, false);
          }
        },

        goPreviousQuestion: () => {
          const { currentQuestion } = get();
          const previousQuestion = currentQuestion - 1;

          if (previousQuestion >= 0) {
            set({ currentQuestion: previousQuestion }, false);
          }
        },

        reset: () => {
          set(
            {
              currentQuestion: 0,
              questions: [],
              hasCompleteAll: false,
              selectedQuizz: null,
            },
            false
          );
        },
      };
    },
    {
      name: "quizz",
      version: 1,
    }
  )
);
