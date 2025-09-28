// Mock API service for development when backend is not available
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

class MockApiService {
  private token: string | null = null;

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

  // Mock authentication endpoints
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 'mock-user-id',
      email: data.email,
      name: data.name || data.email.split('@')[0],
      address: '0x1234567890abcdef1234567890abcdef12345678',
      publicKey: '0xabcdef1234567890abcdef1234567890abcdef12',
      isDeployed: false,
      isFunded: false,
      tokenType: 'STRK',
      authProvider: 'email',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockToken = 'mock-jwt-token-' + Date.now();

    return {
      success: true,
      message: 'Registration successful',
      data: {
        user: mockUser,
        token: mockToken,
        starknetAccount: {
          address: mockUser.address,
          publicKey: mockUser.publicKey,
          isDeployed: false,
        },
        setupStatus: {
          funding: {
            success: false,
            amount: '0',
          },
          deployment: {
            success: false,
          },
          fullyReady: false,
        },
      },
    };
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Accept any email/password combination for development
    const mockUser: User = {
      id: 'mock-user-id',
      email: data.email,
      name: data.email.split('@')[0],
      address: '0x1234567890abcdef1234567890abcdef12345678',
      publicKey: '0xabcdef1234567890abcdef1234567890abcdef12',
      isDeployed: true,
      isFunded: true,
      tokenType: 'STRK',
      authProvider: 'email',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockToken = 'mock-jwt-token-' + Date.now();
    this.setToken(mockToken);

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: mockUser,
        token: mockToken,
        starknetAccount: {
          address: mockUser.address,
          publicKey: mockUser.publicKey,
          isDeployed: true,
        },
      },
    };
  }

  async googleAuth(token: string): Promise<LoginResponse> {
    return this.login({ email: 'user@gmail.com', password: 'password' });
  }

  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: { message: 'Email verified successfully' },
    };
  }

  async resendVerification(email: string): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: { message: 'Verification email sent' },
    };
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: { message: 'Password reset email sent' },
    };
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: { message: 'Password reset successfully' },
    };
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.clearToken();
  }

  // Mock protected endpoints
  async getProfile(): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser: User = {
      id: 'mock-user-id',
      email: 'user@example.com',
      name: 'Mock User',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      publicKey: '0xabcdef1234567890abcdef1234567890abcdef12',
      isDeployed: true,
      isFunded: true,
      tokenType: 'STRK',
      authProvider: 'email',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockUser,
    };
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.getProfile();
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: { message: 'Password changed successfully' },
    };
  }

  async deleteAccount(): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.clearToken();
    return {
      success: true,
      data: { message: 'Account deleted successfully' },
    };
  }

  // Mock Starknet account management
  async deployAccount(): Promise<ApiResponse<{ transactionHash: string; contractAddress: string }>> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      data: {
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        contractAddress: '0x' + Math.random().toString(16).substr(2, 40),
      },
    };
  }

  async getBalance(): Promise<BalanceResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        hasBalance: true,
        balance: '1000.0',
        required: '0.1',
        nativeBalance: '1000.0',
      },
    };
  }

  async getAccountStatus(): Promise<ApiResponse<{ isDeployed: boolean; isFunded: boolean; address: string; publicKey: string }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        isDeployed: true,
        isFunded: true,
        address: '0x1234567890abcdef1234567890abcdef12345678',
        publicKey: '0xabcdef1234567890abcdef1234567890abcdef12',
      },
    };
  }

  // Mock auto-funding
  async fundAccount(): Promise<ApiResponse<{ transactionHash: string; amount: string }>> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      data: {
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        amount: '1.0',
      },
    };
  }

  async getAutoFundingStats(): Promise<ApiResponse<{ totalFunded: number; totalAccounts: number; averageAmount: string }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        totalFunded: 1000,
        totalAccounts: 50,
        averageAmount: '20.0',
      },
    };
  }

  async getFundedAccountBalance(): Promise<ApiResponse<{ balance: string; hasBalance: boolean }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        balance: '1000.0',
        hasBalance: true,
      },
    };
  }

  async batchFund(amounts: string[]): Promise<ApiResponse<{ transactionHashes: string[]; totalAmount: string }>> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      data: {
        transactionHashes: amounts.map(() => '0x' + Math.random().toString(16).substr(2, 64)),
        totalAmount: amounts.reduce((sum, amount) => sum + parseFloat(amount), 0).toString(),
      },
    };
  }

  // Mock contact management
  async getContacts(): Promise<ApiResponse<Contact[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockContacts: Contact[] = [
      {
        id: 'contact-1',
        name: 'Alice',
        address: '0xabcdef1234567890abcdef1234567890abcdef12',
        tokenType: 'STRK',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'contact-2',
        name: 'Bob',
        address: '0x1234567890abcdef1234567890abcdef12345678',
        tokenType: 'ETH',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return {
      success: true,
      data: mockContacts,
    };
  }

  async createContact(data: CreateContactRequest): Promise<ApiResponse<Contact>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newContact: Contact = {
      id: 'contact-' + Date.now(),
      name: data.name,
      address: data.address,
      tokenType: data.tokenType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: newContact,
    };
  }

  async updateContact(id: string, data: UpdateContactRequest): Promise<ApiResponse<Contact>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedContact: Contact = {
      id,
      name: data.name || 'Updated Contact',
      address: data.address || '0x' + Math.random().toString(16).substr(2, 40),
      tokenType: data.tokenType || 'STRK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: updatedContact,
    };
  }

  async deleteContact(id: string): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: { message: 'Contact deleted successfully' },
    };
  }

  // Mock agent query
  async queryAgent(data: AgentQueryRequest): Promise<AgentQueryResponse> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const responses = [
      "I can help you with that! This is a mock response from the AI agent.",
      "Based on your query, here's what I found: This is a development mock response.",
      "I understand you're asking about: " + data.query + ". Here's my mock response.",
      "Let me help you with that. This is a simulated AI agent response for development.",
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      result: {
        success: true,
        data: randomResponse,
      },
    };
  }

  // Generic request method for custom endpoints
  async request<T>(config: any): Promise<T> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {} as T;
  }
}

// Create and export a singleton instance
export const mockApiService = new MockApiService();
export default mockApiService;
