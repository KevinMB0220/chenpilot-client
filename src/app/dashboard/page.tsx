'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAccountStatus, getBalance, deployAccount, fundAccount, getStellarNetworkStatus } from '@/store/slices/accountSlice';
import { loadUser } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChatLayout } from '@/components/layout/ChatLayout';
import { 
  Copy, 
  ExternalLink,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { formatAddress, formatTokenAmount } from '@/utils/format';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { status, balance, isLoading, network } = useAppSelector((state) => state.account);
  const { messages } = useAppSelector((state) => state.chat);

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

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const refreshNetworkStatus = () => {
      dispatch(getStellarNetworkStatus());
    };

    refreshNetworkStatus();
    const interval = setInterval(refreshNetworkStatus, 15000);

    return () => clearInterval(interval);
  }, [dispatch, isAuthenticated]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleDeployAccount = async () => {
    try {
      await dispatch(deployAccount()).unwrap();
      toast.success('Account deployment initiated!');
      // Refresh account status
      dispatch(getAccountStatus());
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Deployment failed';
      toast.error(errorMessage);
    }
  };

  const handleFundAccount = async () => {
    try {
      await dispatch(fundAccount()).unwrap();
      toast.success('Account funding initiated!');
      // Refresh account status and balance
      dispatch(getAccountStatus());
      dispatch(getBalance());
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Funding failed';
      toast.error(errorMessage);
    }
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

  const networkStatusLabel =
    network.status === 'healthy'
      ? 'Healthy'
      : network.status === 'degraded'
        ? 'Degraded'
        : network.status === 'down'
          ? 'Down'
          : 'Checking';

  const networkStatusColor =
    network.status === 'healthy'
      ? 'text-green-400'
      : network.status === 'degraded'
        ? 'text-yellow-400'
        : network.status === 'down'
          ? 'text-red-400'
          : 'text-gray-300';

  const syncStatusLabel =
    network.accountSyncState === 'synced'
      ? 'Synced'
      : network.accountSyncState === 'syncing'
        ? 'Syncing'
        : 'Desynced';

  const syncStatusColor =
    network.accountSyncState === 'synced'
      ? 'text-green-400'
      : network.accountSyncState === 'syncing'
        ? 'text-yellow-400'
        : 'text-red-400';

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
                onClick={handleDeployAccount}
                disabled={isLoading}
              >
                {isLoading ? 'Deploying...' : 'Deploy Account'}
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
                onClick={handleFundAccount}
                disabled={isLoading}
              >
                {isLoading ? 'Funding...' : 'Fund Account'}
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

        {/* Stellar Network */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Stellar Network
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    Network Status
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Activity className={`h-4 w-4 ${networkStatusColor}`} />
                    <span className={`text-lg font-semibold ${networkStatusColor}`}>
                      {networkStatusLabel}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(getStellarNetworkStatus())}
                >
                  Refresh
                </Button>
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-300">
                <div className="flex items-center justify-between">
                  <span>Latest Ledger</span>
                  <span className="text-white font-medium">
                    {network.latestLedger ?? 'Loading...'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ledger Age</span>
                  <span className="text-white font-medium">
                    {network.ledgerAgeSeconds !== null
                      ? `${network.ledgerAgeSeconds}s`
                      : 'Loading...'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Updated</span>
                  <span className="text-white font-medium">
                    {network.lastUpdated
                      ? new Date(network.lastUpdated).toLocaleTimeString()
                      : 'Loading...'}
                  </span>
                </div>
              </div>
              {network.congestion && (
                <div className="mt-4 flex items-start space-x-2 rounded-lg bg-yellow-500/10 p-3 text-yellow-300">
                  <AlertTriangle className="h-4 w-4 mt-0.5" />
                  <span className="text-sm">
                    Congestion detected. Transactions may take longer to confirm.
                  </span>
                </div>
              )}
            </Card>

            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    Account Sync State
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-lg font-semibold ${syncStatusColor}`}>
                      {syncStatusLabel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Based on the latest ledger signal from Horizon.
                  </p>
                </div>
              </div>
              {network.accountSyncState === 'desynced' && (
                <div className="mt-4 flex items-start space-x-2 rounded-lg bg-red-500/10 p-3 text-red-300">
                  <AlertTriangle className="h-4 w-4 mt-0.5" />
                  <span className="text-sm">
                    Account appears out of sync. Try refreshing or check network conditions.
                  </span>
                </div>
              )}
              {network.accountSyncState === 'syncing' && (
                <div className="mt-4 flex items-start space-x-2 rounded-lg bg-yellow-500/10 p-3 text-yellow-300">
                  <AlertTriangle className="h-4 w-4 mt-0.5" />
                  <span className="text-sm">
                    Syncing with the network. Recent updates may be delayed.
                  </span>
                </div>
              )}
            </Card>
          </div>
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
            {messages.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">
                    Recent Chat Messages
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/chat')}
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {messages.slice(-5).reverse().map((message, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-gray-800/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        message.type === 'user' ? 'bg-blue-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-white">
                            {message.type === 'user' ? 'You' : 'AI Agent'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 truncate">
                          {message.content.length > 100 
                            ? message.content.substring(0, 100) + '...' 
                            : message.content
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
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
            )}
          </Card>
        </div>

        {/* Transaction History */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Transaction History
          </h2>
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  Recent Transactions
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement transaction history fetch
                    toast('Transaction history coming soon!');
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </div>
              
              {/* Mock transaction data - will be replaced with real data */}
              <div className="space-y-3">
                {status?.deploymentTransactionHash && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">
                          Account Deployment
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300">
                        Transaction: {formatAddress(status.deploymentTransactionHash)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-green-400">Deployed</span>
                    </div>
                  </div>
                )}
                
                {status?.fundingTransactionHash && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <ArrowDownLeft className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">
                          Account Funding
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300">
                        Transaction: {formatAddress(status.fundingTransactionHash)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-blue-400">Funded</span>
                    </div>
                  </div>
                )}
                
                {!status?.deploymentTransactionHash && !status?.fundingTransactionHash && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      No transactions yet
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Your transaction history will appear here once you start using ChenPilot.
                    </p>
                    <Button
                      onClick={() => router.push('/chat')}
                    >
                      Start with AI Agent
                    </Button>
                  </div>
                )}
              </div>
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
                    <Button 
                      size="sm"
                      onClick={handleDeployAccount}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Deploying...' : 'Deploy Now'}
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
                    <Button 
                      size="sm"
                      onClick={handleFundAccount}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Funding...' : 'Fund Now'}
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
