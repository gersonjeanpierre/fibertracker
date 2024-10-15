export interface Department {
  department: string;
  routes: Route[];
}

export interface Route {
  route: string;
  gestor: string;
  tecnico: string;
  ctos: Cto[];
}

export interface Cto {
  cto: string;
  state: string;
  observation: string;
  cto_campo: string;
  divisor: string;
  mcomentario: string;
  mcomentario_2: string;
  oltA: string;
  slotA: string;
  portA: string;
  oltB: string;
  slotB: string;
  portB: string;
  activeBornes: Array<number>;
  bornes?: DataBornes[];
}

export interface DataBornes {
  borne: number;
  lineIdInicial: string;
  vnoCodeInicial: string;
  olt: string;
  slot: string;
  port: string;
  onuInicial: number;
  estadoInicial: string;
  onuFinal: number;
  estadoEnCampoInicial: string;
  estadoEnCampoFinal: string;
  potenciaAntes: number;
  potenciaDespues: number;
  potenciaCampo: number;
  lineIdFinal: string;
  vnoCodeFinal: string;
  comentario: string;
  ctoEnCampo: string;
}
export interface ExcelTimbradoCto {
  cto: string;
  borne: number;
  lineIdInicial: string;
  vnoCodeInicial: string;
  olt: string;
  slot: number;
  port: number;
  onuInicial: number;
  estadoInicial: string;
  onuFinal: number;
  estadoEnCampoInicial: string;
  estadoEnCampoFinal: string;
  potenciaAntes: number;
  potenciaDespues: number;
  potenciaCampo: number;
  lineIdFinal: string;
  vnoCodeFinal: string;
  comentario: string;
  observacion: string;
  ctoEnCampo: string;
  zona: string;
  grupo: string;
  fecha: string;
  horaInicio: string;
  horaCierre: string;
  gestor: string;
}
