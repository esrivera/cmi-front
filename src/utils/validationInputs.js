export const validationMeta = {
  submitMeta: function submitMeta(data) {
    const errors = {};
    if (data.anioPlanificado.length > 4 || data.anioPlanificado.length < 4) {
      errors.anioPlanificado = "El tamaño del año planificado debe ser de 4 caracteres.";
    }
    return errors;
  },
};
