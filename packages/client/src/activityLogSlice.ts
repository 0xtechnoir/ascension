import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import  { ActivityLogState, LogMessage } from './CustomTypes';

const initialState: ActivityLogState = {
  messages: [],
};

export const activityLogSlice = createSlice({
  name: 'activityLog',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<LogMessage>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { addMessage } = activityLogSlice.actions;

export default activityLogSlice.reducer;
