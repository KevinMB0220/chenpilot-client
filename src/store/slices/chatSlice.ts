import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage, AgentQueryRequest } from '@/types';
import apiService from '@/services/api';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  isTyping: false,
};

// Async thunks
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (query: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const userId = state.auth.user?.id;
      
      if (!userId) {
        return rejectWithValue('User not authenticated');
      }

      const request: AgentQueryRequest = {
        userId,
        query,
      };

      const response = await apiService.queryAgent(request);
      return response;
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
  },
  extraReducers: (builder) => {
    builder
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.isTyping = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        
        // Add agent response message
        const agentMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'agent',
          content: action.payload.result.data,
          timestamp: new Date().toISOString(),
          metadata: {
            success: action.payload.result.success,
            error: action.payload.result.error,
          },
        };
        state.messages.push(agentMessage);
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        state.error = action.payload as string;
        
        // Add error message
        const errorContent = action.payload instanceof Error 
          ? action.payload.message 
          : String(action.payload);
        
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'system',
          content: `Error: ${errorContent}`,
          timestamp: new Date().toISOString(),
          metadata: {
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
  setTyping,
  updateMessage,
  removeMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
