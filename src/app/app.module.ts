import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlashModule } from 'flash-text';
import { FormsModule }   from '@angular/forms';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { AuthGuard } from './auth.guard';

// Layout Routes
import { OnboardinglayoutComponent } from './layouts/onboardinglayout/onboardinglayout.component';
import { DashboardlayoutComponent } from './layouts/dashboardlayout/dashboardlayout.component';
// Onboarding Routes
import { AppheaderComponent } from './includes/appheader/appheader.component';
import { AppfooterComponent } from './includes/appfooter/appfooter.component';
import { AppmenuComponent } from './includes/appmenu/appmenu.component';
import { AppsettingsComponent } from './includes/appsettings/appsettings.component';
// Component pages routes
import { LoginComponent } from './components/login/login.component';
import { LockscreenComponent } from './components/lockscreen/lockscreen.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdduserComponent } from './components/adduser/adduser.component';
import { ManageuserComponent } from './components/manageuser/manageuser.component';
import { EdituserComponent } from './components/edituser/edituser.component';
import { ManageCategoryComponent } from './components/manage-category/manage-category.component';
import { ManageCoursesComponent } from './components/manage-courses/manage-courses.component';
import { ManageSubjectComponent } from './components/manage-subject/manage-subject.component';
import { ManageChaptersComponent } from './components/manage-chapters/manage-chapters.component';
import { ManageTopicsComponent } from './components/manage-topics/manage-topics.component';
import { ManageSubtopicsComponent } from './components/manage-subtopics/manage-subtopics.component';
import { AddExamComponent } from './components/add-exam/add-exam.component';
import { ManageExamComponent } from './components/manage-exam/manage-exam.component';



const routes: Routes = [
  {
    path: '',
    component: OnboardinglayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'lockscreen', component: LockscreenComponent },
    ]
  },
  {
    path: 'dashboard',
    component: DashboardlayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },

      { path: 'add-user', component: AdduserComponent },
      { path: 'edit-user/:id', component: EdituserComponent },
      { path: 'manage-user', component: ManageuserComponent },

      { path: 'manage-category', component: ManageCategoryComponent },
      { path: 'manage-courses', component: ManageCoursesComponent },
      { path: 'manage-subject', component: ManageSubjectComponent },
      { path: 'manage-chapters', component: ManageChaptersComponent },
      { path: 'manage-topics', component: ManageTopicsComponent },
      { path: 'manage-subtopics', component: ManageSubtopicsComponent },

      { path: 'add-exam', component: AddExamComponent },
      { path: 'manage-exam', component: ManageExamComponent },
      
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];


@NgModule({
  declarations: [
    AppComponent,
    OnboardinglayoutComponent,
    DashboardlayoutComponent,
    AppheaderComponent,
    AppfooterComponent,
    AppmenuComponent,
    AppsettingsComponent,
    LoginComponent,
    LockscreenComponent,
    DashboardComponent,
    AdduserComponent,
    ManageuserComponent,
    EdituserComponent,
    ManageCategoryComponent,
    ManageCoursesComponent,
    ManageSubjectComponent,
    ManageChaptersComponent,
    ManageTopicsComponent,
    ManageSubtopicsComponent,
    AddExamComponent,
    ManageExamComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    HttpClientModule,
    FlashModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
