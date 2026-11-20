import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useSearch } from '../../context/SearchContext';
import { recommendationService } from '../../services/recommendationService';

export function AIChatPanel() {
  const { aiAssistantOpen, setAiAssistantOpen } = useApp();
  const { query: currentQuery, executeSearch } = useSearch();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! I'm RecoMind AI. Ask me for recommendations, alternatives, comparisons, or beginner roadmaps for courses, products, movies, tools, and more!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedSearches, setSuggestedSearches] = useState([
    'Best Python full-stack courses',
    'Free AI tools for developers',
    'Top machine learning roadmaps',
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!aiAssistantOpen) return null;

  const handleSend = async (userText = input) => {
    const text = userText.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const data = await recommendationService.chatAssistant(newMessages, currentQuery);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ]);
      if (data.suggested_searches && data.suggested_searches.length > 0) {
        setSuggestedSearches(data.suggested_searches);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm here to help! Explore the verified recommendations on screen, or try asking for specific criteria like 'free certifications' or 'beginner guides'.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRunSearch = (chip) => {
    executeSearch(chip);
    setAiAssistantOpen(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-[#111329] border-l border-purple-900/40 text-white shadow-2xl flex flex-col animate-slide-left">
      {/* Header */}
      <div className="p-4 border-b border-purple-900/30 flex items-center justify-between bg-[#17102F]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C22F5] to-[#A855F7] p-1 flex items-center justify-center shadow-purple-glow-sm">
            <img src="/robot.svg" alt="RecoMind AI" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>AI Assistant</span>
              <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
            </h3>
            <p className="text-[10px] text-purple-300/70">Personalized Discovery & Q&A</p>
          </div>
        </div>
        <button
          onClick={() => setAiAssistantOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${
              m.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                m.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gradient-to-br from-[#7C22F5] to-[#A855F7] text-white shadow-sm'
              }`}
            >
              {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#7C22F5] text-white rounded-tr-xs'
                  : 'bg-[#1C1738] border border-purple-800/40 text-purple-100 rounded-tl-xs'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-purple-300 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#7C22F5]" />
            <span>AI is finding top recommendations...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Search Prompts */}
      {suggestedSearches.length > 0 && (
        <div className="p-3 border-t border-purple-900/30 bg-[#14122E]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400 block mb-1.5">
            Quick Searches
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedSearches.map((s, i) => (
              <button
                key={i}
                onClick={() => handleRunSearch(s)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-purple-950/60 hover:bg-[#7C22F5]/30 border border-purple-500/30 text-purple-200 flex items-center gap-1 transition-all"
              >
                <span>{s}</span>
                <ArrowRight className="w-2.5 h-2.5 text-[#C084FC]" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-3 border-t border-purple-900/30 bg-[#17102F]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI anything..."
            className="flex-1 bg-white/10 border border-purple-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-purple-300/40 outline-none focus:border-[#C084FC]"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-xl bg-gradient-to-r from-[#7C22F5] to-[#A855F7] text-white disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
