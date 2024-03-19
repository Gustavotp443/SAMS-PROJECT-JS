import { BrowserRouter } from "react-router-dom";

import "./shared/forms/traducoesYup";

import { AppRoutes } from "./routes";
import {
  AppThemeProvider,
  AuthProvider,
  DrawerProvider
} from "./shared/contexts";
import { LateralMenu, Login } from "./shared/components";

export const App = () => {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <Login>
          <DrawerProvider>
            <BrowserRouter>
              <LateralMenu>
                <AppRoutes />
              </LateralMenu>
            </BrowserRouter>
          </DrawerProvider>
        </Login>
      </AppThemeProvider>
    </AuthProvider>
  );
};
