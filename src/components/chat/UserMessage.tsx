'use client';

import React, { useState } from 'react';
import { ChatMessage } from '@/types';
import { Copy, Check, Edit2, Check as CheckIcon, X } from 'lucide-react';

interface UserMessageProps {
  message: ChatMessage;
  onCopy?: (text: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
}

export default function UserMessage({ message, onCopy, onEdit }: UserMessageProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content as string);

  const handleCopy = async () => {
    const content = message.content as string;
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(message.content as string);
  };

  const handleSaveEdit = () => {
    if (onEdit && editContent.trim() !== message.content) {
      onEdit(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content as string);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="max-w-3xl bg-[#7C3AED] text-white rounded-2xl px-6 py-4 group relative">
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-white placeholder:text-gray-300 focus:outline-none resize-none"
            rows={Math.max(1, editContent.split('\n').length)}
            autoFocus
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveEdit}
              className="p-1 text-green-400 hover:text-green-300 transition-colors"
              title="Save changes"
            >
              <CheckIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1 text-red-400 hover:text-red-300 transition-colors"
              title="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="whitespace-pre-wrap leading-relaxed text-lg pr-12">
            {message.content}
          </p>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
            <button
              onClick={handleCopy}
              className="p-1 text-gray-300 hover:text-white transition-colors"
              title="Copy message"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={handleEdit}
              className="p-1 text-gray-300 hover:text-white transition-colors"
              title="Edit message"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
