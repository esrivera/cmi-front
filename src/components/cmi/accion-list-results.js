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
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import apis from "src/utils/bookApis";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import FilterNoneRoundedIcon from "@mui/icons-material/FilterNoneRounded";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import LoupeRoundedIcon from "@mui/icons-material/LoupeRounded";
import { clientPublic } from "src/api/axios";
import { msmSwalError, msmSwalExito, palette } from "src/theme/theme";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import ThumbDownAltRoundedIcon from "@mui/icons-material/ThumbDownAltRounded";
import { validationMeta } from "src/utils/validationInputs";

const CmiListResults = ({ actions, updateView, objetives }) => {
  const [selectedActionIds, setSelectedActionIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [observacion, setObservacion] = useState("");
  const [idIndicador, setIdIndicador] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errors, setErrors] = useState({});
  const [anioPlanificado, setAnioPlanificado] = useState("");
  const [porcentajePlanificado, setPorcentajePlanificado] = useState("");
  const [evidencias, setEvidencias] = useState([]);
  const [idMeta, setIdMeta] = useState(0);
  const [meta, setMeta] = useState({
    anioPlanificado: 2021,
    idIndicador: 0,
    numeroAcciones: 0,
    porcentajePlanficadoPorAnio: "",
  });
  const [metas, setMetas] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEvidencia, setOpenEvidencia] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [openObservacion, setOpenObservacion] = useState(false);
  const [formula, setFormula] = useState({});
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

  const handleChange = (event) => {
    setMeta({
      ...meta,
      [event.target.name]: event.target.value,
    });
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
    setOpenEvidencia(false);
    setAnioPlanificado("");
    setPorcentajePlanificado("");
    setEvidencias([]);
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
      porcentajePlanficadoPorAnio: 0,
    });
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
    setMeta({
      anioPlanificado: 2021,
      idIndicador: 0,
      numeroAcciones: 0,
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
        fileDownload(res.data, "documento.pdf");
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  const handleChangeEstadoAprobado = (data) => {
    const bodyAprobacion = {
      estadoAprobacion: true,
      idActividadMeta: data.id,
    };
    clientPublic
      .post(apis.actividad.post_aprobacion, bodyAprobacion)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          msmSwalExito("Actividad aprobada satisfactoriamente");
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status >= 400 && exception.response.status < 500) {
            msmSwalError("No se pudo aprobar la meta");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
    updateView();
  };

  const handleChangeEstadoDesaprobado = (data) => {
    const bodyAprobacion = {
      estadoAprobacion: false,
      idActividadMeta: data.id,
    };
    clientPublic
      .post(apis.actividad.post_aprobacion, bodyAprobacion)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          msmSwalExito("Actividad desaprobada satisfactoriamente");
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status >= 400 && exception.response.status < 500) {
            msmSwalError("No se pudo aprobar la meta");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
    updateView();
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
                          backgroundColor:
                            accion.indicador[0].estadoCumplimiento === "EN_EJECUCION"
                              ? "lightgreen"
                              : "red",
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
                      <TableCell>
                        {accion.indicador[0].porcentajeIndicadorPorAnio != null
                          ? accion.indicador[0].porcentajeIndicadorPorAnio
                          : 0}
                      </TableCell>
                      <TableCell>
                        <IconButton color="default" onClick={() => handleEdit({ ...accion })}>
                          <EditRoundedIcon></EditRoundedIcon>
                          <p style={{ fontSize: 14 }}>Editar</p>
                        </IconButton>
                        <IconButton
                          color="default"
                          onClick={() => handleObservacion({ ...accion })}
                        >
                          <InfoRoundedIcon></InfoRoundedIcon>
                          <p style={{ fontSize: 14 }}>Ver</p>
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
      <Dialog fullWidth open={openActive} onClose={handleCloseActive} disableEscapeKeyDown>
        <DialogTitle>Establecer metas por año</DialogTitle>
        <DialogContent>
          <Grid container direction="row" justify="flex-start" alignItems="center">
            <Grid item md={12} xs={12}>
              <label>
                Los campos marcados con ( <font color={palette.error.main}> *</font> ) son
                obligatorios:
              </label>
            </Grid>
            <Grid item md={3} xs={8}>
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
            <Grid item md={1} xs={8}></Grid>
            <Grid item md={6} xs={8}>
              <TextField
                fullWidth
                required
                name="numeroAcciones"
                margin="normal"
                id="outlined-basic"
                label="Porcentaje o Nro Acciones Esperado"
                type="number"
                autoComplete="off"
                onChange={handleChange}
                value={meta.numeroAcciones}
              />
              {errors.numeroAcciones ? (
                <p style={{ color: "red", fontSize: 11 }}>{errors.numeroAcciones}</p>
              ) : null}
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
        maxWidth={"lg"}
        fullWidth
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
                    <TableCell align="rigth">Año</TableCell>
                    <TableCell align="right" width={120}>
                      Fecha
                    </TableCell>
                    <TableCell align="rigth">Acciones o Porcentaje Planificado</TableCell>
                    <TableCell align="rigth">Acciones o Porcentaje Realizado</TableCell>
                    <TableCell align="rigth">Observación</TableCell>
                    <TableCell align="rigth">Estado</TableCell>
                    <TableCell aling="rigth">Acción</TableCell>
                    <TableCell align="rigth">Evidencia</TableCell>
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
                      <TableCell align="rigth">{porcentajePlanificado}</TableCell>
                      <TableCell align="rigth">{row.porcentajeAvance}</TableCell>
                      <TableCell align="rigth">{row.descripcionActMeta}</TableCell>
                      <TableCell align="rigth">{row.estadoAprobacion}</TableCell>
                      <TableCell align="rigth">
                        {row.estadoAprobacion === "PENDIENTE" ? (
                          <>
                            <IconButton
                              style={{ color: "green", fontSize: 13 }}
                              color="default"
                              onClick={() => handleChangeEstadoAprobado({ ...row })}
                            >
                              <ThumbUpRoundedIcon></ThumbUpRoundedIcon>
                              <p style={{ fontSize: 14 }}>Aprobar</p>
                            </IconButton>
                            <IconButton
                              style={{ color: "red", fontSize: 13 }}
                              color="default"
                              onClick={() => handleChangeEstadoDesaprobado({ ...row })}
                            >
                              <ThumbDownAltRoundedIcon></ThumbDownAltRoundedIcon>
                              <p style={{ fontSize: 14 }}>Desaprobar</p>
                            </IconButton>
                          </>
                        ) : null}
                      </TableCell>
                      <TableCell align="rigth">
                        <IconButton color="default" onClick={() => handleDownload({ ...row })}>
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
