export interface IFormResponse {
  _id: string;
  FormId: string;
  FormResponseId: string;
  ChildId: string;
  ResponseType: string;
  SourceType: string;
  Document: Object;
  SubmitStatus: number;
  CreatedBy: string;
  CreatedOn: Date;
  UpdatedBy: string;
  UpdatedOn: Date;
}
