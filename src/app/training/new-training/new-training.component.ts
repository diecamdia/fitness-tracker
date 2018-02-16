import { AngularFirestore } from 'angularfire2/firestore';

import { TrainingService } from './../training.service';
import { Exercise } from './../exercise.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  exercises: Observable<Exercise[]>;

  constructor(private trainingService: TrainingService, private db: AngularFirestore) { }

  ngOnInit() {
    this.exercises = this.db
      .collection('availabeExercises')
      .snapshotChanges()
      .map(docArray => {
        return docArray.map( doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data().name,
            duration: doc.payload.doc.data().duration,
            calories: doc.payload.doc.data().calories
          };
        });
      });
  }

  onTrainingStart(form: NgForm){
    this.trainingService.startExercise(form.value.exercise);
  }
}
