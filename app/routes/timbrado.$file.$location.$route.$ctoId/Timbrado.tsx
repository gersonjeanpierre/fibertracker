import { useNavigate, useOutletContext } from "@remix-run/react";
import { useState } from "react";
import { Cto } from "~/components/interface/Route";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TimbradoData } from "~/components/interface/Timbrado";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function TimbradoForm() {
  const navigate = useNavigate();
  const cto = useOutletContext<Cto>();
  const [formData, setFormData] = useState<TimbradoData>({
    cto: cto.cto || "",
    borne: "",
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
    potenciaAntes: 0,
    potenciaDespues: 0,
    potenciaCampo: 0,
    lineIdFinal: "",
    vnoCodeFinal: "",
    comentario: "",
    observacion: "",
    ctoEnCampo: "",
    zona: "",
    grupo: "",
    fecha: "",
    horaInicio: "",
    horaCierre: "",
    gestor: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Aquí puedes manejar el envío del formulario, por ejemplo, enviando los datos a una API
  };

  return (
    <Card className="w-full mt-3">
      <CardHeader>
        <CardTitle>Timbrados</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-3 space-y-4"
        >
          <div>
            <Label htmlFor="cto">CTO</Label>
            <Input
              id="cto"
              name="cto"
              value={formData.cto}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="borne">Borne</Label>
            <Input
              id="borne"
              name="borne"
              value={formData.borne}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="lineIdInicial">Line ID Inicial</Label>
            <Input
              id="lineIdInicial"
              name="lineIdInicial"
              value={formData.lineIdInicial}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="vnoCodeInicial">VNO Code Inicial</Label>
            <Input
              id="vnoCodeInicial"
              name="vnoCodeInicial"
              value={formData.vnoCodeInicial}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="olt">OLT</Label>
            <Input
              id="olt"
              name="olt"
              value={formData.olt}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="slot">Slot</Label>
            <Input
              id="slot"
              name="slot"
              value={formData.slot}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              name="port"
              value={formData.port}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="onuInicial">ONU Inicial</Label>
            <Input
              id="onuInicial"
              name="onuInicial"
              value={formData.onuInicial}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="estadoInicial">Estado Inicial</Label>
            <Select
              onValueChange={handleSelectChange("estadoInicial")}
              value={formData.estadoInicial}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el estado inicial" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cto-mal-estado">CTO MAL ESTADO</SelectItem>
                <SelectItem value="cto-robado">CTO ROBADO</SelectItem>
                <SelectItem value="arbol-arbusto-impide-acceso">
                  ARBOL/ARBUSTO IMPIDE ACCESO A CTO
                </SelectItem>
                <SelectItem value="riesgo-electrico">
                  RIESGO ELECTRICO
                </SelectItem>
                <SelectItem value="calle-angosta">CALLE ANGOSTA</SelectItem>
                <SelectItem value="carros-estacionados">
                  CARROS ESTACIONADOS
                </SelectItem>
                <SelectItem value="cto-vertical">CTO VERTICAL</SelectItem>
                <SelectItem value="escalera-no-alcanza-cto">
                  ESCALERA NO ALCANZA CTO
                </SelectItem>
                <SelectItem value="poste-mal-estado">
                  POSTE MAL ESTADO
                </SelectItem>
                <SelectItem value="problemas-con-vecinos">
                  PROBLEMAS CON VECINOS O MUNICIPIO
                </SelectItem>
                <SelectItem value="zona-de-mercado">ZONA DE MERCADO</SelectItem>
                <SelectItem value="techo-impide-acceso">
                  TECHO IMPIDE ACCESO
                </SelectItem>
                <SelectItem value="cto-en-fachada">CTO EN FACHADA</SelectItem>
                <SelectItem value="calle-con-pendiente">
                  CALLE CON PENDIENTE
                </SelectItem>
                <SelectItem value="via-con-transito">
                  VIA CON TRANSITO
                </SelectItem>
                <SelectItem value="calle-con-gradas">
                  CALLE CON GRADAS
                </SelectItem>
                <SelectItem value="desmonte-impide-acceso">
                  DESMONTE IMPIDE ACCESO
                </SelectItem>
                <SelectItem value="poste-impide-acceso">
                  POSTE IMPIDE ACCESO
                </SelectItem>
                <SelectItem value="zona-en-obra">ZONA EN OBRA</SelectItem>
                <SelectItem value="reja-impide-acceso">
                  REJA IMPIDE ACCESO
                </SelectItem>
                <SelectItem value="letrero-impide-acceso">
                  LETRERO IMPIDE ACCESO A CTO
                </SelectItem>
                <SelectItem value="puerto-no-detectado">
                  PUERTO NO DETECTADO
                </SelectItem>
                <SelectItem value="cochera-impide-acceso">
                  COCHERA IMPIDE ACCESO
                </SelectItem>
                <SelectItem value="zona-peligrosa">ZONA PELIGROSA</SelectItem>
                <SelectItem value="calle-con-desnivel">
                  CALLE CON DESNIVEL
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="onuFinal">ONU Final</Label>
            <Input
              id="onuFinal"
              name="onuFinal"
              value={formData.onuFinal}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="estadoEnCampoInicial">
              Estado en Campo Inicial
            </Label>
            <Select
              onValueChange={handleSelectChange("estadoEnCampoInicial")}
              value={formData.estadoEnCampoInicial}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="libre">LIBRE</SelectItem>
                <SelectItem value="ocupado">OCUPADO</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="estadoEnCampoFinal">Estado en Campo Final</Label>
            <Select
              onValueChange={handleSelectChange("estadoEnCampoFinal")}
              value={formData.estadoEnCampoFinal}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="libre">LIBRE</SelectItem>
                <SelectItem value="ocupado">OCUPADO</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="potenciaAntes">Potencia Antes</Label>
            <Input
              id="potenciaAntes"
              name="potenciaAntes"
              type="number"
              value={formData.potenciaAntes}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="potenciaDespues">Potencia Después</Label>
            <Input
              id="potenciaDespues"
              name="potenciaDespues"
              type="number"
              value={formData.potenciaDespues}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="potenciaCampo">Potencia Campo</Label>
            <Input
              id="potenciaCampo"
              name="potenciaCampo"
              type="number"
              value={formData.potenciaCampo}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="lineIdFinal">Line ID Final</Label>
            <Input
              id="lineIdFinal"
              name="lineIdFinal"
              value={formData.lineIdFinal}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="vnoCodeFinal">VNO Code Final</Label>
            <Input
              id="vnoCodeFinal"
              name="vnoCodeFinal"
              value={formData.vnoCodeFinal}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="comentario">Comentario</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el estado final" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ok">OK</SelectItem>
                <SelectItem value="conector-acometida-observado-averiado">
                  CONECTOR ACOMETIDA OBSERVADO/AVERIADO
                </SelectItem>
                <SelectItem value="libre">LIBRE</SelectItem>
                <SelectItem value="cto-sin-acceso">CTO SIN ACCESO</SelectItem>
                <SelectItem value="puerto-cto-observado-averiado">
                  PUERTO DE CTO OBSERVADO/AVERIADO
                </SelectItem>
                <SelectItem value="no-refleja">NO REFLEJA</SelectItem>
                <SelectItem value="revision-casa-cliente">
                  REVISION CASA CLIENTE
                </SelectItem>
                <SelectItem value="borne-atascado">BORNE ATASCADO</SelectItem>
                <SelectItem value="cto-no-ubicado">CTO NO UBICADO</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="observacion">Observación</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el estado inicial" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cto-mal-estado">CTO MAL ESTADO</SelectItem>
                <SelectItem value="cto-robado">CTO ROBADO</SelectItem>
                <SelectItem value="arbol-arbusto-impide-acceso">
                  ARBOL/ARBUSTO IMPIDE ACCESO A CTO
                </SelectItem>
                <SelectItem value="riesgo-electrico">
                  RIESGO ELECTRICO
                </SelectItem>
                <SelectItem value="calle-angosta">CALLE ANGOSTA</SelectItem>
                <SelectItem value="carros-estacionados">
                  CARROS ESTACIONADOS
                </SelectItem>
                <SelectItem value="cto-vertical">CTO VERTICAL</SelectItem>
                <SelectItem value="escalera-no-alcanza-cto">
                  ESCALERA NO ALCANZA CTO
                </SelectItem>
                <SelectItem value="poste-mal-estado">
                  POSTE MAL ESTADO
                </SelectItem>
                <SelectItem value="problemas-con-vecinos">
                  PROBLEMAS CON VECINOS O MUNICIPIO
                </SelectItem>
                <SelectItem value="zona-de-mercado">ZONA DE MERCADO</SelectItem>
                <SelectItem value="techo-impide-acceso">
                  TECHO IMPIDE ACCESO
                </SelectItem>
                <SelectItem value="cto-en-fachada">CTO EN FACHADA</SelectItem>
                <SelectItem value="calle-con-pendiente">
                  CALLE CON PENDIENTE
                </SelectItem>
                <SelectItem value="via-con-transito">
                  VIA CON TRANSITO
                </SelectItem>
                <SelectItem value="calle-con-gradas">
                  CALLE CON GRADAS
                </SelectItem>
                <SelectItem value="desmonte-impide-acceso">
                  DESMONTE IMPIDE ACCESO
                </SelectItem>
                <SelectItem value="poste-impide-acceso">
                  POSTE IMPIDE ACCESO
                </SelectItem>
                <SelectItem value="zona-en-obra">ZONA EN OBRA</SelectItem>
                <SelectItem value="reja-impide-acceso">
                  REJA IMPIDE ACCESO
                </SelectItem>
                <SelectItem value="letrero-impide-acceso">
                  LETRERO IMPIDE ACCESO A CTO
                </SelectItem>
                <SelectItem value="puerto-no-detectado">
                  PUERTO NO DETECTADO
                </SelectItem>
                <SelectItem value="cochera-impide-acceso">
                  COCHERA IMPIDE ACCESO
                </SelectItem>
                <SelectItem value="zona-peligrosa">ZONA PELIGROSA</SelectItem>
                <SelectItem value="calle-con-desnivel">
                  CALLE CON DESNIVEL
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ctoEnCampo">CTO en Campo</Label>
            <Input
              id="ctoEnCampo"
              name="ctoEnCampo"
              value={formData.ctoEnCampo}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="zona">Zona</Label>
            <Input
              id="zona"
              name="zona"
              value={formData.zona}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="grupo">Grupo</Label>
            <Input
              id="grupo"
              name="grupo"
              value={formData.grupo}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="horaInicio">Hora Inicio</Label>
            <Input
              id="horaInicio"
              name="horaInicio"
              type="time"
              value={formData.horaInicio}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="horaCierre">Hora Cierre</Label>
            <Input
              id="horaCierre"
              name="horaCierre"
              type="time"
              value={formData.horaCierre}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="gestor">Gestor</Label>
            <Input
              id="gestor"
              name="gestor"
              value={formData.gestor}
              onChange={handleInputChange}
            />
          </div>
          <Button type="submit">Enviar</Button>
        </form>
      </CardContent>
    </Card>
  );
}
