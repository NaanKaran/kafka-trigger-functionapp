
import { model, Schema, Document } from 'mongoose';
import { IFormResponse } from '../interfaces/formResponse.interface';

const formSchema: Schema = new Schema({
        _id : {
            type: String
        },
        FormId : {
            type: String
        },
        ResponseType : {
            type: String
        },
        SourceType : {
            type: String
        },
        Document : {
            type: Object
        },
        SubmitStatus : {
            type: Number
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
        },
        FormResponseId : {
            type: String
        },
        ChildId : {
            type: String
        }
},{_id: false, versionKey: false});

const FormResponseCollection = model<IFormResponse & Document>('FormResponses', formSchema, 'FormResponses');

export default FormResponseCollection;
