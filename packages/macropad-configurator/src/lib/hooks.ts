import {getCurrentInstance} from 'vue';

export function useUid(prefix?: string) {
    const instance = getCurrentInstance();

    if (!instance) {
        throw new Error('useUid can only be called inside setup() or functional components.');
    }
    prefix ??= instance.type.__name?.toLowerCase();
    return `${prefix}-${instance.uid}`;
}
