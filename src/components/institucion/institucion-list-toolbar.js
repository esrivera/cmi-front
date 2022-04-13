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
} from "@mui/material";
import { useState } from "react";
import { clientPublic } from "src/api/axios";
import { msmSwalError, msmSwalExito, palette } from "src/theme/theme";
import apis from "src/utils/bookApis";
import { Search as SearchIcon } from "../../icons/search";

const InstitutionListToolbar = ({ updateView }) => {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [institucion, setInstitucion] = useState({
    nombre: "",
    correo: "",
    direccion: "",
    siglas: "",
    telefono: "",
  });

  const handleSave = () => {
    clientPublic
      .post(apis.institution.post_add, institucion)
      .then((res) => {
        if (res.status === 200) {
          msmSwalExito("Institución registrada satisfactoriamente");
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status === 400) {
            msmSwalError("No se pudo registrar la institución");
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
    errors.siglas = null;
    errors.correoCliente = null;
    errors.telefono = null;
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setInstitucion({
      ...institucion,
      [event.target.name]: event.target.value,
    });
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
            Instituciones
          </Typography>
          <Box sx={{ m: 1 }}>
            <Button color="primary" variant="contained" onClick={handleClickOpen}>
              Agregar Institución
            </Button>
          </Box>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ maxWidth: 500 }}>
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon color="action" fontSize="small">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Buscar Institución"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose} disableEscapeKeyDown>
        <DialogTitle id="max-width-dialog-title">Nueva Institución</DialogTitle>
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
                  label="Nombre"
                  type="text"
                  autoComplete="off"
                  placeholder="Ej. Servicio de Rentas Internas"
                  onChange={handleChange}
                  value={institucion.nombre}
                />
                {errors.nombre ? <p>{errors.nombre}</p> : null}
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="siglas"
                  margin="normal"
                  id="outlined-basic"
                  label="Siglas"
                  type="text"
                  autoComplete="off"
                  placeholder="Ej. SRI"
                  onChange={handleChange}
                  value={institucion.siglas}
                />
                {errors.siglas ? <p>{errors.siglas}</p> : null}
              </Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="correo"
                  margin="normal"
                  id="outlined-basic"
                  label="Correo"
                  type="email"
                  autoComplete="off"
                  placeholder="Ej. user@ejemplo.com"
                  onChange={handleChange}
                  value={institucion.correo}
                />
                {errors.correo ? <p>{errors.correo}</p> : null}
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  name="direccion"
                  margin="normal"
                  id="outlined-basic"
                  label="Dirección"
                  type="text"
                  autoComplete="off"
                  placeholder="Ej. Av. República y Pradera"
                  onChange={handleChange}
                  value={institucion.direccion}
                />
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  name="telefono"
                  margin="normal"
                  id="outlined-basic"
                  label="Teléfono"
                  type="number"
                  autoComplete="off"
                  placeholder="Ej. 3824290"
                  onChange={handleChange}
                  value={institucion.telefono}
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

export default InstitutionListToolbar;
