import {
  Form,
  Outlet,
  useFetcher,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useTimbrado } from "~/context/TimbaContetext";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { updateCtoData } from "~/service/data-excel";
import { findCto, obtenerFechaHoy, obtenerHoraActual } from "./cto-util";
import { Cto, DataBornes, ExcelTimbradoCto } from "~/interface/timbrado";
import { Checkbox } from "~/components/ui/checkbox";
import { set } from "react-hook-form";

const CtoContent = () => {
  const { data, setData } = useTimbrado();
  const { fileId, location, route, cto } = useParams();
  const [isLadoAChecked, setIsLadoAChecked] = useState(false);
  const [isLadoBChecked, setIsLadoBChecked] = useState(false);

  const [formData, setFormData] = useState<Cto>({
    cto: cto || "",
    state: "",
    observation: "",
    cto_campo: "",
    divisor: "",
    mcomentario: "",
    mcomentario_2: "",
    oltA: "",
    slotA: "",
    portA: "",
    oltB: "",
    slotB: "",
    portB: "",
    activeBornes: [],
    bornes: [],
  });

  const activeBornes = () => {
    const bornes = [];
    if (formData.state === "SIN ACCESO") {
      bornes.push(...Array.from({ length: 16 }, (_, i) => i + 1)); // Agrega los 16 bornes directamente
    }
    if (formData.oltA && formData.slotA && formData.portA) {
      bornes.push(...Array.from({ length: 8 }, (_, i) => i + 1)); // Lado A: Bornes 1-8
    }
    if (formData.oltB && formData.slotB && formData.portB) {
      bornes.push(...Array.from({ length: 8 }, (_, i) => i + 9)); // Lado B: Bornes 9-16
    }
    return bornes;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const activeBornesData: number[] = activeBornes();
    const sinAD: DataBornes[] = sinAccesoData();
    const bornes: DataBornes[] = bornesArray();

    if (!formData.state) {
      setFormData((prev) => ({
        ...prev,
        activeBornes: activeBornesData,
        bornes: formData.state === "SIN ACCESO" ? sinAD : bornes,
      }));

      const updatedData = await updateCtoData(fileId || "", cto || "", {
        ...formData,
        activeBornes: activeBornesData,
        bornes: formData.state === "SIN ACCESO" ? sinAD : bornes,
      });
      setData(updatedData);
      resetForm();
    }

    setFormData((prev) => ({
      ...prev,
      activeBornes: activeBornesData,
    }));
    const updatedData = await updateCtoData(fileId || "", cto || "", {
      ...formData,
      activeBornes: activeBornesData,
    });
    setData(updatedData);
    resetForm();
  };

  const bornesArray = () => {
    const bornes: DataBornes[] = [];
    for (let i = 0; i < activeBornes().length; i++) {
      if (i >= 0 && i <= 7) {
        bornes.push({
          borne: i + 1,
          lineIdInicial: "",
          vnoCodeInicial: "",
          olt: formData.oltA,
          slot: formData.slotA,
          port: formData.portA,
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
      } else {
        bornes.push({
          borne: i + 1,
          lineIdInicial: "",
          vnoCodeInicial: "",
          olt: formData.oltB,
          slot: formData.slotB,
          port: formData.portB,
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
      }
    }
    return bornes;
  };

  const resetForm = () => {
    setFormData({
      cto: "",
      state: "",
      observation: "",
      cto_campo: "",
      divisor: "",
      mcomentario: "",
      mcomentario_2: "",
      oltA: "",
      slotA: "",
      portA: "",
      oltB: "",
      slotB: "",
      portB: "",
      activeBornes: [],
      bornes: [],
    });
  };

  useEffect(() => {
    const ctoFind = findCto(data, location, route, cto);
    if (ctoFind) {
      setFormData({
        cto: cto || "",
        state: ctoFind.state || "",
        observation: ctoFind.observation || "",
        cto_campo: ctoFind.cto_campo || "",
        divisor: ctoFind.divisor || "",
        mcomentario: ctoFind.mcomentario || "",
        mcomentario_2: ctoFind.mcomentario_2 || "",
        oltA: ctoFind.oltA || "",
        slotA: ctoFind.slotA || "",
        portA: ctoFind.portA || "",
        oltB: ctoFind.oltB || "",
        slotB: ctoFind.slotB || "",
        portB: ctoFind.portB || "",
        activeBornes: ctoFind.activeBornes || [],
        bornes: ctoFind.bornes || [],
      });
    }
  }, [cto, data, location, route]);

  const sinAccesoData = () => {
    // DataBornes
    const bornes: DataBornes[] = [];
    for (let i = 0; i < activeBornes().length; i++) {
      bornes.push({
        borne: i + 1,
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
        comentario: formData.state,
        ctoEnCampo: "",
      });
    }
    console.log("BORNES SIN ACCESO", bornes);
    return bornes;
  };

  //ExcelTimbradoCto
  const excelTimbradoDataCto = () => {
    const excelData: ExcelTimbradoCto[] = [];
    // if (excelData.length === 0) {
    //   console.error("No hay datos para copiar");
    //   return;
    // }

    for (let i = 0; i < activeBornes().length; i++) {
      excelData.push({
        cto: formData.cto,
        borne: i + 1,
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
        comentario: formData.state,
        observacion: formData.observation,
        ctoEnCampo: "",
        zona: location || "",
        grupo: route || "",
        fecha: obtenerFechaHoy(),
        horaInicio: "9:00",
        horaCierre: obtenerHoraActual(),
        gestor: localStorage.getItem("gestor") || "",
      });
    }

    // Convertir excelData a un formato TSV
    const headers = Object.keys(excelData[0]).join("\t");
    const rows = excelData
      .map((obj) => Object.values(obj).join("\t"))
      .join("\n");
    const tsvData = `${headers}\n${rows}`;

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

  const handleCopiarExcel = async () => {
    console.log("Copiar a excel");
    console.log(excelTimbradoDataCto());
  };

  const navigate = useNavigate();
  const handleBorne = (borne: string) => {
    navigate(`./${borne}`);
  };

  return (
    <>
      <Form
        method="post"
        onSubmit={handleSubmit}
        className="col-span-2 flex gap-3 w-full"
      >
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="cto">CTO</Label>
              <Input type="text" name="cto" value={formData.cto} disabled />
              <Label htmlFor="estado_cto">Estado CTO</Label>
              <Select
                value={formData.state}
                onValueChange={(value: string) =>
                  setFormData((prev) => ({
                    ...prev,
                    state: value,
                    observation: "",
                  }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el estado inicial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN PROCESO">EN PROCESO</SelectItem>
                  <SelectItem value="SIN ACCESO">SIN ACCESO</SelectItem>
                  <SelectItem value="TIMBRADO">TIMBRADO</SelectItem>
                  <SelectItem value="NO TIMBRADO">NO TIMBRADO</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="observacion">Observación</Label>
              <Select
                value={formData.observation}
                onValueChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, observation: value }))
                }
                disabled={formData.state !== "SIN ACCESO"} // Habilitar solo si es "SIN ACCESO"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una observación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CTO MAL ESTADO">CTO MAL ESTADO</SelectItem>
                  <SelectItem value="CTO ROBADO">CTO ROBADO</SelectItem>
                  <SelectItem value="ARBOL/ARBUSTO IMPIDE ACCESO A CTO">
                    ARBOL/ARBUSTO IMPIDE ACCESO A CTO
                  </SelectItem>
                  <SelectItem value="RIESGO ELECTRICO">
                    RIESGO ELECTRICO
                  </SelectItem>
                  <SelectItem value="CALLE ANGOSTA">CALLE ANGOSTA</SelectItem>
                  <SelectItem value="CARROS ESTACIONADOS">
                    CARROS ESTACIONADOS
                  </SelectItem>
                  <SelectItem value="CTO VERTICAL">CTO VERTICAL</SelectItem>
                  <SelectItem value="ESCALERA NO ALCANZA CTO">
                    ESCALERA NO ALCANZA CTO
                  </SelectItem>
                  <SelectItem value="POSTE MAL ESTADO">
                    POSTE MAL ESTADO
                  </SelectItem>
                  <SelectItem value="PROBLEMAS CON VECINOS O MUNICIPIO">
                    PROBLEMAS CON VECINOS O MUNICIPIO
                  </SelectItem>
                  <SelectItem value="ZONA DE MERCADO">
                    ZONA DE MERCADO
                  </SelectItem>
                  <SelectItem value="TECHO IMPIDE ACCESO">
                    TECHO IMPIDE ACCESO
                  </SelectItem>
                  <SelectItem value="CTO EN FACHADA">CTO EN FACHADA</SelectItem>
                  <SelectItem value="CALLE CON PENDIENTE">
                    CALLE CON PENDIENTE
                  </SelectItem>
                  <SelectItem value="VIA CON TRANSITO">
                    VIA CON TRANSITO
                  </SelectItem>
                  <SelectItem value="CALLE CON GRADAS">
                    CALLE CON GRADAS
                  </SelectItem>
                  <SelectItem value="DESMONTE IMPIDE ACCESO">
                    DESMONTE IMPIDE ACCESO
                  </SelectItem>
                  <SelectItem value="POSTE IMPIDE ACCESO">
                    POSTE IMPIDE ACCESO
                  </SelectItem>
                  <SelectItem value="ZONA EN OBRA">ZONA EN OBRA</SelectItem>
                  <SelectItem value="REJA IMPIDE ACCESO">
                    REJA IMPIDE ACCESO
                  </SelectItem>
                  <SelectItem value="LETRERO IMPIDE ACCESO A CTO">
                    LETRERO IMPIDE ACCESO A CTO
                  </SelectItem>
                  <SelectItem value="PUERTO NO DETECTADO">
                    PUERTO NO DETECTADO
                  </SelectItem>
                  <SelectItem value="COCHERA IMPIDE ACCESO">
                    COCHERA IMPIDE ACCESO
                  </SelectItem>
                  <SelectItem value="ZONA PELIGROSA">ZONA PELIGROSA</SelectItem>
                  <SelectItem value="CALLE CON DESNIVEL">
                    CALLE CON DESNIVEL
                  </SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="cto_campo">CTO Campo</Label>
              <Input
                type="text"
                name="cto_campo"
                value={
                  formData.state === "NO TIMBRADO" ? "" : formData.cto_campo
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cto_campo: e.target.value,
                  }))
                }
                placeholder="CTO Campo"
              />
              <Label htmlFor="divisor">Divisor</Label>
              <Input
                type="text"
                name="divisor"
                value={
                  formData.divisor === "NO TIMBRADO" ? "" : formData.divisor
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    divisor: e.target.value,
                  }))
                }
                placeholder="Divisor"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="w-1/2">
          <CardContent className="mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="mcomentario">Comentario</Label>
                <Input
                  id="mcomentario"
                  placeholder="Comentario"
                  value={formData.mcomentario}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mcomentario: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="mcomentario_2">Comentario 2</Label>
                <Input
                  id="mcomentario_2"
                  placeholder="Comentario 2"
                  value={formData.mcomentario_2}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mcomentario_2: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <Button onClick={handleSubmit}>Guardar</Button>
          </CardContent>
        </Card>
      </Form>
      {/* <ComboboxForm /> */}
      <Form method="post" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>OLT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ladoA"
                  checked={isLadoAChecked}
                  onCheckedChange={setIsLadoAChecked}
                />
                <Label htmlFor="ladoA">Lado A</Label>
              </div>
              {isLadoAChecked && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="oltA">OLT Lado A</Label>
                    <Input
                      id="oltA"
                      placeholder="OLT"
                      value={formData.oltA || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          oltA: e.target.value,
                        }))
                      }
                      disabled={formData.state == "SIN ACCESO"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="slotA">SLOT</Label>
                    <Input
                      id="slotA"
                      type="number"
                      value={formData.slotA || ""}
                      min={0}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          slotA: e.target.value,
                        }));
                      }}
                      disabled={formData.state == "SIN ACCESO"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="portA">PORT</Label>
                    <Input
                      id="portA"
                      type="number"
                      value={formData.portA || ""}
                      min={0}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          portA: e.target.value,
                        }));
                      }}
                      disabled={formData.state == "SIN ACCESO"}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ladoB"
                  checked={isLadoBChecked}
                  onCheckedChange={setIsLadoBChecked}
                />
                <Label htmlFor="ladoB">Lado B</Label>
              </div>
              {isLadoBChecked && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="oltB">OLT Lado B</Label>
                    <Input
                      id="oltB"
                      placeholder="OLT"
                      value={formData.oltB || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          oltB: e.target.value,
                        }))
                      }
                      disabled={formData.state == "SIN ACCESO"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="slotB">SLOT</Label>
                    <Input
                      id="slotB"
                      type="number"
                      value={formData.slotB || ""}
                      min={0}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          slotB: e.target.value,
                        }));
                      }}
                      disabled={formData.state == "SIN ACCESO"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="portB">PORT</Label>
                    <Input
                      id="portB"
                      type="number"
                      value={formData.portB || ""}
                      min={0}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          portB: e.target.value,
                        }));
                      }}
                      disabled={formData.state == "SIN ACCESO"}
                    />
                  </div>
                </div>
              )}
            </div>
            <Button className="mt-4" type="submit">
              Guardar
            </Button>
          </CardContent>
        </Card>
      </Form>

      <Card>
        <CardHeader>
          <CardTitle>Bornes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.activeBornes.map((borne) => (
              <Button
                key={borne}
                variant="outline"
                onClick={() => handleBorne(borne.toString())}
              >
                {borne}
              </Button>
            ))}
          </div>
          <Button id="btnClipboard" onClick={handleCopiarExcel}>
            Copiar a excel
          </Button>
        </CardContent>
      </Card>
      <Outlet />
    </>
  );
};

export default CtoContent;
