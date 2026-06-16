"use client";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "./store";

/**
 * Type-safe `useDispatch` bound to the app's `AppDispatch` shape.
 *
 * Always import this instead of `react-redux`'s plain `useDispatch` so that
 * thunk return types and action shapes are inferred correctly.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Type-safe `useSelector` bound to the app's `RootState`.
 *
 * Always import this instead of `react-redux`'s plain `useSelector` so that
 * `state.*` autocompletion and structural narrowing work everywhere.
 */
export const useAppSelector = useSelector.withTypes<RootState>();
