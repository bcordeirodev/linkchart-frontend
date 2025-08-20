/**
 * Navigation slice centralizado para Link Charts
 * Movido de theme-layouts para centralizar em src/themes
 */

import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '@/store/store';
import { PartialDeep } from 'type-fest';
import { FuseFlatNavItemType, FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import FuseNavigationHelper from '@fuse/utils/FuseNavigationHelper';
import FuseNavItemModel from '@fuse/core/FuseNavigation/models/FuseNavItemModel';
import navigationConfig from '@/configs/navigationConfig';

const navigationAdapter = createEntityAdapter<FuseFlatNavItemType>();

const emptyInitialState = navigationAdapter.getInitialState([]);

const initialState = navigationAdapter.upsertMany(
    emptyInitialState,
    FuseNavigationHelper.flattenNavigation(navigationConfig)
);

/**
 * Actions para navegação
 */
export const appendNavigationItem =
    (item: FuseNavItemType, parentId?: string | null): AppThunk =>
        async (dispatch, getState) => {
            const AppState = getState();
            const navigation = FuseNavigationHelper.unflattenNavigation(selectNavigationAll(AppState));

            dispatch(setNavigation(FuseNavigationHelper.appendNavItem(navigation, FuseNavItemModel(item), parentId)));

            return Promise.resolve();
        };

export const updateNavigationItem =
    (id: string, item: PartialDeep<FuseNavItemType>): AppThunk =>
        async (dispatch, getState) => {
            const AppState = getState();
            const navigation = FuseNavigationHelper.unflattenNavigation(selectNavigationAll(AppState));

            dispatch(setNavigation(FuseNavigationHelper.updateNavItem(navigation, id, item)));

            return Promise.resolve();
        };

export const removeNavigationItem =
    (id: string): AppThunk =>
        async (dispatch, getState) => {
            const AppState = getState();
            const navigation = FuseNavigationHelper.unflattenNavigation(selectNavigationAll(AppState));

            dispatch(setNavigation(FuseNavigationHelper.removeNavItem(navigation, id)));

            return Promise.resolve();
        };

export const {
    selectAll: selectNavigationAll,
    selectIds: selectNavigationIds,
    selectById: selectNavigationItemById
} = navigationAdapter.getSelectors<RootState>((state) => state.navigation);

/**
 * Navigation slice
 */
export const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        setNavigation(state, action: PayloadAction<FuseNavItemType[]>) {
            return navigationAdapter.setAll(state, FuseNavigationHelper.flattenNavigation(action.payload));
        },
        resetNavigation: () => initialState
    }
});

export const { setNavigation, resetNavigation } = navigationSlice.actions;

export type navigationSliceType = typeof navigationSlice;

export default navigationSlice.reducer;
