import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router"; // CLI imports router
import { EstadisticasAdminComponent } from "./estadisticas-admin/estadisticas-admin.component";
import { EncuestasAdminComponent } from "./encuestas-admin/encuestas-admin.component";
import { ListaEncuestasAdminComponent } from "./lista-encuestas-admin/lista-encuestas-admin.component";
import { PageNotFoundComponent } from "src/app/page-not-found/page-not-found.component";
import { CrearEncuestasComponent } from "./crear-encuestas/crear-encuestas.component";

const routes: Routes = [
  {
    path: "",
    component: CrearEncuestasComponent,
    data: { animation: "isCrearEncuestas" },
  },
  {
    path: "estadisticas/:id",
    component: EstadisticasAdminComponent,
    data: { animation: "isEstadisticas" },
  },
  {
    path: "listaEncuestas",
    component: ListaEncuestasAdminComponent,
    data: { animation: "isListaEncuestas" },
  },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministradorRoutingModule {}
