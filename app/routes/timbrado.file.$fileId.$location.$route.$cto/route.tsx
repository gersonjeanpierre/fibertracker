import { Form, useFetcher, useParams } from "@remix-run/react";
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
import { Cto, ExcelTimbradoCto } from "~/interface/timbrado";
import { DataBornes } from "../../interface/timbrado";
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

const CtoContent = () => {
  const { data, setData } = useTimbrado();
  const fetcher = useFetcher();
  const { fileId, location, route, cto } = useParams();

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
      bornes.push(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
    }
    if (formData.oltA && formData.slotA && formData.portA) {
      bornes.push(1, 2, 3, 4, 5, 6, 7, 8);
    }
    if (formData.oltB && formData.slotB && formData.portB) {
      bornes.push(9, 10, 11, 12, 13, 14, 15, 16);
    }
    return bornes;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetcher.load("/");
    const updatedData = await updateCtoData(fileId || "", cto || "", formData);
    setData(updatedData);
    resetForm();
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
        bornes: [],
      });
    }
  }, [cto, data, location, route]);

  const sinAccesoData = () => {
    // DataBornes
    const bornes: DataBornes[] = [];
    for (let i = 0; i < activeBornes().length; i++) {
      bornes.push({
        borne: formData.activeBornes[i],
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
    }
    return bornes;
  };
  //ExcelTimbradoCto
  const excelTimbradoDataCto = () => {
    console.log("ACTIVOS BORNES", activeBornes());
    const excelData: ExcelTimbradoCto[] = [];
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
        gestor: "Gerson Salas",
      });
    }
    return excelData;
  };

  const handleCopiarExcel = () => {
    console.log("Copiar a excel");
    console.log(excelTimbradoDataCto());
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
                  setFormData((prev) => ({ ...prev, state: value }))
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
                value={formData.cto_campo}
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
                value={formData.divisor}
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

            <div className="flex mt-4">
              <div>
                <Label htmlFor="oltA">OLT Lado A</Label>
                <Input
                  id="oltA"
                  placeholder="OLT"
                  value={formData.oltA || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, oltA: e.target.value }))
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
                      slotA: Number(e.target.value),
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
                      portA: Number(e.target.value),
                    }));
                  }}
                  disabled={formData.state == "SIN ACCESO"}
                />
              </div>
            </div>
            <div className="flex mt-4">
              <div>
                <Label htmlFor="oltB">OLT Lado B</Label>
                <Input
                  id="oltB"
                  placeholder="OLT"
                  value={formData.oltB || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, oltB: e.target.value }))
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
                      slotB: Number(e.target.value),
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
                      portB: Number(e.target.value),
                    }));
                  }}
                  disabled={formData.state == "SIN ACCESO"}
                />
              </div>
            </div>
            <Button className="mt-4">Guardar</Button>
          </CardContent>
        </Card>
      </Form>
      <Card>
        <CardHeader>
          <CardTitle>Bornes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline">1</Button>
          </div>
          <Button id="btnClipboard" onClick={handleCopiarExcel}>
            Copiar a excel
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default CtoContent;
