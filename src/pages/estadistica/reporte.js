import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Head from "next/head";
import apis from "src/utils/bookApis";
import { Bar } from "react-chartjs-2";
import { clientPublic } from "src/api/axios";
import { useEffect, useState } from "react";
import TableData from "src/components/report/tableData";
import { msmSwalError } from "src/theme/theme";
import { validateAnio } from "src/utils/validationInputs";
import { DashboardLayoutUser } from "src/components/dashboard-layout-user";

const Reporte = () => {
  const [institutions, setInstitutions] = useState([]);
  const [objetive, setObjetive] = useState([]);
  const [action, setAction] = useState([]);
  const [errors, setErrors] = useState({});
  const [titleGeneral, setTitleGeneral] = useState("");
  const [nameInstitution, setNameInstitution] = useState("");
  const [nameObjetive, setNameObjetive] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [anio, setAnio] = useState(2021);
  const [institutionId, setInstitutionId] = useState("");
  const [objetiveId, setObjetiveId] = useState("");
  const [actionId, setActionId] = useState("");
  const [labelData, setLabelData] = useState([]);
  const [porcentajeData, setPorcentajeData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [reportDataYear, setReportDataYear] = useState([]);
  const [reportDataAction, setReportDataAction] = useState([]);
  const [idObjetivo, setIdObjetivo] = useState(0);
  const queryInstitution = {
    uri: apis.institution.get_all,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "nombre,asc",
  };
  const queryObjetive = {
    uri: apis.objetive.get_all,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "nombre,asc",
  };
  const query = {
    uri: apis.accion.get_id_objetive + idObjetivo,
    metodo: "get",
    body: null,
    page: 0,
    elementos: 15,
    sort: "identificador,asc",
  };
  const data = {
    labels: labelData,
    datasets: [
      {
        label: reportTitle,
        backgroundColor: "rgba(0,0,244,0.8)",
        borderColor: "black",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(0,0,244,0.4)",
        hoverBorderColor: "#FF0000",
        data: porcentajeData,
      },
    ],
  };

  const opciones = {
    maintainAspectRatio: false,
    responsive: true,
  };

  const handleChangeSelect = (event) => {
    setInstitutionId(event.target.value.idInstitucion);
    setNameInstitution(event.target.value.nombre);
  };

  const handleChangeObjetive = (event) => {
    setObjetiveId(event.target.value.id);
    setNameObjetive(event.target.value.nombre);
  };

  const handleChangeObjetiveId = (event) => {
    setIdObjetivo(event.target.value);
  };

  useEffect(() => {
    setTimeout(() => {
      searchActions();
    }, 500);
  }, [idObjetivo, setIdObjetivo]);

  const handleChangeAction = (event) => {
    setActionId(event.target.value.id);
    setNameObjetive(event.target.value.identificador);
  };

  const searchActions = () => {
    clientPublic
      .get(query.uri + "?page=" + query.page + "&size=" + query.elementos + "&sort=" + query.sort)
      .then((result) => {
        if (result.status === 200) {
          setAction(result.data.content);
        }
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  const handleChange = (e) => {
    setAnio(e.target.value);
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
          setObjetive(result.data.content);
        }
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  const generateReport = () => {
    setReportData([]);
    setReportDataYear([]);
    setReportDataAction([]);
    clientPublic
      .get(apis.reporte.by_institution_year, { params: { idInstitucion: institutionId } })
      .then((result) => {
        if (result.status === 200) {
          setReportData(result.data);
          var res = result.data;
          var listPorcentaje = [];
          var listLabel = [];
          res.map((dato) => {
            listPorcentaje.push(dato.porcentajeAccTotal);
            listLabel.push(dato.identificadorAccEstrategica);
          });
          setPorcentajeData(listPorcentaje);
          setLabelData(listLabel);
          setReportTitle("Porcentaje de avance");
          setTitleGeneral("Porcentaje de avance del " + nameInstitution);
        }
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  const generateReport2 = () => {
    setReportData([]);
    setReportDataYear([]);
    setReportDataAction([]);
    clientPublic
      .get(apis.reporte.by_objetive_year, { params: { idObjetivo: objetiveId } })
      .then((result) => {
        if (result.status === 200) {
          setReportData(result.data);
          var res = result.data;
          var listPorcentaje = [];
          var listLabel = [];
          res.map((dato) => {
            listPorcentaje.push(dato.porcentajeAccTotal);
            listLabel.push(dato.identificadorAccEstrategica);
          });
          setPorcentajeData(listPorcentaje);
          setLabelData(listLabel);
          setReportTitle("Porcentaje de avance");
          setTitleGeneral("Porcentaje de avance del " + nameObjetive);
        }
      })
      .catch((exception) => {
        if (exception.response) {
          msmSwalError("Ocurrio un problema en la red al consultar los datos.");
        }
      });
  };

  const generateReport3 = () => {
    setReportData([]);
    setReportDataYear([]);
    setReportDataAction([]);
    const data = {
      anio: anio,
    };
    const newErrors = validateAnio.submitReport(data);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      clientPublic
        .get(apis.reporte.by_institution_year, {
          params: { idInstitucion: institutionId, anio: anio },
        })
        .then((result) => {
          if (result.status === 200) {
            setReportDataYear(result.data);
            var res = result.data;
            var listPorcentaje = [];
            var listLabel = [];
            res.map((dato) => {
              listPorcentaje.push(dato.porcentajeAlcanzadoMetaPorAnio);
              listLabel.push(dato.identificadorAccEstrategica);
            });
            setPorcentajeData(listPorcentaje);
            setLabelData(listLabel);
            setReportTitle("Porcentaje de avance");
            setTitleGeneral("Porcentaje de avance del " + nameInstitution + "en el " + anio);
          }
        })
        .catch((exception) => {
          if (exception.response) {
            msmSwalError("Ocurrio un problema en la red al consultar los datos.");
          }
        });
    }
  };

  const generateReport4 = () => {
    setReportData([]);
    setReportDataYear([]);
    setReportDataAction([]);
    const data = {
      anio: anio,
    };
    const newErrors = validateAnio.submitReport(data);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      clientPublic
        .get(apis.reporte.by_objetive_year, { params: { idObjetivo: objetiveId, anio: anio } })
        .then((result) => {
          if (result.status === 200) {
            setReportDataYear(result.data);
            var res = result.data;
            var listPorcentaje = [];
            var listLabel = [];
            res.map((dato) => {
              listPorcentaje.push(dato.porcentajeAlcanzadoMetaPorAnio);
              listLabel.push(dato.identificadorAccEstrategica);
            });
            setPorcentajeData(listPorcentaje);
            setLabelData(listLabel);
            setReportTitle("Porcentaje de avance");
            setTitleGeneral("Porcentaje de avance del " + nameObjetive + " en el año " + anio);
          }
        })
        .catch((exception) => {
          if (exception.response) {
            msmSwalError("Ocurrio un problema en la red al consultar los datos.");
          }
        });
    }
  };

  const generateReport5 = () => {
    setReportData([]);
    setReportDataYear([]);
    setReportDataAction([]);
    clientPublic
      .get(apis.reporte.meta_by_action + actionId)
      .then((result) => {
        if (result.status === 200) {
          setReportDataAction(result.data);
          var res = result.data;
          var listPorcentaje = [];
          var listLabel = [];
          res.map((dato) => {
            listPorcentaje.push(dato.porcentajeAlcanzadoMetaPorAnio);
            listLabel.push(dato.anioPlanificado);
          });
          setPorcentajeData(listPorcentaje);
          setLabelData(listLabel);
          setReportTitle("Porcentaje de avance");
          setTitleGeneral("Porcentaje de avance de la " + nameObjetive);
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
      <Head>
        <title>Estaditicas | CMI</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ mb: 4 }}>
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
                Reporte de Estadisticas
              </Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Card>
                <CardContent>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      onClick={searchInstitutions}
                    >
                      <Typography>Reporte por Institución</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <FormControl sx={{ width: 300 }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Institución</InputLabel>
                        <Select
                          value={institutionId}
                          onChange={handleChangeSelect}
                          id="demo-simple-select-autowidth"
                          labelId="demo-simple-select-autowidth-label"
                          label="Institución"
                        >
                          <MenuItem disabled value="">
                            <em>--Seleccione--</em>
                          </MenuItem>
                          {institutions.map((institute) => (
                            <MenuItem key={institute.idInstitucion} value={institute}>
                              {institute.nombre}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        sx={{ mt: 1, ml: 3 }}
                        endIcon={<SearchRoundedIcon />}
                        onClick={generateReport}
                      >
                        Generar
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      onClick={searchObjetives}
                    >
                      <Typography>Reporte por Objetivo Estratégico</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <FormControl sx={{ width: 300 }}>
                        <InputLabel id="demo-simple-select-autowidth-label">
                          Objetivo Estratégico
                        </InputLabel>
                        <Select
                          value={objetiveId}
                          onChange={handleChangeObjetive}
                          id="demo-simple-select-autowidth"
                          labelId="demo-simple-select-autowidth-label"
                          label="Objetivo Estratégico"
                        >
                          <MenuItem disabled value="">
                            <em>--Seleccione--</em>
                          </MenuItem>
                          {objetive.map((objetivo) => (
                            <MenuItem key={objetivo.id} value={objetivo}>
                              {objetivo.nombre}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        sx={{ mt: 1, ml: 3 }}
                        endIcon={<SearchRoundedIcon />}
                        onClick={generateReport2}
                      >
                        Generar
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      onClick={searchInstitutions}
                    >
                      <Typography>Reporte por Institución y año</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container direction="row" justify="flex-start" alignItems="center">
                        <Grid item md={5} xs={12} mr={-8} mt={1}>
                          <FormControl sx={{ width: 300 }}>
                            <InputLabel id="demo-simple-select-autowidth-label">
                              Institución
                            </InputLabel>
                            <Select
                              value={institutionId}
                              onChange={handleChangeSelect}
                              id="demo-simple-select-autowidth"
                              labelId="demo-simple-select-autowidth-label"
                              label="Institución"
                            >
                              <MenuItem disabled value="">
                                <em>--Seleccione--</em>
                              </MenuItem>
                              {institutions.map((institute) => (
                                <MenuItem key={institute.idInstitucion} value={institute}>
                                  {institute.nombre}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item md={5} xs={12} mr={-17}>
                          <TextField
                            required
                            name="anio"
                            margin="normal"
                            id="outlined-basic"
                            label="Año"
                            type="number"
                            autoComplete="off"
                            onChange={handleChange}
                            value={anio}
                          />
                          {errors.anio ? (
                            <p style={{ color: "red", fontSize: 11 }}>{errors.anio}</p>
                          ) : null}
                        </Grid>
                        <Grid item md={2} xs={12}>
                          <Button
                            variant="contained"
                            sx={{ mt: 1, ml: 3 }}
                            endIcon={<SearchRoundedIcon />}
                            onClick={generateReport3}
                          >
                            Generar
                          </Button>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      onClick={searchObjetives}
                    >
                      <Typography>Reporte por Objetivo Estratégico y año</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container direction="row" justify="flex-start" alignItems="center">
                        <Grid item md={5} xs={12} mr={-8} mt={1}>
                          <FormControl sx={{ width: 300 }}>
                            <InputLabel id="demo-simple-select-autowidth-label">
                              Objetivo Estratégico
                            </InputLabel>
                            <Select
                              value={objetiveId}
                              onChange={handleChangeObjetive}
                              id="demo-simple-select-autowidth"
                              labelId="demo-simple-select-autowidth-label"
                              label="Objetivo Estratégico"
                            >
                              <MenuItem disabled value="">
                                <em>--Seleccione--</em>
                              </MenuItem>
                              {objetive.map((objetivo) => (
                                <MenuItem key={objetivo.id} value={objetivo}>
                                  {objetivo.nombre}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item md={5} xs={12} mr={-17}>
                          <TextField
                            required
                            name="anio"
                            margin="normal"
                            id="outlined-basic"
                            label="Año"
                            type="number"
                            autoComplete="off"
                            onChange={handleChange}
                            value={anio}
                          />
                          {errors.anio ? (
                            <p style={{ color: "red", fontSize: 11 }}>{errors.anio}</p>
                          ) : null}
                        </Grid>
                        <Grid item md={2} xs={12}>
                          <Button
                            variant="contained"
                            sx={{ mt: 1, ml: 3 }}
                            endIcon={<SearchRoundedIcon />}
                            onClick={generateReport4}
                          >
                            Generar
                          </Button>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      onClick={searchObjetives}
                    >
                      <Typography>Reporte por Acción Estratégica</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container direction="row" justify="flex-start" alignItems="center">
                        <Grid item md={5} xs={12} mr={-8}>
                          <FormControl sx={{ width: 300 }}>
                            <InputLabel id="demo-simple-select-autowidth-label">
                              Objetivo Estratégico
                            </InputLabel>
                            <Select
                              value={objetiveId}
                              onChange={handleChangeObjetiveId}
                              id="demo-simple-select-autowidth"
                              labelId="demo-simple-select-autowidth-label"
                              label="Objetivo Estratégico"
                            >
                              <MenuItem disabled value="">
                                <em>--Seleccione--</em>
                              </MenuItem>
                              {objetive.map((objetivo) => (
                                <MenuItem key={objetivo.id} value={objetivo.id}>
                                  {objetivo.nombre}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item md={5} xs={12} mr={-10}>
                          <FormControl sx={{ width: 300 }}>
                            <InputLabel id="demo-simple-select-autowidth-label">
                              Acción Estratégica
                            </InputLabel>
                            <Select
                              value={objetiveId}
                              onChange={handleChangeAction}
                              id="demo-simple-select-autowidth"
                              labelId="demo-simple-select-autowidth-label"
                              label="Acción Estratégica"
                            >
                              <MenuItem disabled value="">
                                <em>--Seleccione--</em>
                              </MenuItem>
                              {action.map((accion) => (
                                <MenuItem key={accion.id} value={accion}>
                                  {accion.identificador}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12}>
                          <Button
                            variant="contained"
                            sx={{ mt: 1, ml: 3 }}
                            endIcon={<SearchRoundedIcon />}
                            onClick={generateReport5}
                          >
                            Generar
                          </Button>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Box>
          </Box>
          <div className="App" style={{ width: "100%", height: "400px" }}>
            <Typography sx={{ m: 1 }} variant="h4">
              {titleGeneral}
            </Typography>
            <Bar data={data} sx={{ m: 1 }} options={opciones}></Bar>
          </div>
          <Box sx={{ mt: 10 }}>
            <TableData
              reportData={reportData}
              reportDataYear={reportDataYear}
              reportDataAction={reportDataAction}
            ></TableData>
          </Box>
        </Container>
      </Box>
    </>
  );
};

Reporte.getLayout = (page) => <DashboardLayoutUser>{page}</DashboardLayoutUser>;

export default Reporte;
