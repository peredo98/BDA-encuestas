import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";

import { AuthGuard } from "./guards/auth.guard";
import { from } from "rxjs";

const routes: Routes = [
  { path: "", loadChildren: "./modules/usuario/usuario.module#UsuarioModule" },
  {
    path: "admin",
    loadChildren:
      "./modules/administrador/administrador.module#AdministradorModule",
  },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
