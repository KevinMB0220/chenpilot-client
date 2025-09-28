'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { ChatLayout } from '@/components/layout/ChatLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { History, MessageCircle, Clock } from 'lucide-react';

export default function ChatHistoryPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ChatLayout>
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Chat History
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage your previous conversations with the AI agent.
              </p>
            </div>

            <Card>
              <div className="text-center py-12">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No chat history yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Your previous conversations will appear here once you start chatting.
                </p>
                <Button
                  onClick={() => router.push('/chat')}
                  className="inline-flex items-center"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ChatLayout>
  );
}
