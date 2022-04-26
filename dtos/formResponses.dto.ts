import { IFormResponse } from "../interfaces/formResponse.interface";


export class FormResponseDto {

  public formId: string;

  public formResponses: IFormResponse[];
}
