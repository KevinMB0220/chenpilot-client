'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { toggleTheme } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { 
  X,
  Menu
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export function ChatLayout({ children }: ChatLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const theme = useAppSelector((state) => state.ui) || { mode: 'dark' };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock chat history data
  const chatHistory = [
    { id: '1', title: 'How to deploy my account?', timestamp: '2 hours ago' },
    { id: '2', title: 'What is my wallet balance?', timestamp: '1 day ago' },
    { id: '3', title: 'Create a new contact', timestamp: '2 days ago' },
    { id: '4', title: 'Explain Starknet features', timestamp: '3 days ago' },
    { id: '5', title: 'How to fund my account?', timestamp: '1 week ago' },
  ];

  const profileMenuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
    },
    {
      name: 'Contacts',
      href: '/contacts',
    },
    {
      name: 'Settings',
      href: '/settings',
    },
  ];

  const handleNewChat = () => {
    router.push('/chat');
    setSidebarOpen(false);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setSidebarOpen(false);
    setProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Successfully logged out!');
      router.push('/auth/login');
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error || 'Logout failed');
      toast.error(errorMessage);
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 bg-gray-900 shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        sidebarCollapsed ? "w-16" : "w-72"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
            <button 
              onClick={toggleSidebar}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <Menu className="h-6 w-6 text-purple-400" />
              ) : (
                <span className="text-xl font-bold text-purple-400">
                  ChenPilot
                </span>
              )}
            </button>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="px-4 py-4">
            <Button
              onClick={handleNewChat}
              className={cn(
                "w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl",
                sidebarCollapsed ? "px-3" : "px-4"
              )}
            >
              {!sidebarCollapsed && <span>New Chat</span>}
            </Button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-4">
            <div className="space-y-2">
              {!sidebarCollapsed && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Recent Chats
                </h3>
              )}
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleNavigation('/chat')}
                  className={cn(
                    "w-full text-left rounded-xl hover:bg-gray-800/50 transition-all duration-200 group border border-transparent hover:border-gray-700",
                    sidebarCollapsed ? "p-2" : "p-3"
                  )}
                  title={sidebarCollapsed ? chat.title : undefined}
                >
                  <div className="flex items-start space-x-3">
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200 group-hover:text-white transition-colors truncate">
                          {chat.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {chat.timestamp}
                        </p>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Profile Section */}
          <div className="border-t border-gray-700 p-4">
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className={cn(
                  "w-full flex items-center rounded-xl hover:bg-gray-800/50 transition-all duration-200 border border-transparent hover:border-gray-700",
                  sidebarCollapsed ? "justify-center p-2" : "justify-between p-3"
                )}
                title={sidebarCollapsed ? user?.name || user?.email : undefined}
              >
                <div className="flex items-center space-x-3">
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-white truncate">
                        {user?.name || user?.email}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  )}
                </div>
                {!sidebarCollapsed && (
                  profileMenuOpen ? (
                    <span className="text-gray-400">^</span>
                  ) : (
                    <span className="text-gray-400">v</span>
                  )
                )}
              </button>

              {/* Profile Menu Dropdown */}
              {profileMenuOpen && !sidebarCollapsed && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
                  {profileMenuItems.map((item) => {
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleNavigation(item.href)}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-200 hover:bg-gray-700/50 transition-all duration-200"
                      >
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                  <div className="border-t border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 transition-all duration-200"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
