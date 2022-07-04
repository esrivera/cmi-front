import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { validationCredentials } from "src/utils/validationInputs";
import { clientPublic } from "src/api/axios";
import apis from "src/utils/bookApis";
import { msmSwalError, msmSwalExito } from "src/theme/theme";

const Credential = () => {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    newPassword: "",
    confirmPassword: "",
    code: "",
    showPassword: false,
    showNewPassword: false,
  });
  const router = useRouter();

  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
    setIsSubmiting(false);
  };

  const handleClickShowPassword = () => {
    setUser({
      ...user,
      showPassword: !user.showPassword,
    });
  };

  const handleClickShowNewPassword = () => {
    setUser({
      ...user,
      showNewPassword: !user.showNewPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = () => {
    setIsSubmiting(true);
    const newErrors = validationCredentials.submitNewPassword(user);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const formData = { otp: user.code, password: user.newPassword };
      clientPublic
        .post(apis.auth.post_reset_password, formData)
        .then((res) => {
          if (res.status === 200) {
            msmSwalExito("Contraseña modificada exitosamente.");
            router.push("/");
          }
        })
        .catch((exception) => {
          if (exception.response) {
            if (exception.response.status == 404) {
              msmSwalError(
                "No se pudo modificar la contraseña, el código es incorrecto, por favor verificarlo e intentar nuevamente."
              );
            } else if (exception.response.status == 409) {
              msmSwalError(
                "El código ingresado es demasiado antiguo, porfavor volver a relizar el proceso."
              );
            } else if (exception.response.status >= 400 || exception.response.status < 500) {
              msmSwalError("No se puede realizar el proceso. Inténtelo más tarde");
            }
          } else {
            msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
          }
        });
    }
  };

  return (
    <>
      <Head>
        <title>Cambiar Contraseña</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="sm">
          <NextLink href="/" passHref>
            <Button component="a" startIcon={<ArrowBackIcon fontSize="small" />}>
              Iniciar Sesión
            </Button>
          </NextLink>
          <Box sx={{ my: 3 }}>
            <Typography color="textPrimary" variant="h4">
              Cambiar Contraseña
            </Typography>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Ingrese el código que se envió a su correo y la nueva contraseña
            </Typography>
          </Box>
          <TextField
            fullWidth
            label="Ingrese el Código"
            margin="normal"
            name="code"
            required
            onChange={handleChange}
            type="text"
            value={user.code}
            variant="outlined"
          />
          {errors.code ? <p style={{ color: "red", fontSize: 11 }}>{errors.code}</p> : null}
          <FormControl variant="outlined" sx={{ mt: 1 }}>
            <InputLabel htmlFor="outlined-adornment-password">Nueva Contraseña</InputLabel>
            <OutlinedInput
              type={user.showPassword ? "text" : "password"}
              value={user.password}
              name="newPassword"
              required
              sx={{
                display: "flex",
                width: 550,
              }}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {user.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Nueva Contraseña"
            />
          </FormControl>
          {errors.newPassword ? (
            <p style={{ color: "red", fontSize: 11 }}>{errors.newPassword}</p>
          ) : null}
          <FormControl variant="outlined" sx={{ mt: 2 }}>
            <InputLabel htmlFor="outlined-adornment-password">Confirmar Contraseña</InputLabel>
            <OutlinedInput
              type={user.showNewPassword ? "text" : "password"}
              value={user.confirmPassword}
              name="confirmPassword"
              required
              sx={{
                display: "flex",
                width: 550,
              }}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowNewPassword}
                    onMouseDown={handleMouseDownNewPassword}
                    edge="end"
                  >
                    {user.showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirmar Contraseña"
            />
          </FormControl>
          {errors.confirmPassword ? (
            <p style={{ color: "red", fontSize: 11 }}>{errors.confirmPassword}</p>
          ) : null}
          <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              disabled={isSubmiting}
              fullWidth
              onClick={handleSubmit}
              size="large"
              type="submit"
              variant="contained"
            >
              Enviar
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Credential;
