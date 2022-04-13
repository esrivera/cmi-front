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
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import LoupeRoundedIcon from "@mui/icons-material/LoupeRounded";
import { clientPublic } from "src/api/axios";
import { msmSwalError, msmSwalExito, palette } from "src/theme/theme";

const CmiListResults = ({ actions, updateView, objetives }) => {
  const [selectedActionIds, setSelectedActionIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [institution, setInstitution] = useState([]);
  const [idObjetivo, setIdObjetivo] = useState([]);
  const [idInstitucion, setIdInstitucion] = useState([]);
  const [periodicidad, setPeriodicidad] = useState([]);
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
    anio: "",
    valor: "",
  });
  const [open, setOpen] = useState(false);
  const [formula, setFormula] = useState({});
  const [openActive, setOpenActive] = useState(false);
  const [openFormula, setOpenFormula] = useState(false);
  const [openDescripcion, setOpenDescripcion] = useState(false);
  const query = {
    uri: apis.institution.get_all,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "nombre,asc",
  };

  const handleLimitChange = (event) => {
    setLimit(+event.target.value);
    setPage(0);
  };

  const handleEdit = (data) => {
    setOpen(true);
    setAccion(data);
    console.log(data);
  };

  const handleEditData = () => {
    clientPublic
      .put(apis.accion.edit_id, accion)
      .then((res) => {
        if (res.status === 200) {
          msmSwalExito("Acción Estratégica editada satisfactoriamente");
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status === 400) {
            msmSwalError("No se pudo editar la acción estratégica");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
    updateView();
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
      ...accion,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeObservacion = (event) => {
    setAccion({
      ...accion,
      observacion: event.target.value,
    });
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
    console.log(data);
  };

  const handleCloseActive = () => {
    setOpenActive(false);
  };

  const handleFormula = (data) => {
    console.log(data.indicador[0].formula[0]);
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
                      <TableCell>{accion.indicador[0].porcentajeIndicador}</TableCell>
                      <TableCell>{accion.indicador[0].estadoCumplimiento}</TableCell>
                      <TableCell>
                        <IconButton color="default" onClick={() => handleActive({ ...accion })}>
                          <LoupeRoundedIcon></LoupeRoundedIcon>
                        </IconButton>
                      </TableCell>
                      <TableCell>{accion.porcentaje}</TableCell>
                      <TableCell>
                        <IconButton color="default" onClick={() => handleEdit({ ...accion })}>
                          <EditRoundedIcon></EditRoundedIcon>
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
      <Dialog
        fullWidth
        maxWidth="md"
        open={openActive}
        onClose={handleCloseActive}
        disableEscapeKeyDown
      >
        <DialogTitle id="max-width-dialog-title">Establecer metas por año</DialogTitle>
        <DialogContent>
          <form autoComplete="off" onSubmit={handleEditData}>
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
                  name="anio"
                  margin="normal"
                  id="outlined-basic"
                  label="Año"
                  type="number"
                  autoComplete="off"
                  onChange={handleChange}
                  value={meta.anio}
                />
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
                  onChange={handleChange}
                  value={meta.valor}
                />
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <RadioGroup
                  row
                  aria-labelledby="demo-form-control-label-placement"
                  name="position"
                  defaultValue="top"
                >
                  <FormControlLabel value="end" control={<Radio />} label="Nro. Acciones" />
                  <FormControlLabel value="end" control={<Radio />} label="Porcentaje" />
                </RadioGroup>
              </Grid>
              <Grid container alignContent="center" sx={{ mt: 1 }} justify="flex-end">
                <Grid item md={12} xs={12}>
                  <Divider></Divider>
                </Grid>
                <Grid sx={{ mt: 1 }}>
                  <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                    Agregar
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleCloseActive}>
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

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
              value={accion.observacion}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Agregar
          </Button>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>

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
          <Button onClick={handleCloseFormula}>Salir</Button>
        </DialogActions>
      </Dialog>

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
          <Button onClick={handleCloseDescripcion}>Salir</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CmiListResults;
