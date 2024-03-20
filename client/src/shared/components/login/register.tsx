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
import { useState } from "react";
import * as yup from "yup";

const registerSchema = yup.object().shape({
  name: yup.string().required().min(3),
  email: yup.string().required().email(),
  password: yup.string().required().min(6)
});

interface IRegisterProps {
  setRegister: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Register: React.FC<IRegisterProps> = ({
  setRegister,
  isLoading,
  setIsLoading
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = () => {
    setIsLoading(true);

    registerSchema
      .validate({ name, email, password }, { abortEarly: false })
      .then(dadosValidados => {
        login(dadosValidados.email, dadosValidados.password).then(() => {
          setIsLoading(false);
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
              Indentifique-se
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
            <Box>
              <Button
                variant="contained"
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
                onClick={() => setRegister(false)}
              >
                Voltar para Login
              </Button>
            </Box>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
};
