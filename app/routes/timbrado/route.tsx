// app/routes/timbrado.tsx
import { ResetIcon } from "@radix-ui/react-icons";
import { Outlet, useNavigate } from "@remix-run/react";
import { ChangeEvent } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { transformData } from "./xlsx"; // Ajusta la ruta del archivo
import { getAllKeys, getDataByKey, saveDataByKey } from "~/service/data-excel";
import { TimbradoProvider, useTimbrado } from "~/context/TimbradoContext";
import { Department } from "~/interface/timbrado";

export default function TimbradoPage() {
  return (
    <TimbradoProvider>
      <TimbradoContent />
    </TimbradoProvider>
  );
}
function TimbradoContent() {
  const navigate = useNavigate();
  const { filename, setFilename, setData, keys, setKeys } = useTimbrado();

  // Manejo de la carga de archivos
  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const name = file.name.split(".")[0];
    const rawFileData = await file.arrayBuffer();

    try {
      // Transformar el archivo en JSON
      const dataFile = transformData(rawFileData);

      // Guardar los datos en IndexedDB con el nombre del archivo como clave
      await saveDataByKey(name, dataFile);

      // Actualizar el estado global
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
        navigate(`./${fileName}`);
      }
    } catch (error) {
      console.error("Error al cargar datos de IndexedDB:", error);
    }
  };

  return (
    <div className="container mx-auto mt-4">
      <div className="flex gap-3">
        <h1 className="text-4xl mb-4 font-bold">Subir el Excel de rutas</h1>
        <Button onClick={() => navigate(-1)}>
          <ResetIcon className="mr-2 h-4 w-4" />
          Regresar
        </Button>
      </div>

      <Input
        type="file"
        onChange={handleFileUpload}
        accept=".xlsx"
        className="mb-4"
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
      <Outlet />
    </div>
  );
}
