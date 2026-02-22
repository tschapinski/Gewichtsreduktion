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
        type: 'card',
        category: "Einstieg",
        question: "Bevor wir anfangen: Was tut dir im Alltag besonders gut?",
        options: [
            { id: 'A', text: "🧘‍♀️ Zeit für mich alleine (Ruhe)" },
            { id: 'B', text: "🌲 Bewegung an der frischen Luft" },
            { id: 'C', text: "☕ Gesellige Runden mit Freunden" },
            { id: 'D', text: "🎨 Kreativ sein oder Neues lernen" }
        ],
    },
    {
        id: 2,
        type: 'input',
        category: "Dein Wunsch",
        question: "Stell dir vor du hast einen Wunsch bei einer guten Fee frei. Was würdest du dir Wünschen?",
        placeholder: "Mein größter Wunsch ist ...",
    },
    {
        id: 3,
        type: 'slider',
        category: "Erfahrung",
        question: "Wie viele Diäten hast du in deinem Leben schon ausprobiert?",
        config: {
            min: 0,
            max: 4,
            step: 1,
            labels: [
                { val: 0, text: "Keine", icon: "😎" },
                { val: 1, text: "1-2", icon: "😊" },
                { val: 2, text: "3 bis 5", icon: "😐" },
                { val: 3, text: "6 bis 10", icon: "😮" },
                { val: 4, text: "Unzählige", icon: "😰" }
            ]
        },
    },
    {
        id: 4,
        type: 'card',
        category: "Dein Ziel",
        question: "Was ist dein Zielgewicht, das du verlieren möchtest?",
        options: [
            { id: 'D', text: "Gewicht halten" },
            { id: 'A', text: "5 bis 10 kg (Die \"Wohlfühl-Kilos\")" },
            { id: 'B', text: "10 bis 20 kg" },
            { id: 'C', text: "Mehr als 20 kg" }
        ],
    },
    {
        id: 5,
        type: 'card',
        category: "Emotionales Essen",
        question: "Wann greifst du am häufigsten zu Essen, obwohl du keinen körperlichen Hunger hast? (Mehrfachauswahl möglich)",
        multi: true,
        options: [
            { id: 'A', text: "Bei Stress oder Überforderung im Alltag" },
            { id: 'B', text: "Abends auf der Couch aus Langeweile oder Gewohnheit" },
            { id: 'C', text: "Wenn ich traurig bin, mich einsam fühle oder Belohnung brauche" },
            { id: 'D', text: "Ich esse eigentlich immer gerne und viel (große Portionen)" },
            { id: 'E', text: "Ich esse oft unbewusst nebenbei (z.B. bei der Arbeit/TV)" }
        ],
    },
    {
        id: 6,
        type: 'slider',
        category: "Sättigung",
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
        id: 7,
        type: 'card',
        category: "Heisshunger",
        question: "Welche Aussage trifft am ehesten auf deine Beziehung zu Süßigkeiten/Snacks zu? (Mehrfachauswahl möglich)",
        multi: true,
        options: [
            { id: 'A', text: "Ich brauche sie täglich als \"Nervennahrung\"" },
            { id: 'B', text: "Ich kann schwer aufhören (Kontrollverlust)" },
            { id: 'C', text: "Süßes ist gar nicht mein Hauptproblem" },
            { id: 'D', text: "Ich esse sie oft als Belohnung am Ende des Tages" },
            { id: 'E', text: "Ich kann kaum an Süßigkeiten vorbeigehen, wenn sie da sind" }
        ],
    },
    {
        id: 8,
        type: 'card',
        category: "Selbstbild",
        question: "Wie behandelst du deinen Körper aktuell? (Ehrlich sein!)",
        options: [
            { id: 'A', text: "Ich achte gut auf ihn, aber das Gewicht geht nicht runter" },
            { id: 'B', text: "Manchmal wie einen \"Mülleimer\" – Reste essen etc." },
            { id: 'C', text: "Wie einen \"müden Arbeiter\" – keine Pausen" },
            { id: 'D', text: "Ich bin sehr kritisch und fühle mich oft unwohl in meiner Haut" }
        ],
    },
    {
        id: 9,
        type: 'card',
        category: "Ursache",
        question: "Was glaubst du, ist der Hauptgrund für dein Übergewicht?",
        options: [
            { id: 'A', text: "Meine Gene / Stoffwechsel / Alter" },
            { id: 'B', text: "Mangelnde Disziplin / Willensschwäche" },
            { id: 'C', text: "Emotionale Blockaden und alte Gewohnheiten" }
        ],
    },
    {
        id: 10,
        type: 'slider',
        category: "Mindset",
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
        id: 11,
        type: 'card',
        category: "Motivation",
        question: "Bist du bereit, dich auf eine tiefe Entspannung einzulassen?",
        options: [
            { id: 'A', text: "Ja, ich bin offen für Neues (Hypnose)" },
            { id: 'B', text: "Skeptisch, aber verzweifelt genug" },
            { id: 'C', text: "Nein, Angst vor Kontrollverlust" }
        ],
    },
    {
        id: 12,
        type: 'slider',
        category: "Vision",
        question: "Um wieviel Prozent würde sich dein Leben verbessern wenn du keine Heißhunger-Attacken mehr hättest?",
        config: {
            min: 0,
            max: 100,
            step: 1,
            isPercent: true,
            labels: [
                { range: [0, 9], text: "Kaum", icon: "🥱" },
                { range: [10, 19], text: "Minimal", icon: "🫤" },
                { range: [20, 29], text: "Ein wenig", icon: "😐" },
                { range: [30, 39], text: "Etwas", icon: "🙂" },
                { range: [40, 49], text: "Spürbar", icon: "😊" },
                { range: [50, 59], text: "Deutlich", icon: "😌" },
                { range: [60, 69], text: "Bedeutend", icon: "😄" },
                { range: [70, 79], text: "Sehr", icon: "😁" },
                { range: [80, 89], text: "Extrem", icon: "😍" },
                { range: [90, 100], text: "Lebensverändernd", icon: "🤩" }
            ]
        },
    },
    {
        id: 13,
        type: 'wish-reveal',
        category: "Deine Zukunft",
        question: "Und weißt du, was das konkret für dich bedeutet?",
    }
];

// --- Shared Components ---

const Slider = ({ config, value, onChange }) => {
    const [localValue, setLocalValue] = useState(value || Math.floor((config.max - config.min) / 2) + config.min);
    const [isDragging, setIsDragging] = useState(false);
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
            <div className={`flex justify-center mb-12 text-center h-16 items-center flex-col transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
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
                    onMouseDown={() => setIsDragging(true)}
                    onTouchStart={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchEnd={() => setIsDragging(false)}
                    onBlur={() => setIsDragging(false)}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {/* Visual Thumb representation for better styling control (simple version mapped to native input above) */}
                <div
                    className={`absolute top-1/2 -mt-4 w-8 h-8 bg-white border-2 border-vansol-dark rounded-full shadow-lg pointer-events-none transition-all duration-75 flex items-center justify-center transform ${isDragging ? 'scale-125' : 'hover:scale-110'}`}
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
                className="w-full max-w-xs mb-8 rounded-lg shadow-soft animate-premium-fade"
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

// --- New UI Components ---

const FeatureIcons = () => (
    <div className="w-full max-w-md grid grid-cols-3 gap-4 mb-8 mx-auto">
        <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-vansol-green/10 flex items-center justify-center mb-2">
                <span className="material-icons text-vansol-green text-sm">spa</span>
            </div>
            <span className="text-[10px] uppercase tracking-tighter text-vansol-green/70">Ganzheitlich</span>
        </div>
        <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-vansol-green/10 flex items-center justify-center mb-2">
                <span className="material-icons text-vansol-green text-sm">auto_graph</span>
            </div>
            <span className="text-[10px] uppercase tracking-tighter text-vansol-green/70">Analyse</span>
        </div>
        <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-vansol-green/10 flex items-center justify-center mb-2">
                <span className="material-icons text-vansol-green text-sm">biotech</span>
            </div>
            <span className="text-[10px] uppercase tracking-tighter text-vansol-green/70">Wissenschaft</span>
        </div>
    </div>
);

const QuizHeader = ({ step, onBack }) => (
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
                    style={{ width: `${(step / 13) * 100}%` }}
                ></div>
            </div>
            <p className="text-center text-[10px] uppercase tracking-widest mt-2 font-bold text-vansol-green/80">Schritt {step} von 13</p>
        </div>
        <div className="w-10"></div> {/* Spacer */}
    </header>
);

const QuizFooter = () => null;

// --- Main Logic & App ---

const App = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', consent: false });
    const [result, setResult] = useState(null);
    const [isFulfillingWish, setIsFulfillingWish] = useState(false);

    // Refs for animations
    const containerRef = useRef(null);
    const welcomeRefs = useRef([]);

    // Start Screen Animation
    useEffect(() => {
        if (step === 0) {
            // Initial set to ensure they are hidden
            gsap.set(welcomeRefs.current, { opacity: 0, y: 20, scale: 0.95 });

            const tl = gsap.timeline();

            tl.to(welcomeRefs.current[0], {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                ease: "power3.out"
            })
                .to(welcomeRefs.current[1], {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: "power3.out"
                }, "-=0.8")
                .to(welcomeRefs.current[2], {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: "power3.out"
                }, "-=0.8");

            return () => tl.kill();
        }
    }, [step]);


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
        const currentQ = questionsData.find(q => q.id === step);
        let newAnswers = { ...answers };

        if (currentQ.multi) {
            // Multi-select logic
            const currentSelected = newAnswers[qId] || [];
            if (currentSelected.includes(val)) {
                newAnswers[qId] = currentSelected.filter(id => id !== val);
            } else {
                newAnswers[qId] = [...currentSelected, val];
            }
        } else {
            // Single-select logic
            newAnswers[qId] = val;
        }

        setAnswers(newAnswers);

        // Auto-advance only for single-select cards (not input/wish-reveal)
        if (currentQ.type === 'card' && !currentQ.multi) {
            setTimeout(() => {
                if (step < 13) changeStep(step + 1);
                else finishQuestions(newAnswers);
            }, 400);
        }
    };

    const handleNext = () => {
        if (step < 13) changeStep(step + 1);
        else finishQuestions(answers);
    };

    const finishQuestions = (finalAnswers) => {
        // Calculate Result
        let scores = { A: 0, B: 0, C: 0, D: 0 };

        // Helper to check answer (handles single and multi)
        const hasAnswer = (qId, val) => {
            const ans = finalAnswers[qId];
            if (Array.isArray(ans)) return ans.includes(val);
            return ans === val;
        };

        // Map Sliders – question IDs shifted +1 due to new Q2 (input)
        // Q3: 0-4 (Diäten), Q6: 1-10 (Sättigung), Q10: 0-100 (Mindset)

        // Typ A (Emotional): Q5C, Q5E, Q7A, Q7D, Q8B, Q8D, Q9C, Q6(4-7)
        if (hasAnswer(5, 'C')) scores.A++;
        if (hasAnswer(5, 'E')) scores.A++;
        if (hasAnswer(7, 'A')) scores.A++;
        if (hasAnswer(7, 'D')) scores.A++; // Reward/end of day -> Emotional/Habit
        if (hasAnswer(8, 'B')) scores.A++;
        if (hasAnswer(8, 'D')) scores.A++; // Critical self-image -> Emotional
        if (hasAnswer(9, 'C')) scores.A++;
        if (finalAnswers[6] >= 4 && finalAnswers[6] <= 7) scores.A++;

        // Typ B (Gewohnheit): Q5B, Q5E, Q7E, Q8C, Q9A, Q3(<=1)
        if (hasAnswer(5, 'B')) scores.B++;
        if (hasAnswer(5, 'E')) scores.B++;
        if (hasAnswer(7, 'E')) scores.B++; // Difficulty passing by -> Habit/Impulse
        if (hasAnswer(8, 'C')) scores.B++;
        if (hasAnswer(9, 'A')) scores.B++;
        if (finalAnswers[3] <= 1) scores.B++;

        // Typ C (Volumen): Q4C, Q5D, Q7C, Q6(>=8)
        if (hasAnswer(4, 'C')) scores.C++;
        if (hasAnswer(5, 'D')) scores.C++;
        if (hasAnswer(7, 'C')) scores.C++;
        if (finalAnswers[6] >= 8) scores.C++;

        // Typ D (Stress): Q5A, Q7A, Q8C, Q10(>=71)
        if (hasAnswer(5, 'A')) scores.D++;
        if (hasAnswer(7, 'A')) scores.D++;
        if (hasAnswer(8, 'C')) scores.D++;
        if (finalAnswers[10] >= 71) scores.D++;

        const typeKey = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

        const resultTypes = {
            'A': { title: "Der Emotionale Esser", alias: "Das Trostpflaster" },
            'B': { title: "Der Gewohnheits-Esser", alias: "Der Autopilot" },
            'C': { title: "Der Volumen-Esser", alias: "Der Nimmersatt" },
            'D': { title: "Der Stress-Esser", alias: "Der Getriebene" }
        };

        const rec = (finalAnswers[4] === 'B' || finalAnswers[4] === 'C') ? "Hypnotisches Magenband" : "Hypnotischer Magenballon";

        setResult({
            type: resultTypes[typeKey].title,
            typeAlias: resultTypes[typeKey].alias,
            productRecommendation: rec,
            score: scores,
            gaugeScore: Math.random() * 100 // Visual dummy score for gauge later if needed
        });

        changeStep(14); // Gauge Animation
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
            const apiUrl = import.meta.env.VITE_API_URL || '/api/submit-form';
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
                // Go to Thank You
                changeStep(16); // Thank You
            } else {
                console.error("Error:", data);
                // Simple error handling for user
                let msg = "Es gab einen Fehler beim Senden.";
                if (data.detail && data.detail.includes("Member Exists")) {
                    msg = "Diese E-Mail-Adresse ist bereits registriert.";
                    // Still proceed to thank you page for better UX? Or show error?
                    // Usually in funnels, if they exist, we just treat it as success or update them.
                    // For now, let's treat "Member Exists" as a kind of success to the user but log it.
                    changeStep(16);
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
            const currentQ = questionsData.find(q => q.id === step);
            if (e.key === 'Enter' && step > 0 && step <= 13 && currentQ && currentQ.type === 'slider') handleNext();
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
            {step > 0 && step < 14 && (
                <QuizHeader step={step} onBack={() => step > 1 && changeStep(step - 1)} />
            )}

            <div ref={containerRef} className="flex-grow flex flex-col p-6">

                {/* 0. Welcome */}
                {step === 0 && (
                    <div className="pt-8 flex flex-col items-center">
                        <div ref={el => welcomeRefs.current[0] = el} className="opacity-0 text-center mb-6 w-full max-w-xl px-4">
                            <img
                                src="/Bilder/Welcher_Esser.svg"
                                alt="Was für ein Esser bist du?"
                                className="w-full h-auto max-w-[500px] mx-auto "
                            />
                            <p className="text-lg leading-relaxed text-vansol-text/80 mt-4 px-2 max-w-md mx-auto">
                                Finde heraus, was dich bisher am Abnehmen gehindert hat und wie du es endlich ändern kannst.
                            </p>
                        </div>

                        <div ref={el => welcomeRefs.current[1] = el} className="opacity-0 relative w-full max-w-sm flex justify-center items-center py-8 mb-8">
                            <div className="absolute inset-0 bg-vansol-green/5 rounded-full scale-110 blur-2xl"></div>
                            <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-white/50 shadow-2xl overflow-hidden">
                                <img
                                    src="/Bilder/Katrin%20Notitzblock.jpg"
                                    alt="Katrin van Sol"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div ref={el => welcomeRefs.current[2] = el} className="opacity-0 w-full max-w-md pb-10 px-4">
                            <button onClick={() => {
                                setAnswers({});
                                changeStep(1);
                            }} className="w-full bg-vansol-green text-white py-5 rounded-full font-semibold text-lg tracking-wide shadow-xl active:scale-95 transition-transform flex items-center justify-center group hover:bg-opacity-90">
                                JETZT ANALYSE STARTEN
                                <span className="material-icons ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                            <p className="text-center mt-4 text-xs text-vansol-text/50">
                                Dauer der Analyse: ca. 2 Minuten
                            </p>
                        </div>
                    </div>
                )}

                {/* 1–13. Questions */}
                {step >= 1 && step <= 13 && (() => {
                    const currentQ = questionsData.find(q => q.id === step);
                    if (!currentQ) return null;

                    // --- Wish-Reveal Step (step 13) ---
                    if (currentQ.type === 'wish-reveal') {
                        const wishText = answers[2] || '...';
                        return (
                            <div className="flex flex-col flex-grow py-4">
                                {/* Frage – sofort sichtbar, wie alle anderen Schritte */}
                                <div className="mb-6 px-2 animate-fade-in-up">
                                    <span className="inline-block px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-[12px] font-semibold text-vansol-green mb-4 shadow-sm border border-white">
                                        {currentQ.category}
                                    </span>
                                    <h2 className="font-serif text-2xl sm:text-3xl leading-[1.3] text-vansol-dark font-medium">
                                        {currentQ.question}
                                    </h2>
                                </div>
                                <div className="flex-grow flex flex-col justify-center">
                                    {/* ✨ Fee mit Sternen – erscheint mit Antwort-Delay */}
                                    <div className="animate-reveal-fairy flex justify-center mb-6">
                                        <div className="relative inline-flex items-center justify-center">
                                            {/* Sterne rund um die Fee */}
                                            <span className="fairy-star fairy-star-1">✦</span>
                                            <span className="fairy-star fairy-star-2">✧</span>
                                            <span className="fairy-star fairy-star-3">⋆</span>
                                            <span className="fairy-star fairy-star-4">✦</span>
                                            <span className="fairy-star fairy-star-5">✧</span>
                                            <span className="fairy-star fairy-star-6">⋆</span>
                                            {/* Fee – etwas größer als in Schritt 2 */}
                                            <span className={`text-[4.5rem] leading-none select-none ${isFulfillingWish ? 'animate-magic-wave' : 'fairy-float'}`}>🧚‍♀️</span>
                                            {isFulfillingWish && (
                                                <>
                                                    <span className="absolute magic-star-burst magic-star-burst-1 text-[#f59e0b] text-2xl">✦</span>
                                                    <span className="absolute magic-star-burst magic-star-burst-2 text-[#f59e0b] text-xl">✧</span>
                                                    <span className="absolute magic-star-burst magic-star-burst-3 text-[#f59e0b] text-2xl">⋆</span>
                                                    <span className="absolute magic-star-burst magic-star-burst-4 text-[#f59e0b] text-xl">✦</span>
                                                    <span className="absolute magic-star-burst magic-star-burst-5 text-[#f59e0b] text-2xl">✧</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Antwort – erscheint versetzt mit sanfter Animation */}
                                    <div className="animate-reveal-answer bg-white rounded-2xl p-6 shadow-soft border-2 border-vansol-green/20 mb-8">
                                        <p className="text-lg font-medium text-vansol-dark leading-relaxed text-center">
                                            Dein Wunsch –{' '}
                                            <span className="text-vansol-green font-semibold italic">„{wishText}"</span>
                                            {' '}– könnte damit Realität werden.
                                        </p>
                                    </div>
                                    {/* Button – erscheint nochmals versetzt */}
                                    <button
                                        onClick={() => {
                                            setIsFulfillingWish(true);
                                            setTimeout(() => {
                                                finishQuestions(answers);
                                                setIsFulfillingWish(false);
                                            }, 1200);
                                        }}
                                        className="animate-reveal-btn w-full bg-vansol-green text-white py-5 rounded-full font-semibold text-lg tracking-wide shadow-xl active:scale-95 transition-transform flex items-center justify-center group hover:bg-opacity-90"
                                    >
                                        Zum Testergebnis
                                        <span className="material-icons ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        );
                    }

                    // --- Input Step (step 2) ---
                    if (currentQ.type === 'input') {
                        return (
                            <div className="flex flex-col flex-grow py-4 animate-fade-in-up">
                                <div className="mb-8 px-2">
                                    <span className="inline-block px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-[12px] font-semibold text-vansol-green mb-4 shadow-sm border border-white">
                                        {currentQ.category}
                                    </span>
                                    <h2 className="font-serif text-2xl sm:text-3xl leading-[1.3] text-vansol-dark font-medium">
                                        {currentQ.question}
                                    </h2>
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <div className="flex-grow flex flex-col justify-center py-4">
                                        <div className="flex justify-center mb-6">
                                            <div className="animate-fairy-appear-delayed relative inline-flex items-center justify-center">
                                                {/* Sterne rund um die Fee */}
                                                <span className="fairy-star fairy-star-1">✦</span>
                                                <span className="fairy-star fairy-star-2">✧</span>
                                                <span className="fairy-star fairy-star-3">⋆</span>
                                                <span className="fairy-star fairy-star-4">✦</span>
                                                <span className="fairy-star fairy-star-5">✧</span>
                                                <span className="fairy-star fairy-star-6">⋆</span>
                                                {/* Fee –  identisch zu Slide 13 */}
                                                <span className="fairy-float text-[4.5rem] leading-none select-none">🧚‍♀️</span>
                                            </div>
                                        </div>
                                        <textarea
                                            rows={4}
                                            placeholder={currentQ.placeholder}
                                            className="w-full px-5 py-4 bg-white border-2 border-vansol-green/20 rounded-xl focus:border-vansol-green focus:ring-2 focus:ring-vansol-green focus:ring-opacity-20 focus:outline-none transition-all text-base resize-none shadow-soft font-medium text-vansol-dark placeholder-stone-300"
                                            value={answers[step] || ''}
                                            onChange={e => setAnswers({ ...answers, [step]: e.target.value })}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="mt-4 text-center">
                                        <button
                                            onClick={handleNext}
                                            disabled={!answers[step] || answers[step].trim().length === 0}
                                            className="w-full bg-vansol-green text-white py-4 rounded-xl font-semibold tracking-wide shadow-lg hover:bg-opacity-90 transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Weiter
                                            <span className="material-icons ml-2 text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // --- Card & Slider Steps ---
                    return (
                        <div className="flex flex-col flex-grow py-4 animate-fade-in-up">
                            <div className="mb-8 px-2">
                                <span className="inline-block px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-[12px] font-semibold text-vansol-green mb-4 shadow-sm border border-white">
                                    {currentQ.category}
                                </span>
                                <h2 className="font-serif text-2xl sm:text-3xl leading-[1.3] text-vansol-dark font-medium">
                                    {currentQ.question}
                                </h2>
                            </div>

                            {currentQ.type === 'card' ? (
                                <div className="space-y-4 flex-grow flex flex-col">
                                    <div className="space-y-4">
                                        {currentQ.options.map(opt => (
                                            <Card
                                                key={opt.id}
                                                selected={
                                                    Array.isArray(answers[step])
                                                        ? answers[step].includes(opt.id)
                                                        : answers[step] === opt.id
                                                }
                                                onClick={() => handleAnswer(opt.id)}
                                            >
                                                {opt.text}
                                            </Card>
                                        ))}
                                    </div>
                                    {currentQ.multi && (
                                        <div className="mt-8 text-center">
                                            <button
                                                onClick={handleNext}
                                                disabled={!answers[step] || answers[step].length === 0}
                                                className="w-full bg-vansol-green text-white py-4 rounded-xl font-semibold tracking-wide shadow-lg hover:bg-opacity-90 transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Weiter
                                                <span className="material-icons ml-2 text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="py-4 flex-grow flex flex-col justify-center">
                                    <Slider
                                        config={currentQ.config}
                                        value={answers[step]}
                                        onChange={handleAnswer}
                                    />
                                    <div className="mt-12 text-center">
                                        <button onClick={handleNext} className="w-full bg-vansol-green text-white py-4 rounded-xl font-semibold tracking-wide shadow-lg hover:bg-opacity-90 transition-all flex items-center justify-center group">
                                            Weiter
                                            <span className="material-icons ml-2 text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* Gauge Animation */}
                {step === 14 && (
                    <GaugeAnimation onComplete={() => changeStep(15)} />
                )}

                {/* Contact Form */}
                {step === 15 && (
                    <div className="pt-8 pb-12 animate-fade-in-up">
                        <div className="w-full max-w-3xl mx-auto">

                            {/* Headline & Copy */}
                            <div className="text-center mb-10 px-4">
                                <h2 className="mb-6">
                                    <img src="/Bilder/Dein_Ergebnis.svg" alt="DEIN ERGEBNIS WARTET AUF DICH!" className="w-full max-w-[800px] mx-auto p-2" style={{ padding: '10px' }} />
                                </h2>
                                <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-md mx-auto">
                                    Ich schicke dir dein Ergebnis direkt in dein Postfach.
                                </p>
                            </div>

                            {/* Premium Form Card */}
                            <div className="bg-white px-6 md:px-10 py-10 shadow-soft rounded-sm max-w-lg mx-auto">
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
                                            {/* Removed valid/invalid icon as per request */}
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
                                                className="peer opacity-0 absolute h-0 w-0"
                                                checked={formData.consent}
                                                onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                                            />
                                            <label
                                                htmlFor="consent"
                                                className="w-6 h-6 bg-white border-2 border-stone-300 rounded cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out peer-checked:border-vansol-green hover:border-vansol-green"
                                            >
                                                <svg
                                                    className="w-4 h-4 text-vansol-green opacity-0 peer-checked:opacity-100 transition-opacity duration-200 transform scale-90 peer-checked:scale-100"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="3"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                            </label>
                                        </div>
                                        <label htmlFor="consent" className="ml-3 text-sm text-stone-600 leading-relaxed cursor-pointer select-none">
                                            Ja, ich möchte mein persönliches Ergebnis per E-Mail erhalten
                                            und bin einverstanden, dass ich <strong>Tipps zur Hypnose und
                                                Gewichtsreduktion von Katrin van Sol</strong> erhalte.
                                            Abmeldung jederzeit möglich gemäß{' '}
                                            <a href="https://www.vansol.de/rights/datenschutz" target="_blank" rel="noopener noreferrer" className="text-vansol-green underline hover:text-vansol-dark">Datenschutzerklärung</a>.
                                        </label>
                                    </div>

                                    {/* Hero Submit Button */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="group relative w-full bg-vansol-green text-white py-5 rounded-lg uppercase tracking-widest font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
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

                {/* Thank You */}
                {step === 16 && (
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

            {/* Static Footer Wrapper - Outside of animated container */}
            {step >= 1 && step <= 13 && (
                <div className="pb-6 w-full">
                    <QuizFooter />
                </div>
            )}
        </div>
    );
};

export default App;
