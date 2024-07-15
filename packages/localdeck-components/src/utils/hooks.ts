export const isPrintingSymbol = Symbol('isPrinting');
export const useIsPrinting = () => (inject(isPrintingSymbol, ref(false)) as Ref<boolean>);

export interface FontSizes {
  devicePixelRatio: number;
  rootFontSize: number;
  scaleFactor: number;
}

export const fontSizesSymbol = Symbol('fontSizes');
export const useFontSizes = () => (inject(fontSizesSymbol, reactive({
  devicePixelRatio: 1,
  rootFontSize: 14,
  scaleFactor: 1,
})) as FontSizes);
