import { Department } from "~/interface/timbrado";
import { initRouteId } from "../timbrado.file.$fileId.$location/location-utils";

export const findCto = (
  data: Department[],
  location: string,
  route: string,
  cto: string
) => {
  const dept = Array.isArray(data)
    ? data?.find((d) => d.department === location) || { routes: [] }
    : { routes: [] };
  const routeData = dept.routes?.find(
    (r) => r.route === initRouteId(route || "")
  );
  const selectCto = routeData?.ctos?.find((c) => c.cto === cto);

  return selectCto;
};

export function obtenerFechaHoy(): string {
  const hoy = new Date();
  const dia = hoy.getDate().toString().padStart(2, "0");
  const mes = (hoy.getMonth() + 1).toString().padStart(2, "0"); // Los meses empiezan desde 0
  const año = hoy.getFullYear().toString();

  return `${dia}/${mes}/${año}`;
}

export function obtenerHoraActual(): string {
  const ahora = new Date();
  const horas = ahora.getHours().toString().padStart(2, "0");
  const minutos = ahora.getMinutes().toString().padStart(2, "0");

  return `${horas}:${minutos}`;
}

export const getFirstThreeCharacters = (str: string): string => {
  return str.substring(0, 3);
};
