export function useNullableModel<T extends object>(obj: T, key: keyof T) {
  return computed<string>({
    get: () => (obj[key] as string | null) ?? '',
    set: (val) => { obj[key] = (val || null) as T[keyof T]; },
  });
}

export const isPrintingSymbol = Symbol('isPrinting');
export const useIsPrinting = () => (inject(isPrintingSymbol, ref(false)));

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
})));
