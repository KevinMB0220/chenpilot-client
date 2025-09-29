'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAccountStatus, getBalance } from '@/store/slices/accountSlice';
import { loadUser } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChatLayout } from '@/components/layout/ChatLayout';
import { 
  Copy, 
  ExternalLink
} from 'lucide-react';
import { formatAddress, formatTokenAmount } from '@/utils/format';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { status, balance, isLoading } = useAppSelector((state) => state.account);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Load user data and account status
    dispatch(loadUser());
    dispatch(getAccountStatus());
    dispatch(getBalance());
  }, [dispatch, isAuthenticated, router]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const quickActions = [
    {
      title: 'Chat with AI Agent',
      description: 'Ask questions or execute DeFi operations',
      action: () => router.push('/chat'),
      color: 'bg-blue-500',
    },
    {
      title: 'Manage Contacts',
      description: 'Add and organize your contacts',
      action: () => router.push('/contacts'),
      color: 'bg-green-500',
    },
    {
      title: 'View Transactions',
      description: 'Check your transaction history',
      action: () => router.push('/transactions'),
      color: 'bg-purple-500',
    },
  ];

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
      <div className="h-full flex flex-col bg-black text-white overflow-hidden relative">
        {/* Simple Background */}
        <div className="absolute inset-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-300">
            Here's an overview of your ChenPilot account and recent activity.
          </p>
        </div>

        {/* Account Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Wallet Address */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">
                  Wallet Address
                </p>
                <p className="text-lg font-semibold text-white">
                  {status?.address ? formatAddress(status.address) : 'Loading...'}
                </p>
              </div>
            </div>
            {status?.address && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => copyToClipboard(status.address, 'Address')}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            )}
          </Card>

          {/* Account Status */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">
                  Account Status
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-lg font-semibold text-white">
                    {status?.isDeployed ? 'Deployed' : 'Not Deployed'}
                  </span>
                </div>
              </div>
            </div>
            {!status?.isDeployed && (
              <Button
                size="sm"
                className="mt-2"
                onClick={() => {
                  // TODO: Implement account deployment
                  toast('Account deployment coming soon!');
                }}
              >
                Deploy Account
              </Button>
            )}
          </Card>

          {/* Funding Status */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">
                  Funding Status
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-lg font-semibold text-white">
                    {status?.isFunded ? 'Funded' : 'Not Funded'}
                  </span>
                </div>
              </div>
            </div>
            {!status?.isFunded && (
              <Button
                size="sm"
                className="mt-2"
                onClick={() => {
                  // TODO: Implement account funding
                  toast('Account funding coming soon!');
                }}
              >
                Fund Account
              </Button>
            )}
          </Card>

          {/* Balance */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">
                  STRK Balance
                </p>
                <p className="text-lg font-semibold text-white">
                  {balance ? formatTokenAmount(balance.balance, 4, 'STRK') : 'Loading...'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => dispatch(getBalance())}
            >
              Refresh
            </Button>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {action.title}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {action.description}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={action.action}
                    >
                      Get Started
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Recent Activity
          </h2>
          <Card>
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-white mb-2">
                No recent activity
              </h3>
              <p className="text-gray-300 mb-4">
                Your recent transactions and interactions will appear here.
              </p>
              <Button
                onClick={() => router.push('/chat')}
              >
                Start with AI Agent
              </Button>
            </div>
          </Card>
        </div>

        {/* Account Setup Progress */}
        {(!status?.isDeployed || !status?.isFunded) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Complete Your Setup
            </h2>
            <Card>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    status?.isDeployed ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                  }`}>
                    {status?.isDeployed ? '✓' : '1'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">
                      Deploy Your Account
                    </h3>
                    <p className="text-sm text-gray-300">
                      Deploy your Starknet account to start using ChenPilot
                    </p>
                  </div>
                  {!status?.isDeployed && (
                    <Button size="sm">
                      Deploy Now
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    status?.isFunded ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                  }`}>
                    {status?.isFunded ? '✓' : '2'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">
                      Fund Your Account
                    </h3>
                    <p className="text-sm text-gray-300">
                      Add STRK tokens to your account for transactions
                    </p>
                  </div>
                  {!status?.isFunded && (
                    <Button size="sm">
                      Fund Now
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
      </div>
    </ChatLayout>
  );
}
