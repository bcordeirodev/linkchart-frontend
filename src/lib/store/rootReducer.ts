import { combineSlices } from '@reduxjs/toolkit';
import apiService from './apiService';

// Empty interface for declaration merging
export interface LazyLoadedSlices { }

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
export const rootReducer = combineSlices(
	/**
	 * Static slices
	 */
	{},
	/**
	 * Lazy loaded slices
	 */
	{
		[apiService.reducerPath]: apiService.reducer
	}
).withLazyLoadedSlices<LazyLoadedSlices>();

export default rootReducer;
