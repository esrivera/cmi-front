import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";

const TableData = ({ reportData, reportDataYear, reportDataAction }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(+event.target.value);
    setPage(0);
  };

  return (
    <>
      {reportData.length > 0 ? (
        <Card>
          <PerfectScrollbar>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Identificador</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Porcentaje</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.slice(page * limit, page * limit + limit).map((report) => (
                    <TableRow hover key={report.identificadorAccEstrategica}>
                      <TableCell>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <Typography color="textPrimary" variant="body1">
                            {report.identificadorAccEstrategica}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{report.descripcionAccEstrategica}</TableCell>
                      <TableCell>{report.porcentajeAccTotal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </PerfectScrollbar>
          <TablePagination
            component="div"
            count={reportData.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      ) : null}
      {reportDataYear.length > 0 ? (
        <Card>
          <PerfectScrollbar>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Identificador</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Porcentaje o Actividades Planificadas</TableCell>
                    <TableCell>Porcentaje Alcanzado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportDataYear.slice(page * limit, page * limit + limit).map((report) => (
                    <TableRow hover key={report.identificadorAccEstrategica}>
                      <TableCell>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <Typography color="textPrimary" variant="body1">
                            {report.identificadorAccEstrategica}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{report.descripcionAccEstrategica}</TableCell>
                      <TableCell>{report.metaPlanificadaPorAnio}</TableCell>
                      <TableCell>{report.porcentajeAlcanzadoMetaPorAnio}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </PerfectScrollbar>
          <TablePagination
            component="div"
            count={reportDataYear.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      ) : null}
      {reportDataAction.length > 0 ? (
        <Card>
          <PerfectScrollbar>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Año</TableCell>
                    <TableCell>Porcentaje o Actividades Planificadas</TableCell>
                    <TableCell>Porcentaje Alcanzado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell><b>Indicador</b></TableCell>
                    <TableCell colSpan={2}>{reportDataAction[0].nombreInidicador}</TableCell>
                  </TableRow>
                  {reportDataAction.slice(page * limit, page * limit + limit).map((report) => (
                    <TableRow hover key={report.idIndicador}>
                      <TableCell>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <Typography color="textPrimary" variant="body1">
                            {report.anioPlanificado}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{report.accionesOPorcentajePlanificadoPorAnio}</TableCell>
                      <TableCell>{report.porcentajeAlcanzadoMetaPorAnio}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </PerfectScrollbar>
          <TablePagination
            component="div"
            count={reportDataAction.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      ) : null}
    </>
  );
};

export default TableData;
