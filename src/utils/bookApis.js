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
    get_id_objetive: "/accionesEstrategicas/objetivo/",
    get_id_institution: "/accionesEstrategicas/instituciones/",
    get_id_institution_objetive: "/accionesEstrategicas/byInstitucionyObjetivo/",
    edit_id: "/accionesEstrategicas/",
    delete_id: "/accionesEstrategicas/",
    patch_estado_id: "/accionesEstrategicas/",
  },
  user: {
    post_add: "/auth/nuevo",
    get_all: "/user/institute/",
    edit_id: "/user/",
    patch_ci: "/user/state/",
    get_ci: "/user/byCi/",
    post_password: "/auth/reset-password",
  },
  meta: {
    post_add: "/metas",
    get_all_indicador: "/metas/byIndicador/",
    delete_id: "/metas/",
    get_estado_meta: "/metas/meta-trimestre/",
  },
  indicador: {
    patch_observacion: "/indicador/",
  },
  actividad: {
    post_add: "/actMetas",
    post_aprobacion: "/actMetas/aprobacion",
    get_by_anio: "/actMetas/byAnioAndMeta/",
    get_evidencia: "/actMetas/evidencia/",
    delete_id: "/actMetas/",
  },
  reporte: {
    by_institution_year: "/reportes/accionByInstitucionAndAnio",
    by_objetive_year: "/reportes/accionByObjetivoAndAnio",
    meta_by_action: "/reportes/meta-anioByAccionEstrategica/",
  },
  alerta: {
    post_add: "/alertas",
    delete_id: "/alertas/",
    get_by_emisor: "/alertas/byInstitucionEmi/",
    get_by_receptor: "/alertas/byInstitucionRecep/",
    get_evidencia: "/alertas/evidencia/",
    get_by_pendientes: "/alertas/pendientes/byInstitucionRecep/",
    patch_estado: "/alertas/",
  },
};
