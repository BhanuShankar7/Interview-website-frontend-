import React, { useState } from 'react';
import CameraView from './components/CameraView';
import InterviewQA from './components/InterviewQA';
import { Video, Award } from 'lucide-react';

function App() {
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleInterviewComplete = (score: number) => {
    setFinalScore(score);
    setInterviewComplete(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Video className="text-blue-600" size={24} />
            <h1 className="text-xl font-semibold text-gray-900">AI Interview Session</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Left side - Camera */}
          <div className="w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900">Camera Preview</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Make sure you're well-centered and in a well-lit environment
                </p>
              </div>
              <CameraView />
            </div>
          </div>

          {/* Right side - Q&A */}
          <div className="w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              {interviewComplete ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Award className="text-blue-600 w-16 h-16 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Interview Complete!</h2>
                  <div className="w-full max-w-sm mb-6">
                    <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                        style={{ width: `${finalScore}%` }}
                      />
                    </div>
                    <p className="mt-2 text-gray-600">Accuracy Score: {finalScore.toFixed(1)}%</p>
                  </div>
                  <p className="text-gray-600">
                    {finalScore >= 80 ? "Excellent performance! You demonstrated strong communication skills and relevant experience." :
                     finalScore >= 60 ? "Good effort! There's room for improvement in some areas." :
                     "Keep practicing! Focus on incorporating more specific examples and industry terminology."}
                  </p>
                </div>
              ) : (
                <InterviewQA onComplete={handleInterviewComplete} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;