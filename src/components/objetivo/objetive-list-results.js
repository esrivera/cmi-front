import React, { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
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
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import apis from "src/utils/bookApis";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { clientPublic } from "src/api/axios";
import { msmSwalError, msmSwalExito, palette } from "src/theme/theme";

const ObjetiveListResults = ({ objetives, updateView }) => {
  const [selectedObjetiveIds, setSelectedObjetiveIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [idObjetivo, setIdObjetivo] = useState("");
  const [page, setPage] = useState(0);
  const [errors, setErrors] = useState({});
  const [objetive, setObjetive] = useState({
    nombre: "",
    descripcion: "",
  });
  const [open, setOpen] = useState(false);

  const handleLimitChange = (event) => {
    setLimit(+event.target.value);
    setPage(0);
  };

  const handleEdit = (data) => {
    setOpen(true);
    console.log(data);
    setIdObjetivo(data.id);
    setObjetive(data);
  };

  const handleEditData = () => {
    clientPublic
      .put(apis.objetive.edit_id + idObjetivo, objetive)
      .then((res) => {
        if (res.status === 200) {
          msmSwalExito("Objetivo Estratégico editado satisfactoriamente");
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status >= 400) {
            msmSwalError("No se pudo editar el objetivo estratégico");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
    updateView();
  };

  const handleChange = (event) => {
    setObjetive({
      ...objetive,
      [event.target.name]: event.target.value,
    });
  };

  const handleDelete = (id) => {
    clientPublic
      .delete(apis.objetive.delete_id + id)
      .then((res) => {
        if (res.status === 200) {
          msmSwalExito("Objetivo eliminado satisfactoriamente");
          updateView();
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status >= 400) {
            msmSwalError("No se pudo eliminar el objetivo");
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
  };

  return (
    <>
      <Card>
        <PerfectScrollbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Opción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {objetives.slice(0, limit).map((objetivo) => (
                  <TableRow
                    hover
                    key={objetivo.id}
                    selected={selectedObjetiveIds.indexOf(objetivo.id) !== -1}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Typography color="textPrimary" variant="body1">
                          {objetivo.nombre}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{objetivo.descripcion}</TableCell>
                    <TableCell>
                      <IconButton color="default" onClick={() => handleEdit({ ...objetivo })}>
                        <EditRoundedIcon></EditRoundedIcon>
                      </IconButton>
                      <IconButton color="default" onClick={() => handleDelete(objetivo.id)}>
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
          count={objetives.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose} disableEscapeKeyDown>
        <DialogTitle id="max-width-dialog-title">Editar Objetivo Estratégico</DialogTitle>
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
                  value={objetive.nombre}
                />
                {errors.nombre ? <p>{errors.nombre}</p> : null}
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="descripcion"
                  margin="normal"
                  id="outlined-basic"
                  label="Descripción"
                  type="text"
                  autoComplete="off"
                  multiline
                  onChange={handleChange}
                  value={objetive.descripcion}
                />
                {errors.descripcion ? <p>{errors.descripcion}</p> : null}
              </Grid>
              <Grid container alignContent="center" sx={{ mt: 1 }} justify="flex-end">
                <Grid item md={12} xs={12}>
                  <Divider></Divider>
                </Grid>
                <Grid sx={{ mt: 1 }}>
                  <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
                    Editar
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleClose}>
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

export default ObjetiveListResults;
