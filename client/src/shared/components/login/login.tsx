import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  TextField,
  Typography
} from "@mui/material";
import { useAuthContext } from "../../contexts";
import { useState } from "react";
import * as yup from "yup";
import { Register } from "./register";

interface ILoginProps {
  children: React.ReactNode;
}

const loginSchema = yup.object().shape({
  email: yup.string().required().email().max(100),
  password: yup.string().required().min(6).max(100)
});

export const Login: React.FC<ILoginProps> = ({ children }) => {
  const { isAuthenticated, login } = useAuthContext();
  if (isAuthenticated) return <>{children}</>;

  const [register, setRegister] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = () => {
    setIsLoading(true);
    setPasswordError("");
    setEmailError("");
    loginSchema
      .validate({ email, password }, { abortEarly: false })
      .then(dadosValidados => {
        login(dadosValidados.email, dadosValidados.password)
          .then(() => {
            setIsLoading(false);
          })
          .catch(error => {
            setIsLoading(false);
            const errorResponse = JSON.parse(error.message);
            if (errorResponse.errors.password) {
              setPasswordError(errorResponse.errors.password);
            } else if (errorResponse.errors.email) {
              setEmailError(errorResponse.errors.email);
            }
          });
      })
      .catch((errors: yup.ValidationError) => {
        setIsLoading(false);
        errors.inner.forEach(error => {
          if (error.path === "email") {
            setEmailError(error.message);
          } else if (error.path === "password") {
            setPasswordError(error.message);
          }
        });
      });
  };

  if (register) {
    return (
      <Register
        setRegister={setRegister}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    );
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Card>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2} width={250}>
            <Typography variant="h6" align="center">
              Identifique-se
            </Typography>
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={email}
              disabled={isLoading}
              error={!!emailError}
              helperText={emailError}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={() => setEmailError("")}
            />
            <TextField
              fullWidth
              type="password"
              label="Senha"
              value={password}
              disabled={isLoading}
              error={!!passwordError}
              helperText={passwordError}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={() => setPasswordError("")}
            />
          </Box>
        </CardContent>
        <CardActions>
          <Box width="100%" display="flex" justifyContent="center" gap={1}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              endIcon={
                isLoading ? (
                  <CircularProgress
                    variant="indeterminate"
                    color="inherit"
                    size={20}
                  />
                ) : undefined
              }
            >
              Entrar
            </Button>
            <Button
              variant="contained"
              onClick={() => setRegister(true)}
              disabled={isLoading}
              endIcon={
                isLoading ? (
                  <CircularProgress
                    variant="indeterminate"
                    color="inherit"
                    size={20}
                  />
                ) : undefined
              }
            >
              Registrar
            </Button>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
};
