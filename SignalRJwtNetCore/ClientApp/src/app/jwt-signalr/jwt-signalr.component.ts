import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'app-jwt-signalr',
  templateUrl: './jwt-signalr.component.html',
  styleUrls: ['./jwt-signalr.component.css']
})
export class JwtSignalrComponent implements OnInit {

  token: string;
  base_url: string;
  messages: string = "";
  srservice: SignalRService;
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string, sigr_srv: SignalRService) {
    this.base_url = baseUrl;
    this.srservice = sigr_srv;
  }

  ngOnInit() {
  }

  ongetjwt(form: NgForm) {
    this.http.get(this.base_url + 'api/jwt').toPromise().then(
      res => {
        this.token = res['token'];
        this.srservice.set_token(this.token);
      }
    );
    this.messages += "Got token\n";
    
  }

  onconnectToHub(form: NgForm) {
    this.srservice.connect();
    this.messages += "Connected\n";
  }

  ondisconnectfromhub() {
    this.srservice.disconnect();
    this.messages += "Disconnected\n";
  }
}
