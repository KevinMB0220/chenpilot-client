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
  Wallet, 
  Zap, 
  Shield, 
  TrendingUp, 
  Copy, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  MessageCircle,
  Users,
  History
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
      icon: MessageCircle,
      action: () => router.push('/chat'),
      color: 'bg-blue-500',
    },
    {
      title: 'Manage Contacts',
      description: 'Add and organize your contacts',
      icon: Users,
      action: () => router.push('/contacts'),
      color: 'bg-green-500',
    },
    {
      title: 'View Transactions',
      description: 'Check your transaction history',
      icon: History,
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
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's an overview of your ChenPilot account and recent activity.
          </p>
        </div>

        {/* Account Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Wallet Address */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Wallet Address
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {status?.address ? formatAddress(status.address) : 'Loading...'}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-primary-600" />
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Account Status
                </p>
                <div className="flex items-center mt-1">
                  {status?.isDeployed ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-1" />
                  )}
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {status?.isDeployed ? 'Deployed' : 'Not Deployed'}
                  </span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-primary-600" />
            </div>
            {!status?.isDeployed && (
              <Button
                size="sm"
                className="mt-2"
                onClick={() => {
                  // TODO: Implement account deployment
                  toast('Account deployment coming soon!', { icon: 'ℹ️' });
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Funding Status
                </p>
                <div className="flex items-center mt-1">
                  {status?.isFunded ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-1" />
                  )}
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {status?.isFunded ? 'Funded' : 'Not Funded'}
                  </span>
                </div>
              </div>
              <Zap className="h-8 w-8 text-primary-600" />
            </div>
            {!status?.isFunded && (
              <Button
                size="sm"
                className="mt-2"
                onClick={() => {
                  // TODO: Implement account funding
                  toast('Account funding coming soon!', { icon: 'ℹ️' });
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  STRK Balance
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {balance ? formatTokenAmount(balance.balance, 4, 'STRK') : 'Loading...'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary-600" />
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recent Activity
          </h2>
          <Card>
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No recent activity
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Complete Your Setup
            </h2>
            <Card>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    status?.isDeployed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {status?.isDeployed ? <CheckCircle className="h-5 w-5" /> : '1'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Deploy Your Account
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
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
                    status?.isFunded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {status?.isFunded ? <CheckCircle className="h-5 w-5" /> : '2'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Fund Your Account
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
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
