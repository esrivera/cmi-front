import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { clientPublic } from "src/api/axios";
import apis from "src/utils/bookApis";
import { msmSwalError, msmSwalExito } from "src/theme/theme";
import { useState } from "react";
import { validateEmmail } from "src/utils/validationInputs";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setEmail(event.target.value);
    setIsSubmiting(false);
  };

  const handleSubmit = () => {
    setIsSubmiting(true);
    const newErrors = validateEmmail.submitForgotPassword(email);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      clientPublic
        .post(apis.auth.post_forgot_password, { email })
        .then((res) => {
          if (res.status === 200) {
            msmSwalExito(
              "Solicitud generada correctamente, se le ha enviado un correo para completar el proceso"
            );
          }
        })
        .catch((exception) => {
          if (exception.response) {
            if (exception.response.status == 404) {
              msmSwalError(
                "No se encuentra el usuario con el correo ingresado, por favor verificarlo e intentar nuevamente."
              );
            } else if (exception.response.status >= 400 || exception.response.status < 500) {
              msmSwalError(
                "No se puede generar el proceso. " + exception.response.data.messageDebug
              );
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
        <title>Restablecer</title>
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
              ¿Olvidaste tu clave?
            </Typography>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Ingresa el correo electrónico con el que se registró tu cuenta para recibir el mensaje
              de restauración de clave.
            </Typography>
          </Box>
          <TextField
            fullWidth
            label="Ingrese el Correo Electrónico"
            margin="normal"
            name="email"
            onChange={handleChange}
            type="email"
            value={email}
            variant="outlined"
          />
          {errors.email ? <p style={{ color: "red", fontSize: 11 }}>{errors.email}</p> : null}
          <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              fullWidth
              size="large"
              disabled={isSubmiting}
              onClick={handleSubmit}
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

export default Register;
