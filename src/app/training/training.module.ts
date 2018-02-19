import { TrainingRoutingModule } from './training-routing.module';
import { NgModule } from '@angular/core';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { SharedModule } from '../shared/shared.module';

import { TrainingComponent } from './training.component';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingComponent } from './past-training/past-training.component';
import { StopTrainingComponent } from './current-training/stop-training.component';


@NgModule({
  imports: [
    SharedModule,
    AngularFirestoreModule,
    TrainingRoutingModule
  ],
  exports: [],
  declarations: [
    TrainingComponent,
    CurrentTrainingComponent,
    NewTrainingComponent,
    PastTrainingComponent,
    StopTrainingComponent
  ],
  providers: [],
  entryComponents: [StopTrainingComponent]
})
export class TrainingModule { }
