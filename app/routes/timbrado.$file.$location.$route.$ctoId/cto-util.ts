import { Department } from "~/interface/timbrado";
import { initRouteId } from "../timbrado.$file.$location.$route/route-utils";

export const findCto = (
  data: Department[],
  location: string,
  route: string,
  cto: string
) => {
  const dept = data?.find((d) => d.department === location);
  const routeData = dept?.routes?.find(
    (r) => r.route === initRouteId(route || "")
  );
  const selectCto = routeData?.ctos?.find((c) => c.cto === cto);

  return selectCto;
};
