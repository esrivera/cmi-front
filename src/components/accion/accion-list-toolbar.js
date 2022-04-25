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

const ActionListToolbar = ({ updateView, idObjetive, setIdObjetive, objetives }) => {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [objetiveId, setObjetiveId] = useState([]);
  const [idObjetivo, setIdObjetivo] = useState([]);
  const [idInstitucion, setIdInstitucion] = useState([]);
  const [periodicidad, setPeriodicidad] = useState([]);
  const [accion, setAccion] = useState({
    descDenominador: "",
    descNumerador: "",
    descripcionAccEstrategica: "",
    descripcionResultado: "",
    ecuacion: "",
    idInstitucion: 0,
    idObjetivoEstrategico: 0,
    identificador: "",
    nombreIndicador: "",
    perioricidadReporte: "",
  });
  const [institution, setInstitution] = useState([]);
  const query = {
    uri: apis.institution.get_all,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "nombre,asc",
  };

  const handleSave = () => {
    clientPublic
      .post(apis.accion.post_add, accion)
      .then((res) => {
        if (res.status === 200) {
          msmSwalExito("Acción estratégica registrada satisfactoriamente");
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status >= 400) {
            msmSwalError("No se pudo registrar la acción estratégica");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
    updateView();
  };

  const handleClickOpen = () => {
    setOpen(true);
    searchInstitution();
    errors.nombre = null;
    errors.descripcionAccEstrategica = null;
  };

  const searchInstitution = async () => {
    await clientPublic
      .get(query.uri + "?page=" + query.page + "&size=" + query.elementos + "&sort=" + query.sort)
      .then((result) => {
        if (result.status === 200) {
          setInstitution(result.data.content);
        }
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  const handleClose = () => {
    setOpen(false);
    clearData();
  };

  const clearData = () => {
    setAccion({
      descDenominador: "",
      descNumerador: "",
      descripcionAccEstrategica: "",
      descripcionResultado: "",
      ecuacion: "",
      idInstitucion: 0,
      idObjetivoEstrategico: 0,
      identificador: "",
      nombreIndicador: "",
      perioricidadReporte: "",
    });
    setIdInstitucion([]);
    setIdObjetivo([]);
    setPeriodicidad([]);
  };

  const handleChange = (event) => {
    setAccion({
      ...accion,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeSelect = (event) => {
    setObjetiveId(event.target.value);
    setIdObjetive(event.target.value);
  };

  const handleChangeInstitucion = (event) => {
    setIdInstitucion(event.target.value);
    setAccion({
      ...accion,
      idInstitucion: event.target.value,
    });
  };

  const handleChangeObjetivo = (event) => {
    setIdObjetivo(event.target.value);
    setAccion({
      ...accion,
      idObjetivoEstrategico: event.target.value,
    });
  };

  const handleChangePeriodo = (event) => {
    setPeriodicidad(event.target.value);
    console.log(event.target.value);
    setAccion({
      ...accion,
      perioricidadReporte: event.target.value,
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
            Acciones Estratégicas
          </Typography>
          <Box sx={{ m: 1 }}>
            <Button color="primary" variant="contained" onClick={handleClickOpen}>
              Agregar Acción Estratégica
            </Button>
          </Box>
        </Box>
        <Box sx={{ mt: 3, flexWrap: "wrap"}}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ width: 300 }}>
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
                      placeholder="Buscar Acción Estratégica"
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <FormControl sx={{ width: 300 }}>
                    <InputLabel id="demo-simple-select-autowidth-label">
                      Objetivo Estratégico
                    </InputLabel>
                    <Select
                      value={objetiveId}
                      onChange={handleChangeSelect}
                      id="demo-simple-select-autowidth"
                      labelId="demo-simple-select-autowidth-label"
                      label="Objetivo Estratégico"
                    >
                      <MenuItem disabled value="">
                        <em>--Seleccione--</em>
                      </MenuItem>
                      {objetives.map((objetivo) => (
                        <MenuItem key={objetivo.id} value={objetivo.id}>
                          {objetivo.nombre}
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
        <DialogTitle id="max-width-dialog-title">Nueva Acción Estratégica</DialogTitle>
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
                  name="identificador"
                  margin="normal"
                  id="outlined-basic"
                  label="Identificador"
                  type="text"
                  autoComplete="off"
                  placeholder="Ej. A.E.1"
                  onChange={handleChange}
                  value={accion.identificador}
                />
                {errors.identificador ? <p>{errors.identificador}</p> : null}
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="descripcionAccEstrategica"
                  margin="normal"
                  id="outlined-basic"
                  label="Descripción"
                  type="text"
                  autoComplete="off"
                  multiline
                  onChange={handleChange}
                  value={accion.descripcionAccEstrategica}
                />
                {errors.descripcionAccEstrategica ? (
                  <p>{errors.descripcionAccEstrategica}</p>
                ) : null}
              </Grid>
              <Grid item md={5} xs={12}>
                <FormControl sx={{ minWidth: 395 }}>
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
                    {institution.map((element) => (
                      <MenuItem key={element.idInstitucion} value={element.idInstitucion}>
                        {element.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <FormControl sx={{ minWidth: 400 }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Periodicidad</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={periodicidad}
                    onChange={handleChangePeriodo}
                    autoWidth
                    label="Periodicidad"
                  >
                    <MenuItem disabled value="">
                      <em>--Seleccione--</em>
                    </MenuItem>
                    <MenuItem value={"Mensual"}>Mensual</MenuItem>
                    <MenuItem value={"Trimestral"}>Trimestral</MenuItem>
                    <MenuItem value={"Cuatrimestral"}>Cuatrimestral</MenuItem>
                    <MenuItem value={"Semestral"}>Semestral</MenuItem>
                    <MenuItem value={"Anual"}>Anual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={5} xs={12}>
                <FormControl sx={{ minWidth: 400 }}>
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Objetivo Estratégico
                  </InputLabel>
                  <Select
                    value={idObjetivo}
                    onChange={handleChangeObjetivo}
                    id="demo-simple-select-autowidth"
                    labelId="demo-simple-select-autowidth-label"
                    label="Objetivo Estratégico"
                  >
                    <MenuItem disabled value="">
                      <em>--Seleccione--</em>
                    </MenuItem>
                    {objetives.map((objetivo) => (
                      <MenuItem key={objetivo.id} value={objetivo.id}>
                        {objetivo.nombre}
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
                  name="nombreIndicador"
                  margin="normal"
                  id="outlined-basic"
                  label="Indicador"
                  type="text"
                  multiline
                  autoComplete="off"
                  onChange={handleChange}
                  value={accion.nombreIndicador}
                />
              </Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="ecuacion"
                  margin="normal"
                  id="outlined-basic"
                  label="Fórmula de Cálculo"
                  type="text"
                  autoComplete="off"
                  onChange={handleChange}
                  value={accion.ecuacion}
                  placeholder="Ej. PAS=(AVEJ/AVPL)x100"
                />
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="descripcionResultado"
                  margin="normal"
                  id="outlined-basic"
                  label="Descripción Fórmula de Cálculo"
                  type="text"
                  autoComplete="off"
                  multiline
                  onChange={handleChange}
                  value={accion.descripcionResultado}
                />
              </Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="descNumerador"
                  margin="normal"
                  id="outlined-basic"
                  label="Descripción del numerador"
                  type="text"
                  autoComplete="off"
                  multiline
                  onChange={handleChange}
                  value={accion.descNumerador}
                />
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="descDenominador"
                  margin="normal"
                  id="outlined-basic"
                  label="Descripción del denominador"
                  type="text"
                  autoComplete="off"
                  multiline
                  onChange={handleChange}
                  value={accion.descDenominador}
                />
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

export default ActionListToolbar;
