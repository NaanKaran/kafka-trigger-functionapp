
import { TableClient, TableServiceClient, AzureNamedKeyCredential } from '@azure/data-tables';
import * as crypto from 'crypto';
import { CONFIG } from '../environment/environment.appsettings';
import { ResponseLogModel, TriggerStatus } from '../models/responseError.model';

class TableStorageService {
    private accountName = CONFIG.AZURE_STORAGE_ACCOUNT_NAME;
    private accountKey = CONFIG.AZURE_STORAGE_ACCOUNT_KEY;
    private credential = new AzureNamedKeyCredential(this.accountName, this.accountKey);
    private inputRunningStatus = 'InputRunningStatus';
    private tableStorageUrl = `https://${this.accountName}.table.core.windows.net`;
    private _responseStatusTableClient;

    public async createTable(tableName: string) {
        const serviceClient = new TableServiceClient(this.tableStorageUrl, this.credential);
        await serviceClient.createTable(tableName);
    }

    public async addEntity(data: string) {
        this._responseStatusTableClient = new TableClient(this.tableStorageUrl, this.inputRunningStatus, this.credential);

        let objectConversion = JSON.parse(data);

        let responseModel = objectConversion as ResponseLogModel;
        responseModel.partitionKey = responseModel.FormId;
        responseModel.rowKey = crypto.randomUUID();
        responseModel.ResponseLog = JSON.stringify(responseModel.ResponseLog);
        responseModel.ErrorMessage = responseModel.ErrorMessage ? JSON.stringify(responseModel.ErrorMessage) : null;
        responseModel.TriggerStatus = responseModel.Status == 200 ? TriggerStatus.Pass : TriggerStatus.Fail;
        responseModel.SourceType = "Trigger";

        await this._responseStatusTableClient.createTable(this.inputRunningStatus);

        await this._responseStatusTableClient.createEntity(responseModel);            
    }
}

export default TableStorageService;
