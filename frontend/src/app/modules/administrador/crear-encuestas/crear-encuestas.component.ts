import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { SurveyService } from "src/app/services/survey/survey.service";
import { Router } from "@angular/router";
import { DatePipe } from '@angular/common';

@Component({
  selector: "app-crear-encuestas",
  templateUrl: "./crear-encuestas.component.html",
  styleUrls: ["./crear-encuestas.component.scss"],
})
export class CrearEncuestasComponent implements OnInit {
  createSurveyForm;

  optionsLength: Number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private surveyService: SurveyService
  ) {
    this.createSurveyForm = this.formBuilder.group({
      title: "",
      startDate: "",
      endDate: "",
      creationDate: new DatePipe('en-US').transform(Date.now(), 'yyyy-MM-dd'),
      description: "",
      questions: this.formBuilder.array([]),
    });
  }

  addNewQuestion(type) {
    let control = <FormArray>this.createSurveyForm.controls.questions;
    control.push(
      this.formBuilder.group({
        title: [""],
        type: type,
        // nested form array, you could also add a form group initially
        options: this.formBuilder.array([]),
      })
    );
    if (type != "OPEN") {
      let options = this.createSurveyForm.get("questions").controls[
        this.createSurveyForm.get("questions").controls.length - 1
      ].controls.options;
      this.addNewOption(options);
      this.addNewOption(options);
    }
  }

  deleteQuestion(index) {
    let control = <FormArray>this.createSurveyForm.controls.questions;
    control.removeAt(index);
  }

  addNewOption(control) {
    control.push(
      this.formBuilder.group({
        title: [""],
      })
    );
  }

  deleteOption(control, index) {
    control.removeAt(index);
  }

  createSurvey(surveyData) {
    // const newSurvey = JSON.stringify(surveyData);
    console.warn("Survey: ", surveyData);
    this.surveyService.addSurvey(surveyData).subscribe((_) => {
      this.router.navigateByUrl("/admin/listaEncuestas");
    });
  }

  ngOnInit(): void {
  }

  onSubmit(surveyData) {
    this.createSurvey(surveyData);
  }
}
