import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { transformData } from "./xlsx";
import { getAllKeys, getDataByKey, saveDataByKey } from "~/service/data-excel";
import { Outlet, useNavigate } from "@remix-run/react";
import { TimbradoProvider, useTimbrado } from "~/context/TimbaContetext";
import { Department } from "~/interface/timbrado";

export default function TimbradoPage() {
  return (
    <TimbradoProvider>
      <FileContent />
    </TimbradoProvider>
  );
}

const FileContent = () => {
  const navigate = useNavigate();
  const { filename, setFilename, setData, keys, setKeys } = useTimbrado();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const name = file.name.split(".")[0];
    const rawFileData = await file.arrayBuffer();

    try {
      const dataFile = transformData(rawFileData);
      await saveDataByKey(name, dataFile);
      setFilename(name);
      setData(dataFile);

      // Obtener todas las claves de IndexedDB (incluyendo la recién añadida)
      const updatedKeys = await getAllKeys();
      setKeys(updatedKeys); // Actualizar las claves disponibles en el estado

      console.log("Datos cargados correctamente:", dataFile);
    } catch (error) {
      console.error("Error al procesar el archivo:", error);
    }
  };

  const handleKeySelect = async (fileName: string) => {
    try {
      const data = (await getDataByKey(fileName)) as Department[];
      if (data) {
        setData(data);
        setFilename(fileName);
        navigate(`${fileName.toLocaleUpperCase()}`);
      }
    } catch (error) {
      console.error("Error al cargar datos de IndexedDB:", error);
    }
  };

  return (
    <>
      <div className="mb-8">
        <div>
          <h1 className="text-2xl font-bold ">
            Hola, {localStorage.getItem("gestor")}
          </h1>
          <p>Bienvenido a FiberTracker</p>
        </div>
        <Card className="mt-2">
          <CardHeader className="py-3">
            <CardTitle className="text-lg font-semibold">
              Cargar archivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="file"
              onChange={handleFileUpload}
              accept=".xlsx"
              className="mb-2"
            />
            <div className="flex flex-wrap gap-2">
              {keys.length === 0 ? (
                <p>No hay archivos cargados.</p>
              ) : (
                keys.map((key) => (
                  <Button
                    key={key}
                    onClick={() => handleKeySelect(key)}
                    variant={filename === key ? "default" : "outline"}
                  >
                    {key}
                  </Button>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2  gap-2">
        <Outlet />
      </div>
    </>
  );
};
