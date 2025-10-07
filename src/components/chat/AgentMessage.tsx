'use client';

import React, { useState } from 'react';
import { ChatMessage } from '@/types';
import { Copy, Check } from 'lucide-react';

interface AgentMessageProps {
  message: ChatMessage;
  onCopy?: (text: string) => void;
}

export default function AgentMessage({ message, onCopy }: AgentMessageProps) {
  const [copied, setCopied] = useState(false);

  // Handle both string and object content
  const renderContent = () => {
    if (typeof message.content === 'string') {
      return message.content;
    }
    
    if (typeof message.content === 'object' && message.content !== null) {
      // If it's an object, try to extract meaningful text or stringify it
      if ((message.content as any).vaults && Array.isArray((message.content as any).vaults)) {
        return `Found ${(message.content as any).vaults.length} vault(s) available.`;
      }
      
      // For other objects, return a generic message
      return 'Operation completed successfully.';
    }
    
    return String(message.content || '');
  };

  const handleCopy = async () => {
    const content = renderContent();
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      if (onCopy) {
        onCopy(content);
      }
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div className="text-white text-left group relative">
      <p className="whitespace-pre-wrap leading-relaxed text-lg pr-8">
        {renderContent()}
      </p>
      <button
        onClick={handleCopy}
        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-white"
        title="Copy message"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
