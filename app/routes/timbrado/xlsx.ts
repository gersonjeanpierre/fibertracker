import { read, utils } from "xlsx";
import { Department } from "~/interface/timbrado";

// Asegúrate de que transformData acepte un ArrayBuffer y lo procese adecuadamente
export const transformData = (fileData: ArrayBuffer) => {
  // Convertir el ArrayBuffer a un libro de Excel
  const workbook = read(fileData, { type: "array" });

  const dataRuta: Department[] = [];

  // Procesar cada hoja dentro del libro
  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const jsonData: (string | number)[][] = utils.sheet_to_json(sheet, {
      header: 1,
    });

    // Aquí puedes hacer las transformaciones adicionales que necesites
    // Por ejemplo, transponer la matriz
    const transposedData = transposeMatrix(jsonData);

    // Procesar la data como lo haces habitualmente
    const rutas = transposedData.map((row) => {
      const ctos = row.slice(3).map((cto) => ({
        cto: String(cto),
        state: "NO TIMBRADO",
        observation: "",
        cto_campo: "",
        divisor: "",
        mcomentario: "",
        mcomentario_2: "",
        timbrado: [],
      }));
      return {
        route: cleanCell(String(row[0])),
        gestor: cleanCell(String(row[1])),
        tecnico: cleanCell(String(row[2])).toUpperCase(),
        ctos: ctos,
      };
    });

    dataRuta.push({
      department: sheetName,
      routes: rutas,
    });
  });

  return dataRuta;
};

const cleanCell = (cell: string): string => {
  // add case undefined
  if (!cell) {
    return "";
  }
  // Reemplaza múltiples espacios en blanco, incluidas tabulaciones y saltos de línea, con un solo espacio

  return cell.replace(/\s+/g, " ").trim();
};

const transposeMatrix = (
  matrix: (string | number)[][]
): (string | number)[][] => {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
};
