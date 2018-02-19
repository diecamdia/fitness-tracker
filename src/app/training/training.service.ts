import { UIService } from './../shared/ui.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Exercise } from "./exercise.model";
import { AngularFirestore } from 'angularfire2/firestore';

import * as fromRoot from '../app.reducer';
import * as fromApp from '../shared/ui.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private exercises: Exercise[] = [];
  private fsSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  fetchAvailableExercises() {
    this.store.dispatch(new fromApp.StartLoading());
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
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
        this.store.dispatch(new fromApp.StopLoading());
  }, error => {
        this.uiService.showSnackbar('Fectchiing Exercises failed, please retry more later.',null,3000);
        this.exercisesChanged.next(null);
        this.store.dispatch(new fromApp.StopLoading());
      }));
  }

  completeExercise() {
    this.addDataToDataBase({ ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDataBase({ ...this.runningExercise,
      duration: this.runningExercise.duration * (progress /100),
      calories: this.runningExercise.calories * (progress/100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  startExercise(selectedId: string) {
    //this.db.doc('availabeExercises/' + selectedId).update({lastSelected: new Date()});
    this.runningExercise = this.availableExercises.find( ex => ex.id === selectedId);
    this.exerciseChanged.next({...this.runningExercise});
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  fetchCompletedOrCancelledExercises() {
    this.fsSubs.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
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
