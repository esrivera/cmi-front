import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { msmSwalError, msmSwalExito, palette } from "src/theme/theme";
import { clientPublic } from "src/api/axios";
import apis from "src/utils/bookApis";
import { validationPassword } from "src/utils/validationInputs";

export const AccountProfileDetails = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState({
    contrasenia: "",
    nuevaContrasenia: "",
    showPassword: false,
    showNewPassword: false,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPassword({
      contrasenia: "",
      nuevaContrasenia: "",
      showPassword: false,
      showNewPassword: false,
    });
  };

  const handleChange = (prop) => (event) => {
    setPassword({ ...password, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setPassword({
      ...password,
      showPassword: !password.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowNewPassword = () => {
    setPassword({
      ...password,
      showNewPassword: !password.showNewPassword,
    });
  };

  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  const handleSave = () => {
    const newErrors = validationPassword.submitPassword(password);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const newUser = {
        ciUsuario: user.identification,
        passwordActual: password.contrasenia,
        passwordNuevo: password.nuevaContrasenia,
      };
      clientPublic
        .post(apis.user.post_password, newUser)
        .then((res) => {
          if (res.status === 200) {
            msmSwalExito("Cambio de contraseña realizado satisfactoriamente");
          }
        })
        .catch((exception) => {
          if (exception.response) {
            if (exception.response.status === 400) {
              msmSwalError("No se pudo cambiar la contraseña");
            }
          } else {
            msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
          }
        });
      //updateView();
      setOpen(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader title="Perfil" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12} sx={{ flexDirection: "row", display: "flex" }}>
              <PersonRoundedIcon></PersonRoundedIcon>
              <p style={{ fontSize: 15, marginRight: 15 }}>
                <b>Nombres:</b>
              </p>
              <p style={{ fontSize: 15, color: "gray" }}>{user.name}</p>
            </Grid>
            <Grid item md={6} xs={12} sx={{ flexDirection: "row", display: "flex" }}>
              <PersonRoundedIcon></PersonRoundedIcon>
              <p style={{ fontSize: 15, marginRight: 15 }}>
                <b>Apellidos:</b>
              </p>
              <p style={{ fontSize: 15, color: "gray" }}>{user.lastname}</p>
            </Grid>
            <Grid item md={6} xs={12} sx={{ flexDirection: "row", display: "flex" }}>
              <EmailRoundedIcon></EmailRoundedIcon>
              <p style={{ fontSize: 15, marginRight: 15 }}>
                <b>Correo:</b>
              </p>
              <p style={{ fontSize: 15, color: "gray" }}>{user.email}</p>
            </Grid>
            <Grid item md={6} xs={12} sx={{ flexDirection: "row", display: "flex" }}>
              <BadgeRoundedIcon></BadgeRoundedIcon>
              <p style={{ fontSize: 15, marginRight: 15 }}>
                <b>Identificación:</b>
              </p>
              <p style={{ fontSize: 15, color: "gray" }}>{user.identification}</p>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button color="primary" variant="contained" onClick={handleClickOpen}>
            Cambiar Contraseña
          </Button>
        </Box>
      </Card>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose} disableEscapeKeyDown>
        <DialogTitle id="max-width-dialog-title">Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <Grid container direction="row" justify="flex-start" alignItems="center">
            <Grid item md={12} xs={12} mb={1}>
              <label>
                Los campos marcados con ( <font color={palette.error.main}> *</font> ) son
                obligatorios:
              </label>
              <br></br>
              <label style={{ fontSize: 12 }}>
                La contraseña debe constar de 8 a 16 carácteres alfanuméricos
              </label>
            </Grid>
            <Grid item md={5} xs={12}>
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Contraseña Actual</InputLabel>
                <OutlinedInput
                  type={password.showPassword ? "text" : "password"}
                  value={password.contrasenia}
                  onChange={handleChange("contrasenia")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {password.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Contraseña Actual"
                />
                {errors.contrasenia ? (
                  <p style={{ color: "red", fontSize: 11 }}>{errors.contrasenia}</p>
                ) : null}
              </FormControl>
            </Grid>
            <Grid item md={1} xs={12}></Grid>
            <Grid item md={5} xs={12}>
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Nueva Contraseña</InputLabel>
                <OutlinedInput
                  type={password.showNewPassword ? "text" : "password"}
                  value={password.nuevaContrasenia}
                  onChange={handleChange("nuevaContrasenia")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowNewPassword}
                        onMouseDown={handleMouseDownNewPassword}
                        edge="end"
                      >
                        {password.showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Nueva Contraseña"
                />
                {errors.nuevaContrasenia ? (
                  <p style={{ color: "red", fontSize: 11 }}>{errors.nuevaContrasenia}</p>
                ) : null}
              </FormControl>
            </Grid>
            <Grid container alignContent="center" sx={{ mt: 1 }} justify="flex-end">
              <Grid item md={12} xs={12}>
                <Divider></Divider>
              </Grid>
              <Grid sx={{ mt: 1 }}>
                <Button
                  onClick={handleSave}
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ mr: 2 }}
                >
                  Cambiar
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};
