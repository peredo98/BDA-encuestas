import { Component, OnInit } from '@angular/core';
import { Survey } from 'src/app/models/survey.model';
import { SurveyService} from 'src/app/services/survey/survey.service';
@Component({
  selector: 'app-encuestas-usuario',
  templateUrl: './encuestas-usuario.component.html',
  styleUrls: ['./encuestas-usuario.component.scss']
})
export class EncuestasUsuarioComponent implements OnInit {

  surveys: Survey[];

  constructor(private surveyService: SurveyService) {
   }

  ngOnInit(): void {
    this.getSurveys();
  }

  getSurveys(){
    this.surveyService.getSurveys().subscribe(surveys =>{
      console.log(surveys);
      this.surveys = surveys;
    });
  }
}
