import { useParams } from "@remix-run/react";
import { useTimbrado } from "~/context/TimbradoContext";
import { initRouteId } from "./route-utils";

const RouteContent = () => {
  const { data } = useTimbrado();
  const { location, route } = useParams();
  const routesList = data?.find((data) => data.department === location)?.routes;

  const selectRoute = routesList?.find(
    (department) => route && department.route === initRouteId(route)
  );
  console.log("selectRoute", selectRoute);
  return (
    <div>
      <h1>Testeando Contenido ctos</h1>
    </div>
  );
};

export default RouteContent;
