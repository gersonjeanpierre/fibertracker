import { Outlet, useParams } from "@remix-run/react";
import { useTimbrado } from "~/context/TimbradoContext";
import { initRouteId } from "./route-utils";
import { Button } from "~/components/ui/button";

const RouteContent = () => {
  const { data } = useTimbrado();
  const { location, route } = useParams();
  const routesList = data?.find((data) => data.department === location)?.routes;

  const selectRoute = routesList?.find(
    (department) => route && department.route === initRouteId(route)
  );
  console.log("selectRoute", selectRoute);

  const handleCto = (cto: string) => {
    console.log("cto", cto);
  };
  return (
    <>
      <h1>Testeando Contenido ctos</h1>
      <div className="flex gap-2 flex-wrap mt-3">
        {selectRoute?.ctos.map((cto, index) => (
          <Button
            key={index}
            onClick={() => handleCto(cto.cto)}
            variant="outline"
            className="flex flex-col"
          >
            <div>{cto.cto}</div>
            <div>{cto.state}</div>
          </Button>
        ))}
      </div>
      <Outlet />
    </>
  );
};

export default RouteContent;
