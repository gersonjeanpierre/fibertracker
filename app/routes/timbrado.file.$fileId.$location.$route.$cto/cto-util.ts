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
