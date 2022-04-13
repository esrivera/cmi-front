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
  Alert,
  DialogContent,
  DialogTitle,
  Dialog,
  Divider,
  Backdrop,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import React, { useState } from "react";
import { clientPublic } from "src/api/axios";
import { msmSwalError, msmSwalExito, palette } from "src/theme/theme";
import apis from "src/utils/bookApis";
import { Search as SearchIcon } from "../../icons/search";

const ObjetiveListToolbar = ({ updateView }) => {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [objetive, setObjetive] = useState({
    nombre: "",
    descripcion: "",
  });

  const handleSave = () => {
    clientPublic
      .post(apis.objetive.post_add, objetive)
      .then((res) => {
        if (res.status === 200) {
          msmSwalExito("Objetivo estratégico registrado satisfactoriamente");
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status === 400) {
            msmSwalError("No se pudo registrar el objetivo estratégico");
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
    errors.descripcion = null;
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setObjetive({
      ...objetive,
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
            Objetivos Estratégicos
          </Typography>
          <Box sx={{ m: 1 }}>
            <Button color="primary" variant="contained" onClick={handleClickOpen}>
              Agregar Objetivo
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
                  placeholder="Buscar Objetivo Estratégico"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose} disableEscapeKeyDown>
        <DialogTitle id="max-width-dialog-title">Nuevo Objetivo Estratégico</DialogTitle>
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
                  value={objetive.nombre}
                />
                {errors.nombre ? <p>{errors.nombre}</p> : null}
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="descripcion"
                  margin="normal"
                  id="outlined-basic"
                  label="Descripción"
                  type="text"
                  autoComplete="off"
                  multiline
                  onChange={handleChange}
                  value={objetive.descripcion}
                />
                {errors.descripcion ? <p>{errors.descripcion}</p> : null}
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

export default ObjetiveListToolbar;
