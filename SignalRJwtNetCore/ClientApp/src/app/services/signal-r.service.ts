import { Injectable, Inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  connection: HubConnection;
  _baseurl: string;
  token: string;

  constructor(@Inject('BASE_URL') baseUrl: string) {
    this._baseurl = baseUrl;
    console.log(this._baseurl + "hubs/jwthub");
    this.connection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl(this._baseurl + "hubs/jwthub", {
        accessTokenFactory: () => {
          return this.get_token();
        }
      })
      .build();

    //this.connection.on("BroadcastMessage", (type: string, payload: string) => {
    //  this.messageService.add({ severity: type, summary: payload, detail: 'Via SignalR' });
    //});

    this.connection.on("TokenExpired", (args) => {
      console.log("Token expired event!");
    });
  }

  get_token() {
    console.log('getting token: ' + this.token);
    return this.token;
  }

  connect() {
    this.connection.start().then(function () {
      console.log('Connected!');
    }).catch(function (err) {
      return console.error('Connection error: ' + err.toString());
    });
  }

  set_token(new_token: string) {
    console.log('setting token: ' + new_token);
    this.token = new_token;
  }

  disconnect() {
    this.connection.stop().then(() => console.log('Disconnected!'));
  }
  

  
}
