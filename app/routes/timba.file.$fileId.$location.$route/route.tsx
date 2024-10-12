import { Outlet, useNavigate, useParams } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { useTimbrado } from "~/context/TimbaContetext";
import { initRouteId } from "../timba.file.$fileId.$location/location-utils";

const CtoMono = () => {
  const { data } = useTimbrado();
  const { location, route, cto } = useParams();
  const navigate = useNavigate();

  const selectDepartment = Array.isArray(data)
    ? data.find((data) => data.department === location) || { routes: [] }
    : { routes: [] };

  const routesList = selectDepartment.routes;
  const selectRoute = routesList?.find(
    (department) => route && department.route === initRouteId(route)
  );
  const handleCto = (cto: string) => {
    setSelectedCTO(cto);
    navigate(`./${cto}`);
  };

  const [selectedCTO, setSelectedCTO] = useState(cto);
  // const isActiveCto =

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>CTO Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {selectRoute?.ctos.map((cto, index) => (
              <Button
                key={index}
                className=" active:bg-green-600 focus:bg-green-600 "
                onClick={() => handleCto(cto.cto)}
                variant="outline"
                // variant={selectedCTO === cto.cto ? "default" : "outline"}
              >
                {cto.cto}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Outlet />
    </>
  );
};

export default CtoMono;
