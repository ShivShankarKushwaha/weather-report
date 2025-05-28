import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unit:localStorage.getItem('weatherUnit') || 'metric',
};

export const weatherUnitSlice = createSlice({
  name: 'weatherUnit',
  initialState,
  reducers: {
    toggleUnit: (state) => {
      state.unit = state.unit === 'metric' ? 'imperial' : 'metric';
        localStorage.setItem('weatherUnit', state.unit);
    },
    setUnit: (state, action) => {
      state.unit = action.payload;
    },
  },
});

export const { toggleUnit, setUnit } = weatherUnitSlice.actions;
export default weatherUnitSlice.reducer;
