import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../utils/api';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Compass, 
  BookOpen, 
  IndianRupee, 
  Scale, 
  CheckCircle2, 
  ArrowRight,
  RotateCcw,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { Job } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedPrompts?: string[];
  timestamp: string;
}

interface AiCareerAssistantPageProps {
  initialJobContext?: Job | null;
  onClearJobContext?: () => void;
  onNavigateStudyPlanner: (examName?: string) => void;
  onBack?: () => void;
}

export const AiCareerAssistantPage: React.FC<AiCareerAssistantPageProps> = ({
  initialJobContext,
  onClearJobContext,
  onNavigateStudyPlanner,
  onBack,
}) => {
  const { user } = useAuth();
  const { language, t, translateEducation, translateCategory } = useLanguage();

  const getInitialWelcome = (): Message => ({
    id: 'welcome',
    sender: 'assistant',
    text: language === 'te'
      ? `నమస్కారం ${user?.name || 'అభ్యర్థి'}! నేను మీ AI ప్రభుత్వ కెరీర్ సలహాదారుని (Gemini 3.7 Flash ఆధారితం).\n\nమీ ప్రొఫైల్ ఆధారంగా (${translateEducation(user?.profile?.educationLevel || 'Graduation / Bachelor\'s')}, ${user?.profile?.branch || 'CSE'}, ${translateCategory(user?.profile?.category || 'General')} కేటగిరీ), రిక్రూట్‌మెంట్ విధానాలు, సిలబస్ విశ్లేషణ, జీతాల వివరాలు లేదా వ్యక్తిగత కెరీర్ ప్రణాళిక గురించి నన్ను ఏమైనా అడగండి!`
      : `Hello ${user?.name || 'Aspirant'}! I am your AI Government Career Advisor, powered by Gemini 3.7 Flash.\n\nI have access to your eligibility profile (${user?.profile?.educationLevel || 'Graduate'}, ${user?.profile?.degree || 'B.Tech'} in ${user?.profile?.branch || 'CSE'}, ${user?.profile?.category || 'General'} category). Ask me anything about recruitment patterns, exam syllabus breakdowns, salary structures, or personalized career roadmaps!`,
    suggestedPrompts: language === 'te'
      ? [
          `${user?.profile?.degree || 'B.Tech'} తో నేను ఏ కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ ఉద్యోగాలకు దరఖాస్తు చేసుకోవచ్చు?`,
          'SSC CGL మరియు బ్యాంక్ PO (IBPS/SBI) మధ్య జీతం, పోస్టింగ్స్ మరియు వృద్ధి పరంగా తేడాలు ఏమిటి?',
          'UPSC / APPSC / TSPSC కోసం జనరల్ స్టడీస్ & కరెంట్ అఫైర్స్ ఎలా సిద్ధం కావాలి?',
          'ISRO ICRB సైంటిస్ట్ / ఇంజనీర్ పరీక్ష విధానం మరియు ప్రిపరేషన్ వ్యూహం వివరించండి'
        ]
      : [
          `What all central & state govt jobs can I apply with ${user?.profile?.degree || 'B.Tech CSE'}?`,
          'Compare SSC CGL vs Bank PO (IBPS/SBI) for growth, salary & postings',
          'How should I prepare for GS & Current Affairs for UPSC/State PSC?',
          'Explain ISRO ICRB Scientist exam pattern and preparation strategy'
        ],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  const [messages, setMessages] = useState<Message[]>([getInitialWelcome()]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // If launched with job context, send an automatic initial prompt
  useEffect(() => {
    if (initialJobContext) {
      const prompt = language === 'te'
        ? `${initialJobContext.organization} - ${initialJobContext.title} కోసం పూర్తి పరీక్ష విధానం, సిలబస్ వెయిటేజ్ మరియు ప్రిపరేషన్ వ్యూహం తెలపండి.`
        : `Tell me the complete exam pattern, syllabus weightage, and preparation strategy for ${initialJobContext.organization} - ${initialJobContext.title}.`;
      handleSend(prompt);
      if (onClearJobContext) onClearJobContext();
    }
  }, [initialJobContext]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input.trim();
    if (!messageText || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build conversation history payload
      const historyPayload = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await api.sendAiChat({
        message: messageText,
        conversationHistory: historyPayload,
        language: language,
      });

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        suggestedPrompts: res.suggestedPrompts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: language === 'te'
          ? `క్షమించండి, మీ ప్రశ్నకు సమాధానం ఇవ్వడంలో సమస్య ఎదురైంది: ${err.message || 'దయచేసి కాసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.'}`
          : `Sorry, I encountered an error answering your query: ${err.message || 'Please try again in a moment.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([getInitialWelcome()]);
  };

  return (
    <div className="space-y-4 pb-12 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 flex-shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              id="btn-ai-back"
              onClick={onBack}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm group"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base text-white">
                {t('ai.title', 'AI Career & Exam Advisor')}
              </h1>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-bold">
                Gemini 3.7 Flash {language === 'te' ? '• తెలుగు' : ''}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {t('ai.subtitle', 'Personalized guidance tailored to your degree & reservation category.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateStudyPlanner()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950 text-blue-300 border border-blue-800 text-xs font-semibold hover:bg-blue-900/50 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'te' ? 'స్టడీ షెడ్యూల్ రూపొందించండి' : 'Generate Study Schedule'}</span>
          </button>

          <button
            id="btn-clear-ai-chat"
            onClick={handleClearChat}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={language === 'te' ? 'సంభాషణను రీసెట్ చేయండి' : 'Reset conversation'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 text-xs shadow mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none shadow-lg'
            }`}>
              {/* Message text with basic formatting */}
              <div className="whitespace-pre-wrap space-y-2 font-normal">
                {msg.text}
              </div>

              {/* AI Badge for assistant */}
              {msg.sender === 'assistant' && (
                <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-blue-400" />
                    {language === 'te' ? 'AI కెరీర్ మార్గదర్శకత్వం • అధికారిక నియమాల ప్రకారం' : 'AI Career Guidance • Verified against recruitment rules'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
              )}

              {/* Suggested Follow-up Prompts */}
              {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-1.5">
                  <p className="text-[11px] font-semibold text-blue-300">
                    {language === 'te' ? 'సూచించబడిన తదుపరి ప్రశ్నలు:' : 'Suggested Follow-ups:'}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {msg.suggestedPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(p)}
                        className="text-left px-2.5 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-[11px] text-slate-300 hover:text-blue-300 border border-slate-700 hover:border-blue-500/50 transition-colors flex items-center justify-between gap-2"
                      >
                        <span className="truncate">{p}</span>
                        <ArrowRight className="w-3 h-3 flex-shrink-0 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center flex-shrink-0 text-xs shadow mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 text-xs shadow mt-1">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-slate-400">
                {language === 'te' ? 'అధికారిక సిలబస్ & పరీక్ష నియమాలను పరిశీలిస్తోంది...' : 'Consulting official exam frameworks & syllabus...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-2 sm:p-3 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="input-ai-chat"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ai.placeholder', 'Ask about exam patterns, career path after B.Tech/B.Sc, syllabus weightage, promotions...')}
            className="w-full bg-transparent px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            disabled={loading}
          />
          <button
            id="btn-send-ai-message"
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-all flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

