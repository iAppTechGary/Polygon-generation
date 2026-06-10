import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createGeometrizeImageThunk,
  createOrderShapeFromJsonThunk,
  unmixColorThunk,
  listPaletteBrandsThunk,
} from '../thunk/paletteThunk';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ColorSortingMode = 'least-to-most' | 'most-to-least' | 'hue' | 'luminance';

interface PaletteColor {
  hex:  string;
  rgb:  [number, number, number];
  name?: string;
}

interface PaletteState {
  /** Raw JSON returned by the geometrize service */
  geometrizeJsonData:    unknown | null;
  /** Shape data re-ordered for canvas rendering */
  orderedShapeData:      unknown | null;
  /** The source image (as data URL or object URL) */
  paletteImage:          string | null;
  /** Full colour array extracted from the image */
  paletteColors:         PaletteColor[];
  /** Subset of colours used in the active canvas view */
  limitedPaletteColors:  PaletteColor[];
  totalColorsCount:      number;
  colorSortingMode:      ColorSortingMode;
  paletteBrandsList:     unknown[];
  paletteBrandDetails:   unknown | null;
  unmixColorData:        unknown | null;
}

const initialState: PaletteState = {
  geometrizeJsonData:   null,
  orderedShapeData:     null,
  paletteImage:         null,
  paletteColors:        [],
  limitedPaletteColors: [],
  totalColorsCount:     0,
  colorSortingMode:     'least-to-most',
  paletteBrandsList:    [],
  paletteBrandDetails:  null,
  unmixColorData:       null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const paletteSlice = createSlice({
  name: 'palette',
  initialState,
  reducers: {
    setPaletteImage(state, action: PayloadAction<string | null>) {
      state.paletteImage = action.payload;
    },
    setPaletteColors(state, action: PayloadAction<PaletteColor[]>) {
      state.paletteColors   = action.payload;
      state.totalColorsCount = action.payload.length;
    },
    setLimitedPaletteColors(state, action: PayloadAction<PaletteColor[]>) {
      state.limitedPaletteColors = action.payload;
    },
    setTotalColorsCount(state, action: PayloadAction<number>) {
      state.totalColorsCount = action.payload;
    },
    setColorSortingMode(state, action: PayloadAction<ColorSortingMode>) {
      state.colorSortingMode = action.payload;
    },
    resetPalette() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGeometrizeImageThunk.fulfilled, (state, action) => {
        state.geometrizeJsonData = action.payload;
      })
      .addCase(createOrderShapeFromJsonThunk.fulfilled, (state, action) => {
        state.orderedShapeData = action.payload;
      })
      .addCase(unmixColorThunk.fulfilled, (state, action) => {
        state.unmixColorData = action.payload;
      })
      .addCase(listPaletteBrandsThunk.fulfilled, (state, action) => {
        state.paletteBrandsList = action.payload?.data ?? [];
      });
  },
});

export const {
  setPaletteImage,
  setPaletteColors,
  setLimitedPaletteColors,
  setTotalColorsCount,
  setColorSortingMode,
  resetPalette,
} = paletteSlice.actions;

export default paletteSlice.reducer;
