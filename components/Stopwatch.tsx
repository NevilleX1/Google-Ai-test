
import React, { useState, useEffect, useRef } from 'react';

const Stopwatch: React.FC = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning) {
            const startTime = Date.now() - time;
            timerRef.current = window.setInterval(() => {
                setTime(Date.now() - startTime);
            }, 10); // Update every 10ms for two-digit milliseconds
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRunning, time]);

    const handleStartPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
    };

    const formatTime = () => {
        const minutes = Math.floor(time / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
        const milliseconds = Math.floor((time % 1000) / 10).toString().padStart(2, '0');
        return `${minutes}:${seconds}:${milliseconds}`;
    };

    return (
        <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center z-10">
            <div className="text-3xl font-mono text-cyan-400 tracking-wider mb-3" aria-live="polite">
                {formatTime()}
            </div>
            <div className="flex justify-center gap-2">
                <button
                    onClick={handleStartPause}
                    className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors w-20 ${
                        isRunning
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-slate-900'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                    aria-label={isRunning ? "Pause stopwatch" : "Start stopwatch"}
                >
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-1 text-sm font-semibold rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors w-20"
                    aria-label="Reset stopwatch"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Stopwatch;
