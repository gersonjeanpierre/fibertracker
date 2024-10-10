import { Outlet, useNavigate, useParams } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { useTimbrado } from "~/context/TimbradoContext";
import { normalizeRouteId } from "./location-utils";

const RouteContent = () => {
  const { data } = useTimbrado();
  const { location } = useParams();
  const navigate = useNavigate();

  const routesList = data?.find((d) => d.department === location)?.routes;

  const handleRouteClick = (selectRoute: string) => {
    navigate(`./${normalizeRouteId(selectRoute)}`);
  };
  return (
    <>
      <div className="flex flex-col gap-2 ">
        <div className="flex flex-row gap-2 flex-wrap">
          {routesList?.map((route, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleRouteClick(route.route)}
            >
              {route.route}
            </Button>
          ))}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default RouteContent;
