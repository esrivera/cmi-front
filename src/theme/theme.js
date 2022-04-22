import Swal from "sweetalert2";

export const palette = {
  primary: {
    light: "#002071",
    main: "#006BB4",
    dark: "#0d46a0",
    contrastText: "#FFFFFF",
    menuHeader: "#3c3a3a",
    titleCard: "#3c3a3abf",
    borderCell: "rgba(81,81,81,1)",
  },
  secondary: {
    light: "#ff7961",
    main: "#f44336",
    dark: "#ba000d",
    contrastText: "#FFFFFF",
  },
  error: {
    light: "#ffcdd2",
    main: "#f44336",
    dark: "#d32f2f",
    contrastText: "#FFFFFF",
    base: "#ffebee",
  },
  warning: {
    light: "#ffb74d",
    main: "#ff9800",
    dark: "#f57c00",
    contrastText: "#FFFFFF",
    base: "#fffde7",
  },
  info: {
    light: "#bbdefb",
    main: "#1e88e5",
    dark: "#0d47a1",
    contrastText: "#0d47a1",
    base: "#e3f2fd",
  },
  success: {
    light: "#e0f2f1",
    main: "#4caf50",
    dark: "#388e3c",
    contrastText: "#ffffff",
    base: "#e8f5e9",
  },
  base: {
    main: "#E4E4E4",
  },
};

export const colorHeader1 = "rgb(59 58 58)";

export const msmSwalInformacion = (titulo, mensaje) => {
  return Swal.fire({
    title: titulo,
    text: mensaje,
    icon: "info",
    showConfirmButton: true,
    confirmButtonText: "Aceptar ",
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });
};
export const msmSwalExito = (
  titulo,
  mensaje,
  CancelButton = { show: false, text: "", style: "btn btn-outline-primary ml-2" },
  confirmButton = { show: true, text: "Aceptar", style: "btn btn-primary" }
) => {
  return Swal.fire({
    icon: "success",
    title: titulo,
    text: mensaje,
    showConfirmButton: true,
    confirmButtonText: "Aceptar",
  });
};

export const msmSwalError = (titulo, mensaje) => {
  return Swal.fire({
    icon: "error",
    title: titulo,
    text: mensaje,
    showConfirmButton: true,
    confirmButtonText: "Aceptar ",
  });
};
//background-color: rgba(0, 0, 0, 0.5);  arreglar en el menu
export const styleInput = (error, value) => {
  if (value || error) {
    if (error) {
      return "form-control is-invalid";
    } else {
      return "form-control is-valid";
    }
  } else {
    return "form-control";
  }
};
