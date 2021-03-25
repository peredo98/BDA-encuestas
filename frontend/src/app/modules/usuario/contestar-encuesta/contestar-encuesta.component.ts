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
  selectedOptions = [];
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
      this.survey.questions.forEach((question) => {
        this.selectedOptions.push({"questionId": question._id, "options": []});
      });
      console.log(this.survey);
    });
  }

  AnswerSurvey() {
    // TODO: replace '1' with real user ID
    this.surveyService
      .addVotes(this.survey, this.selectedOptions, '1') //'1' is user ID 
      .subscribe((_) => {
        this.router.navigateByUrl("/");
      });
  }

  onItemChangeMulti(value: String, checked: boolean, id: String) {
    this.selectedOptions.forEach((answer) => {
      if(answer.questionId == id){
        let options = answer.options;
        if (checked) {
          if (!options.includes(value)) {
            options.push(value);
          }
        } else {
          var index = options.indexOf(value);
          if (index !== -1) {
            options.splice(index, 1);
          }
        }  
      }
    });
  }

  onTextChange(value: String, id: String) {
    this.selectedOptions.forEach((answer) => {
      if(answer.questionId == id){
        answer.options = [value];
      }
    });
  }

  onSubmit() {
    console.log(this.selectedOptions)
    this.AnswerSurvey();
  }
}
