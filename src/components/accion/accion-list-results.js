import React, { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import BatchPredictionRoundedIcon from "@mui/icons-material/BatchPredictionRounded";
import apis from "src/utils/bookApis";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import { clientPublic } from "src/api/axios";
import { msmSwalError, msmSwalExito, palette } from "src/theme/theme";

const ActionListResults = ({ actions, updateView, objetives }) => {
  const [selectedActionIds, setSelectedActionIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [idAccionEstrategica, setIdAccionEstrategica] = useState("");
  const [idIndicador, setIdindicador] = useState("");
  const [estado, setEstado] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [idAccion, setIdAccion] = useState("");
  const [idFormula, setIdFormula] = useState("");
  const [institution, setInstitution] = useState([]);
  const [idObjetivo, setIdObjetivo] = useState([]);
  const [idInstitucion, setIdInstitucion] = useState([]);
  const [periodicidad, setPeriodicidad] = useState([]);
  const [metas, setMetas] = useState([]);
  const [errors, setErrors] = useState({});
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
  const [open, setOpen] = useState(false);
  const [openActive, setOpenActive] = useState(false);
  const query = {
    uri: apis.institution.get_all,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "nombre,asc",
  };

  const queryMeta = {
    uri: apis.meta.get_all_indicador,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "anioPlanificado,asc",
  };

  const handleLimitChange = (event) => {
    setLimit(+event.target.value);
    setPage(0);
  };

  const handleEdit = (data) => {
    setOpen(true);
    setIdInstitucion(data.institucion.idInstitucion);
    setPeriodicidad(data.perioricidadReporte);
    setIdObjetivo(data.objetivoEstrategico.id);
    setIdAccionEstrategica(data.id);
    setIdFormula(data.indicador[0].formula[0].id);
    setIdindicador(data.indicador[0].id);
    setAccion({
      ...accion,
      idInstitucion: data.institucion.idInstitucion,
      idObjetivoEstrategico: data.objetivoEstrategico.id,
      identificador: data.identificador,
      descripcionAccEstrategica: data.descripcion,
      nombreIndicador: data.indicador[0].nombre,
      descDenominador: data.indicador[0].formula[0].descDenominador,
      descNumerador: data.indicador[0].formula[0].descNumerador,
      ecuacion: data.indicador[0].formula[0].ecuacion,
      descripcionResultado: data.indicador[0].formula[0].descripcionResultado,
      perioricidadReporte: data.perioricidadReporte,
    });
    searchInstitution();
    errors.nombre = null;
    errors.descripcionAccEstrategica = null;
  };

  const handleEditData = () => {
    clientPublic
      .put(apis.accion.edit_id + idAccionEstrategica + "/" + idIndicador + "/" + idFormula, accion)
      .then((res) => {
        if (res.status === 200) {
          msmSwalExito("Acción Estratégica editada satisfactoriamente");
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status >= 400) {
            msmSwalError("No se pudo editar la acción estratégica");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
    updateView();
  };

  const handleList = (data) => {
    setOpenList(true);
    searchMetas(data.indicador[0].id);
  };

  const handleCloseList = () => {
    setOpenList(false);
  };

  const searchMetas = async (id) => {
    await clientPublic
      .get(
        queryMeta.uri +
          id +
          "?page=" +
          queryMeta.page +
          "&size=" +
          queryMeta.elementos +
          "&sort=" +
          queryMeta.sort
      )
      .then((result) => {
        if (result.status === 200) {
          setMetas(result.data.content);
        }
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
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
    setAccion({
      ...accion,
      perioricidadReporte: event.target.value,
    });
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

  const handleDelete = (data) => {
    clientPublic
      .delete(
        apis.accion.delete_id +
          data.id +
          "/" +
          data.indicador[0].id +
          "/" +
          data.indicador[0].formula[0].id
      )
      .then((res) => {
        if (res.status === 200) {
          msmSwalExito("Acción Estratégica eliminada satisfactoriamente");
          updateView();
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status >= 400) {
            msmSwalError("No se pudo eliminar la acción estratégica");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    setOpen(false);
    clearData();
  };

  const handleChangeEstado = () => {
    clientPublic
      .patch(apis.accion.patch_estado_id + idAccion, null, {
        params: { estado: estado },
      })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          msmSwalExito("Estado de la acción estratégica cambiado satisfactoriamente");
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status >= 400 && exception.response.status < 500) {
            msmSwalError("No se pudo cambiar el estado de la acción estratégica");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
    updateView();
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

  const handleActive = (data) => {
    setOpenActive(true);
    setEstado(data.estado ? false : true);
    setIdAccion(data.id);
  };

  const handleCloseActive = () => {
    setOpenActive(false);
  };

  return (
    <>
      <Card>
        <PerfectScrollbar>
          <Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Identificador</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Periodicidad</TableCell>
                    <TableCell>Responsable</TableCell>
                    <TableCell>Metas</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Opción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {actions.slice(page * limit, page * limit + limit).map((accion) => (
                    <TableRow
                      hover
                      key={accion.id}
                      selected={selectedActionIds.indexOf(accion.id) !== -1}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <Typography color="textPrimary" variant="body1">
                            {accion.identificador}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{accion.descripcion}</TableCell>
                      <TableCell>{accion.perioricidadReporte}</TableCell>
                      <TableCell>{accion.institucion.siglas}</TableCell>
                      <TableCell>
                        <IconButton color="default" onClick={() => handleList({ ...accion })}>
                          <SummarizeRoundedIcon></SummarizeRoundedIcon>
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          style={{ color: accion.estado ? "green" : "red", fontSize: 13 }}
                          color="default"
                          onClick={() => handleActive({ ...accion })}
                        >
                          <PowerSettingsNewRoundedIcon></PowerSettingsNewRoundedIcon>
                          <p>{accion.estado ? "Activo" : "Inactivo"}</p>
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton color="default" onClick={() => handleEdit({ ...accion })}>
                          <EditRoundedIcon></EditRoundedIcon>
                        </IconButton>
                        <IconButton color="default" onClick={() => handleDelete({ ...accion })}>
                          <DeleteForeverRoundedIcon></DeleteForeverRoundedIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={actions.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      {/*Form editar acción*/}
      <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose} disableEscapeKeyDown>
        <DialogTitle id="max-width-dialog-title">Editar Acción Estratégica</DialogTitle>
        <DialogContent>
          <form autoComplete="off" onSubmit={handleEditData}>
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
                    Editar
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
      {/*Mesanje de confirmación*/}
      <Dialog
        open={openActive}
        onClose={handleCloseActive}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">¿Estas Seguro/a?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {estado
              ? "¿Está seguro/a de querer activar esta acción estratégica?"
              : "¿Está seguro/a de querer desactivar esta acción estratégica?, no se mostrará en el CMI si se desactiva la misma"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChangeEstado} autoFocus>
            Si
          </Button>
          <Button onClick={handleCloseActive}>No</Button>
        </DialogActions>
      </Dialog>
      {/*Listado de metas por año*/}
      <Dialog
        open={openList}
        onClose={handleCloseList}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Lista de Metas por Año</DialogTitle>
        <DialogContent>
          <Grid item md={12} xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 300 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Año</TableCell>
                    <TableCell align="right">Nro. de Acciones o Porcentaje</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metas.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.anioPlanificado}
                      </TableCell>
                      <TableCell align="right">
                        {row.numeroAcciones > 0
                          ? row.numeroAcciones
                          : row.porcentajePlanficadoPorAnio}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseList}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActionListResults;
