import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AccountStatus, WalletBalance } from '@/types';
import apiService from '@/services/api';

type NetworkHealthStatus = 'healthy' | 'degraded' | 'down' | 'unknown';
type AccountSyncState = 'synced' | 'syncing' | 'desynced';

interface StellarNetworkState {
  status: NetworkHealthStatus;
  latestLedger: number | null;
  ledgerCloseTimeMs: number | null;
  ledgerAgeSeconds: number | null;
  congestion: boolean;
  accountSyncState: AccountSyncState;
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
}

interface AccountState {
  status: AccountStatus | null;
  balance: WalletBalance | null;
  isLoading: boolean;
  error: string | null;
  network: StellarNetworkState;
}

const initialState: AccountState = {
  status: null,
  balance: null,
  isLoading: false,
  error: null,
  network: {
    status: 'unknown',
    latestLedger: null,
    ledgerCloseTimeMs: null,
    ledgerAgeSeconds: null,
    congestion: false,
    accountSyncState: 'syncing',
    lastUpdated: null,
    isLoading: false,
    error: null,
  },
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

export const getStellarNetworkStatus = createAsyncThunk(
  'account/getStellarNetworkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://horizon.stellar.org/ledgers?order=desc&limit=1');
      if (!response.ok) {
        return rejectWithValue('Failed to fetch Stellar network status');
      }
      const data = await response.json();
      const latestLedgerRecord = data?._embedded?.records?.[0];
      if (!latestLedgerRecord) {
        return rejectWithValue('No ledger data available');
      }

      const latestLedger = Number(latestLedgerRecord.sequence);
      const closedAt = latestLedgerRecord.closed_at
        ? new Date(latestLedgerRecord.closed_at).getTime()
        : null;
      const ledgerAgeSeconds = closedAt
        ? Math.max(0, Math.floor((Date.now() - closedAt) / 1000))
        : null;
      const maxTxSetSize = latestLedgerRecord.max_tx_set_size
        ? Number(latestLedgerRecord.max_tx_set_size)
        : 0;
      const successfulTxCount = latestLedgerRecord.successful_transaction_count
        ? Number(latestLedgerRecord.successful_transaction_count)
        : 0;
      const congestion =
        maxTxSetSize > 0 ? successfulTxCount / maxTxSetSize >= 0.85 : false;

      return {
        latestLedger,
        ledgerCloseTimeMs: closedAt,
        ledgerAgeSeconds,
        congestion,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch Stellar network status');
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
      // Get Stellar Network Status
      .addCase(getStellarNetworkStatus.pending, (state) => {
        state.network.isLoading = true;
        state.network.error = null;
        state.network.accountSyncState = 'syncing';
      })
      .addCase(getStellarNetworkStatus.fulfilled, (state, action) => {
        const { latestLedger, ledgerCloseTimeMs, ledgerAgeSeconds, congestion, lastUpdated } =
          action.payload;
        let status: NetworkHealthStatus = 'healthy';
        if (ledgerAgeSeconds !== null && ledgerAgeSeconds > 30) {
          status = 'down';
        } else if (ledgerAgeSeconds !== null && ledgerAgeSeconds > 15) {
          status = 'degraded';
        } else if (congestion) {
          status = 'degraded';
        }

        const accountSyncState: AccountSyncState =
          ledgerAgeSeconds === null
            ? 'desynced'
            : ledgerAgeSeconds > 30
              ? 'desynced'
              : ledgerAgeSeconds > 15
                ? 'syncing'
                : 'synced';

        state.network = {
          ...state.network,
          status,
          latestLedger,
          ledgerCloseTimeMs,
          ledgerAgeSeconds,
          congestion,
          lastUpdated,
          accountSyncState,
          isLoading: false,
          error: null,
        };
      })
      .addCase(getStellarNetworkStatus.rejected, (state, action) => {
        state.network.isLoading = false;
        state.network.status = 'down';
        state.network.error = action.payload as string;
        state.network.accountSyncState = 'desynced';
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
