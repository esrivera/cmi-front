import {
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Grid,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import { Search as SearchIcon } from "../../icons/search";

const CmiListToolbar = ({
  updateView,
  idObjetive,
  setIdObjetive,
  objetives,
  institution,
  idInstitucion,
  setIdInstitucion,
}) => {
  const [objetiveId, setObjetiveId] = useState([]);
  const [institucionId, setInstitucionId] = useState([]);

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
                <Grid item xs={4}>
                  <FormControl sx={{ width: 300 }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Institución</InputLabel>
                    <Select
                      value={institucionId}
                      onChange={changeSelectInstitution}
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
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default CmiListToolbar;
