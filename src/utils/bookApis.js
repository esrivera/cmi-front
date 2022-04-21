export default {
  auth: {
    post_login: "/auth/login",
  },
  institution: {
    post_add: "/institution",
    get_all: "/institution/all",
    delete_id: "/institution/",
    edit_id: "/institution/",
  },
  objetive: {
    post_add: "/objetivoEstrategico",
    get_all: "/objetivoEstrategico/lista",
    delete_id: "/objetivoEstrategico/",
    edit_id: "/objetivoEstrategico/",
  },
  accion: {
    post_add: "/accionesEstrategicas",
    get_all: "",
    get_id_objetive: "/accionesEstrategicas/objetivo/",
    get_id_institution: "/accionesEstrategicas/instituciones/",
    edit_id: "/accionesEstrategicas/",
    delete_id: "/accionesEstrategicas/",
  },
  user: {
    post_add: "/auth/nuevo",
    get_all: "/user/institute/",
    edit_id: "/user/",
    delete_id: "/user/",
  },
  meta: {
    post_add: "/metas",
    get_all_indicador: "/metas/byIndicador/",
    delete_id: "/metas/",
  },
  indicador: {
    patch_observacion: "/indicador/",
  },
};
