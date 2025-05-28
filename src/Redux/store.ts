import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './slices/locationSlice';
import weatherUnitReducer from './slices/weatherUnitSlice';

export const store = configureStore({
  reducer: {
    location: locationReducer,
    weatherUnit: weatherUnitReducer,
  },
});
