// context/TimbradoContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Department } from "~/interface/timbrado"; // Ajusta según tu estructura
import { getDataByKey, getAllKeys } from "~/service/data-excel"; // Asegúrate de importar getAllKeys

interface TimbradoContextType {
  filename: string;
  setFilename: (name: string) => void;
  data: Department[] | null;
  setData: (data: Department[]) => void;
  reloadData: () => void;
}

const TimbradoContext = createContext<TimbradoContextType | undefined>(
  undefined
);

export const useTimbrado = () => {
  const context = useContext(TimbradoContext);
  if (!context) {
    throw new Error("useTimbrado must be used within a TimbradoProvider");
  }
  return context;
};

export const TimbradoProvider = ({ children }: { children: ReactNode }) => {
  const [filename, setFilename] = useState<string>("");
  const [data, setData] = useState<Department[] | null>(null);

  const loadLastKey = async () => {
    try {
      const keys = await getAllKeys();
      if (keys.length > 0) {
        const lastKey = keys[keys.length - 1];
        setFilename(lastKey);
        const storedData = await getDataByKey(lastKey);
        if (storedData) {
          setData(storedData as Department[]);
        }
      }
    } catch (error) {
      console.error(
        "Error al cargar el último key de la base de datos:",
        error
      );
    }
  };

  const reloadData = useCallback(async () => {
    if (filename) {
      try {
        const storedData = await getDataByKey(filename);
        if (storedData) {
          setData(storedData as Department[]);
        }
      } catch (error) {
        console.error("Error al recargar los datos:", error);
      }
    }
  }, [filename]);

  useEffect(() => {
    if (!filename) {
      loadLastKey(); // Cargar el último key cuando no hay un filename seleccionado
    } else {
      reloadData();
    }
  }, [filename, reloadData]);

  return (
    <TimbradoContext.Provider
      value={{ filename, setFilename, data, setData, reloadData }}
    >
      {children}
    </TimbradoContext.Provider>
  );
};
