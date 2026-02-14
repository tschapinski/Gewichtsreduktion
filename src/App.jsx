import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';

// --- GSAP Animations Hook ---
const useGSAP = (callback, dependencies = []) => {
    useEffect(callback, dependencies);
};

// --- Questions Data with Type Config ---
const questionsData = [
    {
        id: 1,
        type: 'slider',
        question: "Wie viele Diäten hast du in deinem Leben schon ausprobiert?",
        config: {
            min: 0,
            max: 2,
            step: 1,
            labels: [
                { val: 0, text: "Keine / 1-2", icon: "😊" },
                { val: 1, text: "3 bis 5", icon: "😐" },
                { val: 2, text: "Unzählige", icon: "😰" }
            ]
        },
    },
    {
        id: 2,
        type: 'card',
        question: "Was ist dein Zielgewicht, das du verlieren möchtest?",
        options: [
            { id: 'A', text: "5 bis 10 kg (Die \"Wohlfühl-Kilos\")" },
            { id: 'B', text: "10 bis 20 kg" },
            { id: 'C', text: "Mehr als 20 kg" }
        ],
    },
    {
        id: 3,
        type: 'card',
        question: "Wann greifst du am häufigsten zu Essen, obwohl du keinen körperlichen Hunger hast?",
        options: [
            { id: 'A', text: "Bei Stress oder Überforderung im Alltag" },
            { id: 'B', text: "Abends auf der Couch aus Langeweile oder Gewohnheit" },
            { id: 'C', text: "Wenn ich traurig bin, mich einsam fühle oder Belohnung brauche" },
            { id: 'D', text: "Ich esse eigentlich immer gerne und viel (große Portionen)" }
        ],
    },
    {
        id: 4,
        type: 'slider',
        question: "Wie würdest du dein Sättigungsgefühl beschreiben?",
        config: {
            min: 1,
            max: 10,
            step: 1,
            showValue: true,
            labels: [
                { range: [1, 3], text: "Ich spüre es und höre auf", icon: "✅" },
                { range: [4, 7], text: "Ich spüre es, ignoriere es oft", icon: "⚠️" },
                { range: [8, 10], text: "Ich spüre es gar nicht / erst bei Übelkeit", icon: "🚫" }
            ]
        },
    },
    {
        id: 5,
        type: 'card',
        question: "Welche Aussage trifft am ehesten auf deine Beziehung zu Süßigkeiten/Snacks zu?",
        options: [
            { id: 'A', text: "Ich brauche sie täglich als \"Nervennahrung\"" },
            { id: 'B', text: "Ich kann schwer aufhören (Kontrollverlust)" },
            { id: 'C', text: "Süßes ist gar nicht mein Hauptproblem" }
        ],
    },
    {
        id: 6,
        type: 'card',
        question: "Wie behandelst du deinen Körper aktuell? (Ehrlich sein!)",
        options: [
            { id: 'A', text: "Ich achte gut auf ihn, aber das Gewicht geht nicht runter" },
            { id: 'B', text: "Manchmal wie einen \"Mülleimer\" – Reste essen etc." },
            { id: 'C', text: "Wie einen \"müden Arbeiter\" – keine Pausen" }
        ],
    },
    {
        id: 7,
        type: 'card',
        question: "Was glaubst du, ist der Hauptgrund für dein Übergewicht?",
        options: [
            { id: 'A', text: "Meine Gene / Stoffwechsel / Alter" },
            { id: 'B', text: "Mangelnde Disziplin / Willensschwäche" },
            { id: 'C', text: "Emotionale Blockaden und alte Gewohnheiten" }
        ],
    },
    {
        id: 8,
        type: 'slider',
        question: "Glaubst du, dass dein Unterbewusstsein stärker ist als dein bewusster Wille?",
        config: {
            min: 0,
            max: 100,
            step: 1,
            isPercent: true,
            labels: [
                { range: [0, 30], text: "Nein, ich habe die Kontrolle" },
                { range: [31, 70], text: "Manchmal schon" },
                { range: [71, 100], text: "Ja, absolut (Machtlos)" }
            ]
        },
    },
    {
        id: 9,
        type: 'card',
        question: "Bist du bereit, dich auf eine tiefe Entspannung einzulassen?",
        options: [
            { id: 'A', text: "Ja, ich bin offen für Neues (Hypnose)" },
            { id: 'B', text: "Skeptisch, aber verzweifelt genug" },
            { id: 'C', text: "Nein, Angst vor Kontrollverlust" }
        ],
    },
    {
        id: 10,
        type: 'card',
        question: "Stell dir vor, du hättest dein Ziel bereits erreicht. Wie fühlst du dich?",
        options: [
            { id: 'A', text: "Frei und erleichtert" },
            { id: 'B', text: "Stolz und selbstbewusst" },
            { id: 'C', text: "Energetischer und gesünder" }
        ],
    }
];

// --- Shared Components ---

const Slider = ({ config, value, onChange }) => {
    const [localValue, setLocalValue] = useState(value || Math.floor((config.max - config.min) / 2) + config.min);
    const sliderRef = useRef(null);

    useEffect(() => onChange(localValue), []); // Init value

    const handleChange = (e) => {
        const val = parseInt(e.target.value);
        setLocalValue(val);
        onChange(val);
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(5); // Haptic
        }
    };

    const getCurrentLabel = () => {
        if (config.labels[0].val !== undefined) {
            return config.labels.find(l => l.val === localValue) || config.labels[0];
        }
        return config.labels.find(l => localValue >= l.range[0] && localValue <= l.range[1]) || config.labels[0];
    };

    const labelData = getCurrentLabel();

    return (
        <div className="w-full py-8 px-4">
            <div className="flex justify-center mb-12 text-center h-16 items-center flex-col animate-pulse-slow">
                <span className="text-4xl mb-2 block">{labelData.icon || ""}</span>
                <span className="text-xl font-serif text-vansol-dark">{labelData.text}</span>
                {config.showValue && <span className="text-sm text-vansol-green mt-1 font-bold">{localValue} / {config.max}</span>}
                {config.isPercent && <span className="text-sm text-vansol-green mt-1 font-bold">{localValue}%</span>}
            </div>

            <div className="relative h-2 bg-vansol-white rounded-full">
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
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {/* Visual Thumb representation for better styling control (simple version mapped to native input above) */}
                <div
                    className="absolute top-1/2 -mt-4 w-8 h-8 bg-white border-2 border-vansol-dark rounded-full shadow-lg pointer-events-none transition-all duration-75 flex items-center justify-center transform hover:scale-110"
                    style={{ left: `calc(${((localValue - config.min) / (config.max - config.min)) * 100}% - 16px)` }}
                >
                    <div className="w-2 h-2 bg-vansol-dark rounded-full"></div>
                </div>
            </div>

            <div className="flex justify-between mt-4 text-xs text-stone-500 uppercase tracking-widest">
                <span>{config.isPercent ? '0%' : (config.labels[0].val !== undefined ? config.labels[0].text : config.min)}</span>
                <span>{config.isPercent ? '100%' : (config.labels[config.labels.length - 1].val !== undefined ? config.labels[config.labels.length - 1].text : config.max)}</span>
            </div>
        </div>
    );
};

const Card = ({ selected, onClick, children }) => {
    const cardRef = useRef(null);

    const handleEnter = () => {
        gsap.to(cardRef.current, { y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", duration: 0.2 });
    };
    const handleLeave = () => {
        if (!selected) gsap.to(cardRef.current, { y: 0, boxShadow: "none", duration: 0.2 });
    };

    useEffect(() => {
        if (selected) {
            gsap.to(cardRef.current, {
                scale: 1.02,
                borderColor: "#787d78",
                backgroundColor: "#ffffff",
                duration: 0.3
            });
        } else {
            gsap.to(cardRef.current, {
                scale: 1,
                borderColor: "#e3e3e3",
                backgroundColor: "#ffffff",
                duration: 0.3
            });
        }
    }, [selected]);

    return (
        <div
            ref={cardRef}
            onClick={onClick}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className={`
                w-full p-6 mb-4 cursor-pointer border rounded-sm relative overflow-hidden
                ${selected ? 'shadow-md ring-1 ring-vansol-green ring-opacity-50' : 'border-vansol-grey'}
            `}
        >
            <div className="flex items-center relative z-10">
                <div className={`
                    w-6 h-6 rounded-full border flex items-center justify-center mr-4 flex-shrink-0 transition-colors duration-300
                    ${selected ? 'border-vansol-green bg-vansol-green' : 'border-vansol-dark'}
                `}>
                    {selected && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                </div>
                <span className="text-lg leading-relaxed font-sans">{children}</span>
            </div>
        </div>
    );
};

const GaugeAnimation = ({ onComplete }) => {
    const gaugeRef = useRef(null);
    const needleRef = useRef(null);
    const textRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ onComplete: () => setTimeout(onComplete, 1000) });

        // Reset
        gsap.set(needleRef.current, { rotation: -90, transformOrigin: "bottom center" });

        // 1. Fill UP
        tl.to(needleRef.current, { rotation: 90, duration: 1.5, ease: "power2.inOut" })
            // 2. Oscillate
            .to(needleRef.current, { rotation: -45, duration: 0.8, ease: "elastic.out(1, 0.3)" })
            .to(needleRef.current, { rotation: 45, duration: 0.6, ease: "power1.inOut" })
            // 3. Land on approx target (simulated generic "High" for drama)
            .to(needleRef.current, {
                rotation: 20,
                duration: 1.5,
                ease: "elastic.out(1, 0.5)",
                onComplete: () => {
                    if (confetti) confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 }, colors: ['#787d78', '#e6ddd3'] });
                }
            });

        // Text pulse
        gsap.to(textRef.current, { opacity: 0.5, duration: 0.5, yoyo: true, repeat: -1 });

    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <img
                src="/Bilder/Katrin%20Magenband.jpg"
                alt="Magenband Visualisierung"
                className="w-full max-w-xs mb-8 rounded-lg shadow-soft"
            />
            <div className="relative w-64 h-32 overflow-hidden mb-8">
                {/* Gauge Arc Background */}
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[30px] border-l-vansol-green border-t-blue-400 border-r-orange-400 border-b-red-400"
                    style={{ borderBottomColor: 'transparent', transform: 'rotate(-45deg)', borderRadius: '50%' }}>
                </div>
                {/* Needle */}
                <div ref={needleRef} className="absolute bottom-0 left-1/2 w-2 h-32 bg-vansol-dark origin-bottom -translate-x-1" style={{ borderRadius: '4px 4px 0 0' }}></div>
                <div className="absolute bottom-0 left-1/2 w-6 h-6 bg-vansol-dark rounded-full -translate-x-3 translate-y-3"></div>
            </div>

            <h2 className="text-3xl font-display mb-2">Auswertung läuft...</h2>
            <p ref={textRef} className="text-vansol-green uppercase tracking-widest text-sm">Deine Antworten werden analysiert</p>
        </div>
    );
};

// --- Main Logic & App ---

const App = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', consent: false });
    const [result, setResult] = useState(null);

    // Refs for animations
    const containerRef = useRef(null);

    // Auto-Save
    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.setItem('vansol_funnel_state_v2', JSON.stringify({ answers, step, formData }));
        }, 1000);
        return () => clearTimeout(timeout);
    }, [answers, step, formData]);

    // Load State
    useEffect(() => {
        const saved = localStorage.getItem('vansol_funnel_state_v2');
        if (saved) {
            try {
                const p = JSON.parse(saved);
                if (p.step && p.step < 11) setStep(p.step);
                if (p.answers) setAnswers(p.answers);
                if (p.formData) setFormData(p.formData);
            } catch (e) { }
        }
    }, []);

    // Transition Handling
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
        const newAnswers = { ...answers, [qId]: val };
        setAnswers(newAnswers);

        // For sliders, we don't auto-advance instantly usually, but for this funnel flow request:
        // If it's a card, auto-advance. If slider, user manually clicks "Next" or we auto-advance?
        // Request said "Behalte Card-Auswahl bei (Auto-advance implied)".
        // For Sliders, usually a "Next" button is better UX.
        // Let's implement a "Weiter" button for Sliders, and Auto-advance for Cards.

        const qType = questionsData.find(q => q.id === step)?.type;
        if (qType === 'card') {
            setTimeout(() => {
                if (step < 10) changeStep(step + 1);
                else finishQuestions(newAnswers);
            }, 400);
        }
    };

    const handleNext = () => {
        if (step < 10) changeStep(step + 1);
        else finishQuestions(answers);
    };

    const finishQuestions = (finalAnswers) => {
        // Calculate Result
        let scores = { A: 0, B: 0, C: 0, D: 0 };

        // Map Sliders
        // Q1: 0, 1, 2
        // Q4: 1-10
        // Q8: 0-100

        // Existing logic + Slider Mapping
        // Typ A (Emotional): 3C, 5A, 6B, 7C, Q4(4-7)
        if (finalAnswers[3] === 'C') scores.A++;
        if (finalAnswers[5] === 'A') scores.A++;
        if (finalAnswers[6] === 'B') scores.A++;
        if (finalAnswers[7] === 'C') scores.A++;
        if (finalAnswers[4] >= 4 && finalAnswers[4] <= 7) scores.A++;

        // Typ B (Gewohnheit): 3B, 4C(old), 6C, 7A
        // Q4C old was "Teller leer". New Q4 doesn't have it. Let's ignore Q4 for B, or map Q1 low?
        if (finalAnswers[3] === 'B') scores.B++;
        if (finalAnswers[6] === 'C') scores.B++;
        if (finalAnswers[7] === 'A') scores.B++;
        if (finalAnswers[1] <= 1) scores.B++; // Low diets = naive/habit?

        // Typ C (Volumen): 2C, 3D, 4B(old), 5C
        // Q4B old was "Spüre gar nicht". New Q4(8-10)
        if (finalAnswers[2] === 'C') scores.C++;
        if (finalAnswers[3] === 'D') scores.C++;
        if (finalAnswers[5] === 'C') scores.C++;
        if (finalAnswers[4] >= 8) scores.C++;

        // Typ D (Stress): 3A, 5A, 6C, 8A(old)
        // Q8A old was "Ja absolut". New Q8(71-100)
        if (finalAnswers[3] === 'A') scores.D++;
        if (finalAnswers[5] === 'A') scores.D++;
        if (finalAnswers[6] === 'C') scores.D++;
        if (finalAnswers[8] >= 71) scores.D++;

        const typeKey = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

        const resultTypes = {
            'A': { title: "Der Emotionale Esser", alias: "Das Trostpflaster" },
            'B': { title: "Der Gewohnheits-Esser", alias: "Der Autopilot" },
            'C': { title: "Der Volumen-Esser", alias: "Der Nimmersatt" },
            'D': { title: "Der Stress-Esser", alias: "Der Getriebene" }
        };

        const rec = (finalAnswers[2] === 'B' || finalAnswers[2] === 'C') ? "Hypnotisches Magenband" : "Hypnotischer Magenballon";

        setResult({
            type: resultTypes[typeKey].title,
            typeAlias: resultTypes[typeKey].alias,
            productRecommendation: rec,
            score: scores,
            gaugeScore: Math.random() * 100 // Visual dummy score for gauge later if needed
        });

        changeStep(11); // Gauge Animation
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        // Validate
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.consent) return;

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="animate-pulse">Sende Daten...</span>';
        }

        const payload = {
            ...formData,
            answers,
            result,
            timestamp: new Date().toISOString()
        };
        console.log("Submitting:", payload);

        try {
            // Use local server URL, or environment variable if available
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/submit-form';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Success:", data);
                // Reset Form Status for next run
                setTimeout(() => {
                    localStorage.removeItem('vansol_funnel_state_v2');
                }, 500);
                changeStep(13); // Thank You
            } else {
                console.error("Error:", data);
                // Simple error handling for user
                let msg = "Es gab einen Fehler beim Senden.";
                if (data.detail && data.detail.includes("Member Exists")) {
                    msg = "Diese E-Mail-Adresse ist bereits registriert.";
                    // Still proceed to thank you page for better UX? Or show error?
                    // Usually in funnels, if they exist, we just treat it as success or update them.
                    // For now, let's treat "Member Exists" as a kind of success to the user but log it.
                    changeStep(13);
                    return;
                }
                alert(msg + " (" + (data.detail || data.error) + ")");
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert("Netzwerkfehler. Bitte versuche es später noch einmal.");
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }
    };

    // Keyboard Nav
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Enter' && step > 0 && step <= 10 && questionsData.find(q => q.id === step).type === 'slider') handleNext();
            if (e.key === 'Escape' && step > 1) changeStep(step - 1);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [step, answers]);


    // --- Render ---

    // Contact Form Validation Icons
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    return (
        <div className="max-w-md md:max-w-2xl mx-auto min-h-screen relative flex flex-col font-sans">

            {/* Header / Progress - Not on Welcome/Thanks */}
            {step > 0 && step < 13 && (
                <div className="pt-8 px-6 pb-2 flex flex-col">
                    <div className="flex justify-between items-center mb-4 opacity-60 text-xs tracking-widest uppercase">
                        <button onClick={() => step > 1 && changeStep(step - 1)} className={`hover:text-vansol-dark ${step <= 1 ? 'invisible' : ''}`}>← Zurück</button>
                        <span>Frage {step > 10 ? 10 : step} / 10</span>
                    </div>
                    {step <= 10 && (
                        <div className="w-full bg-vansol-white h-1.5 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-vansol-green to-stone-500 h-full transition-all duration-700 ease-in-out" style={{ width: `${(step / 10) * 100}%` }}></div>
                        </div>
                    )}
                </div>
            )}

            <div ref={containerRef} className="flex-grow flex flex-col p-6">

                {/* 0. Welcome */}
                {step === 0 && (
                    <div className="text-center pt-8 animate-fade-in-up">
                        <div className="mb-0 flex justify-center">
                            <img
                                src="/Bilder/Katrin%20Notitzblock.jpg"
                                alt="Katrin van Sol"
                                className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-full shadow-lg border-4 border-white"
                            />
                        </div>
                        <h1 className="mb-6">
                            <img src="/Bilder/Welcher_Esser.svg" alt="WAS FÜR EIN ESSER BIST DU?" className="w-full max-w-2xl mx-auto p-2" style={{ padding: '10px' }} />
                        </h1>
                        <p className="text-lg sm:text-xl mb-8 text-stone-600 max-w-xl mx-auto leading-relaxed">
                            Finde heraus, was dich bisher am Abnehmen gehindert hat und wie du es endlich ändern kannst.
                        </p>
                        <button onClick={() => {
                            setAnswers({});
                            localStorage.removeItem('vansol_funnel_state_v2');
                            changeStep(1);
                        }} className="bg-vansol-dark text-white px-10 py-5 rounded-full text-lg uppercase tracking-widest font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            Jetzt Analyse starten
                        </button>
                        <p className="mt-6 text-sm text-stone-500 flex items-center justify-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-vansol-green"></span>
                            Dauert nur 2 Minuten
                        </p>
                    </div>
                )}

                {/* 1-10. Questions */}
                {step >= 1 && step <= 10 && (
                    <div className="flex flex-col justify-center flex-grow py-4 animate-fade-in-up">

                        <h2 className="font-serif text-2xl sm:text-3xl mb-8 text-center px-4 max-w-3xl mx-auto">{questionsData.find(q => q.id === step).question}</h2>

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
                            <div className="py-4">
                                <Slider
                                    config={questionsData.find(q => q.id === step).config}
                                    value={answers[step]}
                                    onChange={handleAnswer}
                                />
                                <div className="mt-12 text-center">
                                    <button onClick={handleNext} className="bg-vansol-dark text-white px-12 py-4 uppercase tracking-widest shadow-lg hover:bg-opacity-90 transition-all">
                                        Weiter
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 11. Gauge Animation */}
                {step === 11 && (
                    <GaugeAnimation onComplete={() => changeStep(12)} />
                )}

                {/* 12. Contact Form */}
                {step === 12 && (
                    <div className="pt-8 pb-12 animate-fade-in-up">
                        <div className="max-w-lg mx-auto">

                            {/* Headline & Copy */}
                            <div className="text-center mb-10 px-4">
                                <h2 className="mb-6">
                                    <img src="/Bilder/Dein_Ergebnis.svg" alt="DEIN ERGEBNIS WARTET AUF DICH!" className="w-full max-w-2xl mx-auto p-2" style={{ padding: '10px' }} />
                                </h2>
                                <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-md mx-auto">
                                    Du bist nur noch einen Schritt entfernt von deiner individuellen Analyse.
                                    Ich schicke dir dein Ergebnis direkt in dein Postfach –
                                    inklusive meiner persönlichen Empfehlung, wie du endlich
                                    dein Wunschgewicht erreichst.
                                </p>
                            </div>

                            {/* Premium Form Card */}
                            <div className="bg-white px-6 md:px-10 py-10 shadow-soft rounded-sm">
                                <form onSubmit={handleContactSubmit} className="space-y-6">

                                    {/* Vorname */}
                                    <div className="relative">
                                        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                            Vorname
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Dein Vorname"
                                            className="w-full px-5 py-4 bg-vansol-beige bg-opacity-30 border border-stone-200 rounded-lg focus:border-vansol-green focus:ring-2 focus:ring-vansol-green focus:ring-opacity-20 focus:outline-none transition-all text-base"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>

                                    {/* Nachname */}
                                    <div className="relative">
                                        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                            Nachname
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Dein Nachname"
                                            className="w-full px-5 py-4 bg-vansol-beige bg-opacity-30 border border-stone-200 rounded-lg focus:border-vansol-green focus:ring-2 focus:ring-vansol-green focus:ring-opacity-20 focus:outline-none transition-all text-base"
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>

                                    {/* E-Mail (Hero Field) */}
                                    <div className="relative pt-2">
                                        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                                            E-Mail-Adresse
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                placeholder="deine@email.de"
                                                className={`w-full pl-12 pr-12 py-5 bg-vansol-beige bg-opacity-30 border rounded-lg focus:outline-none transition-all text-base font-medium ${formData.email && isValidEmail(formData.email)
                                                    ? 'border-success focus:ring-2 focus:ring-success focus:ring-opacity-20'
                                                    : 'border-stone-200 focus:border-vansol-green focus:ring-2 focus:ring-vansol-green focus:ring-opacity-20'
                                                    }`}
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                            {formData.email && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                    {isValidEmail(formData.email) ? (
                                                        <svg className="w-6 h-6 text-success animate-bounce-in" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                        </svg>
                                                    ) : (
                                                        <span className="text-error text-sm">✗</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {formData.email && !isValidEmail(formData.email) && (
                                            <p className="text-error text-xs mt-2 ml-1">Bitte gib eine gültige E-Mail-Adresse ein</p>
                                        )}
                                    </div>

                                    {/* DSGVO Checkbox - Elegant */}
                                    <div className="flex items-start pt-4 pb-2">
                                        <div className="relative flex-shrink-0 mt-1">
                                            <input
                                                type="checkbox"
                                                required
                                                id="consent"
                                                className="peer sr-only"
                                                checked={formData.consent}
                                                onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                                            />
                                            <label
                                                htmlFor="consent"
                                                className="w-6 h-6 border-2 border-stone-300 rounded cursor-pointer flex items-center justify-center transition-all peer-checked:bg-vansol-green peer-checked:border-vansol-green hover:border-vansol-green"
                                            >
                                                <svg className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </label>
                                        </div>
                                        <label htmlFor="consent" className="ml-3 text-sm text-stone-600 leading-relaxed cursor-pointer select-none">
                                            Ja, ich möchte mein persönliches Ergebnis per E-Mail erhalten
                                            und bin einverstanden, dass ich <strong>Tipps zur Hypnose und
                                                Gewichtsreduktion von Katrin van Sol</strong> erhalte.
                                            Abmeldung jederzeit möglich gemäß{' '}
                                            <a href="#datenschutz" className="text-vansol-green underline hover:text-vansol-dark">Datenschutzerklärung</a>.
                                        </label>
                                    </div>

                                    {/* Hero Submit Button */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="group relative w-full bg-vansol-dark text-white py-5 rounded-lg uppercase tracking-widest font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                                            disabled={!formData.consent || !isValidEmail(formData.email)}
                                        >
                                            <span className="relative z-10 flex items-center justify-center">
                                                Jetzt mein Ergebnis erhalten
                                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                                </svg>
                                            </span>
                                            {/* Shine Effect on Hover */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-shine"></div>
                                        </button>
                                    </div>

                                    {/* Trust Elements */}
                                    <div className="flex items-center justify-center gap-6 pt-4 text-xs text-stone-500">
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-vansol-green" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                            </svg>
                                            <span>100% vertraulich</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-vansol-green" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                            </svg>
                                            <span>Kostenlos</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-vansol-green" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                            </svg>
                                            <span>Kein Spam</span>
                                        </div>
                                    </div>

                                </form>
                            </div>

                            {/* Footer Links */}
                            <div className="text-center mt-8 text-xs text-stone-400">
                                <a href="#impressum" className="hover:text-vansol-dark transition-colors">Impressum</a>
                                <span className="mx-2">•</span>
                                <a href="#datenschutz" className="hover:text-vansol-dark transition-colors">Datenschutz</a>
                            </div>

                        </div>
                    </div>
                )}

                {/* 13. Thank You */}
                {step === 13 && (
                    <div className="text-center pt-10 px-4">

                        <h1 className="mb-6">
                            <img src="/Bilder/Dein_Ergebnis.svg" alt="DEIN ERGEBNIS WARTET AUF DICH!" className="w-full max-w-2xl mx-auto p-2" style={{ padding: '10px' }} />
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-stone-600 max-w-2xl mx-auto">
                            Vielen Dank, {formData.firstName}! Ich habe deine Angaben analysiert.
                        </p>

                        <div className="bg-white p-8 md:p-12 rounded-sm border border-vansol-grey inline-block max-w-lg w-full relative overflow-hidden shadow-soft">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-vansol-green via-stone-400 to-vansol-beige"></div>

                            <h2 className="font-display text-2xl md:text-3xl mb-4 text-vansol-dark">Bitte prüfe dein Postfach</h2>
                            <p className="text-stone-600 leading-relaxed mb-6">
                                Die Auswertung ist abgeschlossen. In der E-Mail, die ich dir gerade gesendet habe,
                                erfährst du, <strong>welcher Esser-Typ du bist</strong>.
                            </p>
                            <p className="text-stone-600 leading-relaxed mb-6">
                                Es ist spannend! Schau gleich nach, das Ergebnis könnte dich überraschen.
                            </p>

                            <div className="bg-vansol-beige bg-opacity-40 p-4 rounded text-sm text-stone-600">
                                💡 <strong>Tipp:</strong> Solltest du keine E-Mail finden, prüfe bitte auch deinen Spam-Ordner
                            </div>
                        </div>

                        <div className="mt-12 space-y-4">
                            <a
                                href="https://www.vansol.de"
                                className="inline-block bg-vansol-dark text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all"
                            >
                                Zurück zur Website
                            </a>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default App;
