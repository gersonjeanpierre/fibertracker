import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useTimbrado } from "~/context/TimbaContetext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Outlet, useNavigate, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { initRouteId, normalizeRouteId } from "./location-utils";

const RouteContent = () => {
  const { data } = useTimbrado();
  const { location, route } = useParams();
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const selectDepartment = Array.isArray(data)
    ? data.find((data) => data.department === location) || { routes: [] }
    : { routes: [] };

  const routeList = selectDepartment.routes;
  const handleSelect = (value: string) => {
    setSelectedRoute(value);
    navigate(`${normalizeRouteId(value)}`);
  };
  useEffect(() => {
    if (location) {
      setSelectedRoute(location); // Establece el valor de 'location' cuando el componente se monta
    }
    if (route) {
      setSelectedRoute(initRouteId(route));
    }
  }, [location, route]);

  return (
    <>
      <Card className="">
        <CardHeader>
          <CardTitle>Route Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleSelect} value={selectedRoute || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select Route" />
            </SelectTrigger>
            <SelectContent>
              {routeList?.map((route, index) => (
                <SelectItem key={index} value={route.route}>
                  {route.route}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Outlet />
    </>
  );
};

export default RouteContent;
