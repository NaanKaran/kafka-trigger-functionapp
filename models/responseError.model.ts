export class ResponseLogModel {
    constructor(partitionKey: string, rowKey: string) {
        this.partitionKey = partitionKey;
        this.rowKey = rowKey;
    }
    partitionKey?: string;
    rowKey?: string;
    public FormId: string;
    public ResponseLog: string;
    public Status: number;
    public ErrorMessage: string;
    public TriggerStatus: TriggerStatus;
    public SourceType: string;
}

export enum TriggerStatus{
    Pass =1,
    Fail=2
}