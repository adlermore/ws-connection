import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedLocation: null,
  selectedHour: '',
  selectedMinute: '',
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocationData: (state, action) => {
      state.selectedLocation = action.payload.location;
      state.selectedHour = action.payload.hours;
      state.selectedMinute = action.payload.minutes;
    },
    resetLocationData: (state) => {
      state.selectedLocation = null;
      state.selectedHour = '';
      state.selectedMinute = '';
    },
  },
});

// ✅ Selector
export const getLocationData = (state) => state.location;

export const { setLocationData, resetLocationData } = locationSlice.actions;

export default locationSlice.reducer;
