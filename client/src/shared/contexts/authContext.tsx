import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { AuthService } from "../services/api/auth/authService";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  uid: number;
  iat: number;
  exp: number;
}
interface IAuthContextData {
  logout: () => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | void>;
}
interface IAuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext({} as IAuthContextData);

const LOCAL_STORAGE_KEY_ACCESS_TOKEN = "ACCESS_TOKEN"; //CHAVE
const LOCAL_STORAGE_USER_ID = "USER_ID";

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY_ACCESS_TOKEN);
    if (accessToken) {
      setAccessToken(accessToken);
    } else {
      setAccessToken(undefined);
    }
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const result = await AuthService.auth(email, password);
    if (result instanceof Error) {
      return result.message;
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY_ACCESS_TOKEN, result.accessToken);
      const decodedToken = jwtDecode<TokenPayload>(result.accessToken);
      const uid = decodedToken.uid;
      localStorage.setItem(LOCAL_STORAGE_USER_ID, uid.toString());
      setAccessToken(result.accessToken);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY_ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_USER_ID);
    setAccessToken(undefined);
  }, []);

  const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);

  return (
    //FUNÇÕES DE CONTEXTO PRECISAM DE CALLBACK
    <AuthContext.Provider
      value={{ isAuthenticated, login: handleLogin, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
