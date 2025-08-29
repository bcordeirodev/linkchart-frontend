import { combineSlices } from '@reduxjs/toolkit';
import apiService from './apiService';

// Empty interface for declaration merging
export interface LazyLoadedSlices { }

// Importação direta do slice
import navigationSlice from '@/themes/store/navigationSlice';

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
export const rootReducer = combineSlices(
	/**
	 * Static slices
	 */
	{
		navigation: navigationSlice
	},
	/**
	 * Lazy loaded slices
	 */
	{
		[apiService.reducerPath]: apiService.reducer
	}
).withLazyLoadedSlices<LazyLoadedSlices>();

export default rootReducer;
