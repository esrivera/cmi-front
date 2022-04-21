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
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
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
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import apis from "src/utils/bookApis";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import FilterNoneRoundedIcon from "@mui/icons-material/FilterNoneRounded";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import LoupeRoundedIcon from "@mui/icons-material/LoupeRounded";
import { clientPublic } from "src/api/axios";
import { msmSwalError, msmSwalExito, palette } from "src/theme/theme";
import { validationMeta } from "src/utils/validationInputs";

const CmiListResults = ({ actions, updateView, objetives }) => {
  const [selectedActionIds, setSelectedActionIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [institution, setInstitution] = useState([]);
  const [idObjetivo, setIdObjetivo] = useState([]);
  const [idInstitucion, setIdInstitucion] = useState([]);
  const [periodicidad, setPeriodicidad] = useState([]);
  const [observacion, setObservacion] = useState("");
  const [idIndicador, setIdIndicador] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errors, setErrors] = useState({});
  const [accion, setAccion] = useState({
    descDenominador: "",
    descNumerador: "",
    observacion: "",
    descripcion: "",
    descripcionResultado: "",
    ecuacion: "",
    idInstitucion: 0,
    idObjetivoEstrategico: 0,
    identificador: "",
    nombreIndicador: "",
    perioricidadReporte: "",
  });
  const [meta, setMeta] = useState({
    anioPlanificado: "",
    idIndicador: 0,
    numeroAcciones: "",
    porcentajePlanficadoPorAnio: "",
  });
  const [metas, setMetas] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEvidencia, setOpenEvidencia] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [openObservacion, setOpenObservacion] = useState(false);
  const [formula, setFormula] = useState({});
  const [selectCheck, setSelectCheck] = useState("N");
  const [valor, setValor] = useState();
  const [openActive, setOpenActive] = useState(false);
  const [openFormula, setOpenFormula] = useState(false);
  const [openDescripcion, setOpenDescripcion] = useState(false);
  const query = {
    uri: apis.meta.get_all_indicador,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "anioPlanificado,asc",
  };

  function createData(name, valor, avance, detalle) {
    return { name, valor, avance, detalle };
  }

  const rows = [
    createData("2021", 10, 10, "Finalizado"),
    createData("2022", 25, 3, "En Proceso"),
    createData("2023", 35, 0, ""),
    createData("2024", 30, 0, ""),
  ];

  const handleLimitChange = (event) => {
    setLimit(+event.target.value);
    setPage(0);
  };

  const handleEdit = (data) => {
    setOpen(true);
    setObservacion(data.indicador[0].observaciones);
    setIdIndicador(data.indicador[0].id);
  };

  const handleAddObservacion = () => {
    clientPublic
      .patch(apis.indicador.patch_observacion + idIndicador, null, {
        params: { observacion: observacion },
      })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          msmSwalExito("Observación agregada satisfactoriamente");
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status >= 400 && exception.response.status < 500) {
            msmSwalError("No se pudo agregar la observación");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
    updateView();
  };

  const handleAddMeta = () => {
    const newErrors = validationMeta.submitMeta(meta);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      clientPublic
        .post(apis.meta.post_add, meta)
        .then((res) => {
          if (res.status >= 200 && res.status < 300) {
            msmSwalExito("Meta agregada satisfactoriamente");
          }
        })
        .catch((exception) => {
          if (exception.response) {
            if (exception.response.status >= 400 && exception.response.status < 500) {
              msmSwalError("No se pudo agregar la meta");
            }
          } else {
            msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
          }
        });
      updateView();
    }
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
      descripcion: "",
      observacion: "",
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
    setMeta({
      ...meta,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeRadioSelect = (event) => {
    setSelectCheck(event.target.value);
    if (event.target.value === "N") {
      setMeta({
        ...meta,
        numeroAcciones: valor,
        porcentajePlanficadoPorAnio: 0,
      });
    } else {
      setMeta({
        ...meta,
        porcentajePlanficadoPorAnio: valor,
        numeroAcciones: 0,
      });
    }
  };

  const handleChangeRadio = (event) => {
    setValor(event.target.value);
    if (selectCheck === "N") {
      setMeta({
        ...meta,
        numeroAcciones: event.target.value,
        porcentajePlanficadoPorAnio: 0,
      });
    } else {
      setMeta({
        ...meta,
        porcentajePlanficadoPorAnio: event.target.value,
        numeroAcciones: 0,
      });
    }
  };

  const handleChangeObservacion = (event) => {
    setObservacion(event.target.value);
  };

  const handleDelete = (id) => {
    clientPublic
      .delete(apis.accion.delete_id + id)
      .then((res) => {
        if (res.status === 200) {
          msmSwalExito("Acción Estratégica eliminada satisfactoriamente");
          updateView();
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status === 400) {
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

  const handleCloseList = () => {
    setOpenList(false);
  };

  const handleEvidencia = (data) => {
    setOpenEvidencia(true);
  };

  const handleCloseEvidencia = () => {
    setOpenEvidencia(false);
  };

  const handleCloseObservacion = () => {
    setOpenObservacion(false);
  };

  const handleObservacion = (data) => {
    setOpenObservacion(true);
    setObservacion(data.indicador[0].observaciones);
  };

  const handleActive = (data) => {
    setOpenActive(true);
    setErrors({});
    setMeta({
      ...meta,
      idIndicador: data.indicador[0].id,
    });
  };

  const handleList = (data) => {
    setOpenList(true);
    searchMetas(data.indicador[0].id);
  };

  const searchMetas = async (id) => {
    await clientPublic
      .get(
        query.uri + id + "?page=" + query.page + "&size=" + query.elementos + "&sort=" + query.sort
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

  const handleCloseActive = () => {
    setOpenActive(false);
    setMeta({
      anioPlanificado: "",
      idIndicador: 0,
      numeroAcciones: "",
      porcentajePlanficadoPorAnio: "",
    });
    setErrors({});
  };

  const handleDeleteMeta = (data) => {
    clientPublic
      .delete(apis.meta.delete_id + data.id)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          msmSwalExito("Meta eliminada satisfactoriamente");
          updateView();
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status >= 400 && exception.response.status < 500) {
            msmSwalError("No se pudo eliminar la meta");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
  };

  const handleFormula = (data) => {
    setFormula(data.indicador[0].formula[0]);
    setOpenFormula(true);
  };

  const handleCloseFormula = () => {
    setOpenFormula(false);
  };

  const handleDescripcion = (data) => {
    setDescripcion(data.descripcion);
    setOpenDescripcion(true);
  };

  const handleCloseDescripcion = () => {
    setOpenDescripcion(false);
  };

  return (
    <>
      <Card>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 850 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ORD</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Indicador</TableCell>
                    <TableCell>Periodicidad</TableCell>
                    <TableCell>Responsable</TableCell>
                    <TableCell>Formula</TableCell>
                    <TableCell>Porcentaje del Indicador</TableCell>
                    <TableCell>Estado de Cumplimiento</TableCell>
                    <TableCell>Metas</TableCell>
                    <TableCell>Porcentaje de la Meta</TableCell>
                    <TableCell>Observaciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {actions.slice(0, limit).map((accion) => (
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
                      <TableCell>
                        <IconButton
                          color="default"
                          onClick={() => handleDescripcion({ ...accion })}
                        >
                          <InfoRoundedIcon></InfoRoundedIcon>
                        </IconButton>
                      </TableCell>
                      <TableCell>{accion.indicador[0].nombre}</TableCell>
                      <TableCell>{accion.perioricidadReporte}</TableCell>
                      <TableCell>{accion.institucion.siglas}</TableCell>
                      <TableCell>
                        <IconButton color="default" onClick={() => handleFormula({ ...accion })}>
                          <InfoRoundedIcon></InfoRoundedIcon>
                        </IconButton>
                      </TableCell>
                      {/* <TableCell>{accion.indicador[0].porcentajeIndicador}</TableCell> */}
                      <TableCell>13</TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "lightgreen",
                        }}
                      >
                        {accion.indicador[0].estadoCumplimiento}
                      </TableCell>
                      <TableCell>
                        <IconButton color="default" onClick={() => handleActive({ ...accion })}>
                          <LoupeRoundedIcon></LoupeRoundedIcon>
                        </IconButton>
                        <IconButton color="default" onClick={() => handleList({ ...accion })}>
                          <SummarizeRoundedIcon></SummarizeRoundedIcon>
                        </IconButton>
                        <IconButton color="default" onClick={() => handleEvidencia({ ...accion })}>
                          <FilterNoneRoundedIcon></FilterNoneRoundedIcon>
                        </IconButton>
                      </TableCell>
                      {/* <TableCell>{accion.porcentaje}</TableCell> */}
                      <TableCell>12</TableCell>
                      <TableCell>
                        <IconButton color="default" onClick={() => handleEdit({ ...accion })}>
                          <EditRoundedIcon></EditRoundedIcon>
                        </IconButton>
                        <IconButton
                          color="default"
                          onClick={() => handleObservacion({ ...accion })}
                        >
                          <InfoRoundedIcon></InfoRoundedIcon>
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
      {/* Agregar Metas */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={openActive}
        onClose={handleCloseActive}
        disableEscapeKeyDown
      >
        <DialogTitle id="max-width-dialog-title">Establecer metas por año</DialogTitle>
        <DialogContent>
          <Grid container direction="row" justify="flex-start" alignItems="center">
            <Grid item md={12} xs={12}>
              <label>
                Los campos marcados con ( <font color={palette.error.main}> *</font> ) son
                obligatorios:
              </label>
            </Grid>
            <Grid item md={2} xs={12}>
              <TextField
                fullWidth
                required
                name="anioPlanificado"
                margin="normal"
                inputProps={{ maxLength: 4, minLength: 4 }}
                id="outlined-basic"
                label="Año"
                type="number"
                autoComplete="off"
                onChange={handleChange}
                value={meta.anioPlanificado}
              />
              {errors.anioPlanificado ? (
                <p style={{ color: "red", fontSize: 11 }}>{errors.anioPlanificado}</p>
              ) : null}
            </Grid>
            <Grid item md={1} xs={12}></Grid>
            <Grid item md={3} xs={12}>
              <TextField
                fullWidth
                required
                name="valor"
                margin="normal"
                id="outlined-basic"
                label="Porcentaje o Nro Acciones Esperado"
                type="number"
                autoComplete="off"
                onChange={handleChangeRadio}
                onBlur={handleChangeRadio}
                value={valor}
              />
            </Grid>
            <Grid item md={1} xs={12}></Grid>
            <Grid item md={5} xs={12}>
              <RadioGroup
                row
                aria-labelledby="demo-form-control-label-placement"
                defaultValue="N"
                onChange={handleChangeRadioSelect}
              >
                <FormControlLabel value="N" control={<Radio />} label="Nro. Acciones" />
                <FormControlLabel value="P" control={<Radio />} label="Porcentaje" />
              </RadioGroup>
            </Grid>
            <Grid container alignContent="center" sx={{ mt: 1 }} justify="flex-end">
              <Grid item md={12} xs={12}>
                <Divider></Divider>
              </Grid>
              <Grid sx={{ mt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddMeta}
                  type="submit"
                  sx={{ mr: 2 }}
                >
                  Agregar
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCloseActive}>
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* Agregar Observaciones */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">Agregar Observación</DialogTitle>
        <DialogContent>
          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              required
              name="observacion"
              margin="normal"
              id="outlined-basic"
              label="Observación"
              type="text"
              autoComplete="off"
              multiline
              onChange={handleChangeObservacion}
              value={observacion}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddObservacion} autoFocus>
            Agregar
          </Button>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
      {/* Información de la Formula */}
      <Dialog
        open={openFormula}
        onClose={handleCloseFormula}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Información de la Fórmula</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <text>
              Formula {formula.ecuacion}
              <br />
              {formula.descripcionResultado}
              <br />
              {formula.descNumerador}
              <br />
              {formula.descDenominador}
            </text>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFormula}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      {/* Información de la Descripción */}
      <Dialog
        open={openDescripcion}
        onClose={handleCloseDescripcion}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Información de la Descripción</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <text>{descripcion}</text>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDescripcion}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      {/* Lista de metas por año */}
      <Dialog
        open={openList}
        onClose={handleCloseList}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
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
                    <TableCell align="right">Eliminar</TableCell>
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
                      <TableCell align="right">
                        <IconButton onClick={() => handleDeleteMeta({ ...row })}>
                          <DeleteForeverRoundedIcon></DeleteForeverRoundedIcon>
                        </IconButton>
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
      {/* Información de las Observaciones */}
      <Dialog
        open={openObservacion}
        onClose={handleCloseObservacion}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Observaciones</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <text>{observacion != null ? observacion : "No se han registrado observaciones"}</text>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseObservacion}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      {/* Lista de metas por año con evidencia */}
      <Dialog
        open={openEvidencia}
        onClose={handleCloseEvidencia}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">Lista de Metas por Año</DialogTitle>
        <DialogContent>
          <Grid item md={12} xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 300 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Año</TableCell>
                    <TableCell align="right">Acciones o Porcentaje Planificado</TableCell>
                    <TableCell align="right">Acciones o Porcentaje Realizado</TableCell>
                    <TableCell align="right">Observación</TableCell>
                    <TableCell align="right">Evidencia</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.valor}</TableCell>
                      <TableCell align="right">{row.avance}</TableCell>
                      <TableCell align="right">{row.detalle}</TableCell>
                      <TableCell align="right">
                        <IconButton>
                          <CloudDownloadRoundedIcon></CloudDownloadRoundedIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEvidencia}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CmiListResults;
