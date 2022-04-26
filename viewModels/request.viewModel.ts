import { IFormResponse } from "../interfaces/formResponse.interface";


export class RequestViewModel{
    public formId: string;
    public formResponses: IFormResponse[];
    public filterKeys: string[];

}