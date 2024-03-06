import * as jwt from "jsonwebtoken";

interface IJwtData {
  uid: number;
}

const key = (() => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    return "secret";
  } else if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined.");
  } else {
    return process.env.JWT_SECRET;
  }
})();

const sign = (data: IJwtData): string | "JWT_SECRET_NOT_FOUND" => {
  if (!process.env.JWT_SECRET) return "JWT_SECRET_NOT_FOUND";

  return jwt.sign(data, key, { expiresIn: "24h" });
};

const verify = (
  token: string
): IJwtData | "JWT_SECRET_NOT_FOUND" | "INVALID_TOKEN" => {
  if (!process.env.JWT_SECRET) return "JWT_SECRET_NOT_FOUND";

  try {
    const decoded = jwt.verify(token, key);
    if (typeof decoded === "string") {
      return "INVALID_TOKEN";
    }

    return decoded as IJwtData;
  } catch (e) {
    return "INVALID_TOKEN";
  }
};

export const JWTService = {
  sign,
  verify
};
