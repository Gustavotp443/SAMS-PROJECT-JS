import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  uid: number;
  iat: number;
  exp: number;
}

export const getUserId = (token: string) => {
  const decodedToken: TokenPayload = jwtDecode(token) as TokenPayload;
  return decodedToken.uid;
};
