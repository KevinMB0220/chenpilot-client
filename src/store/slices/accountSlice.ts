import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AccountStatus, WalletBalance } from '@/types';
import apiService from '@/services/api';

interface AccountState {
  status: AccountStatus | null;
  balance: WalletBalance | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  status: null,
  balance: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const getAccountStatus = createAsyncThunk(
  'account/getStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAccountStatus();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to get account status');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get account status');
    }
  }
);

export const getBalance = createAsyncThunk(
  'account/getBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getBalance();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to get balance');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get balance');
    }
  }
);

export const deployAccount = createAsyncThunk(
  'account/deploy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.deployAccount();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Account deployment failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Account deployment failed');
    }
  }
);

export const fundAccount = createAsyncThunk(
  'account/fund',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.fundAccount();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Account funding failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Account funding failed');
    }
  }
);

export const getAutoFundingStats = createAsyncThunk(
  'account/getAutoFundingStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAutoFundingStats();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to get funding stats');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get funding stats');
    }
  }
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateAccountStatus: (state, action: PayloadAction<Partial<AccountStatus>>) => {
      if (state.status) {
        state.status = { ...state.status, ...action.payload };
      } else {
        state.status = action.payload as AccountStatus;
      }
    },
    updateBalance: (state, action: PayloadAction<Partial<WalletBalance>>) => {
      if (state.balance) {
        state.balance = { ...state.balance, ...action.payload };
      } else {
        state.balance = action.payload as WalletBalance;
      }
    },
    clearAccount: (state) => {
      state.status = null;
      state.balance = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Account Status
      .addCase(getAccountStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAccountStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = action.payload;
        state.error = null;
      })
      .addCase(getAccountStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Balance
      .addCase(getBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload;
        state.error = null;
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Deploy Account
      .addCase(deployAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deployAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.status) {
          state.status.isDeployed = true;
          state.status.deploymentTransactionHash = action.payload.transactionHash;
        }
        state.error = null;
      })
      .addCase(deployAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fund Account
      .addCase(fundAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fundAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.status) {
          state.status.isFunded = true;
          state.status.fundingTransactionHash = action.payload.transactionHash;
        }
        state.error = null;
      })
      .addCase(fundAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Auto Funding Stats
      .addCase(getAutoFundingStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAutoFundingStats.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getAutoFundingStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateAccountStatus, updateBalance, clearAccount } = accountSlice.actions;
export default accountSlice.reducer;
