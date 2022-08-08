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
import apis from "src/utils/bookApis";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import { clientPublic } from "src/api/axios";
import { msmSwalError, msmSwalExito, palette } from "src/theme/theme";

const UserListResults = ({ users, updateView, wordSearch }) => {
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [estado, setEstado] = useState(false);
  const [idUser, setIdUser] = useState();
  const [page, setPage] = useState(0);
  const [errors, setErrors] = useState({});
  const [idInstitucion, setIdInstitucion] = useState([]);
  const [openActive, setOpenActive] = useState(false);
  const [ciUser, setCiUser] = useState("");
  const [dataSearch, setDataSearch] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [usuario, setUsuario] = useState({
    apellido: "",
    email: "",
    idInstitucion: 0,
    identificacion: "",
    nombre: "",
    telefono: "",
  });
  const [open, setOpen] = useState(false);
  const queryInstitution = {
    uri: apis.institution.get_all,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 50,
    sort: "nombre,asc",
  };

  const handleLimitChange = (event) => {
    setLimit(+event.target.value);
    setPage(0);
  };

  const searchInstitutions = () => {
    clientPublic
      .get(
        queryInstitution.uri +
          "?page=" +
          queryInstitution.page +
          "&size=" +
          queryInstitution.elementos +
          "&sort=" +
          queryInstitution.sort
      )
      .then((result) => {
        if (result.status === 200) {
          setInstitutions(result.data.content);
        }
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  const handleEdit = (data) => {
    setOpen(true);
    setIdUser(data.id);
    searchInstitutions();
    setIdInstitucion(data.institute.idInstitucion);
    setUsuario(data);
  };

  const handleEditData = () => {
    clientPublic
      .put(apis.user.edit_id + idUser, usuario)
      .then((res) => {
        if (res.status === 200) {
          msmSwalExito("Usuario editado satisfactoriamente");
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status === 400) {
            msmSwalError("No se pudo editar el usuario");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
    updateView();
  };

  const handleChange = (event) => {
    setUsuario({
      ...usuario,
      [event.target.name]: event.target.value,
    });
  };

  const handleDelete = () => {
    clientPublic
      .patch(apis.user.patch_ci + ciUser, null, {
        params: { estado: estado === "BLO" ? "ACT" : "BLO" },
      })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          msmSwalExito("Estado del usuario modificado satisfactoriamente");
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status >= 400 && exception.response.status < 500) {
            msmSwalError("No se pudo modificar el estado del usuario");
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

  const clearData = () => {
    setUsuario({
      apellido: "",
      email: "",
      idInstitucion: 0,
      identificacion: "",
      nombre: "",
      telefono: "",
    });
    setIdInstitucion([]);
  };

  const handleClose = () => {
    setOpen(false);
    clearData();
  };

  const handleChangeInstitucion = (event) => {
    setIdInstitucion(event.target.value);
    setUsuario({
      ...usuario,
      idInstitucion: event.target.value,
    });
  };

  const handleActive = (data) => {
    setOpenActive(true);
    setEstado(data.estadoUsuario);
    setCiUser(data.identification);
  };

  const handleCloseActive = () => {
    setOpenActive(false);
  };

  useEffect(() => {
    if (dataSearch) {
      if (wordSearch.length > 2) {
        const listData = [];
        users.map((user) => {
          user.name.toUpperCase().includes(wordSearch.toUpperCase()) ||
          user.lastname.toUpperCase().includes(wordSearch.toUpperCase()) ||
          user.identification.toUpperCase().includes(wordSearch.toUpperCase()) ||
          user.email.toUpperCase().includes(wordSearch.toUpperCase())
            ? listData.push(user)
            : "";
        });
        setDataSearch(listData);
      }
    }
  }, [wordSearch]);

  let rows = [];
  if (wordSearch === "" || wordSearch.length < 3) {
    rows = users.slice();
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
                    <TableCell>Nombre</TableCell>
                    <TableCell>Apellido</TableCell>
                    <TableCell>Cedula</TableCell>
                    <TableCell>Correo</TableCell>
                    <TableCell>Teléfono</TableCell>
                    <TableCell>Editar</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(page * limit, page * limit + limit).map((user) => (
                    <TableRow
                      hover
                      key={user.id}
                      selected={selectedUserIds.indexOf(user.id) !== -1}
                    >
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.lastname}</TableCell>
                      <TableCell>{user.identification}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <IconButton color="default" onClick={() => handleEdit({ ...user })}>
                          <EditRoundedIcon></EditRoundedIcon>
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          style={{
                            color:
                              user.estadoUsuario === "PRI" || user.estadoUsuario === "ACT"
                                ? "green"
                                : "red",
                            fontSize: 13,
                          }}
                          color="default"
                          onClick={() => handleActive({ ...user })}
                        >
                          <PowerSettingsNewRoundedIcon></PowerSettingsNewRoundedIcon>
                          <p>
                            {user.estadoUsuario === "PRI" || user.estadoUsuario === "ACT"
                              ? "Activo"
                              : "Inactivo"}
                          </p>
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
      <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose} disableEscapeKeyDown>
        <DialogTitle id="max-width-dialog-title">Editar Usuario</DialogTitle>
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
                  name="name"
                  margin="normal"
                  id="outlined-basic"
                  label="Nombres"
                  type="text"
                  autoComplete="off"
                  placeholder="Ej. Javier"
                  onChange={handleChange}
                  value={usuario.name}
                />
                {errors.nombre ? <p>{errors.nombre}</p> : null}
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="lastname"
                  margin="normal"
                  id="outlined-basic"
                  label="Apellidos"
                  type="text"
                  autoComplete="off"
                  placeholder="Ej. Herrera"
                  onChange={handleChange}
                  value={usuario.lastname}
                />
                {errors.apellido ? <p>{errors.apellido}</p> : null}
              </Grid>
              <Grid item md={5} xs={12}>
                <FormControl sx={{ minWidth: 395 }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Institución</InputLabel>
                  <Select
                    value={idInstitucion}
                    onChange={handleChangeInstitucion}
                    id="demo-simple-select-autowidth"
                    labelId="demo-simple-select-autowidth-label"
                    label="Institución"
                  >
                    <MenuItem disabled value="">
                      <em>--Seleccione--</em>
                    </MenuItem>
                    {institutions.map((element) => (
                      <MenuItem key={element.idInstitucion} value={element.idInstitucion}>
                        {element.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="identification"
                  margin="normal"
                  id="outlined-basic"
                  label="Identificación / CI"
                  type="text"
                  autoComplete="off"
                  placeholder="Ej. 1722201066"
                  onChange={handleChange}
                  value={usuario.identification}
                />
                {errors.identificacion ? <p>{errors.identificacion}</p> : null}
              </Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="email"
                  margin="normal"
                  id="outlined-basic"
                  label="Correo"
                  type="email"
                  autoComplete="off"
                  placeholder="Ej. demo@demo.com"
                  onChange={handleChange}
                  value={usuario.email}
                />
                {errors.email ? <p>{errors.email}</p> : null}
              </Grid>
              <Grid item md={1} xs={12}></Grid>
              <Grid item md={5} xs={12}>
                <TextField
                  fullWidth
                  required
                  name="phone"
                  margin="normal"
                  id="outlined-basic"
                  label="Teléfono"
                  type="text"
                  placeholder="Ej. 0978644612"
                  autoComplete="off"
                  onChange={handleChange}
                  value={usuario.phone}
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
                  <Button variant="outlined" color="secondary" onClick={handleClose}>
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      {/*Mesanje de confirmación*/}
      <Dialog
        open={openActive}
        onClose={handleCloseActive}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">¿Estas Seguro/a?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {estado === "BLO"
              ? "¿Está seguro/a de querer activar este usuario?"
              : "¿Está seguro/a de querer desactivar esta usuario?, este usuario no podra ingresar al sistema"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} autoFocus>
            Si
          </Button>
          <Button onClick={handleCloseActive}>No</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserListResults;
