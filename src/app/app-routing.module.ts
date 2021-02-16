import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'add-bubble',
    loadChildren: () => import('./popovers/add-bubble/add-bubble.module').then( m => m.AddBubblePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./popovers/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'document',
    loadChildren: () => import('./popovers/document/document.module').then( m => m.DocumentPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
