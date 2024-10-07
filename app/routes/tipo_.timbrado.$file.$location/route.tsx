import { useTimbrado } from "~/context/TimbradoContext";

const RouteContent = () => {
  const { data } = useTimbrado();
  console.log("data", data);
  return (
    <>
      <h1>Testeando</h1>
    </>
  );
};

export default RouteContent;
