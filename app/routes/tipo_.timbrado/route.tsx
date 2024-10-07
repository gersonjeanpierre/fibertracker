// app/routes/timbrado.tsx
import { ResetIcon } from "@radix-ui/react-icons";
import { Outlet, useNavigate, useParams } from "@remix-run/react";
import { ChangeEvent } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { transformData } from "./xlsx";
import { getDataByKey, saveDataByKey } from "~/service/data-excel";
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
  const { filename, setFilename, setData, keys } = useTimbrado(); // Usa el contexto

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const name = file.name.split(".")[0];
    const rawFileData = await file.arrayBuffer();

    try {
      const dataFile = transformData(rawFileData);
      await saveDataByKey(name, dataFile);
      setFilename(name); // Actualiza el estado global
    } catch (error) {
      console.error("Error al procesar el archivo:", error);
    }
  };

  const loadDataFromDB = async (key: string) => {
    try {
      const data = (await getDataByKey(key)) as Department[];
      if (data) {
        setData(data);
        setFilename(key);
      }
    } catch (error) {
      console.error("Error al cargar datos de IndexedDB:", error);
    }
  };

  const handleKeySelect = async (fileName: string) => {
    await loadDataFromDB(fileName);
    navigate(`./${fileName}`);
  };

  console.log(useParams());
  return (
    <>
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
      </div>
      <div className="flex flex-wrap gap-2">
        {keys.map((key) => (
          <Button
            key={key}
            onClick={() => handleKeySelect(key)}
            variant={filename === key ? "default" : "outline"}
          >
            {key}
          </Button>
        ))}
      </div>
      <Outlet />
    </>
  );
}
