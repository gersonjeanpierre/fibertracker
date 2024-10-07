import { useParams } from "@remix-run/react";
import { useTimbrado } from "~/context/TimbradoContext";

const RouteContent = () => {
  const { data } = useTimbrado();
  const param = useParams();
  console.log("param", param);
  console.log("data", data);
  return (
    <div>
      <h1>Testeando Contenido ctos</h1>
    </div>
  );
};

export default RouteContent;
