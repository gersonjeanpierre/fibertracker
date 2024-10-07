// context/TimbradoContext.tsx
import { useNavigate, useParams } from "@remix-run/react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Department } from "~/interface/timbrado";
import { getDataByKey, getAllKeys } from "~/service/data-excel";

interface TimbradoContextType {
  filename: string;
  setFilename: (name: string) => void;
  data: Department[] | null;
  setData: (data: Department[]) => void;
  keys: string[];
  setKeys: (keys: string[]) => void;
  reloadData: () => void;
}

const TimbradoContext = createContext<TimbradoContextType | undefined>(
  undefined
);

export const useTimbrado = () => {
  const context = useContext(TimbradoContext);
  if (!context) {
    throw new Error("useTimbrado debe ser usado dentro de un TimbradoProvider");
  }
  return context;
};

export const TimbradoProvider = ({ children }: { children: ReactNode }) => {
  const [filename, setFilename] = useState<string>("");
  const [data, setData] = useState<Department[] | null>(null);
  const [keys, setKeys] = useState<string[]>([]);
  const { file } = useParams();
  const navigate = useNavigate();

  // Función para cargar el último key de IndexedDB
  const loadLastKey = useCallback(async () => {
    try {
      const dbKeys = await getAllKeys();
      setKeys(dbKeys); // Guarda las claves disponibles en el estado
      if (dbKeys.length > 0) {
        const lastKey = dbKeys[dbKeys.length - 1];
        if (file) {
          setFilename(file);
          return; // Ya se ha especificado un file en la URL, no necesitamos continuar
        }
        setFilename(lastKey);
        navigate(`./${lastKey}`);
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
  }, [file, navigate]);

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

  // Efecto para cargar los datos cuando se monta el componente o cambia el filename
  useEffect(() => {
    if (!filename) {
      loadLastKey(); // Solo carga el último key si no hay un filename
    } else {
      reloadData(); // Recarga los datos cuando cambia el filename
    }
  }, [filename, loadLastKey, reloadData]);

  return (
    <TimbradoContext.Provider
      value={{
        filename,
        setFilename,
        data,
        setData,
        keys,
        setKeys,
        reloadData,
      }}
    >
      {children}
    </TimbradoContext.Provider>
  );
};
