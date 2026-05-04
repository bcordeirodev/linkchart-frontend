import { combineSlices } from "@reduxjs/toolkit";

// Empty interface for declaration merging
export interface LazyLoadedSlices {}

export const rootReducer = combineSlices(
  {},
).withLazyLoadedSlices<LazyLoadedSlices>();

export default rootReducer;
