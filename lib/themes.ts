export type ThemeColors = {
  primary950: string;
  primary900: string;
  primary800: string;
  primary300: string;
  primary200: string;
  primary100: string;
  primary50: string;
  accent900: string;
  accent700: string;
  accent400: string;
  accent300: string;
  accent200: string;
  accent100: string;
  accent50: string;
  bgPage: string;
  fgDark: string;
};

export type ThemeDefinition = {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
};

export const themes: ThemeDefinition[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Teal & Amber — the original look",
    colors: {
      primary950: "#042f2e",
      primary900: "#134e4a",
      primary800: "#115e59",
      primary300: "#5eead4",
      primary200: "#99f6e4",
      primary100: "#ccfbf1",
      primary50: "#f0fdfa",
      accent900: "#78350f",
      accent700: "#b45309",
      accent400: "#fbbf24",
      accent300: "#fcd34d",
      accent200: "#fde68a",
      accent100: "#fef3c7",
      accent50: "#fffbeb",
      bgPage: "#f7f8f4",
      fgDark: "#0d2532",
    },
  },
  {
    id: "royal",
    name: "Royal",
    description: "Indigo & Gold — regal and authoritative",
    colors: {
      primary950: "#1e1b4b",
      primary900: "#312e81",
      primary800: "#3730a3",
      primary300: "#a5b4fc",
      primary200: "#c7d2fe",
      primary100: "#e0e7ff",
      primary50: "#eef2ff",
      accent900: "#713f12",
      accent700: "#a16207",
      accent400: "#facc15",
      accent300: "#fde047",
      accent200: "#fef08a",
      accent100: "#fef9c3",
      accent50: "#fefce8",
      bgPage: "#f5f5fa",
      fgDark: "#1e1b4b",
    },
  },
  {
    id: "crimson",
    name: "Crimson",
    description: "Rose & Warm Orange — bold and energetic",
    colors: {
      primary950: "#4c0519",
      primary900: "#881337",
      primary800: "#9f1239",
      primary300: "#fda4af",
      primary200: "#fecdd3",
      primary100: "#ffe4e6",
      primary50: "#fff1f2",
      accent900: "#7c2d12",
      accent700: "#c2410c",
      accent400: "#fb923c",
      accent300: "#fdba74",
      accent200: "#fed7aa",
      accent100: "#ffedd5",
      accent50: "#fff7ed",
      bgPage: "#faf6f5",
      fgDark: "#1c0a0a",
    },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Emerald & Tan — natural and organic",
    colors: {
      primary950: "#022c22",
      primary900: "#064e3b",
      primary800: "#065f46",
      primary300: "#6ee7b7",
      primary200: "#a7f3d0",
      primary100: "#d1fae5",
      primary50: "#ecfdf5",
      accent900: "#451a03",
      accent700: "#92400e",
      accent400: "#fb923c",
      accent300: "#fdba74",
      accent200: "#fed7aa",
      accent100: "#ffedd5",
      accent50: "#fff7ed",
      bgPage: "#f4f7f2",
      fgDark: "#14532d",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Cyan & Coral — fresh and modern",
    colors: {
      primary950: "#083344",
      primary900: "#164e63",
      primary800: "#155e75",
      primary300: "#67e8f9",
      primary200: "#a5f3fc",
      primary100: "#cffafe",
      primary50: "#ecfeff",
      accent900: "#7f1d1d",
      accent700: "#be123c",
      accent400: "#fb7185",
      accent300: "#fda4af",
      accent200: "#fecdd3",
      accent100: "#ffe4e6",
      accent50: "#fff1f2",
      bgPage: "#f3f8fa",
      fgDark: "#0c4a6e",
    },
  },
  {
    id: "plum",
    name: "Plum",
    description: "Purple & Pink — creative and vibrant",
    colors: {
      primary950: "#2e1065",
      primary900: "#4c1d95",
      primary800: "#5b21b6",
      primary300: "#c4b5fd",
      primary200: "#ddd6fe",
      primary100: "#ede9fe",
      primary50: "#f5f3ff",
      accent900: "#831843",
      accent700: "#be185d",
      accent400: "#f472b6",
      accent300: "#f9a8d4",
      accent200: "#fbcfe8",
      accent100: "#fce7f3",
      accent50: "#fdf2f8",
      bgPage: "#f8f5fa",
      fgDark: "#1e1065",
    },
  },
];

export function getThemeById(id: string): ThemeDefinition {
  return themes.find((t) => t.id === id) ?? themes[0];
}

export function themeToStyleVars(colors: ThemeColors): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(colors)) {
    const cssVar = `--theme-${key.replace(/([A-Z])/g, "-$1").replace(/([a-z])(\d)/g, "$1-$2").toLowerCase()}`;
    vars[cssVar] = value;
  }
  return vars;
}
