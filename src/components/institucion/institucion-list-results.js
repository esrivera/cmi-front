import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import apis from "src/utils/bookApis";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { clientPublic } from "src/api/axios";
import { msmSwalError, msmSwalExito } from "src/theme/theme";
import { palette } from "src/theme/theme";

const InstitutionListResults = ({ customers, updateView }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [errors, setErrors] = useState({});
  const [idInstitucion, setIdInstitucion] = useState("");
  const [page, setPage] = useState(0);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [institucion, setInstitucion] = useState({});

  const handleLimitChange = (event) => {
    setLimit(+event.target.value);
    setPage(0);
  };

  const handleEdit = (data) => {
    setOpenEditModal(true);
    setIdInstitucion(data.idInstitucion);
    setInstitucion(data);
  };

  const handleEditData = () => {
    clientPublic
      .put(apis.institution.edit_id + idInstitucion, institucion)
      .then((res) => {
        if (res.status === 200) {
          msmSwalExito("Institución editada satisfactoriamente");
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status >= 400) {
            msmSwalError("No se pudo editar la institución");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
    updateView();
  };

  const handleChange = (event) => {
    setInstitucion({
      ...institucion,
      [event.target.name]: event.target.value,
    });
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleDelete = (id) => {
    clientPublic
      .delete(apis.institution.delete_id + id)
      .then((res) => {
        if (res.status === 200) {
          msmSwalExito("Institución eliminada satisfactoriamente");
          updateView();
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status === 400) {
            msmSwalError("No se pudo eliminar la institución");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <Card style={{ overflowX: "scroll", width: "100%" }}>
        <PerfectScrollbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Siglas</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Opción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.slice(page * limit, page * limit + limit).map((customer) => (
                <TableRow
                  hover
                  key={customer.idInstitucion}
                  selected={selectedCustomerIds.indexOf(customer.idInstitucion) !== -1}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Typography color="textPrimary" variant="body1">
                        {customer.nombre}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{customer.siglas}</TableCell>
                  <TableCell>{customer.correo}</TableCell>
                  <TableCell>{customer.direccion}</TableCell>
                  <TableCell>{customer.telefono}</TableCell>
                  <TableCell>
                    <IconButton color="default" onClick={() => handleEdit({ ...customer })}>
                      <EditRoundedIcon></EditRoundedIcon>
                    </IconButton>
                    <IconButton
                      color="default"
                      onClick={() => handleDelete(customer.idInstitucion)}
                    >
                      <DeleteForeverRoundedIcon></DeleteForeverRoundedIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={customers.length}
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
        open={openEditModal}
        onClose={handleCloseEditModal}
        disableEscapeKeyDown
      >
        <DialogTitle id="max-width-dialog-title">Editar Institución</DialogTitle>
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
                  name="nombre"
                  margin="normal"
                  id="outlined-basic"
                  label="Nombre"
                  type="text"
                  autoComplete="off"
                  placeholder="Ej. Servicio de Rentas Internas"
                  onChange={handleChange}
                  value={institucion.nombre}
                />
                {errors.nombre ? <p>{errors.nombre}</p> : null}
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="siglas"
                  margin="normal"
                  id="outlined-basic"
                  label="Siglas"
                  type="text"
                  autoComplete="off"
                  placeholder="Ej. SRI"
                  onChange={handleChange}
                  value={institucion.siglas}
                />
                {errors.siglas ? <p>{errors.siglas}</p> : null}
              </Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="correo"
                  margin="normal"
                  id="outlined-basic"
                  label="Correo"
                  type="email"
                  autoComplete="off"
                  placeholder="Ej. user@ejemplo.com"
                  onChange={handleChange}
                  value={institucion.correo}
                />
                {errors.correo ? <p>{errors.correo}</p> : null}
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  name="direccion"
                  margin="normal"
                  id="outlined-basic"
                  label="Dirección"
                  type="text"
                  autoComplete="off"
                  placeholder="Ej. Av. República y Pradera"
                  onChange={handleChange}
                  value={institucion.direccion}
                />
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  name="telefono"
                  margin="normal"
                  id="outlined-basic"
                  label="Teléfono"
                  type="number"
                  autoComplete="off"
                  placeholder="Ej. 3824290"
                  onChange={handleChange}
                  value={institucion.telefono}
                />
                {errors.telefono ? <p>{errors.telefono}</p> : null}
              </Grid>
              <Grid container alignContent="center" sx={{ mt: 1 }} justify="flex-end">
                <Grid item md={12} xs={12}>
                  <Divider></Divider>
                </Grid>
                <Grid sx={{ mt: 1 }}>
                  <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                    Editar
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleCloseEditModal}>
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstitutionListResults;
