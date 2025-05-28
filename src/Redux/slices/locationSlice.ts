import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentCity: localStorage.getItem('location') || 'New York',
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCity: (state, action) => {
      state.currentCity = action.payload;
      localStorage.setItem('location', action.payload);
    }
  },
});

export const { setCity } = locationSlice.actions;
export default locationSlice.reducer;
