import { createContext } from "react";
import themes from "./themes";

export type themeOptions = 'dark' | 'light';

export type ThemeContext = {
  theme: themeOptions;
  setTheme: (t: themeOptions) => void;
}

export function getDefaultTheme(): themeOptions {
  return (window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
}

export const ThemeContext = createContext<ThemeContext>({
  theme: getDefaultTheme(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTheme: (theme) => { }
});


export function getTheme(t: themeOptions) {
  return themes[t];
}