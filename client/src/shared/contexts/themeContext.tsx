import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { ThemeProvider } from "@emotion/react";
import { DarkTheme, LightTheme } from "../themes";
import { Box } from "@mui/system";

interface IThemeContextData {
  themeName: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext({} as IThemeContextData);

interface IAppThemeProviderProps {
  children?: React.ReactNode;
}

export const useAppThemeContext = () => {
  return useContext(ThemeContext);
};

export const AppThemeProvider: React.FC<IAppThemeProviderProps> = ({
  children
}) => {
  const [themeName, setThemeName] = useState<"light" | "dark">(
    () => (localStorage.getItem("themeName") as "light" | "dark") || "light"
  );

  useEffect(() => {
    localStorage.setItem("themeName", themeName);
  }, [themeName]);

  const toggleTheme = useCallback(() => {
    setThemeName(oldThemeName => (oldThemeName === "light" ? "dark" : "light"));
  }, []);

  const theme = useMemo(() => {
    if (themeName === "light") return LightTheme;
    return DarkTheme;
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <Box
          width="100vw"
          height="100vh"
          bgcolor={theme.palette.background.default}
        >
          {children}
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
