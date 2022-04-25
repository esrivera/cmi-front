export const validationMeta = {
  submitMeta: function submitMeta(data) {
    const errors = {};
    if (data.anioPlanificado.length > 4 || data.anioPlanificado.length < 4) {
      errors.anioPlanificado = "El tamaño del año planificado debe ser de 4 caracteres.";
    }
    return errors;
  },
};

export const validationActivity = {
  submitActivity: function submitActivity(data) {
    const errors = {};
    if (data.porcentajeAvance.length < 1) {
      errors.porcentajeAvance = "El porcentaje es necesario";
    } else if (data.porcentajeAvance <= 0) {
      errors.porcentajeAvance = "El porcentaje debe ser un valor mayor a 0";
    }
    if (data.descripcionActMeta.length < 1 || data.descripcionActMeta === "") {
      errors.descripcionActMeta = "El porcentaje es necesario";
    } else if (data.descripcionActMeta.length >= 100) {
      errors.descripcionActMeta = "La descripción solo puede ser de 100 caracteres";
    }
    if (data.file === null) {
      errors.file = "Es necesario seleccionar un archivo";
    }
    return errors;
  },
};
