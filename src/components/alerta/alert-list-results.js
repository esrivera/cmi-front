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
  IconButton,
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
import { msmSwalError, msmSwalExito, palette } from "src/theme/theme";

const AlertListResults = ({ alerts, updateView }) => {
  const [limit, setLimit] = useState(10);
  const [selectedAlertsid, setSelectedAlertsId] = useState([]);
  const [page, setPage] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [alertId, setAlertId] = useState("");

  const handleLimitChange = (event) => {
    setLimit(+event.target.value);
    setPage(0);
  };

  const handleDownload = (data) => {
    clientPublic
      .get(apis.alerta.get_evidencia + data.idAlerta, {
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

  const handleConfirm = (id) => {
    setOpenConfirm(true);
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

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  return (
    <>
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
                  <TableCell>Evidencia</TableCell>
                  <TableCell>Eliminar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alerts.slice(page * limit, page * limit + limit).map((alert) => (
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
                    <TableCell>{alert.tipoAlerta}</TableCell>
                    <TableCell>{alert.estadoAlerta}</TableCell>
                    <TableCell>
                      <IconButton color="default" onClick={() => handleDownload({ ...alert })}>
                        <CloudDownloadRoundedIcon></CloudDownloadRoundedIcon>
                        <p style={{ fontSize: 14 }}>Descargar</p>
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton color="default" onClick={() => handleConfirm(alert.idAlerta)}>
                        <DeleteForeverRoundedIcon></DeleteForeverRoundedIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={alerts.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
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
    </>
  );
};

export default AlertListResults;
