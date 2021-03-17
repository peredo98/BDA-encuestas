import { Component, OnInit } from "@angular/core";
import { Survey } from "src/app/models/survey.model";
import { SurveyService } from "src/app/services/survey/survey.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Route } from "@angular/compiler/src/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-contestar-encuesta",
  templateUrl: "./contestar-encuesta.component.html",
  styleUrls: ["./contestar-encuesta.component.scss"],
})
export class ContestarEncuestaComponent implements OnInit {
  survey: Survey;
  sub;
  selectedOptions: String[] = [];
  openAnswers: Record<string, String> = {};

  constructor(
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private surveyService: SurveyService
  ) {}

  ngOnInit(): void {
    this.sub = this._Activatedroute.paramMap.subscribe((params) => {
      var id = params.get("id");
      this.getSurveyById(id);
    });
  }

  getSurveyById(id: String) {
    this.surveyService.getSurveyByID(id).subscribe((survey) => {
      this.survey = survey;
      console.log(this.survey);
    });
  }

  AnswerSurvey() {
    this.surveyService
      .addVotes(this.survey, this.selectedOptions)
      .subscribe((_) => {
        this.router.navigateByUrl("/");
      });
  }

  onItemChange(value: String, checked: boolean, event) {
    console.log(event);
    console.log(" Value is : ", value);
    console.log(" Check is : ", checked);

    if (checked) {
      if (!this.selectedOptions.includes(value)) {
        this.selectedOptions.push(value);
      }
    } else {
      var index = this.selectedOptions.indexOf(value);
      if (index !== -1) {
        this.selectedOptions.splice(index, 1);
      }
    }

    console.log(this.selectedOptions);
  }

  onItemChangeMulti(value: String, checked: boolean) {
    console.log(" Value is : ", value);
    console.log(" Check is : ", checked);

    if (checked) {
      if (!this.selectedOptions.includes(value)) {
        this.selectedOptions.push(value);
      }
    } else {
      var index = this.selectedOptions.indexOf(value);
      if (index !== -1) {
        this.selectedOptions.splice(index, 1);
      }
    }

    console.log(this.selectedOptions);
  }

  onTextChange(value: String, id: String) {
    console.log(this.openAnswers);
    let key = `${id}`;
    this.openAnswers[key] = value;
  }

  onSubmit() {
    Object.values(this.openAnswers).forEach((element: String) => {
      this.selectedOptions.push(element);
    });
    this.AnswerSurvey();
  }
}
