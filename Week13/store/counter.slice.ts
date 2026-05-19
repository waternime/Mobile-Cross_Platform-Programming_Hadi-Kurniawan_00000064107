import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type OperationName = "supabase" | "notification";
export type OperationResult = "success" | "failed";

export type OperationCounters = {
  success: number;
  failed: number;
};

export interface CounterState {
  totalSuccess: number;
  totalFailed: number;
  supabase: OperationCounters;
  notification: OperationCounters;
  status: "idle" | "succeeded" | "failed";
  error: string | null;
}

type RecordResultPayload = {
  operation: OperationName;
  result: OperationResult;
  error?: string | null;
};

const emptyCounters: OperationCounters = {
  success: 0,
  failed: 0,
};

const initialState: CounterState = {
  totalSuccess: 0,
  totalFailed: 0,
  supabase: { ...emptyCounters },
  notification: { ...emptyCounters },
  status: "idle",
  error: null,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    recordResult(state, action: PayloadAction<RecordResultPayload>) {
      const { operation, result, error } = action.payload;

      if (result === "success") {
        state[operation].success += 1;
        state.totalSuccess += 1;
        state.status = "succeeded";
        state.error = null;
      } else {
        state[operation].failed += 1;
        state.totalFailed += 1;
        state.status = "failed";
        state.error = error ?? "Operation failed.";
      }
    },
    resetCounters(state) {
      state.totalSuccess = 0;
      state.totalFailed = 0;
      state.supabase = { ...emptyCounters };
      state.notification = { ...emptyCounters };
      state.status = "idle";
      state.error = null;
    },
  },
});

export const { recordResult, resetCounters } = counterSlice.actions;
export default counterSlice.reducer;
