'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateAgentStatus } from '@/store/slices/chatSlice';
import { 
  Wifi, 
  WifiOff, 
  Activity, 
  Zap, 
  DollarSign, 
  Bitcoin, 
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import apiService from '@/services/api';
import { AgentStatus as AgentStatusType, AgentCapabilities } from '@/types/agent';

interface AgentStatusProps {
  className?: string;
  showDetails?: boolean;
}

export default function AgentStatus({ className = '', showDetails = false }: AgentStatusProps) {
  const dispatch = useAppDispatch();
  const { agentStatus } = useAppSelector((state) => state.chat);
  const [status, setStatus] = useState<AgentStatusType | null>(null);
  const [capabilities, setCapabilities] = useState<AgentCapabilities | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkAgentStatus = async () => {
    setIsLoading(true);
    try {
      // Try to get status and capabilities, but don't fail if they're not available
      const [statusData, capabilitiesData] = await Promise.allSettled([
        apiService.getAgentStatus(),
        apiService.getAgentCapabilities()
      ]);
      
      const status = statusData.status === 'fulfilled' ? statusData.value : null;
      const capabilities = capabilitiesData.status === 'fulfilled' ? capabilitiesData.value : null;
      
      setStatus(status);
      setCapabilities(capabilities);
      
      // If we got at least one response, consider the agent connected
      const isConnected = statusData.status === 'fulfilled' || capabilitiesData.status === 'fulfilled';
      
      dispatch(updateAgentStatus({
        isConnected,
        lastHealthCheck: new Date().toISOString(),
        capabilities
      }));
      
      setLastCheck(new Date());
    } catch (error) {
      console.error('Failed to check agent status:', error);
      dispatch(updateAgentStatus({
        isConnected: false,
        lastHealthCheck: new Date().toISOString(),
        capabilities: null
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAgentStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkAgentStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-400" />;
    }
    
    if (agentStatus.isConnected) {
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusText = () => {
    if (isLoading) {
      return 'Checking...';
    }
    
    if (agentStatus.isConnected) {
      return 'Agent Online';
    } else {
      return 'Agent Offline';
    }
  };

  const getStatusColor = () => {
    if (isLoading) {
      return 'text-blue-400';
    }
    
    if (agentStatus.isConnected) {
      return 'text-green-400';
    } else {
      return 'text-red-400';
    }
  };

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName.toLowerCase()) {
      case 'vesu':
        return <DollarSign className="h-3 w-3" />;
      case 'atomiq':
        return <Zap className="h-3 w-3" />;
      case 'xverse':
        return <Bitcoin className="h-3 w-3" />;
      case 'troves':
        return <Building2 className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  const getServiceStatus = (service: any) => {
    if (service.isHealthy) {
      return <CheckCircle className="h-3 w-3 text-green-400" />;
    } else {
      return <AlertCircle className="h-3 w-3 text-yellow-400" />;
    }
  };

  if (!showDetails) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getStatusIcon()}
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        <button
          onClick={checkAgentStatus}
          disabled={isLoading}
          className="p-1 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          title="Refresh status"
        >
          <Activity className="h-4 w-4" />
        </button>
      </div>

      {status && (
        <div className="space-y-3">
          <div className="text-xs text-gray-400">
            Version: {status.version} | Uptime: {Math.floor(status.uptime / 3600)}h
          </div>
          
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-300">Services</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(status.services).map(([name, service]) => (
                <div key={name} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                  <div className="flex items-center space-x-2">
                    {getServiceIcon(name)}
                    <span className="text-xs text-gray-300 capitalize">{name}</span>
                  </div>
                  {getServiceStatus(service)}
                </div>
              ))}
            </div>
          </div>

          {capabilities && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-300">Capabilities</div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(capabilities.features)
                  .filter(([_, enabled]) => enabled)
                  .map(([feature, _]) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded"
                    >
                      {feature}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {lastCheck && (
            <div className="text-xs text-gray-500">
              Last check: {lastCheck.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
