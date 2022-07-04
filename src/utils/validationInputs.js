export const validationMeta = {
  submitMeta: function submitMeta(data) {
    const errors = {};
    if (data.anioPlanificado.length > 4 || data.anioPlanificado.length < 4) {
      errors.anioPlanificado = "El tamaño del año planificado debe ser de 4 carácteres.";
    } else if (data.anioPlanificado > 2030 || data.anioPlanificado < 2021) {
      errors.anioPlanificado = "El año planificado debe estar entre 2021 y 2030.";
    }
    if (data.numeroAcciones.length < 0) {
      errors.numeroAcciones = "El valor es requerido.";
    } else if (data.numeroAcciones <= 0) {
      errors.numeroAcciones = "El valor no puede ser 0 o negativo.";
    }
    return errors;
  },
};

export const validationActivity = {
  submitActivity: function submitActivity(data) {
    const errors = {};
    if (data.porcentajeAvance.length < 1) {
      errors.porcentajeAvance = "El porcentaje es necesario";
    } else if (data.porcentajeAvance < 0) {
      errors.porcentajeAvance = "El porcentaje debe ser un valor positivo";
    }
    if (data.descripcionActMeta.length < 1 || data.descripcionActMeta === "") {
      errors.descripcionActMeta = "La descripción es necesaria";
    } else if (data.descripcionActMeta.length >= 100) {
      errors.descripcionActMeta = "La descripción solo puede ser de 100 caracteres";
    }
    // if (data.file === null) {
    //   errors.file = "Es necesario seleccionar un archivo";
    // }
    return errors;
  },
};

export const validationPassword = {
  submitPassword: function submitPassword(data) {
    const errors = {};
    if (data.contrasenia.length < 1 || data.contrasenia === "") {
      errors.contrasenia = "Este campo es necesario";
    }
    if (data.nuevaContrasenia.length < 1 || data.nuevaContrasenia === "") {
      errors.nuevaContrasenia = "Este campo es necesario";
    } else if (data.nuevaContrasenia.length < 8 || data.nuevaContrasenia.length > 16) {
      errors.nuevaContrasenia = "La contraseña debe estar entre 8 y 16 carácteres alfanuméricos";
    }
    return errors;
  },
};

export const validateAnio = {
  submitReport: function submitReport(data) {
    const errors = {};
    if (data.anio.length > 4 || data.anio.length < 4) {
      errors.anio = "El tamaño del año planificado debe ser de 4 carácteres.";
    } else if (data.anio > 2030 || data.anio < 2021) {
      errors.anio = "El año debe estar entre 2021 y 2030.";
    }
    return errors;
  },
};

export const validateAlert = {
  submitAlert: function submitAlert(data) {
    const errors = {};
    if (data.descripcionAlerta.length < 1 || data.descripcionAlerta === "") {
      errors.descripcionAlerta = "Este campo es necesario";
    }
    if (data.tipoAlerta.length < 1 || data.tipoAlerta === "") {
      errors.tipoAlerta = "Este campo es necesario";
    }
    if (data.file === null) {
      errors.file = "Es necesario seleccionar un archivo";
    }
    if (data.idInstitucionReceptor.length < 1) {
      errors.idInstitucionReceptor = "Se debe seleccionar almenos una institución receptora";
    }

    return errors;
  },
};

export const validationCredentials = {
  submitNewPassword: function submitNewPassword(data) {
    const errors = {};
    if (data.newPassword.length < 1 || data.newPassword === "") {
      errors.newPassword = "Este campo es necesario";
    } else if (data.newPassword.length < 8 || data.newPassword.length > 16) {
      errors.newPassword = "La contraseña debe estar entre 8 y 16 carácteres alfanuméricos";
    }
    if (data.confirmPassword.length < 1 || data.confirmPassword === "") {
      errors.confirmPassword = "Este campo es necesario";
    } else if (data.confirmPassword.length < 8 || data.confirmPassword.length > 16) {
      errors.confirmPassword = "La contraseña debe estar entre 8 y 16 carácteres alfanuméricos";
    } else if (data.confirmPassword != data.newPassword) {
      errors.confirmPassword = "No coinciden las contraseñas";
    }
    if (data.code.length < 1 || data.code === "") {
      errors.code = "Este campo es necesario";
    } else if (data.code.length != 6) {
      errors.code = "El código debe ser de 6 caracteres";
    }
    return errors;
  },
};

export const validateEmmail = {
  submitForgotPassword: function submitForgotPassword(data) {
    const errors = {};
    if (data.length < 1 || data === "") {
      errors.email = "Este campo es necesario";
    }
    return errors;
  },
};
