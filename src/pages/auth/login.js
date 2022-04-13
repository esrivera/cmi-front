import Head from "next/head";
import NextLink from "next/link";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Link,
  Snackbar,
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

const Login = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const handleAutentication = (e) => {
    e.preventDefault();
    clientPublic
      .post(apis.auth.post_login, user)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          const dataToken = parseJwt(res.data.token);
          const rolUser = parseJwt(res.data.token).rol;
          if (rolUser === "ADMIN") {
            router.push("/inicio");
          } else {
            router.push("/inicio/home");
          }
          console.log(dataToken);
        }
      })
      .catch((exception) => {
        // setErrorMessage("No se pudo iniciar sesión credenciales invalidas.");
        // setOpen(true);
        if (exception.response) {
          if (exception.response.status === 400) {
            msmSwalError("No se pudo iniciar sesión credenciales invalidas.");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          sx={{
            width: "45%",
            marginLeft: 50,
            marginBottom: 30,
          }}
          onClose={handleClose}
          severity="error"
        >
          <AlertTitle>Error</AlertTitle>
          {errorMessage} — <strong>reingresar los datos!</strong>
        </Alert>
      </Snackbar>
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
            <TextField
              fullWidth
              required
              name="password"
              margin="normal"
              id="outlined-password-input"
              label="Clave"
              type="password"
              autoComplete="current-password"
              onChange={handleChange}
              value={user.password}
            />
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
