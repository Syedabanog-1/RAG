"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  Play, 
  Globe, 
  Cpu, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  Zap,
  Youtube,
  X,
  Pause,
  List,
  Search
} from 'lucide-react';
import { slides, Slide } from './slides';

const languages = [
  { code: 'en-US', name: 'English' },
  { code: 'ur-PK', name: 'Urdu' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
];

const RobotAvatar = ({ isSpeaking, size = "small", color = "sky" }: { isSpeaking: boolean, size?: "small" | "large", color?: "sky" | "pink" }) => {
  const isPink = color === "pink";
  const shadowColor = isPink ? '#db2777' : '#38bdf8';
  const mouthActiveColor = isPink ? '#f472b6' : '#7dd3fc';
  
  // Tailwind Purge-safe strings
  const containerShadow = isPink ? "shadow-[0_0_50px_rgba(219,39,119,0.4)]" : "shadow-[0_0_50px_rgba(14,165,233,0.4)]";
  const borderColor = isPink ? "border-pink-400/30" : "border-sky-400/30";
  const borderBody = isPink ? "border-pink-400/20" : "border-sky-400/20";
  const bgGradient = isPink ? "from-pink-500/20" : "from-sky-500/20";
  const bgEye = isPink ? "bg-pink-600" : "bg-sky-600";
  const bgMouth = isPink ? "bg-pink-400" : "bg-sky-400";
  const bgBlur = isPink ? "bg-pink-500" : "bg-sky-500";
  const mouthShadow = isPink ? "shadow-[0_0_15px_rgba(219,39,119,0.4)]" : "shadow-[0_0_15px_rgba(14,165,233,0.4)]";
  
  return (
  <div className={`relative flex flex-col items-center justify-center ${size === "small" ? "w-24 h-32" : "w-64 h-80"}`}>
    <motion.div 
      animate={isSpeaking ? { 
        y: [0, -15, 0],
        rotate: [0, 2, -2, 0]
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
      className={`${size === "small" ? "w-24 h-24" : "w-48 h-48"} glass rounded-[3rem] relative ${borderColor} overflow-hidden z-10 ${containerShadow}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient} to-transparent`} />
      {/* Eyes */}
      <div className="absolute top-[35%] left-0 w-full flex justify-around px-6">
        {[0, 1].map((i) => (
          <motion.div 
            key={i}
            animate={isSpeaking ? { 
              scaleY: [1, 0.1, 1],
              boxShadow: [`0 0 10px ${shadowColor}`, `0 0 20px ${shadowColor}`, `0 0 10px ${shadowColor}`]
            } : {}}
            transition={{ duration: 0.15, repeat: isSpeaking ? Infinity : 0, repeatDelay: 2.5 }}
            className={`${size === "small" ? "w-4 h-4" : "w-8 h-8"} bg-white rounded-full flex items-center justify-center`}
          >
            <div className={`${size === "small" ? "w-2 h-2" : "w-4 h-4"} ${bgEye} rounded-full`} />
          </motion.div>
        ))}
      </div>
      {/* Mouth */}
      <div className="absolute bottom-[20%] left-0 w-full flex justify-center">
        <motion.div 
          animate={isSpeaking ? { 
            height: [4, 12, 4], 
            width: [20, 40, 20],
            backgroundColor: [shadowColor, mouthActiveColor, shadowColor]
          } : { height: 4, width: 20 }}
          transition={{ duration: 0.2, repeat: Infinity }}
          className={`${bgMouth} rounded-full ${mouthShadow}`}
        />
      </div>
    </motion.div>
    {/* Body Part */}
    <div className={`${size === "small" ? "w-16 h-20" : "w-32 h-40"} glass rounded-t-none rounded-b-[5rem] -mt-12 ${borderBody} relative overflow-hidden`}>
      <div className="absolute top-12 left-1/2 -translate-x-1/2">
        <motion.div 
          animate={isSpeaking ? { opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] } : { opacity: 0.4 }}
          transition={{ duration: 1, repeat: Infinity }}
          className={`${size === "small" ? "w-8 h-8" : "w-16 h-16"} rounded-full ${bgBlur} blur-xl`} 
        />
      </div>
    </div>
  </div>
  );
};

export default function RAGMasterclass() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [showTopics, setShowTopics] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMovie, setShowMovie] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [movieSubtitle, setMovieSubtitle] = useState("");
  const [currentExplanation, setCurrentExplanation] = useState("");
  const [translatedContent, setTranslatedContent] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = async (slide: Slide, isMovie = false) => {
    if (isSpeaking && !isMovie) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsGenerating(true);
    let textToSpeak = slide.explanation;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: slide.title,
          context: slide.content,
          language: selectedLang.name
        })
      });
      const data = await res.json();
      if (data.explanation) {
        textToSpeak = data.explanation;
        if (isMovie) {
          setMovieSubtitle(textToSpeak);
          setCurrentExplanation(textToSpeak);
          if (data.translatedContent) {
            setTranslatedContent(data.translatedContent);
          }
        } else {
          setCurrentExplanation("");
        }
      }
    } catch (e) {
      console.warn("Groq failed.");
    } finally {
      setIsGenerating(false);
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const langCode = selectedLang.code.toLowerCase();
    
    // Hardened Voice Selection for Urdu/Hindi
    let bestVoice = voices.find(v => v.lang.toLowerCase() === langCode);
    if (!bestVoice) bestVoice = voices.find(v => v.lang.toLowerCase().startsWith(langCode.split('-')[0]));
    
    // Fallback logic for Urdu (often not present in browsers, use Hindi/India as fallback)
    if (!bestVoice && (langCode.includes('ur') || langCode.includes('hi'))) {
      bestVoice = voices.find(v => v.lang.toLowerCase().includes('hi-in') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('urdu') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('pakistan'));
    }
    
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      console.warn("Falling back to system default voice for", langCode);
      utterance.lang = langCode;
    }
    
    utterance.rate = 0.85; 
    utterance.pitch = 1.1; 
    utterance.onend = () => {
      setIsSpeaking(false);
      if (isMovie) setTimeout(() => setShowMovie(false), 1500);
    };
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') {
        console.log("Speech was stopped by user.");
        return;
      }
      console.error("Speech Synthesis Error Code:", e.error);
      setIsSpeaking(false);
      
      // Automatic English Fallback if original language fails
      if (langCode !== 'en-us') {
        console.log("Retrying with English voice fallback...");
        const fallbackUtterance = new SpeechSynthesisUtterance(textToSpeak);
        fallbackUtterance.lang = 'en-US';
        window.speechSynthesis.speak(fallbackUtterance);
      }
    };
    
    window.speechSynthesis.cancel();
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 200);
  };

  const startMovie = () => {
    setShowMovie(true);
    setCurrentExplanation(""); 
    setMovieSubtitle("");
    setTranslatedContent([]); // Reset translations
    
    // 2-second cinematic delay before starting narration
    setTimeout(() => {
      speak(slides[currentSlide], true);
    }, 2000);
  };

  const nextSlide = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setShowMovie(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setShowMovie(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  const slide = slides[currentSlide];

  return (
    <main className="h-screen w-full bg-[#020617] text-white overflow-hidden flex flex-col font-sans selection:bg-sky-500">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-sky-600/10 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" 
        />
      </div>

      <nav className="h-28 lg:h-36 px-8 lg:px-20 flex justify-between items-center bg-black/40 backdrop-blur-2xl border-b border-white/10 relative z-50">
        <div className="flex items-center gap-8 lg:gap-12">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-16 h-16 lg:w-20 lg:h-20 bg-sky-500 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(14,165,233,0.5)] cursor-pointer"
          >
             <Cpu className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
          </motion.div>
          <div>
            <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none">RAG <span className="text-sky-400">MASTERY</span></h1>
            <p className="text-sm lg:text-lg text-slate-400 font-bold tracking-[0.4em] mt-2 uppercase">AI EDUCATION</p>
          </div>
        </div>

        <div className="flex items-center gap-10 lg:gap-16">
          <div className="hidden md:flex items-center gap-6 bg-white/5 border border-white/10 px-8 py-4 rounded-[2rem]">
            <span className="text-lg font-black text-slate-500 uppercase tracking-widest">SLIDE</span>
            <span className="text-3xl lg:text-4xl font-black text-sky-400">{currentSlide + 1}<span className="text-slate-700 mx-2">/</span>{slides.length}</span>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowTopics(true)}
              className="p-6 lg:p-8 glass border border-white/10 rounded-[2rem] hover:bg-sky-600 transition-all group"
            >
              <BookOpen className="w-8 h-8 lg:w-10 lg:h-10 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-4 px-10 py-6 lg:px-14 lg:py-8 glass border-2 border-white/10 rounded-[2.5rem] hover:border-sky-500/50 transition-all font-black uppercase text-xl lg:text-2xl"
              >
                <Globe className="w-8 h-8 lg:w-10 lg:h-10 text-sky-400" />
                {selectedLang.name}
              </button>
              
              <AnimatePresence>
                {showSettings && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="absolute top-full right-0 mt-6 w-80 glass border-2 border-white/10 rounded-[3rem] p-4 z-[200] shadow-3xl"
                  >
                    {languages.map((l) => (
                      <button 
                        key={l.code} 
                        onClick={() => { setSelectedLang(l); setShowSettings(false); }}
                        className={`w-full text-left px-8 py-6 rounded-2xl text-xl lg:text-2xl font-black transition-all mb-2 last:mb-0 ${selectedLang.code === l.code ? 'bg-sky-600 text-white' : 'hover:bg-white/10 text-slate-300'}`}
                      >
                        {l.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow flex items-center px-10 lg:px-32 py-10 relative overflow-y-auto lg:overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: "anticipate" }}
            className="w-full grid lg:grid-cols-2 gap-16 lg:gap-32 items-center"
          >
            {/* Left: Text Content */}
            <div className="space-y-12 lg:space-y-20">
              <div className="space-y-6 lg:space-y-10">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block px-8 py-3 lg:px-10 lg:py-4 bg-sky-600/20 border-2 border-sky-500/30 rounded-full"
                >
                  <span className="text-sky-400 font-black text-lg lg:text-2xl uppercase tracking-[0.3em]">
                    {slide.subtitle || "Mastering RAG Technology"}
                  </span>
                </motion.div>
                
                <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-[6.5rem] font-black leading-[1.1] lg:leading-[1] uppercase tracking-tight">
                  {slide.title.split(' ').map((word, i) => (
                    <span key={i} className={i % 2 !== 0 ? "text-sky-400" : ""}>{word} </span>
                  ))}
                </h2>
              </div>

              <div className="space-y-6 lg:space-y-8">
                {slide.content.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="flex items-start gap-8 group"
                  >
                    <div className="mt-3 w-5 h-5 lg:w-7 lg:h-7 bg-sky-500 rounded-full shadow-[0_0_30px_rgba(14,165,233,1)] flex-shrink-0" />
                    <span className="text-3xl lg:text-4xl font-bold text-slate-200 group-hover:text-white leading-tight">{item}</span>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-8 lg:gap-12 pt-10">
                <button 
                  onClick={() => speak(slide)}
                  className={`group flex items-center justify-center w-24 h-24 lg:w-32 lg:h-32 rounded-[2.5rem] lg:rounded-[3rem] font-black transition-all shadow-3xl ${isSpeaking ? 'bg-rose-600 text-white' : 'bg-gradient-to-br from-sky-500 to-blue-700 text-white hover:scale-105 active:scale-95 shadow-sky-600/40'}`}
                  title="Voice Explanation"
                >
                  {isGenerating ? <Zap className="w-10 h-10 lg:w-14 lg:h-14 animate-spin" /> : isSpeaking ? <Pause className="w-10 h-10 lg:w-14 lg:h-14" /> : <Volume2 className="w-10 h-10 lg:w-14 lg:h-14" />}
                </button>

                <button 
                  onClick={startMovie}
                  className="flex items-center justify-center w-24 h-24 lg:w-32 lg:h-32 rounded-[2.5rem] lg:rounded-[3rem] border-4 border-white/10 glass hover:bg-white/10 transition-all group"
                  title="Watch Video"
                >
                  <Youtube className="w-10 h-10 lg:w-16 lg:h-16 text-sky-400 group-hover:scale-125 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right: Visual Content */}
            <div className="relative group hidden lg:block">
              <motion.div 
                className="relative z-10 rounded-[5rem] overflow-hidden border-[12px] border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)] aspect-[4/3]"
              >
                <img 
                  src={slide.imageUrl} 
                  className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" 
                  alt={slide.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-16 left-16 right-16 p-12 glass border-2 border-white/20 rounded-[3rem]">
                  <p className="text-xl font-black text-sky-400 uppercase tracking-[0.5em] mb-4">Deep Learning Insight</p>
                  <p className="text-4xl font-bold leading-tight">{slide.title}</p>
                </div>
              </motion.div>
              
              {/* Backglow */}
              <div className="absolute -inset-10 bg-sky-600/20 blur-[120px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <footer className="h-40 px-8 lg:px-20 flex items-center justify-between bg-black/60 border-t border-white/10 backdrop-blur-3xl relative z-50">
        <div className="flex items-center gap-10">
          <button 
            onClick={prevSlide}
            className="w-24 h-24 lg:w-28 lg:h-28 rounded-[2.5rem] border-4 border-white/10 glass flex items-center justify-center hover:bg-sky-600 hover:border-sky-500 transition-all group"
          >
            <ChevronLeft className="w-12 h-12 lg:w-16 lg:h-16 group-hover:scale-125 transition-transform" />
          </button>
          <button 
            onClick={nextSlide}
            className="w-24 h-24 lg:w-28 lg:h-28 rounded-[2.5rem] border-4 border-white/10 glass flex items-center justify-center hover:bg-sky-600 hover:border-sky-500 transition-all group"
          >
            <ChevronRight className="w-12 h-12 lg:w-16 lg:h-16 group-hover:scale-125 transition-transform" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-4 transition-all duration-700 rounded-full ${i === currentSlide ? 'w-32 lg:w-48 bg-sky-400 shadow-[0_0_20px_rgba(14,165,233,1)]' : 'w-6 bg-white/10 hover:bg-white/40'}`}
            />
          ))}
        </div>

        <div className="text-right hidden sm:block">
          <p className="text-2xl font-black text-slate-500 uppercase tracking-[0.4em]">Syeda Gulzar Bano</p>
          <p className="text-lg text-sky-400 font-bold uppercase tracking-[0.3em] mt-2">RAG Expert 2026</p>
        </div>
      </footer>

      {/* TOPICS OVERVIEW MODAL */}
      <AnimatePresence>
        {showTopics && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-3xl p-8 lg:p-20 overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto space-y-20">
              <div className="flex justify-between items-center border-b-2 border-sky-500/20 pb-12">
                <div className="space-y-6">
                  <h2 className="text-6xl lg:text-9xl font-black text-sky-400 uppercase tracking-tighter">RAG SYLLABUS</h2>
                  <p className="text-4xl text-sky-200/60 font-black uppercase tracking-[0.4em]">Mastering the Future of AI</p>
                </div>
                <button 
                  onClick={() => setShowTopics(false)}
                  className="p-10 glass rounded-[2.5rem] hover:bg-sky-600 transition-all border-2 border-sky-500/20"
                >
                  <X className="w-16 h-16 text-white" />
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-16">
                {slides.map((s, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => { setCurrentSlide(idx); setShowTopics(false); }}
                    className="group glass p-12 rounded-[5rem] border-4 border-white/5 hover:border-sky-500 transition-all cursor-pointer flex flex-col sm:flex-row gap-12 items-start sm:items-center"
                  >
                    <div className="w-32 h-32 rounded-[3rem] bg-sky-600/20 flex items-center justify-center text-5xl font-black text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all shrink-0 shadow-2xl shadow-sky-900/40">
                      0{idx + 1}
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-5xl lg:text-6xl font-black group-hover:text-sky-400 transition-colors uppercase leading-none">{s.title}</h3>
                      <p className="text-3xl lg:text-4xl text-sky-200 font-bold leading-relaxed">{s.subtitle}</p>
                      <div className="flex flex-wrap gap-4 pt-4">
                        {s.content.map((item, i) => (
                          <span key={i} className="px-8 py-4 bg-sky-600/10 border-2 border-sky-500/20 rounded-2xl text-xl lg:text-2xl font-black text-sky-300 uppercase tracking-wider">{item}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMovie && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#020617] flex flex-col overflow-hidden"
          >
            <div className="absolute top-8 right-8 flex gap-6 z-[2000]">
              <button 
                onClick={() => { 
                  if (isSpeaking) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  } else {
                    speak(slide, true);
                  }
                }}
                className={`flex items-center gap-4 px-8 py-4 glass rounded-2xl transition-all border border-white/10 group ${isSpeaking ? 'hover:bg-rose-600' : 'hover:bg-emerald-600'}`}
                title={isSpeaking ? "Stop Narration" : "Play Narration"}
              >
                {isSpeaking ? (
                  <div className="w-8 h-8 bg-white rounded-sm group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
                ) : (
                  <Play className="w-10 h-10 text-white fill-white group-hover:scale-110 transition-transform" />
                )}
              </button>
              <button 
                onClick={() => { setShowMovie(false); window.speechSynthesis.cancel(); setIsSpeaking(false); }}
                className="p-6 glass rounded-2xl hover:bg-sky-600 transition-all border border-white/10"
              >
                <X className="w-10 h-10 text-white" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row h-full">
              {/* Left Side: THE MOVIE VISUAL (High-Tech Cinematic) */}
              <div className="flex-grow lg:w-2/3 relative bg-black overflow-hidden border-r border-white/10">
                {/* Background Tech Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    x: [-10, 10, -10],
                    y: [-5, 5, -5]
                  }}
                  transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-full relative"
                >
                  <img 
                    src={slide.imageUrl} 
                    className="w-full h-full object-cover opacity-70 grayscale-[20%] brightness-110"
                    alt="Movie Content"
                  />
                  {/* Digital Glitch/Scanline Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none" />
                </motion.div>
                
                {/* Dynamic HUD Overlays */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-10 left-10 p-8 glass border-2 border-sky-500/20 rounded-[3rem] z-10 bg-black/40">
                     <div className="flex items-center gap-4 mb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                        <span className="text-sky-400 font-black tracking-widest text-lg uppercase">LIVE STREAM: {slide.title}</span>
                     </div>
                     <p className="text-xs text-sky-300/60 font-mono">FRAME_SEC: 60FPS // BUFFER: OPTIMIZED</p>
                  </div>

                  {/* Corner Tech Accents */}
                  <div className="absolute top-10 right-10 w-32 h-32 border-t-4 border-r-4 border-sky-500/30 rounded-tr-[3rem]" />
                  <div className="absolute bottom-10 left-10 w-32 h-32 border-b-4 border-l-4 border-sky-500/30 rounded-bl-[3rem]" />

                  {/* Pulsing Core Visual */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                     <motion.div 
                       animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.4, 0.1] }}
                       transition={{ duration: 4, repeat: Infinity }}
                       className="w-[30rem] h-[30rem] border-[20px] border-sky-500 rounded-full blur-3xl"
                     />
                  </div>
                </div>

                {/* Animated Data Stream */}
                <div className="absolute bottom-10 left-10 right-10 h-32 z-10 pointer-events-none flex items-end gap-2 px-10">
                   {[...Array(40)].map((_, i) => (
                     <motion.div 
                       key={i}
                       animate={{ height: [10, Math.random() * 80 + 20, 10] }}
                       transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                       className="w-2 bg-sky-500/40 rounded-t-sm"
                     />
                   ))}
                </div>
              </div>

              {/* Right Side: LIVE EXPLANATION SIDEBAR */}
              <div className="lg:w-1/3 glass-dark backdrop-blur-3xl flex flex-col p-8 sm:p-12 lg:p-20 relative overflow-y-auto min-h-[50vh] lg:min-h-0">
                <div className="mb-10 lg:mb-20 flex justify-center">
                   <RobotAvatar isSpeaking={isSpeaking} size="large" />
                </div>

                <div className="space-y-8 lg:space-y-12">
                   <div className="space-y-4">
                      <p className="text-sky-500 font-black text-xl lg:text-2xl uppercase tracking-[0.3em]">Live Explanation</p>
                      <div className="h-1.5 w-24 lg:w-32 bg-sky-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
                   </div>

                   <motion.div 
                     initial={{ opacity: 0, x: 50 }}
                     animate={{ opacity: 1, x: 0 }}
                     key={currentExplanation}
                     className="relative"
                   >
                     <p className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-[1.3] text-slate-100 italic">
                        {isGenerating ? (
                          selectedLang.code.startsWith('ur') ? "RAG Master-Class shuru ho rahi hai..." :
                          selectedLang.code.startsWith('hi') ? "RAG Master-Class shuru ho rahi hai..." :
                          selectedLang.code.startsWith('es') ? "RAG Master-Class comienza ahora..." :
                          selectedLang.code.startsWith('fr') ? "Le Master-Class RAG commence..." :
                          "RAG Master-Class is starting..."
                        ) : currentExplanation || (
                          selectedLang.code.startsWith('ur') ? "RAG Master-Class shuru ho rahi hai..." :
                          selectedLang.code.startsWith('hi') ? "RAG Master-Class shuru ho rahi hai..." :
                          "RAG Master-Class is starting..."
                        )}
                     </p>
                     
                     {/* Tech Accents - Using Translated Content */}
                     <div className="mt-12 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 border-t border-white/10 pt-10">
                        {(translatedContent.length > 0 ? translatedContent : slides[currentSlide].content).map((item: any, idx) => {
                          const displayString = typeof item === 'object' && item !== null 
                            ? (item.translatedPoint || item.point || item.text || item.content || "Processing...") 
                            : String(item);
                          return (
                          <div key={idx} className="flex items-start gap-4 group">
                             <div className="w-3 h-3 bg-sky-500 rounded-full mt-2 shrink-0 shadow-[0_0_10px_rgba(14,165,233,1)] group-hover:scale-125 transition-transform" />
                             <span className="text-lg lg:text-xl font-bold text-slate-400 uppercase tracking-tight group-hover:text-white transition-colors">{displayString}</span>
                          </div>
                          );
                        })}
                     </div>
                   </motion.div>
                </div>
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-white/5 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={isSpeaking ? { width: "100%" } : {}}
                 transition={{ duration: 45, ease: "linear" }}
                 className="h-full bg-gradient-to-r from-sky-600 to-blue-400 shadow-[0_0_20px_rgba(14,165,233,1)]"
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
