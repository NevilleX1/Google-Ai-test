
import React, { useState, useCallback, useMemo } from 'react';
import { correctGrammar } from './services/geminiService';
import Spinner from './components/Spinner';
import { CopyIcon, CheckIcon, SparklesIcon } from './components/Icon';
import Stopwatch from './components/Stopwatch';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [correctedText, setCorrectedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const examples = useMemo(() => [
    "Me and my friend is going to the park.",
    "She don't like vegetables, but she eat fruits.",
    "Their going to there house after school.",
    "I seen that movie yesterday it was good.",
  ], []);

  const handleCorrectGrammar = useCallback(async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to correct.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setCorrectedText('');
    try {
      const result = await correctGrammar(inputText);
      setCorrectedText(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  const handleCopy = useCallback(() => {
    if (correctedText) {
      navigator.clipboard.writeText(correctedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [correctedText]);

  const handleExampleClick = (example: string) => {
    setInputText(example);
    setCorrectedText('');
    setError(null);
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="relative w-full max-w-4xl mx-auto">
        <Stopwatch />
        <header className="text-center mb-8 md:mb-12">
           <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            AI Grammar Corrector
          </h1>
          <p className="text-slate-400 text-lg">
            Refine your writing instantly. Let AI perfect your grammar and style.
          </p>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col gap-4">
              <label htmlFor="input-text" className="text-sm font-medium text-slate-300">Enter your text:</label>
              <textarea
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full h-64 bg-slate-800 border border-slate-700 rounded-lg p-4 focus:ring-2 focus:ring-pink-500 focus:outline-none transition duration-200 resize-none"
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col gap-4">
               <label htmlFor="output-text" className="text-sm font-medium text-slate-300">Corrected text:</label>
               <div className="relative w-full h-64 bg-slate-800 border border-slate-700 rounded-lg p-4">
                {correctedText && (
                    <button 
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
                        aria-label="Copy corrected text"
                    >
                        {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5 text-slate-400" />}
                    </button>
                )}
                <p className="whitespace-pre-wrap text-slate-200">
                  {correctedText}
                </p>
                {!isLoading && !correctedText && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                        Your corrected text will appear here.
                    </div>
                )}
                 {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Spinner />
                    </div>
                )}
               </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleCorrectGrammar}
              disabled={isLoading || !inputText.trim()}
              className="bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-500 focus:ring-opacity-50 flex items-center justify-center mx-auto w-full max-w-xs"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span className="ml-2">Correcting...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Correct Grammar
                </>
              )}
            </button>
            {error && <p className="text-red-400 mt-4">{error}</p>}
          </div>

          <div className="mt-12">
              <h3 className="text-center text-slate-400 mb-4">Or try an example:</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {examples.map((ex, index) => (
                    <button
                        key={index}
                        onClick={() => handleExampleClick(ex)}
                        className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white px-4 py-2 rounded-full text-sm transition-colors duration-200"
                    >
                        "{ex}"
                    </button>
                ))}
              </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
