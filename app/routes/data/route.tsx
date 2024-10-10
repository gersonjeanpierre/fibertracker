"use client";

import { useState, useCallback, useMemo } from "react";
import * as d3 from "d3";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Upload, Filter, Download } from "lucide-react";

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB per chunk
const PREVIEW_ROWS = 5;

export default function CsvUploader() {
  const [csvData, setCsvData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [progress, setProgress] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const processChunk = useCallback((chunk, header, isFirstChunk) => {
    const rows = d3.csvParseRows(chunk);
    if (isFirstChunk) {
      setColumns(header);
    }
    return rows.map((row) => {
      return header.reduce((obj, key, index) => {
        obj[key] = row[index];
        return obj;
      }, {});
    });
  }, []);

  const readCsvFileInChunks = useCallback(
    (file) => {
      let header = [];
      const fileSize = file.size;

      const readNextChunk = (start) => {
        const reader = new FileReader();
        const blob = file.slice(start, start + CHUNK_SIZE);

        reader.onload = (e) => {
          const chunk = e.target.result;
          const rows = chunk.split("\n");

          if (start === 0) {
            header = rows.shift().split(",");
          }

          const processedChunk = processChunk(
            rows.join("\n"),
            header,
            start === 0
          );
          setCsvData((prevData) => [...prevData, ...processedChunk]);

          const nextStart = start + CHUNK_SIZE;
          setProgress((nextStart / fileSize) * 100);

          if (nextStart < fileSize) {
            readNextChunk(nextStart);
          } else {
            console.log("File reading completed");
          }
        };

        reader.readAsText(blob);
      };

      readNextChunk(0);
    },
    [processChunk]
  );

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 0) {
      setCsvData([]);
      setFilteredData([]);
      setProgress(0);
      readCsvFileInChunks(file);
    }
  };

  const handleFilter = useCallback(() => {
    if (selectedColumn && filterValue) {
      const filtered = csvData.filter((row) => {
        return (
          row[selectedColumn] &&
          row[selectedColumn].toLowerCase().includes(filterValue.toLowerCase())
        );
      });
      setFilteredData(filtered);
    }
  }, [selectedColumn, filterValue, csvData]);

  const handleColumnSelection = (column) => {
    setSelectedColumns((prevSelectedColumns) =>
      prevSelectedColumns.includes(column)
        ? prevSelectedColumns.filter((col) => col !== column)
        : [...prevSelectedColumns, column]
    );
  };

  const exportFilteredCsv = () => {
    if (selectedColumns.length === 0) {
      alert("Debes seleccionar al menos una columna para exportar.");
      return;
    }

    const dataToExport = filteredData.length > 0 ? filteredData : csvData;
    const filteredWithSelectedColumns = dataToExport.map((row) =>
      selectedColumns.reduce((acc, column) => {
        acc[column] = row[column];
        return acc;
      }, {})
    );

    const csvString = d3.csvFormat(filteredWithSelectedColumns);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "exported_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const previewData = useMemo(() => {
    const data = filteredData.length > 0 ? filteredData : csvData;
    return data.slice(0, PREVIEW_ROWS);
  }, [filteredData, csvData]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cargador de CSV (hasta 1GB)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="w-full"
                id="csv-file"
              />
              <Label htmlFor="csv-file" className="cursor-pointer">
                <Upload className="h-6 w-6" />
                <span className="sr-only">Cargar CSV</span>
              </Label>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {columns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Filtrar Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="column-select">Seleccionar Columna:</Label>
                  <Select
                    onValueChange={setSelectedColumn}
                    value={selectedColumn}
                  >
                    <SelectTrigger id="column-select">
                      <SelectValue placeholder="Seleccionar columna" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-value">Valor del Filtro:</Label>
                  <Input
                    id="filter-value"
                    type="text"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    placeholder="Ingrese el valor del filtro"
                  />
                </div>
              </div>
              <Button onClick={handleFilter} className="w-full">
                <Filter className="mr-2 h-4 w-4" /> Aplicar Filtro
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {csvData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Vista Previa de Datos{" "}
              {filteredData.length > 0 ? "Filtrados" : "Cargados"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {columns.map((column) => (
                  <div key={column} className="flex items-center space-x-2">
                    <Checkbox
                      id={`column-${column}`}
                      checked={selectedColumns.includes(column)}
                      onCheckedChange={() => handleColumnSelection(column)}
                    />
                    <Label htmlFor={`column-${column}`}>{column}</Label>
                  </div>
                ))}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column}>{column}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell key={column}>{row[column]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-sm text-gray-500">
                Mostrando {previewData.length} de{" "}
                {filteredData.length || csvData.length} filas
              </div>
              <Button onClick={exportFilteredCsv} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Exportar Datos{" "}
                {filteredData.length > 0 ? "Filtrados" : "Cargados"} como CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
