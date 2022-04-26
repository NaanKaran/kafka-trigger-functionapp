import { AzureFunction, Context } from "@azure/functions";
import { appendFile } from "fs";
import App from "../app";
import app from "../app";
import FormInputService from "../services/formInput.service";
import { RequestViewModel } from "../viewModels/request.viewModel";

// This is to describe the metadata of a Kafka event
class KafkaEvent {
  Offset: number;
  Partition: number;
  Topic: string;
  Timestamp: string;
  Value: any;

  constructor(metadata: any) {
    this.Offset = metadata.Offset;
    this.Partition = metadata.Partition;
    this.Topic = metadata.Topic;
    this.Timestamp = metadata.Timestamp;
    this.Value = metadata.Value;
  }

  public getValue<T>(): T {
    return JSON.parse(this.Value);
  }
}

const kafkaTrigger: AzureFunction = async function (
  context: Context,
  event_str: string[]
): Promise<void> {
    await new App().start();
    
    for (const event of event_str) {
        console.dir(event_str);
        let event_obj = new KafkaEvent(JSON.parse(event));
      
        context.log("Event Offset: " + event_obj.Offset);
        context.log("Event Partition: " + event_obj.Partition);
        context.log("Event Topic: " + event_obj.Topic);
        context.log("Event Timestamp: " + event_obj.Timestamp);
        context.log("Event Value (as string): " + event_obj.Value);
      
        let formService = new FormInputService();
        var response = await formService.addOrUpdateFormResponseAsync(
          event_obj.getValue<RequestViewModel>()
        );
        context.log(response);
    }
  
};

export default kafkaTrigger;
