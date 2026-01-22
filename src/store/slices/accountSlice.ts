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
    // Mock account status
    const mockStatus: AccountStatus = {
      isDeployed: true,
      isFunded: true,
      deploymentTransactionHash: '0xmockdeploymenthash',
      fundingTransactionHash: '0xmockfundinghash',
      balance: '1000000000000000000', // 1 ETH in wei
      address: '0x1234567890abcdef',
      publicKey: '0xabcdef1234567890',
    };
    return mockStatus;
  }
);

export const getBalance = createAsyncThunk(
  'account/getBalance',
  async (_, { rejectWithValue }) => {
    // Mock balance
    return '1000000000000000000'; // 1 ETH in wei
  }
);

export const deployAccount = createAsyncThunk(
  'account/deploy',
  async (_, { rejectWithValue }) => {
    // Mock deploy account - always succeed
    return { success: true, transactionHash: '0xmockdeployhash' };
  }
);

export const fundAccount = createAsyncThunk(
  'account/fund',
  async (_, { rejectWithValue }) => {
    // Mock fund account - always succeed
    return { success: true, transactionHash: '0xmockfundhash' };
  }
);

export const getAutoFundingStats = createAsyncThunk(
  'account/getAutoFundingStats',
  async (_, { rejectWithValue }) => {
    // Mock funding stats
    return {
      totalFunded: 10,
      totalAmount: '10000000000000000000', // 10 ETH
      lastFunding: new Date().toISOString(),
    };
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
