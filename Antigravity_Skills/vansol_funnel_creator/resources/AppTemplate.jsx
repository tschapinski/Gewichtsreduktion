import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';

// --- GSAP Animations Hook ---
const useGSAP = (callback, dependencies = []) => {
    useEffect(callback, dependencies);
};

// --- CONFIGURATION ---
// Customize your questions here
const questionsData = [
    {
        id: 1,
        type: 'card',
        category: "Example Category",
        question: "Example Question 1?",
        options: [
            { id: 'A', text: "Option A" },
            { id: 'B', text: "Option B" }
        ],
    },
    {
        id: 2,
        type: 'slider',
        category: "Example Slider",
        question: "Example Slider Question?",
        config: {
            min: 1,
            max: 10,
            step: 1,
            showValue: true,
            labels: [
                { range: [1, 3], text: "Low", icon: "🔽" },
                { range: [8, 10], text: "High", icon: "🔼" }
            ]
        },
    }
];

// --- Shared Components ---

const Slider = ({ config, value, onChange }) => {
    const [localValue, setLocalValue] = useState(value || Math.floor((config.max - config.min) / 2) + config.min);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);

    useEffect(() => onChange(localValue), []);

    const handleChange = (e) => {
        const val = parseInt(e.target.value);
        setLocalValue(val);
        onChange(val);
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(5);
    };

    const getCurrentLabel = () => {
        if (!config.labels) return { text: "" };
        if (config.labels[0].val !== undefined) {
            return config.labels.find(l => l.val === localValue) || config.labels[0];
        }
        return config.labels.find(l => localValue >= l.range[0] && localValue <= l.range[1]) || config.labels[0];
    };

    const labelData = getCurrentLabel();

    return (
        <div className="w-full py-8 px-4">
            <div className={`flex justify-center mb-12 text-center h-16 items-center flex-col transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
                <span className="text-4xl mb-2 block">{labelData.icon || ""}</span>
                <span className="text-xl font-serif text-vansol-dark">{labelData.text}</span>
                {config.showValue && <span className="text-sm text-vansol-green mt-1 font-bold">{localValue} / {config.max}</span>}
            </div>

            <div className="relative h-2 bg-white rounded-full">
                <div
                    className="absolute top-0 left-0 h-full bg-vansol-green rounded-full opacity-50 transition-all duration-100"
                    style={{ width: `${((localValue - config.min) / (config.max - config.min)) * 100}%` }}
                ></div>
                <input
                    ref={sliderRef}
                    type="range"
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    value={localValue}
                    onChange={handleChange}
                    onMouseDown={() => setIsDragging(true)}
                    onTouchStart={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchEnd={() => setIsDragging(false)}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                    className={`absolute top-1/2 -mt-4 w-8 h-8 bg-white border-2 border-vansol-dark rounded-full shadow-lg pointer-events-none transition-all duration-75 flex items-center justify-center transform ${isDragging ? 'scale-125' : 'hover:scale-110'}`}
                    style={{ left: `calc(${((localValue - config.min) / (config.max - config.min)) * 100}% - 16px)` }}
                >
                    <div className="w-2 h-2 bg-vansol-dark rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

const Card = ({ selected, onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className={`
                w-full text-left bg-white p-6 rounded-xl ios-shadow border-2 transition-all duration-200 group flex items-center justify-between
                ${selected ? 'border-vansol-green' : 'border-transparent hover:border-vansol-green/30 active:scale-[0.98]'}
            `}
        >
            <span className="text-lg font-medium leading-tight pr-4 text-vansol-text">{children}</span>
            <div className={`
                w-6 h-6 min-w-[24px] rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0
                ${selected ? 'border-vansol-green' : 'border-vansol-beige'}
            `}>
                <div className={`
                    w-3 h-3 rounded-full bg-vansol-green transition-opacity
                    ${selected ? 'opacity-100' : 'opacity-0'}
                `}></div>
            </div>
        </button>
    );
};

const QuizHeader = ({ step, total, onBack }) => (
    <header className="pt-2 px-6 pb-4 flex items-center justify-between">
        <button
            onClick={onBack}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-sm text-vansol-text hover:bg-white/80 transition-colors ${step <= 1 ? 'invisible' : ''}`}
        >
            <span className="material-icons text-xl">arrow_back_ios_new</span>
        </button>
        <div className="flex-1 px-8">
            <div className="w-full h-1.5 bg-vansol-green/20 rounded-full overflow-hidden">
                <div
                    className="h-full bg-vansol-green rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(step / total) * 100}%` }}
                ></div>
            </div>
            <p className="text-center text-[10px] uppercase tracking-widest mt-2 font-bold text-vansol-green/80">Schritt {step} von {total}</p>
        </div>
        <div className="w-10"></div>
    </header>
);

// --- Main App ---

const App = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});

    // Animation Refs
    const containerRef = useRef(null);
    const welcomeRefs = useRef([]);

    // Welcome Animation
    useEffect(() => {
        if (step === 0) {
            gsap.set(welcomeRefs.current, { opacity: 0, y: 20 });
            gsap.to(welcomeRefs.current, {
                opacity: 1,
                y: 0,
                stagger: 0.2,
                duration: 1,
                ease: "power3.out",
                delay: 0.5
            });
        }
    }, [step]);

    // Transition
    const changeStep = (newStep) => {
        if (containerRef.current) {
            gsap.to(containerRef.current, {
                opacity: 0,
                x: -20,
                duration: 0.3,
                onComplete: () => {
                    setStep(newStep);
                    window.scrollTo(0, 0);
                    gsap.fromTo(containerRef.current,
                        { opacity: 0, x: 20 },
                        { opacity: 1, x: 0, duration: 0.4, clearProps: "all" }
                    );
                }
            });
        } else {
            setStep(newStep);
        }
    };

    const handleAnswer = (val) => {
        const qId = step;
        const currentQ = questionsData.find(q => q.id === step);
        const newAnswers = { ...answers, [qId]: val };
        setAnswers(newAnswers);

        if (currentQ.type === 'card' && !currentQ.multi) {
            setTimeout(() => {
                if (step < questionsData.length) changeStep(step + 1);
                else finishQuestions(newAnswers);
            }, 400);
        }
    };

    const finishQuestions = (finalAnswers) => {
        console.log("Finished:", finalAnswers);
        changeStep(questionsData.length + 1); // Go to Result/Contact
    };

    return (
        <div className="max-w-md md:max-w-2xl mx-auto min-h-screen relative flex flex-col font-sans text-vansol-text bg-vansol-beige">

            {step > 0 && step <= questionsData.length && (
                <QuizHeader step={step} total={questionsData.length} onBack={() => step > 1 && changeStep(step - 1)} />
            )}

            <div ref={containerRef} className="flex-grow flex flex-col p-6">

                {/* Welcome Screen */}
                {step === 0 && (
                    <div className="pt-20 flex flex-col items-center text-center">
                        <h1 ref={el => welcomeRefs.current[0] = el} className="text-4xl font-serif mb-6 opacity-0">Welcome to Van Sol</h1>
                        <p ref={el => welcomeRefs.current[1] = el} className="mb-10 text-lg opacity-0">Start your journey today.</p>
                        <button
                            ref={el => welcomeRefs.current[2] = el}
                            onClick={() => changeStep(1)}
                            className="bg-vansol-green text-white px-8 py-4 rounded-full font-bold shadow-lg opacity-0 hover:scale-105 transition-transform"
                        >
                            Start Analysis
                        </button>
                    </div>
                )}

                {/* Questions */}
                {step >= 1 && step <= questionsData.length && (
                    <div className="animate-fade-in-up">
                        <h2 className="font-serif text-3xl mb-8">
                            {questionsData.find(q => q.id === step).question}
                        </h2>

                        {questionsData.find(q => q.id === step).type === 'card' ? (
                            <div className="space-y-4">
                                {questionsData.find(q => q.id === step).options.map(opt => (
                                    <Card
                                        key={opt.id}
                                        selected={answers[step] === opt.id}
                                        onClick={() => handleAnswer(opt.id)}
                                    >
                                        {opt.text}
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Slider
                                config={questionsData.find(q => q.id === step).config}
                                value={answers[step]}
                                onChange={handleAnswer}
                            />
                        )}
                        {questionsData.find(q => q.id === step).type !== 'card' && (
                            <button onClick={() => changeStep(step + 1)} className="mt-8 w-full bg-vansol-green text-white py-4 rounded-xl">Next</button>
                        )}
                    </div>
                )}

                {/* Result Screen Placeholder */}
                {step > questionsData.length && (
                    <div className="text-center pt-20 animate-fade-in-up">
                        <h2 className="text-3xl font-serif mb-4">Complete!</h2>
                        <p>Thank you for participating.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default App;
