import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { transformData } from "./xlsx";
import { getAllKeys, getDataByKey, saveDataByKey } from "~/service/data-excel";
import { useState } from "react";
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
        <h2 className="text-3xl font-bold mb-4">File Upload</h2>
        <Card>
          <CardContent className="p-6">
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
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Outlet />
      </div>
    </>
  );
};
