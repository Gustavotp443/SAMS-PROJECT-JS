import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { AppThemeProvider, DrawerProvider } from "./shared/contexts";
import { LateralMenu } from "./shared/components";
export const App = () => {
  return (
    <AppThemeProvider>
      <DrawerProvider>
        <BrowserRouter>
          <LateralMenu>
            <AppRoutes />
          </LateralMenu>
        </BrowserRouter>
      </DrawerProvider>
    </AppThemeProvider>
  );
};
