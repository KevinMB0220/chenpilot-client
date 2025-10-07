import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage, AgentQueryRequest, Conversation } from '@/types';
import { AgentQueryResponse } from '@/types/agent';
import apiService from '@/services/api';

interface ChatState {
  messages: ChatMessage[];
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
  agentStatus: {
    isConnected: boolean;
    lastHealthCheck: string | null;
    capabilities: any;
  };
  chatHistory: { [conversationId: string]: ChatMessage[] };
}

const initialState: ChatState = {
  messages: [],
  conversations: [],
  currentConversation: null,
  isLoading: false,
  error: null,
  isTyping: false,
  agentStatus: {
    isConnected: false,
    lastHealthCheck: null,
    capabilities: null,
  },
  chatHistory: {},
};

// Async thunks
export const loadConversations = createAsyncThunk(
  'chat/loadConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getConversations(50);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to load conversations');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load conversations');
    }
  }
);

export const loadConversation = createAsyncThunk(
  'chat/loadConversation',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getConversation(conversationId);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to load conversation');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load conversation');
    }
  }
);

export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async ({ title, description }: { title: string; description?: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.createConversation(title, description);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to create conversation');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create conversation');
    }
  }
);

export const getOrCreateActiveConversation = createAsyncThunk(
  'chat/getOrCreateActiveConversation',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getOrCreateActiveConversation();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to get/create active conversation');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get/create active conversation');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (query: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const userId = state.auth.user?.id;
      const currentConversation = state.chat.currentConversation;
      
      if (!userId) {
        return rejectWithValue('User not authenticated');
      }

      // Get or create active conversation
      let conversation = currentConversation;
      if (!conversation) {
        const convResponse = await apiService.getOrCreateActiveConversation();
        if (convResponse.success) {
          conversation = convResponse.data;
        } else {
          return rejectWithValue('Failed to get/create conversation');
        }
      }

      // Save user message to database
      const userMessageResponse = await apiService.createMessage(
        conversation.id,
        'user',
        query
      );

      if (!userMessageResponse.success) {
        return rejectWithValue('Failed to save user message');
      }

      // Send query to agent
      const request: AgentQueryRequest = {
        userId,
        query,
      };

      const response = await apiService.queryAgent(request);
      
      // Save agent response to database
      if (response.result.success) {
        await apiService.createMessage(
          conversation.id,
          'agent',
          response.result.data,
          {
            success: response.result.success,
            error: response.result.error,
            transactionHash: response.result.transactionHash,
            type: response.result.metadata?.type,
            action: response.result.metadata?.action,
            amount: response.result.metadata?.amount,
            asset: response.result.metadata?.asset,
            requiresConfirmation: response.result.metadata?.requiresConfirmation,
          }
        );
      }

      return { response, conversation };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    addUserMessage: (state, action: PayloadAction<string>) => {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: action.payload,
        timestamp: new Date().toISOString(),
      };
      state.messages.push(userMessage);
    },
    addSystemMessage: (state, action: PayloadAction<{ content: string; metadata?: any }>) => {
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'system',
        content: action.payload.content,
        timestamp: new Date().toISOString(),
        metadata: action.payload.metadata,
      };
      state.messages.push(systemMessage);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    updateMessage: (state, action: PayloadAction<{ id: string; updates: Partial<ChatMessage> }>) => {
      const index = state.messages.findIndex(msg => msg.id === action.payload.id);
      if (index !== -1) {
        state.messages[index] = { ...state.messages[index], ...action.payload.updates };
      }
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },
    updateAgentStatus: (state, action: PayloadAction<{ isConnected: boolean; lastHealthCheck: string | null; capabilities?: any }>) => {
      state.agentStatus = { ...state.agentStatus, ...action.payload };
    },
    setAgentConnected: (state, action: PayloadAction<boolean>) => {
      state.agentStatus.isConnected = action.payload;
    },
    startNewChat: (state) => {
      // Save current conversation messages to history
      if (state.currentConversation && state.messages.length > 0) {
        state.chatHistory[state.currentConversation.id] = [...state.messages];
      }
      // Clear current messages and conversation
      state.messages = [];
      state.currentConversation = null;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('chat_history', JSON.stringify(state.chatHistory));
      }
    },
    loadChatHistory: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      if (state.chatHistory[conversationId]) {
        state.messages = state.chatHistory[conversationId];
      } else {
        state.messages = [];
      }
    },
    saveChatHistory: (state) => {
      if (state.currentConversation && state.messages.length > 0) {
        state.chatHistory[state.currentConversation.id] = [...state.messages];
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('chat_history', JSON.stringify(state.chatHistory));
        }
      }
    },
    deleteChatHistory: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      delete state.chatHistory[conversationId];
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('chat_history', JSON.stringify(state.chatHistory));
      }
    },
    initializeChatHistory: (state) => {
      if (typeof window !== 'undefined') {
        const savedHistory = localStorage.getItem('chat_history');
        if (savedHistory) {
          try {
            state.chatHistory = JSON.parse(savedHistory);
          } catch (error) {
            console.error('Failed to parse chat history:', error);
            state.chatHistory = {};
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Load Conversations
      .addCase(loadConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
        state.error = null;
      })
      .addCase(loadConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Load Conversation
      .addCase(loadConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentConversation = action.payload;
        state.messages = action.payload.messages || [];
        state.error = null;
      })
      .addCase(loadConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Conversation
      .addCase(createConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations.unshift(action.payload);
        state.currentConversation = action.payload;
        state.messages = [];
        state.error = null;
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get or Create Active Conversation
      .addCase(getOrCreateActiveConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrCreateActiveConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentConversation = action.payload;
        state.messages = action.payload.messages || [];
        state.error = null;
      })
      .addCase(getOrCreateActiveConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.isTyping = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        state.currentConversation = action.payload.conversation;
        
        // Add agent response message with enhanced metadata
        const agentMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'agent',
          content: action.payload.response.result.data,
          timestamp: new Date().toISOString(),
          metadata: {
            success: action.payload.response.result.success,
            error: action.payload.response.result.error,
            transactionHash: action.payload.response.result.transactionHash,
            type: action.payload.response.result.metadata?.type,
            action: action.payload.response.result.metadata?.action,
            amount: action.payload.response.result.metadata?.amount,
            asset: action.payload.response.result.metadata?.asset,
            requiresConfirmation: action.payload.response.result.metadata?.requiresConfirmation,
          },
        };
        state.messages.push(agentMessage);
        
        // Save chat history after each message
        if (state.currentConversation) {
          state.chatHistory[state.currentConversation.id] = [...state.messages];
          if (typeof window !== 'undefined') {
            localStorage.setItem('chat_history', JSON.stringify(state.chatHistory));
          }
        }
        
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        state.error = action.payload as string;
        
        // Add error message with friendly content
        const errorContent = action.payload instanceof Error 
          ? action.payload.message 
          : String(action.payload);
        
        // Convert technical error messages to user-friendly ones
        let friendlyMessage = errorContent;
        if (errorContent.includes('invalid query')) {
          friendlyMessage = "I didn't understand that. Could you please rephrase your question?";
        } else if (errorContent.includes('Failed to send message')) {
          friendlyMessage = "I'm having trouble processing your request. Please try again.";
        } else if (errorContent.includes('User not authenticated')) {
          friendlyMessage = "Please log in to continue the conversation.";
        }
        
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'agent',
          content: friendlyMessage,
          timestamp: new Date().toISOString(),
          metadata: {
            success: false,
            type: 'error',
          },
        };
        state.messages.push(errorMessage);
      });
  },
});

export const {
  clearError,
  addMessage,
  addUserMessage,
  addSystemMessage,
  clearMessages,
  setMessages,
  setConversations,
  setCurrentConversation,
  setTyping,
  updateMessage,
  removeMessage,
  updateAgentStatus,
  setAgentConnected,
  startNewChat,
  loadChatHistory,
  saveChatHistory,
  deleteChatHistory,
  initializeChatHistory,
} = chatSlice.actions;
export default chatSlice.reducer;
