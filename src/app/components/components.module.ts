import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResumeComponent } from './resume/resume.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MainComponent } from './main/main.component'

@NgModule({
  declarations: [
    ListComponent,
    ResumeComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgApexchartsModule
  ],
  exports: [
    ListComponent,
    ResumeComponent,
    MainComponent
  ]
})
export class ComponentsModule { }
