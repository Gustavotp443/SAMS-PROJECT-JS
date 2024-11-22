import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";
import { useAuthContext } from "../../contexts";
import { useState } from "react";
import * as yup from "yup";
import { Register } from "./register";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import bgImg1 from "./../../../img/fundo1.png";
import bgImg2 from "./../../../img/fundo2.png";

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
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  interface BackgroundBoxProps {
    image: string;
    zIndex: number;
  }
  const BackgroundBox: React.FC<BackgroundBoxProps> = ({ image, zIndex }) => (
    <Box
      sx={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: zIndex
      }}
    />
  );

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
      sx={{ position: "relative" }}
    >
      <BackgroundBox image={bgImg2} zIndex={1} />
      <BackgroundBox image={bgImg1} zIndex={2} />

      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          textShadow: "1px 1px 0px #fff",
          textAlign: "center",
          color: "#cd9a02",
          width: "100%"
        }}
      >
        <Typography variant="h4">Olá! Você está no SAMS</Typography>
      </Box>

      <Card
        sx={{
          zIndex: 999,
          boxShadow: "6px 6px 4px rgba(255, 193, 7, 1)",
          position: "relative",
          width: 300 // Tamanho fixo para evitar que o card se distorça em telas menores
        }}
      >
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
              type={showPassword ? "text" : "password"}
              label="Senha"
              value={password}
              disabled={isLoading}
              error={!!passwordError}
              helperText={passwordError}
              onChange={e => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
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
