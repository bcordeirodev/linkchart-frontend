import { createDynamicMiddleware } from "@reduxjs/toolkit/react";

import type { AppDispatch, RootState } from "./store";

/**
 * Singleton Redux Toolkit dynamic-middleware host.
 *
 * Lets feature code register/unregister middleware at runtime (e.g. lazy-loaded
 * slices that ship their own listener middleware) without rebuilding the store.
 */
const dynamicInstance = createDynamicMiddleware();

/**
 * The dynamic middleware to wire into `configureStore({middleware: ...})`.
 * Every `addAppMiddleware(...)` call attaches/detaches via this same instance.
 */
export const { middleware: dynamicMiddleware } = dynamicInstance;

interface Config {
  state: RootState;
  dispatch: AppDispatch;
}

/**
 * Type-safe wrapper around `addMiddleware` bound to the app's state/dispatch.
 *
 * Call from a feature module (typically inside an effect) to attach extra
 * middleware after the store is built.
 */
export const addAppMiddleware =
  dynamicInstance.addMiddleware.withTypes<Config>();

/**
 * Type-safe wrapper around `withMiddleware` for one-off `dispatch` calls
 * that need additional middleware applied transiently.
 */
export const withAppMiddleware =
  dynamicInstance.withMiddleware.withTypes<Config>();

/**
 * Factory for typed dispatch hooks scoped to a specific middleware bundle.
 *
 * Useful when a feature wants its own `useFeatureDispatch` that always runs
 * with a known middleware set without polluting the global store config.
 */
export const createAppDispatchWithMiddlewareHook =
  dynamicInstance.createDispatchWithMiddlewareHook.withTypes<Config>();
