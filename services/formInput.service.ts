
import * as crypto from 'crypto';
import { SubmitStatus } from '../enums/submitStatus.enum';
import { IForm } from '../interfaces/form.interface';
import { IFormResponse } from '../interfaces/formResponse.interface';
import FormCollection from '../models/form.model';
import FormResponseCollection from '../models/formResponse.model';
import { ErrorViewModel } from '../viewModels/error.view.model';
import { RequestViewModel } from '../viewModels/request.viewModel';
import { ResponseViewModel } from '../viewModels/response.viewModel';
import TableStorageService from './table-storage.service';

var BSON = require('bson');
const Validator = require('formio/src/resources/Validator.js');
const Utils = require('formio/src/util/util.js');

class FormInputService {
  private _formCollection = FormCollection;
  private _fromResponseCollection = FormResponseCollection;
  public _tableService = new TableStorageService();

  public addOrUpdateFormResponseAsync = async (requestViewModel: RequestViewModel): Promise<any> => {
    const response = await this.validateFormResponseAsync(requestViewModel);

    const responseLog = {
      FormId: requestViewModel.formId,
      ResponseLog: response,
      Status: response.status,
      ErrorMessage: response.errors ?? null,
    };

    const data = JSON.stringify(responseLog);
    await this._tableService.addEntity(data);
    console.log(responseLog);
    return response;
  };

  public async validateFormResponseAsync(requestViewModel: RequestViewModel): Promise<any> {
    let response = new ResponseViewModel();
    try {
      let erros = [] as ErrorViewModel[];
      const form = await this._formCollection.findOne({ _id: requestViewModel.formId });

      await this.errorValidation(form, requestViewModel, erros);

      if (erros.length > 0) {
        response.status = 400;
        response.message = 'Validation Error';
        response.errors = erros;
        return response;
      }

      for (const res of requestViewModel.formResponses) {
        await this.inputAddOrUpdateAsync(res, requestViewModel, form.FormBsonDocument);
      }

      response.status = 200;
      response.message = 'Form responses successfully saved.';
      return response;
    } catch (error) {
      response.status = 500;
      response.message = 'Internal Server Error';
      response.errors = [
        {
          message: error.message,
          stack: error.stack,
        },
      ];
      return response;
    }
  }

  public async getFlattenComponent(formId: string): Promise<any> {
    var response = {} as any;
    const form = await this._formCollection.findOne({ _id: formId });

    if (!form) {
      response.status = 400;
      response.message = 'form not found';
      return response;
    }
    const flattenComponents = Utils.flattenComponents(form.FormBsonDocument['components']);
    let componentsArray = [];

    if (Object.keys(flattenComponents).length > 0) {
      componentsArray = Object.values(flattenComponents)
        .filter((component: any) => component.type !== 'button')
        .map((component: any) => ({ key: component.key, label: component.label, type: component.type }));
    }

    response.status = 200;
    response.data = componentsArray;
    return response;
  }

  private async inputAddOrUpdateAsync(response: IFormResponse, requestViewModel: RequestViewModel, schema: object): Promise<IFormResponse> {
    const uuid = crypto.randomUUID();
    let filter = { FormId: requestViewModel.formId };

    let datetimeKeys = this.getDateFields(schema);

    for (const key of requestViewModel.filterKeys) {
      if (datetimeKeys.indexOf(key) > -1) {
        filter[`Document.data.${key}`] = { $date: `${response.Document['data'][key]}` };
      } else {
        filter[`Document.data.${key}`] = response['Document']['data'][key];
      }
    }

    const json = JSON.stringify(filter);
    filter = BSON.EJSON.parse(json);

    //let inputDocument = await this._fromResponseCollection.findOne(filter);
    let inputDocuments: IFormResponse[] = await this._fromResponseCollection.find(filter);

    if (inputDocuments.length > 0) {
      await this.updateOldResponseAsync(inputDocuments, response, datetimeKeys, filter);
    } else {
      await this.insertNewResponseAsync(requestViewModel, uuid, response, datetimeKeys);
    }

    return response;
  }

  private async updateOldResponseAsync(inputDocuments: IFormResponse[], response: IFormResponse, datetimeKeys: string[], filter: any) {

    for (const inputDocument of inputDocuments) {
      inputDocument['UpdatedBy'] = 'TimerTrigger';
      inputDocument['UpdatedOn'] = new Date();

      var updateKeys = Object.keys(response.Document['data']);

      for (const key of updateKeys) {
        inputDocument['Document']['data'][key] = response.Document['data'][key];
      }

      this.dateFormatUpdate(datetimeKeys, response, inputDocument);

      const json = JSON.stringify(inputDocument.Document);
      inputDocument['Document'] = BSON.EJSON.parse(json);
      await this._fromResponseCollection.updateOne({ _id : inputDocument._id}, inputDocument);
    }

 
  }

  private async insertNewResponseAsync(requestViewModel: RequestViewModel, uuid: string, response: IFormResponse, datetimeKeys: string[]) {
    let inputDocument = this.getFromTemplate(requestViewModel.formId, uuid, response.SourceType);
    inputDocument.Document = response.Document;

    for (const key of datetimeKeys) {
      if (response.Document['data'][key]) {
        inputDocument['Document']['data'][key] = { $date: `${response['Document']['data'][key]}` };
      }
    }
    const json = JSON.stringify(inputDocument.Document);

    inputDocument['Document'] = BSON.EJSON.parse(json);
    await this._fromResponseCollection.findByIdAndUpdate(inputDocument._id, inputDocument, { upsert: true });
    return inputDocument;
  }

  private dateFormatUpdate(datetimeKeys: string[], response: IFormResponse, inputDocument: IFormResponse) {
    for (const key of datetimeKeys) {
      if (response['Document']['data'][key]) {
        inputDocument['Document']['data'][key] = { $date: `${response['Document']['data'][key]}` };
      } else if (inputDocument['Document']['data'][key]) {
        inputDocument['Document']['data'][key] = { $date: `${inputDocument['Document']['data'][key]}` };
      }
    }
  }

  private errorValidation(form: IForm, requestViewModel: RequestViewModel, erros: ErrorViewModel[]): Promise<any> {
    let schema = form.FormBsonDocument;
    let promises = [] as Promise<any>[];
    this.numberFieldValidationAppend(schema);
    this.dateFieldValidationAppend(schema);

    const validator = new Validator(schema);

    for (const formEntry of requestViewModel.formResponses) {
      promises.push(
        new Promise((resolve, reject) => {
          validator.validate(formEntry.Document, (err, submission) => {
            if (err) {
              erros.push(err);
            }
            resolve(true);
          });
        }),
      );
    }
    return Promise.all(promises);
  }

  private numberFieldValidationAppend(schema: Object) {
    Utils.eachComponent(schema['components'], function (component) {
      if (component.type === 'number') {
        if (!component.validate) {
          component.validate = {};
        }
        component.validate.pattern = '([+-]?[0-9]*[.]?[0-9]+)';
        component.validate.patternMessage = 'Must be a valid number format';
      }
    });
  }

  private dateFieldValidationAppend(schema: Object) {
    Utils.eachComponent(schema['components'], function (component) {
      if (component.type === 'datetime') {
        if (!component.validate) {
          component.validate = {};
        }
        component.validate.pattern =
          '^((([0-9]{4}|[0-9]{2})[./-]([0]?[1-9]|[1][0-2])[./-]([0]?[1-9]|[1|2][0-9]|[3][0|1]) ([0-9]{2}):([0-9]{2}):([0-9]{2}))|(([0-9]{4}|[0-9]{2})[./-]([0]?[1-9]|[1][0-2])[./-]([0]?[1-9]|[1|2][0-9]|[3][0|1])))$';
        component.validate.patternMessage = 'Must be a valid date format (YYYY-MM-DD HH:MM:SS) or (YYYY-MM-DD)';
      }
    });
  }

  private getDateFields(schema: Object): string[] {
    let dateFields = [] as string[];
    Utils.eachComponent(schema['components'], function (component) {
      if (component.type === 'datetime') {
        console.log(component.key);
        dateFields.push(component.key);
      }
    });
    return dateFields;
  }

  private getFromTemplate(formId: string, id: string, sourceType: string): any {
    const uuid = crypto.randomUUID();

    let defaultResponse: IFormResponse = {
      _id: id,
      FormId: formId,
      FormResponseId: uuid,
      ChildId: null,
      Document: {
        data: {},
        state: 'submitted',
      },
      CreatedBy: 'TimerTrigger',
      CreatedOn: new Date(),
      ResponseType: 'Data Stream',
      SubmitStatus: SubmitStatus.Approved,
      UpdatedBy: 'TimerTrigger',
      UpdatedOn: new Date(),
      SourceType: sourceType ?? '',
    };

    return defaultResponse;
  }
}

export default FormInputService;
