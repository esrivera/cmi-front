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
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { clientPublic } from "src/api/axios";
import { msmSwalError } from "src/theme/theme";
import apis from "src/utils/bookApis";
import { Search as SearchIcon } from "../../icons/search";

const AlertInstitutionListToolbar = ({
  wordSearch,
  idInstitucion,
  setIdInstitucion,
  setWordSearch,
}) => {
  const [institution, setInstitution] = useState([]);
  const query = {
    uri: apis.institution.get_all,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 50,
    sort: "nombre,asc",
  };

  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setIdInstitucion(event.target.value);
  };

  const handleChangeWord = (event) => {
    setWordSearch(event.target.value);
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

  useEffect(() => {
    searchInstitution();
  }, []);

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
        </Box>
        <Box sx={{ mt: 3, flexWrap: "wrap" }}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ maxWidth: 400 }}>
                    <TextField
                      fullWidth
                      name="wordSearch"
                      value={wordSearch}
                      onChange={handleChangeWord}
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
                      autoFocus
                      autoComplete="off"
                    />
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Instituciones</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={idInstitucion}
                      label="Instituciones"
                      onChange={handleChange}
                    >
                      <MenuItem disabled value="">
                        <em>--Seleccione--</em>
                      </MenuItem>
                      {institution.map((element) => (
                        <MenuItem key={element.idInstitucion} value={element.idInstitucion}>
                          {element.nombre}
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

export default AlertInstitutionListToolbar;
