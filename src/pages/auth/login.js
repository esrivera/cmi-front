import Head from "next/head";
import NextLink from "next/link";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import { clientPublic } from "src/api/axios";
import { parseJwt } from "src/utils/userAction";
import apis from "src/utils/bookApis";
import { useRouter } from "next/router";
import { msmSwalError } from "src/theme/theme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useCookies } from "react-cookie";

const Login = () => {
  const [user, setUser] = useState({ username: "", password: "", showPassword: false });
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["token"]);
  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const handleClickShowPassword = () => {
    setUser({
      ...user,
      showPassword: !user.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleAutentication = (e) => {
    e.preventDefault();
    clientPublic
      .post(apis.auth.post_login, user)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          const rolUser = parseJwt(res.data.token).rol;
          setCookie("token", res.data.token, { path: "/" });
          if (rolUser === "ADMIN") {
            router.push("/inicio");
          } else {
            router.push("/inicio/cmi");
          }
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status == 401) {
            msmSwalError(
              "Usuario bloqueado, porfavor contáctese con el administrador del sistema."
            );
          } else if (exception.response.status >= 400 || exception.response.status < 500) {
            msmSwalError("No se pudo iniciar sesión credenciales inválidas.");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
  };

  return (
    <>
      <Head>
        <title>Inicio de Sesión</title>
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Image width={450} height={250} src="/img/conse1.jpg" alt="logo" />
          </div>
          <form onSubmit={handleAutentication}>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                margin="normal"
                id="outlined-disabled"
                label="Usuario"
                required
                name="username"
                placeholder="Nombre de usuario"
                onChange={handleChange}
                value={user.username}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                <OutlinedInput
                  type={user.showPassword ? "text" : "password"}
                  value={user.password}
                  name="password"
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
                  label="Contraseña"
                />
              </FormControl>
            </Grid>
            <Box sx={{ py: 2 }}>
              <Button color="primary" fullWidth size="large" type="submit" variant="contained">
                Iniciar Sesión
              </Button>
            </Box>
            <Typography color="textSecondary" variant="body2">
              ¿Olvidaste tu contraseña?{" "}
              <NextLink href="/auth/restablecer">
                <Link
                  to="/auth/restablecer"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  Restablecer
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
