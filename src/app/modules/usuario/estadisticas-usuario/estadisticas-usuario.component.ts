import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Survey } from 'src/app/models/survey.model';
import { SurveyService} from 'src/app/services/survey/survey.service';
@Component({
  selector: 'app-estadisticas-usuario',
  templateUrl: './estadisticas-usuario.component.html',
  styleUrls: ['./estadisticas-usuario.component.scss']
})
export class EstadisticasUsuarioComponent implements OnInit {
  survey: Survey;
  sub;

  constructor(private _Activatedroute:ActivatedRoute,
    private _router:Router, private surveyService: SurveyService){
  }

  ngOnInit(): void {
    this.sub = this._Activatedroute.paramMap.subscribe(params => { 
        var id = params.get('id'); 
        this.getSurveyById(id);
    });
  }

  getSurveyById(id: String) {
    this.surveyService.getSurveyByID(id).subscribe(survey => {
      this.survey = survey;
      console.log(this.survey);
    });
  }
}
