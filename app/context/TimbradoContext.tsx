import { useNavigate, useParams } from "@remix-run/react";
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
  keys: string[];
  setKeys: (keys: string[]) => void;
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

  const loadLastKey = async () => {
    try {
      const keys = await getAllKeys();
      if (keys.length > 0) {
        const lastKey = keys[keys.length - 1];
        // setFilename(lastKey === file ? lastKey : file || "");
        if (file) {
          // navigate(`./${file}`);
          return setFilename(file);
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
  };

  const loadKeys = async () => {
    try {
      const dbKeys = await getAllKeys();
      setKeys(dbKeys);
      return dbKeys;
    } catch (error) {
      console.error("Error al cargar las claves de IndexedDB:", error);
      return [];
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
      loadKeys(); // Cargar las claves de la base de datos
    } else {
      reloadData();
    }
  }, [filename]);

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
