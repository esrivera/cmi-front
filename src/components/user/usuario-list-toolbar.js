import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Grid,
  DialogContent,
  DialogTitle,
  Dialog,
  Divider,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import { clientPublic } from "src/api/axios";
import { msmSwalError, msmSwalExito, palette } from "src/theme/theme";
import apis from "src/utils/bookApis";
import { Search as SearchIcon } from "../../icons/search";

const UserListToolbar = ({
  updateView,
  idInstitute,
  setIdInstitute,
  institutions,
  wordSearch,
  setWordSearch,
}) => {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [institutionId, setInstitutionId] = useState("");
  const [idInstitucion, setIdInstitucion] = useState("");
  const [usuario, setUsuario] = useState({
    apellido: "",
    email: "",
    idInstitucion: 0,
    identificacion: "",
    nombre: "",
    telefono: "",
  });

  const handleSave = () => {
    clientPublic
      .post(apis.user.post_add, usuario)
      .then((res) => {
        if (res.status === 201) {
          msmSwalExito("Usuario registrado satisfactoriamente");
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status >= 400) {
            msmSwalError("No se pudo registrar el usuario");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
    updateView();
  };

  const handleClickOpen = () => {
    setOpen(true);
    errors.nombre = null;
    errors.apellido = null;
    errors.identificacion = null;
    errors.email = null;
    errors.telefono = null;
  };

  const handleClose = () => {
    setOpen(false);
    clearData();
  };

  const clearData = () => {
    setUsuario({
      apellido: "",
      email: "",
      idInstitucion: 0,
      identificacion: "",
      nombre: "",
      telefono: "",
    });
    setIdInstitucion([]);
  };

  const handleChange = (event) => {
    setUsuario({
      ...usuario,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeSelect = (event) => {
    setInstitutionId(event.target.value);
    setIdInstitute(event.target.value);
  };

  const handleChangeInstitucion = (event) => {
    setIdInstitucion(event.target.value);
    setUsuario({
      ...usuario,
      idInstitucion: event.target.value,
    });
  };

  const handleChangeWord = (event) => {
    setWordSearch(event.target.value);
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            m: -1,
          }}
        >
          <Typography sx={{ m: 1 }} variant="h4">
            Usuarios
          </Typography>
          <Box sx={{ m: 1 }}>
            <Button color="primary" variant="contained" onClick={handleClickOpen}>
              Agregar Usuario
            </Button>
          </Box>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ maxWidth: 400 }}>
                    <TextField
                      fullWidth
                      name="wordSearch"
                      value={wordSearch}
                      onChange={handleChangeWord}
                      autoFocus
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SvgIcon color="action" fontSize="small">
                              <SearchIcon />
                            </SvgIcon>
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Buscar Usuario"
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <FormControl sx={{ width: 300 }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Institución</InputLabel>
                    <Select
                      value={institutionId}
                      onChange={handleChangeSelect}
                      id="demo-simple-select-autowidth"
                      labelId="demo-simple-select-autowidth-label"
                      label="Institución"
                    >
                      <MenuItem disabled value="">
                        <em>--Seleccione--</em>
                      </MenuItem>
                      {institutions.map((institute) => (
                        <MenuItem key={institute.idInstitucion} value={institute.idInstitucion}>
                          {institute.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose} disableEscapeKeyDown>
        <DialogTitle id="max-width-dialog-title">Nuevo Usuario</DialogTitle>
        <DialogContent>
          <form autoComplete="off" onSubmit={handleSave}>
            <Grid container direction="row" justify="flex-start" alignItems="center">
              <Grid item md={12} xs={12}>
                <label>
                  Los campos marcados con ( <font color={palette.error.main}> *</font> ) son
                  obligatorios:
                </label>
              </Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="nombre"
                  margin="normal"
                  id="outlined-basic"
                  label="Nombres"
                  type="text"
                  autoComplete="off"
                  placeholder="Ej. Javier"
                  onChange={handleChange}
                  value={usuario.nombre}
                />
                {errors.nombre ? <p>{errors.nombre}</p> : null}
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="apellido"
                  margin="normal"
                  id="outlined-basic"
                  label="Apellidos"
                  type="text"
                  autoComplete="off"
                  placeholder="Ej. Herrera"
                  onChange={handleChange}
                  value={usuario.apellido}
                />
                {errors.apellido ? <p>{errors.apellido}</p> : null}
              </Grid>
              <Grid item md={5} xs={12}>
                <FormControl sx={{ width: 395 }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Institución</InputLabel>
                  <Select
                    value={idInstitucion}
                    onChange={handleChangeInstitucion}
                    id="demo-simple-select-autowidth"
                    labelId="demo-simple-select-autowidth-label"
                    label="Institución"
                  >
                    <MenuItem disabled value="">
                      <em>--Seleccione--</em>
                    </MenuItem>
                    {institutions.map((element) => (
                      <MenuItem key={element.idInstitucion} value={element.idInstitucion}>
                        {element.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="identificacion"
                  margin="normal"
                  id="outlined-basic"
                  label="Identificación / CI"
                  type="text"
                  autoComplete="off"
                  placeholder="Ej. 1722201066"
                  onChange={handleChange}
                  value={usuario.identificacion}
                />
                {errors.identificacion ? <p>{errors.identificacion}</p> : null}
              </Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="email"
                  margin="normal"
                  id="outlined-basic"
                  label="Correo"
                  type="email"
                  autoComplete="off"
                  placeholder="Ej. demo@demo.com"
                  onChange={handleChange}
                  value={usuario.email}
                />
                {errors.email ? <p>{errors.email}</p> : null}
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="telefono"
                  margin="normal"
                  id="outlined-basic"
                  label="Teléfono"
                  type="text"
                  placeholder="Ej. 0978644612"
                  autoComplete="off"
                  onChange={handleChange}
                  value={usuario.telefono}
                />
                {errors.telefono ? <p>{errors.telefono}</p> : null}
              </Grid>
              <Grid container alignContent="center" sx={{ mt: 1 }} justify="flex-end">
                <Grid item md={12} xs={12}>
                  <Divider></Divider>
                </Grid>
                <Grid sx={{ mt: 1 }}>
                  <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                    Agregar
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleClose}>
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserListToolbar;
