import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'bubbles',
        loadChildren: () => import('./bubbles/bubbles.module').then( m => m.BubblesPageModule)
      },
      {
        path: 'actions',
        loadChildren: () => import('./actions/actions.module').then( m => m.ActionsPageModule)
      },
      {
        path: 'scenarios',
        loadChildren: () => import('./scenarios/scenarios.module').then( m => m.ScenariosPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/bubbles',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/bubbles',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
