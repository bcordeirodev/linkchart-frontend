/**
 * Hook de navegação centralizado para Link Charts
 * Movido de theme-layouts para centralizar em src/themes
 */

'use client';

import { useMemo } from 'react';
import navigationConfig from '@/configs/navigationConfig';
import useUser from '@auth/useUser';
import useI18n from '@i18n/useI18n';
import i18n from '@i18n';
import FuseUtils from '@fuse/utils';
import FuseNavigationHelper from '@fuse/utils/FuseNavigationHelper';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';

/**
 * Hook de navegação para Link Charts
 * Simplificado mas mantém funcionalidades essenciais
 */
function useNavigation() {
    const { data: user } = useUser();
    const userRole = user?.role;
    const { languageId } = useI18n();

    const navigation = useMemo(() => {
        function setAdditionalData(data: FuseNavItemType[]): FuseNavItemType[] {
            return data?.map((item) => ({
                hasPermission: Boolean(FuseUtils.hasPermission(item?.auth, userRole ?? null)),
                ...item,
                ...(item?.translate && item?.title ? { title: i18n.t(`navigation:${item?.translate}`) } : {}),
                ...(item?.children ? { children: setAdditionalData(item?.children) } : {})
            }));
        }

        const translatedValues = setAdditionalData(navigationConfig);
        return translatedValues;
    }, [userRole, languageId]);

    const flattenNavigation = useMemo(() => {
        return FuseNavigationHelper.flattenNavigation(navigation);
    }, [navigation]);

    return { navigation, flattenNavigation };
}

export default useNavigation;
