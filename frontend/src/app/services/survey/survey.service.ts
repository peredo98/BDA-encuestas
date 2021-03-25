import { Injectable } from '@angular/core';
import {Observable, of, throwError } from 'rxjs';
import { Survey } from 'src/app/models/survey.model';
import { Question } from 'src/app/models/question.model';
import { Option } from 'src/app/models/option.model';

import {HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {map, catchError, tap} from 'rxjs/operators'

  @Injectable({
    providedIn: 'root'
  })
  export class SurveyService {

    endpoint = 'http://localhost:8080/api/surveys';
    surveys:Survey[];

    headerDict = {
      'Content-Type': 'application/json',
        Accept: '*/*',
        'Access-Control-Allow-Origin': '*',
    }
      
    requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    }; 

    handleError(error: HttpErrorResponse){
      let errorMessage = "Unknown error!";
      if(error.error instanceof ErrorEvent){
        errorMessage = `Error: ${error.error.message}`;
      }else{
        errorMessage = `Error Code: ${error.status}\nMessage:${error.message}`;
      }
      window.alert(errorMessage);
      return throwError(errorMessage);
    }

      getSurveys():Observable<any>{

        return this.http
        .get(this.endpoint, this.requestOptions);
        // .pipe(map(this.extractData), retry(3), catchError(this.handleError));
      }

      getSurveyByID(id: String){ 

        return this.http
        .get(this.endpoint + '/' + id, this.requestOptions);
      }

      deleteSurvey(survey: Survey){
        this.http
        .delete(this.endpoint + '/' + survey._id, this.requestOptions).subscribe(_ => { 
          this.surveys.forEach( (item, index) => {
            if(item._id == survey._id) this.surveys.splice(index,1);
          });
        });
      }

      toggleSurvey(survey: Survey){

        this.http.put(this.endpoint + '/' + survey._id + '/turn', this.requestOptions).subscribe(_ => {
          survey.isPublish = !survey.isPublish
        })
      }

      toggleResults(survey: Survey){

        this.http.put(this.endpoint + '/' + survey._id + '/results', this.requestOptions).subscribe(_ => {
          survey.resultsPublish = !survey.resultsPublish
        })
      }


      addVotes(survey: Survey, selectedOptions, userId){

        let obj = {};
        obj = {"selectedOptions" : selectedOptions, "userId" : userId};
        console.log(obj);
        const body = JSON.stringify(obj, null, 1);

        console.log(body);

        return this.http.put(this.endpoint + '/' + survey._id + '/addVotes', body ,this.requestOptions);
      }

      
      addSurvey(newSurvey: String){

        const survey = JSON.stringify(newSurvey);

        console.log(survey);

        return this.http.post<Survey>(this.endpoint, survey, this.requestOptions);
      }

      constructor(private http: HttpClient) { 

      }
    }
