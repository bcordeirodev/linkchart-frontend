import { configureStore } from "@reduxjs/toolkit";

import { dynamicMiddleware } from "./middleware";
import rootReducer from "./rootReducer";

import type { Action, Middleware, ThunkAction } from "@reduxjs/toolkit";

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>;

const middlewares: Middleware[] = [dynamicMiddleware];

/**
 * Builds a fresh Redux Toolkit store wired with `rootReducer` and the
 * dynamic middleware. Accepts an optional `preloadedState` for SSR hydration
 * and test isolation; the module-level `store` export is the singleton used by
 * the app at runtime.
 */
const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middlewares),
    preloadedState,
  });
  return store;
};

export const store = makeStore();

// Infer the type of `store`
export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
export type AppAction<R = Promise<void>> =
  | Action<string>
  | ThunkAction<R, RootState, unknown, Action<string>>;

export default store;
