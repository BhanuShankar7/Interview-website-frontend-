import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, ArrowRight } from 'lucide-react';

const QUESTIONS = [
  "Tell me about yourself and your background in software development.",
  "What is your greatest professional achievement?",
  "How do you handle difficult situations in a team?",
  "Where do you see yourself in 5 years?",
  "What are your strengths and weaknesses?",
  "Why are you interested in this position?",
  "How do you stay updated with the latest technology trends?",
  "Describe a challenging project you worked on.",
  "How do you handle pressure and deadlines?",
  "What questions do you have for us?"
];

const EXPECTED_KEYWORDS = {
  0: ["experience",  "skills", "background", "projects", "education"],
  1: ["success", "project", "team", "impact", "result"],
  2: ["communication", "collaboration", "resolution", "approach", "solution"],
  3: ["goals", "growth", "career", "development", "progress"],
  4: ["improvement", "learning", "positive", "overcome", "develop"],
  5: ["interest", "motivation", "contribution", "value", "passion"],
  6: ["learning", "courses", "reading", "practice", "community"],
  7: ["problem", "solution", "implementation", "outcome", "learning"],
  8: ["organization", "prioritization", "management", "strategy", "focus"],
  9: ["culture", "growth", "opportunity", "team", "future"]
};

interface InterviewQAProps {
  onComplete: (score: number) => void;
}

const InterviewQA: React.FC<InterviewQAProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [timeLeft, setTimeLeft] = useState(59);
  const [scores, setScores] = useState<number[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isListening && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      stopListening();
    }
    return () => clearInterval(timer);
  }, [isListening, timeLeft]);

  const startListening = () => {
    setIsListening(true);
    setTimeLeft(59);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    evaluateAnswer();
  };

  const evaluateAnswer = () => {
    const keywords = EXPECTED_KEYWORDS[currentQuestion as keyof typeof EXPECTED_KEYWORDS];
    const words = transcript.toLowerCase().split(' ');
    const matchedKeywords = keywords.filter(keyword => 
      words.some(word => word.includes(keyword.toLowerCase()))
    );
    const score = (matchedKeywords.length / keywords.length) * 100;
    const newScores = [...scores, score];
    setScores(newScores);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTranscript("");
      setTimeLeft(59);
    } else {
      const finalScore = newScores.reduce((a, b) => a + b, 0) / newScores.length;
      onComplete(finalScore);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex-1">
        <div className="bg-gray-50 p-6 rounded-lg shadow mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Question {currentQuestion + 1}/10:</h3>
          <p className="text-gray-700">{QUESTIONS[currentQuestion]}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Your Answer:</h3>
            <span className="text-gray-500">{timeLeft}s</span>
          </div>
          <div className="min-h-[150px] bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700">{transcript || "Your answer will appear here..."}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`px-6 py-3 rounded-full flex items-center gap-2 text-white transition-colors ${
            isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={currentQuestion >= QUESTIONS.length}
        >
          {isListening ? (
            <>
              <MicOff size={20} />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <Mic size={20} />
              <span>Start Recording</span>
            </>
          )}
        </button>

        {!isListening && transcript && (
          <button
            onClick={evaluateAnswer}
            className="px-6 py-3 rounded-full flex items-center gap-2 text-white bg-green-500 hover:bg-green-600"
          >
            <span>Next Question</span>
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewQA;