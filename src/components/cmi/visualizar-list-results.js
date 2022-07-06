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
  Typography,
} from "@mui/material";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import apis from "src/utils/bookApis";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import FilterNoneRoundedIcon from "@mui/icons-material/FilterNoneRounded";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import { clientPublic } from "src/api/axios";
import { msmSwalError, msmSwalExito, palette } from "src/theme/theme";

const VisualizarListResults = ({ actions, wordSearch }) => {
  const [selectedActionIds, setSelectedActionIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [observacion, setObservacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [anioPlanificado, setAnioPlanificado] = useState("");
  const [anioSemaforo, setAnioSemaforo] = useState("");
  const [idIndicador, setIdIndicador] = useState("");
  const [porcentajePlanificado, setPorcentajePlanificado] = useState("");
  const [evidencias, setEvidencias] = useState([]);
  const [semaforos, setSemaforos] = useState([]);
  const [idMeta, setIdMeta] = useState(0);
  const [metas, setMetas] = useState([]);
  const [openEvidencia, setOpenEvidencia] = useState(false);
  const [openSemaforo, setOpenSemaforo] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [openObservacion, setOpenObservacion] = useState(false);
  const [formula, setFormula] = useState({});
  const [openFormula, setOpenFormula] = useState(false);
  const [openDescripcion, setOpenDescripcion] = useState(false);
  const [dataSearch, setDataSearch] = useState([]);
  const query = {
    uri: apis.meta.get_all_indicador,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 50,
    sort: "anioPlanificado,asc",
  };
  const query2 = {
    uri: apis.meta.get_estado_meta,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 50,
    sort: "fecha,asc",
  };

  const handleLimitChange = (event) => {
    setLimit(+event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
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

  const handleViewState = (data) => {
    setOpenSemaforo(true);
    searchMetas(data.indicador[0].id);
    setIdIndicador(data.indicador[0].id);
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

  const handleChangeSemaforo = (event) => {
    setSemaforos([]);
    setAnioSemaforo(event.target.value);
  };

  const handleCloseSemaforo = () => {
    setOpenSemaforo(false);
    setAnioSemaforo("");
    setSemaforos([]);
  };

  useEffect(() => {
    if (anioSemaforo > 0) {
      searchSemaforo();
    }
  }, [anioSemaforo]);

  const searchSemaforo = async () => {
    await clientPublic
      .get(
        query2.uri +
          idIndicador +
          "?page=" +
          query2.page +
          "&size=" +
          query2.elementos +
          "&sort=" +
          query2.sort,
        {
          params: { anio: anioSemaforo },
        }
      )
      .then((result) => {
        if (result.status === 200) {
          if (result.data.content.length > 0) {
            setSemaforos(result.data.content);
          } else {
            setSemaforos([]);
          }
        }
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
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
        const file = new Blob([res.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status === 404) {
            msmSwalError("No existe evidencia registrada para esta actividad");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
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
                      <TableCell>
                        <IconButton color="default" onClick={() => handleViewState({ ...accion })}>
                          <InfoRoundedIcon></InfoRoundedIcon>
                          <p style={{ fontSize: 14 }}>Ver</p>
                        </IconButton>
                      </TableCell>
                      <TableCell>
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
          count={rows.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
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
                    <TableCell align="right">Año</TableCell>
                    <TableCell align="right" width={120}>
                      Fecha
                    </TableCell>
                    <TableCell align="right">Acciones o Porcentaje Planificado</TableCell>
                    <TableCell align="right">Acciones o Porcentaje Realizado</TableCell>
                    <TableCell align="right">Observación</TableCell>
                    <TableCell align="right">Estado</TableCell>
                    <TableCell align="right">Evidencia</TableCell>
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
      {/* Lista de estados de cumplimiento */}
      <Dialog
        open={openSemaforo}
        onClose={handleCloseSemaforo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"md"}
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">Lista de estados de cumplimiento por año</DialogTitle>
        <DialogContent>
          <FormControl sx={{ minWidth: 120, marginTop: 2, marginBottom: 2 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Año</InputLabel>
            <Select
              value={anioSemaforo}
              onChange={handleChangeSemaforo}
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
                    <TableCell align="left" width={120}>
                      Fecha
                    </TableCell>
                    <TableCell align="left">Porcentaje o N° de Acciones Realizadas</TableCell>
                    <TableCell align="left">Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {semaforos.map((row) => (
                    <TableRow
                      key={row.idMetaTrimestre}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell width="30%" component="th" scope="row">
                        {row.fecha}
                      </TableCell>
                      <TableCell width="30%" align="left">
                        {row.porcentajeAvanceTrimestre}
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor:
                            row.estadoCumplimiento === "EN_EJECUCION"
                              ? "#69CD37"
                              : row.estadoCumplimiento === "CUMPLIDO"
                              ? "#CCCF03"
                              : row.estadoCumplimiento === "NO_CUMPLIDO"
                              ? "#FE333F"
                              : "gray",
                          color: "#F6F2F2",
                          fontSize: 16,
                        }}
                        align="left"
                        width="20%"
                      >
                        {row.estadoCumplimiento === "EN_EJECUCION"
                          ? "En Ejecución"
                          : row.estadoCumplimiento === "CUMPLIDO"
                          ? "Cumplido"
                          : row.estadoCumplimiento === "NO_CUMPLIDO"
                          ? "No Cumplido"
                          : "No Iniciado"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSemaforo}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VisualizarListResults;
