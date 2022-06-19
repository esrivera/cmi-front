import React, { useEffect, useState } from "react";
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
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import apis from "src/utils/bookApis";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import FilterNoneRoundedIcon from "@mui/icons-material/FilterNoneRounded";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import LoupeRoundedIcon from "@mui/icons-material/LoupeRounded";
import { clientPublic } from "src/api/axios";
import fileDownload from "js-file-download";
import { msmSwalError, msmSwalExito, palette } from "src/theme/theme";
import { validationActivity, validationMeta } from "src/utils/validationInputs";
import { parseJwt } from "src/utils/userAction";

const CmiListResultsUser = ({ actions, updateView, wordSearch }) => {
  const [selectedActionIds, setSelectedActionIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [observacion, setObservacion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [idIndicador, setIdIndicador] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errors, setErrors] = useState({});
  const [metas, setMetas] = useState([]);
  const [evidencias, setEvidencias] = useState([]);
  const [valorAccion, setValorAccion] = useState("");
  const [anioAccion, setAnioAccion] = useState("");
  const [open, setOpen] = useState(false);
  const [idMeta, setIdMeta] = useState(0);
  const [anioPlanificado, setAnioPlanificado] = useState("");
  const [openEvidencia, setOpenEvidencia] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [formula, setFormula] = useState({});
  const [porcentajeAvance, setPorcentajeAvance] = useState("");
  const [descripcionActMeta, setDescripcionActMeta] = useState("");
  const [porcentajePlanificado, setPorcentajePlanificado] = useState("");
  const [file, setFile] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [indicadorId, setIndicadorId] = useState("");
  const [metaId, setMetaId] = useState("");
  const [activityId, setActivityId] = useState("");
  const [openMensaje, setOpenMensaje] = useState(false);
  const [openActive, setOpenActive] = useState(false);
  const [openFormula, setOpenFormula] = useState(false);
  const [openDescripcion, setOpenDescripcion] = useState(false);
  const [dataSearch, setDataSearch] = useState([]);
  const query = {
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

  const handleAddAcctMeta = () => {
    var data = {
      porcentajeAvance: porcentajeAvance,
      descripcionActMeta: descripcionActMeta,
      file: file,
    };
    const ISSERVER = typeof window === "undefined";
    const ci = "";
    if (!ISSERVER) {
      const token = localStorage.getItem("token");
      ci = parseJwt(token).CI;
    }
    const newErrors = validationActivity.submitActivity(data);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData();
      formData.append("file", file);
      clientPublic
        .post(apis.actividad.post_add, formData, {
          params: {
            anio: anioAccion,
            descripcionActMeta: descripcionActMeta,
            idIndicador: indicadorId,
            idMeta: metaId,
            porcentajeAvance: porcentajeAvance,
            ciUsuario: ci,
          },
        })
        .then((res) => {
          if (res.status >= 200 && res.status < 300) {
            msmSwalExito("Actividad agregada satisfactoriamente");
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

  const handleChange = (event) => {
    setPorcentajeAvance(event.target.value);
  };

  const handleChangeDescripcion = (event) => {
    setDescripcionActMeta(event.target.value);
  };

  const handleChangeFile = (event) => {
    setFile(event.target.files[0]);
    setNombreArchivo(event.target.files[0].name);
  };

  const handleChangeObservacion = (event) => {
    setObservacion(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseList = () => {
    setOpenList(false);
  };

  const handleEvidencia = (data) => {
    setOpenEvidencia(true);
    searchMetas(data.indicador[0].id);
  };

  const handleCloseEvidencia = () => {
    setOpenEvidencia(false);
    setAnioPlanificado("");
    setPorcentajePlanificado("");
    setEvidencias([]);
  };

  useEffect(() => {
    var currentTime = new Date();
    var year = currentTime.getFullYear();
    if (metas.length > 0) {
      for (let i = 0; i < metas.length; i++) {
        if (metas[i].anioPlanificado == year) {
          setValorAccion(metas[i].numeroAcciones);
          setMetaId(metas[i].id);
        }
      }
    }
  }, [metas]);

  const handleActive = (data) => {
    var currentTime = new Date();
    var year = currentTime.getFullYear();
    setAnioAccion(year);
    setIndicadorId(data.indicador[0].id);
    searchMetas(data.indicador[0].id);
    setOpenActive(true);
    setErrors({});
  };

  const handleCloseMensaje = () => {
    setOpenMensaje(false);
  };

  const handleList = (data) => {
    setOpenList(true);
    searchMetas(data.indicador[0].id);
  };

  const searchMetas = (id) => {
    clientPublic
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
    setNombreArchivo("");
    setMetaId("");
    setIndicadorId("");
    setErrors({});
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleConfirm = (id) => {
    setOpenConfirm(true);
    setActivityId(id);
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

  const handleChangeSelect = (event) => {
    setEvidencias([]);
    setAnioPlanificado(event.target.value);
    let metaAux = metas.find((metaAux) => metaAux.anioPlanificado === event.target.value);
    setIdMeta(metaAux.id);
  };

  useEffect(() => {
    if (anioPlanificado > 0) {
      searchActivities();
    }
  }, [anioPlanificado]);

  const searchActivities = async () => {
    await clientPublic
      .get(apis.actividad.get_by_anio + anioPlanificado + "/" + idMeta)
      .then((result) => {
        if (result.status === 200) {
          if (result.data.lstActivitidadMeta != null) {
            setEvidencias(result.data.lstActivitidadMeta);
          } else {
            setEvidencias([]);
          }
          setPorcentajePlanificado(result.data.porcentajeOAccionPlanificado);
        }
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  const handleDownload = (data) => {
    clientPublic
      .get(apis.actividad.get_evidencia + data.id, {
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, "document.pdf");
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  const handleDelete = () => {
    clientPublic
      .delete(apis.actividad.delete_id + activityId)
      .then((res) => {
        if (res.status === 200) {
          msmSwalExito("Actividad eliminada satisfactoriamente");
          updateView();
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status === 400) {
            msmSwalError("No se pudo eliminar la actividad");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
    setOpenConfirm(false);
    setOpenEvidencia(false);
  };

  useEffect(() => {
    if (dataSearch) {
      if (wordSearch.length > 2) {
        const listData = [];
        actions.map((action) => {
          action.indicador[0].nombre.toUpperCase().includes(wordSearch.toUpperCase()) ||
          action.institucion.siglas.toUpperCase().includes(wordSearch.toUpperCase()) ||
          action.institucion.nombre.toUpperCase().includes(wordSearch.toUpperCase()) ||
          action.perioricidadReporte.toUpperCase().includes(wordSearch.toUpperCase()) ||
          action.identificador.toUpperCase().includes(wordSearch.toUpperCase())
            ? listData.push(action)
            : "";
        });
        setDataSearch(listData);
      }
    }
  }, [wordSearch, dataSearch]);

  let rows = [];
  if (wordSearch === "" || wordSearch.length < 3) {
    rows = actions.slice();
  } else {
    rows = dataSearch.slice();
  }

  return (
    <>
      <Card>
        <PerfectScrollbar>
          <Box>
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
                  {rows.slice(page * limit, page * limit + limit).map((accion) => (
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
                          <p style={{ fontSize: 14 }}>Ver</p>
                        </IconButton>
                      </TableCell>
                      <TableCell>{accion.indicador[0].nombre}</TableCell>
                      <TableCell>{accion.perioricidadReporte}</TableCell>
                      <TableCell>{accion.institucion.siglas}</TableCell>
                      <TableCell>
                        <IconButton color="default" onClick={() => handleFormula({ ...accion })}>
                          <InfoRoundedIcon></InfoRoundedIcon>
                          <p style={{ fontSize: 14 }}>Ver</p>
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {accion.indicador[0].porcentajeIndicador != null
                          ? accion.indicador[0].porcentajeIndicador
                          : 0}
                      </TableCell>
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
                          <p style={{ fontSize: 14 }}>Agregar</p>
                        </IconButton>
                        <IconButton color="default" onClick={() => handleList({ ...accion })}>
                          <SummarizeRoundedIcon></SummarizeRoundedIcon>
                          <p style={{ fontSize: 14 }}>Metas por Año</p>
                        </IconButton>
                        <IconButton color="default" onClick={() => handleEvidencia({ ...accion })}>
                          <FilterNoneRoundedIcon></FilterNoneRoundedIcon>
                          <p style={{ fontSize: 14 }}>Actividades</p>
                        </IconButton>
                      </TableCell>
                      <TableCell>{accion.porcentaje}</TableCell>
                      <TableCell>
                        <IconButton color="default" onClick={() => handleEdit({ ...accion })}>
                          <EditRoundedIcon></EditRoundedIcon>
                          <p style={{ fontSize: 14 }}>Revisar</p>
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
          count={rows.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      {/* Agregar Actividades Meta */}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openActive}
        onClose={handleCloseActive}
        disableEscapeKeyDown
      >
        <DialogTitle id="max-width-dialog-title">Agregar actividades de la meta</DialogTitle>
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
                name="anioAccion"
                margin="normal"
                disabled
                id="outlined-basic"
                label="Año"
                type="number"
                autoComplete="off"
                value={anioAccion}
              />
            </Grid>
            <Grid item md={4} xs={12} sx={{ ml: 2 }}>
              <TextField
                fullWidth
                required
                name="valorAccion"
                margin="normal"
                id="outlined-basic"
                label="Porcentaje o Nro Acciones Esperado"
                type="number"
                disabled
                autoComplete="off"
                value={valorAccion}
              />
            </Grid>
            <Grid item md={5} xs={12} sx={{ ml: 2 }}>
              <TextField
                fullWidth
                required
                name="porcentajeAvance "
                margin="normal"
                id="outlined-basic"
                label="Porcentaje o Nro Acciones Realizado"
                type="number"
                autoComplete="off"
                onChange={handleChange}
                value={porcentajeAvance}
              />
              {errors.porcentajeAvance ? (
                <p style={{ color: "red", fontSize: 11 }}>{errors.porcentajeAvance}</p>
              ) : null}
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                required
                name="descripcionActMeta "
                margin="normal"
                id="outlined-basic"
                label="Descripción de la actividad"
                type="text"
                multiline
                autoComplete="off"
                onChange={handleChangeDescripcion}
                value={descripcionActMeta}
              />
              {errors.descripcionActMeta ? (
                <p style={{ color: "red", fontSize: 11 }}>{errors.descripcionActMeta}</p>
              ) : null}
            </Grid>
            <Grid item md={4} xs={12} sx={{ ml: 2 }}>
              <IconButton color="default" variant="contained" component="label">
                <CloudUploadRoundedIcon></CloudUploadRoundedIcon>
                <input type="file" name="file" hidden onChange={handleChangeFile} />
                <p style={{ fontSize: 18 }}>Evidencia</p>
                <p style={{ color: "blue", fontSize: 14, marginLeft: 20 }}>{nombreArchivo}</p>
              </IconButton>
              <p style={{ fontSize: 13 }}>Cargar un solo archivo PDF no mayor a 2Mb</p>
              {errors.file ? <p style={{ color: "red", fontSize: 11 }}>{errors.file}</p> : null}
            </Grid>
            <Grid container alignContent="center" sx={{ mt: 1 }} justify="flex-end">
              <Grid item md={12} xs={12}>
                <Divider></Divider>
              </Grid>
              <Grid sx={{ mt: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleAddAcctMeta}
                  color="primary"
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
      {/* Lista de metas por año con evidencia */}
      <Dialog
        open={openEvidencia}
        onClose={handleCloseEvidencia}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth={"lg"}
      >
        <DialogTitle id="alert-dialog-title">Lista de Actividades por Año</DialogTitle>
        <DialogContent>
          <FormControl sx={{ minWidth: 120, marginTop: 2, marginBottom: 2 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Año</InputLabel>
            <Select
              value={anioPlanificado}
              onChange={handleChangeSelect}
              id="demo-controlled-open-select"
              labelId="demo-controlled-open-select-label"
              label="label"
            >
              <MenuItem disabled value="">
                <em>--Seleccione--</em>
              </MenuItem>
              {metas.map((meta) => (
                <MenuItem key={meta.id} value={meta.anioPlanificado}>
                  {meta.anioPlanificado}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid item md={12} xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 300 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Año</TableCell>
                    <TableCell align="right" width={120}>
                      Fecha
                    </TableCell>
                    <TableCell align="right">Acciones o Porcentaje Planificado</TableCell>
                    <TableCell align="right">Acciones o Porcentaje Realizado</TableCell>
                    <TableCell align="right">Observación</TableCell>
                    <TableCell align="right">Estado</TableCell>
                    <TableCell align="right">Evidencia</TableCell>
                    <TableCell align="right">Eliminar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {evidencias.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.anioAvance}
                      </TableCell>
                      <TableCell align="right" width={120}>
                        {row.fecha}
                      </TableCell>
                      <TableCell align="right">{porcentajePlanificado}</TableCell>
                      <TableCell align="right">{row.porcentajeAvance}</TableCell>
                      <TableCell align="right">{row.descripcionActMeta}</TableCell>
                      <TableCell align="right">{row.estadoAprobacion}</TableCell>
                      <TableCell align="right">
                        <IconButton color="default" onClick={() => handleDownload({ ...row })}>
                          <CloudDownloadRoundedIcon></CloudDownloadRoundedIcon>
                          <p style={{ fontSize: 14 }}>Descargar</p>
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        {row.estadoAprobacion === "PENDIENTE" ? (
                          <>
                            <IconButton color="default" onClick={() => handleConfirm(row.id)}>
                              <DeleteForeverRoundedIcon></DeleteForeverRoundedIcon>
                            </IconButton>
                          </>
                        ) : null}
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
      {/* Mensaje de error para actividades de la meta */}
      <Dialog
        open={openMensaje}
        onClose={handleCloseMensaje}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Mensaje de Información</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <text>{mensaje}</text>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMensaje}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      {/*Mesanje de confirmación*/}
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">¿Estas Seguro/a?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Está seguro/a de querer eliminar esta actividad?, no se mostrará en las actividades si
            se elimina la misma
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} autoFocus>
            Si
          </Button>
          <Button onClick={handleCloseConfirm}>No</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CmiListResultsUser;
