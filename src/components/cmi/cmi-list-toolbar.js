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
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import { clientPublic } from "src/api/axios";
import { msmSwalError, msmSwalExito, palette } from "src/theme/theme";
import apis from "src/utils/bookApis";
import { Search as SearchIcon } from "../../icons/search";

const CmiListToolbarUser = ({
  updateView,
  idObjetive,
  setIdObjetive,
  objetives,
  institution,
  idInstitucion,
  setIdInstitucion,
}) => {
  const [errors, setErrors] = useState({});
  const [objetiveId, setObjetiveId] = useState([]);
  const [institucionId, setInstitucionId] = useState([]);
  const [accion, setAccion] = useState({
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

  const handleSave = () => {
    clientPublic
      .post(apis.accion.post_add, accion)
      .then((res) => {
        if (res.status === 200) {
          msmSwalExito("Acción estratégica registrada satisfactoriamente");
        }
      })
      .catch((exception) => {
        if (exception.response) {
          if (exception.response.status === 400) {
            msmSwalError("No se pudo registrar la acción estratégica");
          }
        } else {
          msmSwalError("Ocurrió un error interno. Contáctese con el administrador del Sistema.");
        }
      });
    updateView();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChangeSelect = (event) => {
    setObjetiveId(event.target.value);
    setIdObjetive(event.target.value);
  };

  const changeSelectInstitution = (event) => {
    setInstitucionId(event.target.value);
    setIdInstitucion(event.target.value);
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
            Gestión CMI
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ maxWidth: 300 }}>
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
                      placeholder="Buscar Acción Estratégica"
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <FormControl sx={{ width: 300 }}>
                    <InputLabel id="demo-simple-select-autowidth-label">
                      Objetivo Estratégico
                    </InputLabel>
                    <Select
                      value={objetiveId}
                      onChange={handleChangeSelect}
                      id="demo-simple-select-autowidth"
                      labelId="demo-simple-select-autowidth-label"
                      label="Objetivo Estratégico"
                    >
                      <MenuItem disabled value="">
                        <em>--Seleccione--</em>
                      </MenuItem>
                      {objetives.map((objetivo) => (
                        <MenuItem key={objetivo.id} value={objetivo.id}>
                          {objetivo.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* <Grid item xs={4}>
                  <FormControl sx={{ width: 300 }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Institución</InputLabel>
                    <Select
                      value={objetiveId}
                      onChange={handleChangeSelect}
                      id="demo-simple-select-autowidth"
                      labelId="demo-simple-select-autowidth-label"
                      label="Institución"
                    >
                      <MenuItem disabled value="">
                        <em>--Seleccione--</em>
                      </MenuItem>
                      {institution.map((institute) => (
                        <MenuItem key={institute.idInstitucion} value={institute.idInstitucion}>
                          {institute.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default CmiListToolbarUser;
