import { Option } from "./option.model";

export class Question {
  constructor(
    public _id?: number,
    public title?: string,
    public type?: string,
    public options?: Option[]
  ) {}
}
