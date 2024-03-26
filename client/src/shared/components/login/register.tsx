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
import { useState } from "react";
import * as yup from "yup";
import { userService } from "../../services/api/users/userService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const registerSchema = yup.object().shape({
  name: yup.string().required().min(3).max(100),
  email: yup.string().required().email().max(100),
  password: yup.string().required().min(6).max(100)
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
  const [showPassword, setShowPassword] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = () => {
    setIsLoading(true);

    registerSchema
      .validate({ name, email, password }, { abortEarly: false })
      .then(dadosValidados => {
        userService.register(dadosValidados).then(() => {
          setIsLoading(false);
          setRegister(false);
        });
      })
      .catch((errors: yup.ValidationError) => {
        setIsLoading(false);
        errors.inner.forEach(error => {
          if (error.path === "email") {
            setEmailError(error.message);
          } else if (error.path === "password") {
            setPasswordError(error.message);
          } else if (error.path === "name") {
            setNameError(error.message);
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
              Cadastro
            </Typography>
            <TextField
              fullWidth
              type="name"
              label="Nome"
              value={name}
              disabled={isLoading}
              error={!!nameError}
              helperText={nameError}
              onChange={e => setName(e.target.value)}
              onKeyDown={() => setNameError("")}
            />
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
              Cadastrar
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
                Voltar ao Login
              </Button>
            </Box>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
};
