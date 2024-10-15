import { Cto, Department } from "~/interface/timbrado";

const DB_NAME = "TimbradoDB";
const STORE_NAME = "Routes";

export const openDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Error al abrir la base de datos");
  });
};

// Guardar datos en IndexedDB por clave
export const saveDataByKey = async (key: string, data: Department[]) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(data, key);

    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject("Error al guardar los datos en IndexedDB");
    });
  } catch (error) {
    console.error("IndexedDB save error:", error);
    throw new Error("No se pudo guardar los datos en IndexedDB");
  }
};

export const getAllKeys = async () => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const request = store.getAllKeys();
  return new Promise<string[]>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as string[]);
    request.onerror = () => reject("Error al obtener las claves");
  });
};

// Obtener datos de IndexedDB por clave
export const getDataByKey = async (key: string) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Error al obtener los datos de IndexedDB");
    });
  } catch (error) {
    console.error("IndexedDB get error:", error);
    throw new Error("No se pudo obtener los datos de IndexedDB");
  }
};

// Eliminar datos por clave
export const deleteDataByKey = async (key: string) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(key);

    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject("Error al eliminar los datos de IndexedDB");
    });
  } catch (error) {
    console.error("IndexedDB delete error:", error);
    throw new Error("No se pudo eliminar los datos de IndexedDB");
  }
};

// Limpiar todos los datos
export const clearData = async () => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.clear();

    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject("Error al limpiar IndexedDB");
    });
  } catch (error) {
    console.error("IndexedDB clear error:", error);
    throw new Error("No se pudo limpiar IndexedDB");
  }
};

export const updateCtoData = async (
  file: string,
  ctoId: string,
  updatedData: Cto
) => {
  try {
    // Obtener los datos por la clave
    const data = (await getDataByKey(file)) as Department[];

    if (!data) {
      throw new Error(`No se encontraron datos para la clave ${file}`);
    }
    console.log("DATA SERVICE #####################", data);
    const dataUpdated = Array<Department>();

    // Buscar y actualizar el CTO
    let ctoUpdated = false;
    data.map((department) => {
      const rutas = department.routes.map((route) => {
        const ctos = route.ctos.map((cto) => {
          if (cto.cto === ctoId) {
            console.log("CTO ENCONTRADO #####################", cto);
            ctoUpdated = true;
            return { ...cto, ...updatedData };
          }
          return cto;
        });
        return { ...route, ctos };
      });
      dataUpdated.push({ ...department, routes: rutas });
    });

    if (!ctoUpdated) {
      throw new Error(`No se encontró el CTO con ID ${ctoId}`);
    }

    console.log("DATA ACTUALIZADA #####################", dataUpdated);

    // Guardar los datos actualizados nuevamente en IndexedDB
    await saveDataByKey(file, dataUpdated);

    return dataUpdated;
  } catch (error) {
    console.error("Error actualizando el CTO:", error);
    if (error instanceof Error) {
      throw new Error(`Error actualizando el CTO: ${error.message}`);
    } else {
      throw new Error(`Error actualizando el CTO: ${String(error)}`);
    }
  }
};
