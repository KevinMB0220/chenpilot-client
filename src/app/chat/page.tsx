'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { sendMessage, addUserMessage, clearMessages } from '@/store/slices/chatSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChatLayout } from '@/components/layout/ChatLayout';
import { 
  Send, 
  Loader2,
  RotateCcw,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  Mic,
  Square,
  X
} from 'lucide-react';
import { formatRelativeTime } from '@/utils/format';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { messages, isLoading, isTyping } = useAppSelector((state) => state.chat);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue('');

    // Add user message immediately
    dispatch(addUserMessage(message));

    try {
      await dispatch(sendMessage(message)).unwrap();
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error || 'Failed to send message');
      toast.error(errorMessage);
    }
  };

  const handleClearChat = () => {
    dispatch(clearMessages());
    toast.success('Chat cleared');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    toast.success('Voice recording started');
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    setRecordingTime(0);
    toast.success('Voice recording stopped');
  };

  const enterVoiceMode = () => {
    setIsVoiceMode(true);
    toast.success('Voice chat mode activated');
  };

  const exitVoiceMode = () => {
    setIsVoiceMode(false);
    if (isRecording) {
      stopRecording();
    }
    toast.success('Returned to text chat');
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }


  return (
    <ChatLayout>
      <div className="h-full flex flex-col bg-black text-white overflow-hidden relative">
        {/* Animated Background */}
        <div className="absolute inset-0">
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {isVoiceMode ? (
              /* Voice Chat Interface */
              <div className="h-full flex items-center justify-center p-8 relative z-10">
                <div className="text-center max-w-2xl">
                  <div className="relative mb-8">
                    <div className="w-40 h-40 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                      <Mic className="h-20 w-20 text-white" />
                    </div>
                  </div>
                  
                  <h2 className="text-4xl font-bold text-purple-400 mb-6">
                    Voice Chat Mode
                  </h2>
                  <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    Click the microphone to start speaking. I'll listen and respond to your voice commands.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      {!isRecording ? (
                        <button
                          onClick={startRecording}
                          className="w-24 h-24 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-700"
                        >
                          <Mic className="h-10 w-10 text-white" />
                        </button>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          {/* Animated Sound Frequency Bars */}
                          <div className="flex items-end space-x-1 h-12">
                            <div className="w-1 bg-gray-400 rounded-full frequency-bar" style={{ height: '20px', animationDelay: '0ms' }}></div>
                            <div className="w-1 bg-gray-500 rounded-full frequency-bar" style={{ height: '32px', animationDelay: '100ms' }}></div>
                            <div className="w-1 bg-gray-400 rounded-full frequency-bar" style={{ height: '24px', animationDelay: '200ms' }}></div>
                            <div className="w-1 bg-gray-500 rounded-full frequency-bar" style={{ height: '40px', animationDelay: '300ms' }}></div>
                            <div className="w-1 bg-gray-400 rounded-full frequency-bar" style={{ height: '28px', animationDelay: '400ms' }}></div>
                            <div className="w-1 bg-gray-500 rounded-full frequency-bar" style={{ height: '36px', animationDelay: '500ms' }}></div>
                            <div className="w-1 bg-gray-400 rounded-full frequency-bar" style={{ height: '22px', animationDelay: '600ms' }}></div>
                            <div className="w-1 bg-gray-500 rounded-full frequency-bar" style={{ height: '30px', animationDelay: '700ms' }}></div>
                            <div className="w-1 bg-gray-400 rounded-full frequency-bar" style={{ height: '26px', animationDelay: '800ms' }}></div>
                </div>
              </div>
                      )}
                    </div>
                    
                    {isRecording && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-2">
                          {formatRecordingTime(recordingTime)}
            </div>
                        <p className="text-gray-400 mb-4">Listening...</p>
                        <div className="flex justify-center space-x-4">
                          <button
                            onClick={stopRecording}
                            className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
                            title="Stop Recording"
                          >
                            <Square className="h-6 w-6" />
                          </button>
                          <button
                            onClick={exitVoiceMode}
                            className="w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-all duration-200 border border-gray-700"
                            title="Exit Voice Mode"
                          >
                            <X className="h-6 w-6" />
                          </button>
            </div>
          </div>
                    )}
                    
                    {!isRecording && (
                      <div className="flex justify-center">
                        <button
                          onClick={exitVoiceMode}
                          className="w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-all duration-200 border border-gray-700"
                          title="Exit Voice Mode"
                        >
                          <X className="h-6 w-6" />
                        </button>
                  </div>
                    )}
                  </div>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex items-center justify-center p-8 relative z-10">
                <div className="text-center max-w-4xl">
              
                  <h2 className="text-4xl font-bold text-purple-400 mb-6">
                    Welcome to ChenPilot AI
                  </h2>
                  <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                    I'm your AI assistant for DeFi operations. Ask me anything about your account, 
                    transactions, or how to perform complex operations across Bitcoin and Starknet.
                  </p>
              </div>
            </div>
          ) : (
              <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 relative z-10">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                      className={`max-w-3xl group ${
                      message.type === 'user'
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-900/80 backdrop-blur-sm text-white border border-gray-800 shadow-sm hover:shadow-md transition-shadow'
                      } rounded-2xl px-6 py-4`}
                  >
                    <div className="flex items-start space-x-3">
                        <div className="flex-1 min-w-0">
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <p className="whitespace-pre-wrap m-0 leading-relaxed">{message.content}</p>
                          </div>
                          {message.metadata?.type === 'error' && (
                            <div className="mt-3 flex items-center text-red-400 bg-red-900/20 px-3 py-2 rounded-lg border border-red-800">
                              <XCircle className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">Error occurred</span>
                            </div>
                          )}
                          {message.metadata?.type === 'success' && (
                            <div className="mt-3 flex items-center text-green-400 bg-green-900/20 px-3 py-2 rounded-lg border border-green-800">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">Operation completed</span>
                        </div>
                      )}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-xs text-gray-400 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatRelativeTime(message.timestamp)}
                            </div>
                            {message.type === 'assistant' && (
                              <button
                              onClick={() => copyToClipboard(message.content)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                                title="Copy message"
                            >
                              <Copy className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl px-6 py-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                        <span className="text-sm text-gray-400">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
        {!isVoiceMode && (
          <div className="bg-black border-t border-gray-800 relative z-10">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
                <div className="flex-1 relative">
                  <div className="relative">
                    {/* Shining border animation */}
                    <div className="absolute inset-0 bg-purple-500/30 rounded-xl animate-border-shine opacity-0 hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    <div className="absolute inset-[1px] bg-black rounded-xl"></div>
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask me anything about your DeFi operations..."
                disabled={isLoading}
                      className="min-h-[52px] pr-20 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 rounded-xl relative z-10"
                    />
                    {/* Shining background animation */}
                    <div className="absolute inset-0 bg-purple-500/20 rounded-xl animate-shine opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 z-20">
                    <button
                      type="button"
                      onClick={enterVoiceMode}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="Enter voice chat mode"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                  </div>
            </div>
                <div className="flex items-center space-x-2">
                  {messages.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearChat}
                      className="text-gray-400 hover:text-white p-3"
                      title="Clear chat"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
            </Button>
                </div>
          </form>
            </div>
        </div>
        )}
      </div>
    </ChatLayout>
  );
}

<style jsx>{`
  @keyframes frequency-wave {
    0%, 100% { 
      transform: scaleY(0.3);
      opacity: 0.7;
    }
    50% { 
      transform: scaleY(1);
      opacity: 1;
    }
  }
  
  @keyframes shine {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  @keyframes border-shine {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  .frequency-bar {
    animation: frequency-wave 1.5s ease-in-out infinite;
  }
  
  .animate-shine {
    animation: shine 2s ease-in-out infinite;
  }
  
  .animate-border-shine {
    animation: border-shine 3s linear infinite;
  }
`}</style>