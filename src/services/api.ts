import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { 
  RegisterRequest, 
  LoginRequest, 
  RegisterResponse, 
  LoginResponse, 
  User, 
  Contact, 
  CreateContactRequest, 
  UpdateContactRequest,
  BalanceResponse,
  AgentQueryRequest,
  AgentQueryResponse,
  ApiResponse
} from '@/types';
import mockApiService from './mockApi';

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;
  private useMock: boolean = false;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:2333',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if we should use mock service (when no backend is available)
    this.useMock = process.env.NODE_ENV === 'development' && 
                   (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' ||
                    !process.env.NEXT_PUBLIC_API_BASE_URL || 
                    process.env.NEXT_PUBLIC_API_BASE_URL === 'http://localhost:2333');

    if (this.useMock) {
      console.log('🔧 Using Mock API Service for development');
    }

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          // Redirect to login or dispatch logout action
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  loadTokenFromStorage() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.token = token;
      }
    }
  }

  // Authentication endpoints
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    if (this.useMock) {
      return await mockApiService.register(data);
    }
    
    try {
      const response = await this.api.post<RegisterResponse>('/auth/register', data);
      return response.data;
    } catch (error) {
      // Fallback to mock service if backend is not available
      console.warn('Backend not available, using mock service for register');
      return await mockApiService.register(data);
    }
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    if (this.useMock) {
      return await mockApiService.login(data);
    }
    
    try {
      const response = await this.api.post<LoginResponse>('/auth/login', data);
      if (response.data.success && response.data.data.token) {
        this.setToken(response.data.data.token);
      }
      return response.data;
    } catch (error) {
      // Fallback to mock service if backend is not available
      console.warn('Backend not available, using mock service for login');
      return await mockApiService.login(data);
    }
  }

  async googleAuth(token: string): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/auth/google-auth', { token });
    if (response.data.success && response.data.data.token) {
      this.setToken(response.data.data.token);
    }
    return response.data;
  }

  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.api.get<ApiResponse<{ message: string }>>(`/auth/verify-email/${token}`);
    return response.data;
  }

  async resendVerification(email: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.api.post<ApiResponse<{ message: string }>>('/auth/resend-verification', { email });
    return response.data;
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.api.post<ApiResponse<{ message: string }>>(`/auth/reset-password/${token}`, { password });
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } finally {
      this.clearToken();
    }
  }

  // Protected endpoints
  async getProfile(): Promise<ApiResponse<User>> {
    if (this.useMock) {
      return await mockApiService.getProfile();
    }
    
    try {
      const response = await this.api.get<ApiResponse<User>>('/auth/profile');
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock service for getProfile');
      return await mockApiService.getProfile();
    }
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.api.put<ApiResponse<User>>('/auth/profile', data);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.api.post<ApiResponse<{ message: string }>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  async deleteAccount(): Promise<ApiResponse<{ message: string }>> {
    const response = await this.api.delete<ApiResponse<{ message: string }>>('/auth/account');
    this.clearToken();
    return response.data;
  }

  // Starknet account management
  async deployAccount(): Promise<ApiResponse<{ transactionHash: string; contractAddress: string }>> {
    const response = await this.api.post<ApiResponse<{ transactionHash: string; contractAddress: string }>>('/auth/starknet/deploy');
    return response.data;
  }

  async getBalance(): Promise<BalanceResponse> {
    if (this.useMock) {
      return await mockApiService.getBalance();
    }
    
    try {
      const response = await this.api.get<BalanceResponse>('/auth/starknet/balance');
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock service for getBalance');
      return await mockApiService.getBalance();
    }
  }

  async getAccountStatus(): Promise<ApiResponse<{ isDeployed: boolean; isFunded: boolean; address: string; publicKey: string }>> {
    if (this.useMock) {
      return await mockApiService.getAccountStatus();
    }
    
    try {
      const response = await this.api.get<ApiResponse<{ isDeployed: boolean; isFunded: boolean; address: string; publicKey: string }>>('/auth/starknet/status');
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock service for getAccountStatus');
      return await mockApiService.getAccountStatus();
    }
  }

  // Auto-funding
  async fundAccount(): Promise<ApiResponse<{ transactionHash: string; amount: string }>> {
    const response = await this.api.post<ApiResponse<{ transactionHash: string; amount: string }>>('/auth/funding/fund-account');
    return response.data;
  }

  async getAutoFundingStats(): Promise<ApiResponse<{ totalFunded: number; totalAccounts: number; averageAmount: string }>> {
    const response = await this.api.get<ApiResponse<{ totalFunded: number; totalAccounts: number; averageAmount: string }>>('/auth/funding/auto-funding-stats');
    return response.data;
  }

  async getFundedAccountBalance(): Promise<ApiResponse<{ balance: string; hasBalance: boolean }>> {
    const response = await this.api.get<ApiResponse<{ balance: string; hasBalance: boolean }>>('/auth/funding/funded-account-balance');
    return response.data;
  }

  async batchFund(amounts: string[]): Promise<ApiResponse<{ transactionHashes: string[]; totalAmount: string }>> {
    const response = await this.api.post<ApiResponse<{ transactionHashes: string[]; totalAmount: string }>>('/auth/funding/batch-fund', { amounts });
    return response.data;
  }

  // Contact management
  async getContacts(): Promise<ApiResponse<Contact[]>> {
    if (this.useMock) {
      return await mockApiService.getContacts();
    }
    
    try {
      const response = await this.api.get<ApiResponse<Contact[]>>('/contacts');
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock service for getContacts');
      return await mockApiService.getContacts();
    }
  }

  async createContact(data: CreateContactRequest): Promise<ApiResponse<Contact>> {
    if (this.useMock) {
      return await mockApiService.createContact(data);
    }
    
    try {
      const response = await this.api.post<ApiResponse<Contact>>('/contacts', data);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock service for createContact');
      return await mockApiService.createContact(data);
    }
  }

  async updateContact(id: string, data: UpdateContactRequest): Promise<ApiResponse<Contact>> {
    if (this.useMock) {
      return await mockApiService.updateContact(id, data);
    }
    
    try {
      const response = await this.api.put<ApiResponse<Contact>>(`/contacts/${id}`, data);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock service for updateContact');
      return await mockApiService.updateContact(id, data);
    }
  }

  async deleteContact(id: string): Promise<ApiResponse<{ message: string }>> {
    if (this.useMock) {
      return await mockApiService.deleteContact(id);
    }
    
    try {
      const response = await this.api.delete<ApiResponse<{ message: string }>>(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock service for deleteContact');
      return await mockApiService.deleteContact(id);
    }
  }

  // Agent query
  async queryAgent(data: AgentQueryRequest): Promise<AgentQueryResponse> {
    if (this.useMock) {
      return await mockApiService.queryAgent(data);
    }
    
    try {
      const response = await this.api.post<AgentQueryResponse>('/query', data);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock service for queryAgent');
      return await mockApiService.queryAgent(data);
    }
  }

  // Generic request method for custom endpoints
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.api.request<T>(config);
    return response.data;
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;
