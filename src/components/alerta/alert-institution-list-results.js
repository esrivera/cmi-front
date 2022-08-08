import React, { useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
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
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import { clientPublic } from "src/api/axios";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { msmSwalError } from "src/theme/theme";

const AlertInstitutionListResults = ({ alerts, wordSearch }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
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

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
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
  }, [wordSearch]);

  let rows = [];
  if (wordSearch === "" || wordSearch.length < 3) {
    rows = alerts.slice();
  } else {
    rows = dataSearch.slice();
  }

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
                  <TableCell>Instituciones Receptoras</TableCell>
                  <TableCell>Evidencia</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * limit, page * limit + limit).map((alert) => (
                  <TableRow hover key={alert.idAlerta}>
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

export default AlertInstitutionListResults;
