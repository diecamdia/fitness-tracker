import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { UIService } from './../shared/ui.service';
import { take } from 'rxjs/operators';
import { Exercise } from "./exercise.model";
import { AngularFirestore } from 'angularfire2/firestore';

import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';

@Injectable()
export class TrainingService {
  private fsSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fsSubs.push(this.db
      .collection('availabeExercises')
      .snapshotChanges()
      .map(docArray => {
        // throw(new Error());
        return docArray.map( doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data().name,
            duration: doc.payload.doc.data().duration,
            calories: doc.payload.doc.data().calories
          };
        });
      })
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
        this.store.dispatch(new UI.StopLoading());
  }, error => {
        this.uiService.showSnackbar('Fectchiing Exercises failed, please retry more later.',null,3000);
        this.store.dispatch(new Training.SetAvailableTrainings([]));
      }));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDataBase({ ...ex,
        date: new Date(),
        state: 'completed'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDataBase({ ...ex,
        duration: ex.duration * (progress /100),
        calories: ex.calories * (progress/100),
        date: new Date(),
        state: 'cancelled'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  startExercise(selectedId: string) {
    //this.db.doc('availabeExercises/' + selectedId).update({lastSelected: new Date()});
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  fetchCompletedOrCancelledExercises() {
    this.fsSubs.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new Training.SetFinishedTrainings(exercises));
      }));
  }

  cancelSubscriptions() {
    if (this.fsSubs) {
      this.fsSubs.forEach(subscription => subscription.unsubscribe());
    }
  }

  private addDataToDataBase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
