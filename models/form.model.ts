
import { model, Schema, Document } from 'mongoose';
import { IForm } from '../interfaces/form.interface';

const formSchema: Schema = new Schema({
        _id : {
            type: String
        },
        Name : {
            type: String
        },
        FormBsonDocument : {
            type: Object
        },
        Description : {
            type: String
        },
        FormType : {
            type: String
        },
        DepartmentId : {
            type: String
        },
        SubDepartmentId : {
            type: String
        },
          SubDepartmentName : {
            type: String
        },
        IsDeleted : {
            type: Boolean
        },

        CreatedBy : {
            type: String
        },
        CreatedOn : {
            type: Date
        },
        UpdatedBy : {
            type: String
        },
        UpdatedOn : {
            type: Date
        }
},{ _id: false , collection: 'Forms', versionKey: false});

const FormCollection = model<IForm & Document>('Forms', formSchema, 'Forms');

export default FormCollection;
