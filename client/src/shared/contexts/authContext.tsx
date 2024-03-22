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
import { IDetailUser, userService } from "../services/api/users/userService";
import { getUsertId } from "../utils";

interface TokenPayload {
  uid: number;
  iat: number;
  exp: number;
}
interface IAuthContextData {
  logout: () => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | void>;
  userData: () => Promise<IDetailUser | null>;
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

  const getUserData = useCallback(async (): Promise<IDetailUser | null> => {
    try {
      const userId = getUsertId();
      const data = await userService.getById(userId);
      if (data instanceof Error) {
        console.error("Falha ao buscar dados de usuário", data.message);
        return null;
      }
      return data;
    } catch (error) {
      console.error("Falha ao buscar dados de usuário", error);
      return null;
    }
  }, []);

  const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);

  return (
    //FUNÇÕES DE CONTEXTO PRECISAM DE CALLBACK
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
        userData: getUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
