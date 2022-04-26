export interface IForm {
  _id: string;
  Name: string;
  FormBsonDocument: Object;
  Description: string;
  FormType: string;
  DepartmentId: string;
  SubDepartmentId: string;
  SubDepartmentName: string;
  IsDeleted: string;
  CreatedBy: string;
  CreatedOn: Date;
  UpdatedBy: string;
  UpdatedOn: Date;
}
