import { connect, set } from "mongoose";

class App {
  public async start() {
   await this.connectToDatabase();
  }

  private async connectToDatabase() {
      console.log("Connecting to database..." + process.env["MONGO_DB_URL"]);
   await connect(process.env["MONGO_DB_URL"],   {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
  }
}

export default  App;
