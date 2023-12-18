export function useUid(prefix?: string) {
    const uid = ref<string>();
    onMounted(() => {
        let instance = getCurrentInstance();

        let p = prefix ?? instance?.type.__name;
        let u = instance?.uid ?? Math.random().toString(36).substring(2, 9);

        return uid.value = `${p}-${u}`;
    });
    return uid;
}
