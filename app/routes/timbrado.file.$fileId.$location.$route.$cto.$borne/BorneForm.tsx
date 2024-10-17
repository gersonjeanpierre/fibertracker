import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Cto, DataBornes, ExcelTimbradoCto } from "~/interface/timbrado";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useTimbrado } from "~/context/TimbaContetext";
import { useParams } from "@remix-run/react";
import {
  findCto,
  obtenerFechaHoy,
  obtenerHoraActual,
} from "../timbrado.file.$fileId.$location.$route.$cto/cto-util";
import { updateCtoData, updateCtoDataBorne } from "~/service/data-excel";

export default function BorneForm() {
  const { data, setData } = useTimbrado();
  const { borne, route, location, cto, fileId } = useParams();

  const [formData, setFormData] = useState<DataBornes>({
    borne: borne ? parseInt(borne, 10) : 0,
    lineIdInicial: "",
    vnoCodeInicial: "",
    olt: "",
    slot: "",
    port: "",
    onuInicial: "",
    estadoInicial: "",
    onuFinal: "",
    estadoEnCampoInicial: "",
    estadoEnCampoFinal: "",
    potenciaAntes: "",
    potenciaDespues: "",
    potenciaCampo: "",
    lineIdFinal: "",
    vnoCodeFinal: "",
    comentario: "",
    ctoEnCampo: "",
  });

  useEffect(() => {
    const ctoFind: Cto = findCto(data, location, route, cto);
    if (ctoFind) {
      const borneNumber = borne ? parseInt(borne, 10) : 0;
      if (borneNumber >= 1 && borneNumber <= 8) {
        setFormData((prev) => ({
          ...prev,
          borne: borneNumber,
          olt: ctoFind.oltA,
          slot: ctoFind.slotA,
          port: ctoFind.portA,
          ctoEnCampo: ctoFind.cto_campo,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          borne: borneNumber,
          olt: ctoFind.oltB,
          slot: ctoFind.slotB,
          port: ctoFind.portB,
          ctoEnCampo: ctoFind.divisor,
        }));
      }
      setFormData((prev) => ({
        ...prev,
        estadoInicial:
          ctoFind.bornes &&
          borneNumber > 0 &&
          borneNumber <= ctoFind.bornes.length
            ? ctoFind.bornes[borneNumber - 1]?.estadoInicial || ""
            : "",
        onuFinal:
          ctoFind.bornes &&
          borneNumber > 0 &&
          borneNumber <= ctoFind.bornes.length
            ? parseInt(
                ctoFind.bornes[borneNumber - 1]?.onuFinal?.toString() || "",
                10
              )
            : "",
        estadoEnCampoInicial:
          ctoFind.bornes &&
          borneNumber > 0 &&
          borneNumber <= ctoFind.bornes.length
            ? ctoFind.bornes[borneNumber - 1]?.estadoEnCampoInicial || ""
            : "",
        estadoEnCampoFinal:
          ctoFind.bornes &&
          borneNumber > 0 &&
          borneNumber <= ctoFind.bornes.length
            ? ctoFind.bornes[borneNumber - 1]?.estadoEnCampoFinal || ""
            : "",
        potenciaAntes:
          ctoFind.bornes &&
          borneNumber > 0 &&
          borneNumber <= ctoFind.bornes.length
            ? ctoFind.bornes[borneNumber - 1]?.potenciaAntes || ""
            : "",
        potenciaDespues:
          ctoFind.bornes &&
          borneNumber > 0 &&
          borneNumber <= ctoFind.bornes.length
            ? ctoFind.bornes[borneNumber - 1]?.potenciaDespues || ""
            : "",
        potenciaCampo:
          ctoFind.bornes &&
          borneNumber > 0 &&
          borneNumber <= ctoFind.bornes.length
            ? ctoFind.bornes[borneNumber - 1]?.potenciaCampo || ""
            : "",
        lineIdFinal:
          ctoFind.bornes &&
          borneNumber > 0 &&
          borneNumber <= ctoFind.bornes.length
            ? ctoFind.bornes[borneNumber - 1]?.lineIdFinal || ""
            : "",
        vnoCodeFinal:
          ctoFind.bornes &&
          borneNumber > 0 &&
          borneNumber <= ctoFind.bornes.length
            ? ctoFind.bornes[borneNumber - 1]?.vnoCodeFinal || ""
            : "",
        comentario:
          ctoFind.bornes &&
          borneNumber > 0 &&
          borneNumber <= ctoFind.bornes.length
            ? ctoFind.bornes[borneNumber - 1]?.comentario || ""
            : "",
      }));
    }
  }, [data, location, route, cto, borne]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    const update = await updateCtoDataBorne(fileId, cto, {
      ...formData,
    });
    setData(update);
    console.log("##### DATA ACTUALIZADA #####################", data);
  };

  //ExcelTimbradoCto
  const excelTimbradoDataCto = () => {
    const ctoFind: Cto = findCto(data, location, route, cto);
    const excelData: ExcelTimbradoCto[] = [];
    // if (excelData.length === 0) {
    //   console.error("No hay datos para copiar");
    //   return;
    // }

    for (let i = 0; i < ctoFind.activeBornes.length; i++) {
      excelData.push({
        cto: ctoFind.cto,
        borne: i + 1,
        lineIdInicial: "",
        vnoCodeInicial: "",
        olt: i >= 0 && i <= 7 ? ctoFind.oltA : ctoFind.oltB,
        slot: i >= 0 && i <= 7 ? ctoFind.slotA : ctoFind.slotB,
        port: i >= 0 && i <= 7 ? ctoFind.portA : ctoFind.portB,
        onuInicial: "",
        estadoInicial: ctoFind.bornes[i]?.estadoInicial || "",
        onuFinal: ctoFind.bornes[i]?.onuFinal || "",
        estadoEnCampoInicial: ctoFind.bornes[i]?.estadoEnCampoInicial || "",
        estadoEnCampoFinal: ctoFind.bornes[i]?.estadoEnCampoFinal || "",
        potenciaAntes: parseFloat(ctoFind.bornes[i]?.potenciaAntes || "") || "",
        potenciaDespues:
          parseFloat(ctoFind.bornes[i]?.potenciaDespues || "") || "",
        potenciaCampo: parseFloat(ctoFind.bornes[i]?.potenciaCampo || "") || "",
        lineIdFinal: ctoFind.bornes[i]?.lineIdFinal || "",
        vnoCodeFinal: ctoFind.bornes[i]?.vnoCodeFinal || "",
        comentario: ctoFind.bornes[i]?.comentario || "",
        observacion: ctoFind.observation,
        ctoEnCampo: i >= 0 && i <= 7 ? ctoFind.cto_campo : ctoFind.divisor,
        zona: location || "",
        grupo: route || "",
        fecha: obtenerFechaHoy(),
        horaInicio: "9:00",
        horaCierre: obtenerHoraActual(),
        gestor: localStorage.getItem("gestor") || "",
      });
    }

    // Convertir excelData a un formato TSV
    // const headers = Object.keys(excelData[0]).join("\t");
    const rows = excelData
      .map((obj) => Object.values(obj).join("\t"))
      .join("\n");
    // const tsvData = `${headers}\n${rows}`;
    const tsvData = `${rows}`;

    // Copiar al portapapeles
    navigator.clipboard
      .writeText(tsvData)
      .then(() => {
        console.log("Datos copiados al portapapeles");
      })
      .catch((err) => {
        console.error("Error al copiar al portapapeles: ", err);
      });

    return excelData;
  };

  const renderInput = (
    label: string,
    name: keyof DataBornes,
    type: string = "text"
  ) => (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        min={name === "onuFinal" ? 0 : -30}
        max={
          name === "potenciaAntes" ||
          name === "potenciaCampo" ||
          name === "potenciaDespues"
            ? -10
            : 125
        }
        step={name === "onuFinal" ? 1 : 0.01}
        value={formData[name]}
        onChange={handleInputChange}
        disabled={
          name === "borne" ||
          name === "olt" ||
          name === "slot" ||
          name === "port"
        }
      />
    </div>
  );

  const renderSelect = (
    label: string,
    name: keyof DataBornes,
    options: { value: string; label: string }[]
  ) => (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Select onValueChange={handleSelectChange(name)} value={formData[name]}>
        <SelectTrigger>
          <SelectValue placeholder={`Seleccione ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Formulario de Borne</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInput("Borne", "borne")}
            {/* {renderInput("Line ID Inicial", "lineIdInicial")}
                {renderInput("VNO Code Inicial", "vnoCodeInicial")} */}
            <div className="grid grid-cols-3 gap-4">
              {renderInput("OLT", "olt")}
              {renderInput("Slot", "slot")}
              {renderInput("Port", "port")}
            </div>

            {/* {renderInput("ONU Inicial", "onuInicial")} */}
            {renderSelect("Estado Inicial", "estadoInicial", [
              { value: "libre", label: "LIBRE" },
              { value: "ocupado", label: "OCUPADO" },
            ])}
            {renderInput("ONU Final", "onuFinal", "number")}
            {renderSelect("Estado en Campo Inicial", "estadoEnCampoInicial", [
              { value: "libre", label: "LIBRE" },
              { value: "ocupado", label: "OCUPADO" },
            ])}
            {renderSelect("Estado en Campo Final", "estadoEnCampoFinal", [
              { value: "libre", label: "LIBRE" },
              { value: "ocupado", label: "OCUPADO" },
            ])}
            {renderInput("Potencia Antes", "potenciaAntes", "number")}
            {renderInput("Potencia Después", "potenciaDespues", "number")}
            {renderInput("Potencia Campo", "potenciaCampo", "number")}
            {renderInput("Line ID Final", "lineIdFinal")}
            {renderInput("VNO Code Final", "vnoCodeFinal")}
            {renderSelect("Comentario", "comentario", [
              { value: "OK", label: "OK" },
              {
                value: "CONECTOR ACOMETIDA OBSERVADO/AVERIADO",
                label: "CONECTOR ACOMETIDA OBSERVADO/AVERIADO",
              },
              { value: "LIBRE", label: "LIBRE" },
              { value: "CTO SIN ACCESO", label: "CTO SIN ACCESO" },
              {
                value: "PUERTO DE CTO OBSERVADO/AVERIADO",
                label: "PUERTO DE CTO OBSERVADO/AVERIADO",
              },
              { value: "NO REFLEJA", label: "NO REFLEJA" },
              {
                value: "REVISION CASA CLIENTE",
                label: "REVISION CASA CLIENTE",
              },
              { value: "BORNE ATASCADO", label: "BORNE ATASCADO" },
              { value: "CTO NO UBICADO", label: "CTO NO UBICADO" },
            ])}
          </div>

          <Button type="submit" className="w-full">
            Enviar
          </Button>
          <Button onClick={excelTimbradoDataCto}>Copiar</Button>
        </form>
      </CardContent>
    </Card>
  );
}
