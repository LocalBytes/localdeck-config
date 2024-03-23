export const isPrintingSymbol = Symbol('isPrinting');
export const useIsPrinting = () => (inject(isPrintingSymbol, ref(false)) as Ref<boolean>)
