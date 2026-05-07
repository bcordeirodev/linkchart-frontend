import { combineSlices } from "@reduxjs/toolkit";

// Empty interface for declaration merging — intentional for Redux Toolkit module augmentation
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-empty-interface
export interface LazyLoadedSlices {}

export const rootReducer = combineSlices(
  {},
).withLazyLoadedSlices<LazyLoadedSlices>();

export default rootReducer;
