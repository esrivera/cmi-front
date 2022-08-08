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
  Button,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import apis from "src/utils/bookApis";
import { Search as SearchIcon } from "../../icons/search";
import KeyboardReturnRoundedIcon from "@mui/icons-material/KeyboardReturnRounded";
import { clientPublic } from "src/api/axios";

const CmiListToolbarUser = ({ idObjetive, setIdObjetive, wordSearch, setWordSearch }) => {
  const [objetives, setObjetives] = useState([]);
  const queryObjetive = {
    uri: apis.objetive.get_all,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 50,
    sort: "nombre,asc",
  };

  const searchObjetives = () => {
    clientPublic
      .get(
        queryObjetive.uri +
          "?page=" +
          queryObjetive.page +
          "&size=" +
          queryObjetive.elementos +
          "&sort=" +
          queryObjetive.sort
      )
      .then((result) => {
        if (result.status === 200) {
          setObjetives(result.data.content);
        }
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  useEffect(() => {
    searchObjetives();
  }, []);

  const handleChangeSelect = (event) => {
    setIdObjetive(event.target.value);
  };

  const handleChangeWord = (event) => {
    setWordSearch(event.target.value);
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
          <Link href="/inicio/cmi">
            <Button variant="outlined" sx={{ m: 4 }}>
              <KeyboardReturnRoundedIcon></KeyboardReturnRoundedIcon>Volver
            </Button>
          </Link>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ maxWidth: 300 }}>
                    <TextField
                      fullWidth
                      name="wordSearch"
                      value={wordSearch}
                      onChange={handleChangeWord}
                      autoFocus
                      autoComplete="off"
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
                      value={idObjetive}
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
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default CmiListToolbarUser;
