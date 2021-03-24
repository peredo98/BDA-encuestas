import { Question } from "./question.model";

export class Survey {
  constructor(
    public _id?: string,
    public title?: string,
    public description?: string,
    public startDate?: string,
    public endDate?: string,
    public creationDate?: string,
    public questions?: Question[],
    public isPublish?: boolean,
    public resultsPublish?: boolean
  ) {}
}
