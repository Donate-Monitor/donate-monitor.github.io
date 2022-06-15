import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ClientInfo, AccountEntity } from './api';

@Component({
  selector: 'app-monobank',
  templateUrl: './monobank.component.html',
  styleUrls: ['./monobank.component.css']
})
export class MonobankComponent implements OnInit {
  token = new FormControl('');

  clientInfo: ClientInfo | null = null;
  selectedEntity: AccountEntity | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  public async onRun() {
    const token = this.token.value || '';

    let response = await this.http.get("https://api.monobank.ua/personal/client-info", {
      headers: new HttpHeaders({
        'X-token': token
      })
    });

    response.subscribe(response => {
      console.log("Response from server: ", response);
      this.clientInfo = new ClientInfo(response);
    });
  }

  public onSelectAccount() {
    console.log(this.selectedEntity);
  }
};
