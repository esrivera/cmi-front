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
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import apis from "src/utils/bookApis";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import { clientPublic } from "src/api/axios";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import { msmSwalError, msmSwalExito, palette } from "src/theme/theme";
import { parseJwt } from "src/utils/userAction";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

const AlertListResults = ({ alerts, updateView, tipoAlerta, wordSearch }) => {
  const [limit, setLimit] = useState(10);
  const [selectedAlertsid, setSelectedAlertsId] = useState([]);
  const [page, setPage] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [alertId, setAlertId] = useState("");
  const [dataSearch, setDataSearch] = useState([]);
  const [openTable, setOpenTable] = useState(false);
  const [institutions, setInstitutions] = useState([]);

  const handleLimitChange = (event) => {
    setLimit(+event.target.value);
    setPage(0);
  };

  const handleViewInstitutions = (data) => {
    setOpenTable(true);
    searchInstitutions(data.idAlerta);
  };

  const handleCloseViewInstitutions = (data) => {
    setOpenTable(false);
  };

  const searchInstitutions = (id) => {
    clientPublic
      .get(apis.alerta.get_institutions + id)
      .then((result) => {
        if (result.status === 200) {
          setInstitutions(result.data);
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
      .get(apis.alerta.get_evidencia + data.idAlerta, {
        responseType: "blob",
      })
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  const handleConfirm = (id) => {
    setOpenConfirm(true);
    setAlertId(id);
  };

  const handleDialog = (id) => {
    setOpenDialog(true);
    setAlertId(id);
  };

  const handleDelete = () => {
    clientPublic
      .delete(apis.alerta.delete_id + alertId)
      .then((res) => {
        if (res.status === 200) {
          msmSwalExito("Alerta eliminada satisfactoriamente");
          updateView();
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status >= 400) {
            msmSwalError("No se pudo eliminar la alerta");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
  };

  const handlePatch = () => {
    const ISSERVER = typeof window === "undefined";
    const id = "";
    if (!ISSERVER) {
      const token = localStorage.getItem("token");
      id = parseJwt(token).instituteId;
    }
    clientPublic
      .patch(apis.alerta.patch_estado + alertId + "/" + id, null, {
        params: { estadoAlerta: "RECI" },
      })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          msmSwalExito("Estado de la alerta modificado satisfactoriamente");
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status >= 400 && exception.response.status < 500) {
            msmSwalError("No se pudo cambiar el estado de la alerta");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
    updateView();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (dataSearch) {
      if (wordSearch.length > 2) {
        const listData = [];
        alerts.map((alert) => {
          alert.estadoAlerta.toUpperCase().includes(wordSearch.toUpperCase()) ||
          wordSearch.toUpperCase().includes(alert.estadoAlerta.toUpperCase()) ||
          alert.descripcion.toUpperCase().includes(wordSearch.toUpperCase()) ||
          alert.fechaAlerta.toUpperCase().includes(wordSearch.toUpperCase()) ||
          wordSearch.toUpperCase().includes(alert.tipoAlerta.toUpperCase()) ||
          alert.tipoAlerta.toUpperCase().includes(wordSearch.toUpperCase())
            ? listData.push(alert)
            : "";
        });
        setDataSearch(listData);
      }
    }
  }, [wordSearch, dataSearch]);

  let rows = [];
  if (wordSearch === "" || wordSearch.length < 3) {
    rows = alerts.slice();
  } else {
    rows = dataSearch.slice();
  }

  return (
    <>
      {tipoAlerta === "env" ? (
        <Card>
          <PerfectScrollbar>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Instituciones</TableCell>
                    <TableCell>Evidencia</TableCell>
                    <TableCell>Eliminar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(page * limit, page * limit + limit).map((alert) => (
                    <TableRow
                      hover
                      key={alert.idAlerta}
                      selected={selectedAlertsid.indexOf(alert.idAlerta) !== -1}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <Typography color="textPrimary" variant="body1">
                            {alert.fechaAlerta}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{alert.descripcion}</TableCell>
                      <TableCell>
                        {alert.tipoAlerta === "SOC" ? "Socioeconómica" : "Delito Hidrocarburífero"}
                      </TableCell>
                      <TableCell>
                        {alert.estadoAlerta === "PEND" ? "Pendiente" : "Recibido"}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="default"
                          onClick={() => handleViewInstitutions({ ...alert })}
                        >
                          <InfoRoundedIcon></InfoRoundedIcon>
                          <p style={{ fontSize: 14 }}>Ver</p>
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton color="default" onClick={() => handleDownload({ ...alert })}>
                          <CloudDownloadRoundedIcon></CloudDownloadRoundedIcon>
                          <p style={{ fontSize: 14 }}>Descargar</p>
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {alert.estadoAlerta === "PEND" ? (
                          <IconButton color="default" onClick={() => handleConfirm(alert.idAlerta)}>
                            <DeleteForeverRoundedIcon></DeleteForeverRoundedIcon>
                          </IconButton>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
      ) : (
        <Card>
          <PerfectScrollbar>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Instituciones</TableCell>
                    <TableCell>Evidencia</TableCell>
                    <TableCell>Opción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(page * limit, page * limit + limit).map((alert) => (
                    <TableRow
                      hover
                      key={alert.idAlerta}
                      selected={selectedAlertsid.indexOf(alert.idAlerta) !== -1}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <Typography color="textPrimary" variant="body1">
                            {alert.fechaAlerta}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{alert.descripcion}</TableCell>
                      <TableCell>
                        {alert.tipoAlerta === "SOC" ? "Socioeconómica" : "Delito Hidrocarburífero"}
                      </TableCell>
                      <TableCell>
                        {alert.estadoAlerta === "PEND" ? "Pendiente" : "Recibido"}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="default"
                          onClick={() => handleViewInstitutions({ ...alert })}
                        >
                          <InfoRoundedIcon></InfoRoundedIcon>
                          <p style={{ fontSize: 14 }}>Ver</p>
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton color="default" onClick={() => handleDownload({ ...alert })}>
                          <CloudDownloadRoundedIcon></CloudDownloadRoundedIcon>
                          <p style={{ fontSize: 14 }}>Descargar</p>
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {alert.estadoAlerta === "PEND" ? (
                          <IconButton color="default" onClick={() => handleDialog(alert.idAlerta)}>
                            <PowerSettingsNewRoundedIcon></PowerSettingsNewRoundedIcon>
                            <p style={{ fontSize: 14 }}>{"Recibido"}</p>
                          </IconButton>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
      )}
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
            ¿Está seguro/a de querer eliminar esta alerta?, no se mostrará para las otras
            instituciones si se elimina la misma
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} autoFocus>
            Si
          </Button>
          <Button onClick={handleCloseConfirm}>No</Button>
        </DialogActions>
      </Dialog>
      {/*Mesanje de confirmación Patch*/}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">¿Estas Seguro/a?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Está seguro/a de querer confirmar la recepción de esta alerta?, no se podra modificar
            el estado de la alerta cuando se cambie.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePatch} autoFocus>
            Si
          </Button>
          <Button onClick={handleCloseDialog}>No</Button>
        </DialogActions>
      </Dialog>
      {/* Lista de instituciones*/}
      <Dialog
        open={openTable}
        onClose={handleCloseViewInstitutions}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Lista de Instituciones Receptoras</DialogTitle>
        <DialogContent>
          <Grid item md={12} xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 300 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Institución</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {institutions.map((row) => (
                    <TableRow
                      key={row.idInstitucionReceptor}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.nombreInstitucionReceptor}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewInstitutions}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AlertListResults;
