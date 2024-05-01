export const isPrintingSymbol = Symbol('isPrinting');
export const useIsPrinting = () => (inject(isPrintingSymbol, ref(false)) as Ref<boolean>)

export const fontSizesSymbol = Symbol('fontSizes');
export const useFontSizes = () => (inject(fontSizesSymbol, ref({})) as Reactive<{
    devicePixelRatio: number,
    rootFontSize: number,
}>)
