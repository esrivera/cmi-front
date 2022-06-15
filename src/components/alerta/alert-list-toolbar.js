import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Grid,
  DialogContent,
  DialogTitle,
  Dialog,
  Divider,
  IconButton,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import React, { useState } from "react";
import { clientPublic } from "src/api/axios";
import { msmSwalError, msmSwalExito, palette } from "src/theme/theme";
import apis from "src/utils/bookApis";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import { Search as SearchIcon } from "../../icons/search";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { validateAlert } from "src/utils/validationInputs";
import { parseJwt } from "src/utils/userAction";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, idInstitutions, theme) {
  return {
    fontWeight: idInstitutions.includes(name)
      ? theme.typography.fontWeightRegular
      : theme.typography.fontWeightMedium,
  };
}

const AlertListToolbar = ({ updateView }) => {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({
    tipoAlerta: "",
    descripcionAlerta: "",
    fechaAlerta: "",
    idInstitucionEmisor: "",
  });
  const theme = useTheme();
  const [idInstitutions, setIdInstitutions] = useState([]);
  const [file, setFile] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [institution, setInstitution] = useState([]);
  const query = {
    uri: apis.institution.get_all,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "nombre,asc",
  };

  const handleChangeSelect = (event) => {
    const {
      target: { value },
    } = event;
    setIdInstitutions(value);
  };

  const handleChangeFile = (event) => {
    setFile(event.target.files[0]);
    setNombreArchivo(event.target.files[0].name);
  };

  const handleSave = () => {
    const ISSERVER = typeof window === "undefined";
    const id = "";
    if (!ISSERVER) {
      const token = localStorage.getItem("token");
      id = parseJwt(token).instituteId;
    }
    const date = new Date();
    const arrayIdInstitution = [];
    const cont = 0;
    idInstitutions.forEach((element) => arrayIdInstitution.push(element.idInstitucion));
    const idInstitucionReceptor = "";
    arrayIdInstitution.forEach((element) => {
      if (arrayIdInstitution.length != cont + 1) {
        idInstitucionReceptor = idInstitucionReceptor.concat(element).concat(",");
      } else {
        idInstitucionReceptor = idInstitucionReceptor.concat(element);
      }
      cont++;
    });
    const data = {
      descripcionAlerta: alert.descripcionAlerta,
      idInstitucionEmisor: id,
      idInstitucionReceptor: arrayIdInstitution,
      tipoAlerta: alert.tipoAlerta,
      fechaAlerta: date.toISOString().split("T")[0],
      file: file,
    };
    const newErrors = validateAlert.submitAlert(data);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData();
      formData.append("file", file);
      clientPublic
        .post(apis.alerta.post_add, formData, {
          params: {
            descripcionAlerta: data.descripcionAlerta,
            idInstitucionEmisor: data.idInstitucionEmisor,
            idInstitucionReceptor: idInstitucionReceptor,
            tipoAlerta: data.tipoAlerta,
            fechaAlerta: data.fechaAlerta,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            msmSwalExito("Alerta institucional registrada satisfactoriamente");
          }
        })
        .catch((exception) => {
          if (exception.response) {
            if (exception.response.status === 400) {
              msmSwalError("No se pudo registrar la alerta institucional");
            }
          } else {
            msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
          }
        });
      updateView();
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setErrors({});
    searchInstitution();
  };

  const handleClose = () => {
    setOpen(false);
    clearData();
    setIdInstitutions([]);
  };

  const clearData = () => {
    setAlert({
      tipoAlerta: "",
      descripcionAlerta: "",
      fechaAlerta: "",
      idInstitucionEmisor: "",
    });
  };

  const handleChange = (event) => {
    setAlert({
      ...alert,
      [event.target.name]: event.target.value,
    });
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

  return (
    <>
      <Box>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            m: -1,
          }}
        >
          <Typography sx={{ m: 1 }} variant="h4">
            Alertas Institucionales
          </Typography>
          <Box sx={{ m: 1 }}>
            <Button color="primary" variant="contained" onClick={handleClickOpen}>
              Agregar Alerta
            </Button>
          </Box>
        </Box>
        <Box sx={{ mt: 3, flexWrap: "wrap" }}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ maxWidth: 400 }}>
                    <TextField
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SvgIcon color="action" fontSize="small">
                              <SearchIcon />
                            </SvgIcon>
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Buscar Alerta"
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                    >
                      <FormControlLabel value="env" control={<Radio />} label="Enviadas" />
                      <FormControlLabel value="rec" control={<Radio />} label="Recibidas" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose} disableEscapeKeyDown>
        <DialogTitle id="max-width-dialog-title">Nuevo Alerta Institucional</DialogTitle>
        <DialogContent>
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
                name="tipoAlerta"
                margin="normal"
                id="outlined-basic"
                label="Tipo de Alerta"
                type="text"
                autoComplete="off"
                onChange={handleChange}
                value={alert.tipoAlerta}
              />
              {errors.tipoAlerta ? (
                <p style={{ color: "red", fontSize: 11 }}>{errors.tipoAlerta}</p>
              ) : null}
            </Grid>
            <Grid item md={1} xs={12}></Grid>
            <Grid item md={5} xs={12}>
              <TextField
                fullWidth
                required
                name="descripcionAlerta"
                margin="normal"
                id="outlined-basic"
                label="Descripción"
                type="text"
                autoComplete="off"
                multiline
                onChange={handleChange}
                value={alert.descripcionAlerta}
              />
              {errors.descripcionAlerta ? (
                <p style={{ color: "red", fontSize: 11 }}>{errors.descripcionAlerta}</p>
              ) : null}
            </Grid>
            <Grid item md={5} xs={12}>
              <FormControl sx={{ width: 400 }}>
                <InputLabel id="demo-multiple-chip-label">Institución Receptora</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={idInstitutions}
                  onChange={handleChangeSelect}
                  input={<OutlinedInput id="select-multiple-chip" label="Institución Receptora" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value.idInstitucion} label={value.nombre} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {institution.map((institute) => (
                    <MenuItem
                      key={institute.idInstitucion}
                      value={institute}
                      style={getStyles(institute, idInstitutions, theme)}
                    >
                      {institute.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.idInstitucionReceptor ? (
                <p style={{ color: "red", fontSize: 11 }}>{errors.idInstitucionReceptor}</p>
              ) : null}
            </Grid>
            <Grid item md={1} xs={12}></Grid>
            <Grid item md={5} xs={12}>
              <IconButton color="default" variant="contained" component="label">
                <CloudUploadRoundedIcon></CloudUploadRoundedIcon>
                <input type="file" name="file" hidden onChange={handleChangeFile} />
                <p style={{ fontSize: 18 }}>Evidencia</p>
                <p style={{ color: "blue", fontSize: 14, marginLeft: 2 }}>{nombreArchivo}</p>
              </IconButton>
              <p style={{ fontSize: 13 }}>Cargar un solo archivo PDF</p>
              {errors.file ? <p style={{ color: "red", fontSize: 11 }}>{errors.file}</p> : null}
            </Grid>
            <Grid container alignContent="center" sx={{ mt: 1 }} justify="flex-end">
              <Grid item md={12} xs={12}>
                <Divider></Divider>
              </Grid>
              <Grid sx={{ mt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  type="submit"
                  sx={{ mr: 2 }}
                >
                  Agregar
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AlertListToolbar;
