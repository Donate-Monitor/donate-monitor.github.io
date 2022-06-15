import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ClientInfo, Convert } from './api';

@Component({
  selector: 'app-monobank',
  templateUrl: './monobank.component.html',
  styleUrls: ['./monobank.component.css']
})
export class MonobankComponent implements OnInit {
  token = new FormControl('');

  clientInfo: any;
  selectedEntity: AccountEntity | null = null;

  cardsAndJars: Array<AccountEntity> = [];

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
      this.clientInfo = Convert.toClientInfo(response);;
 
      this.cardsAndJars = this.calculateCardsAndJars(this.clientInfo);
    });
  }

  private calculateCardsAndJars(clientInfo: any): Array<AccountEntity> {
    let arr: Array<AccountEntity> = [];
    clientInfo.accounts.forEach((element: any) => {
      arr.push(new AccountEntity(element.id, element.currencyCode));
    });
    return arr;
  }

};

export class AccountEntity {
  id: string;
  currencyCode: number;
  value: string = 'some value';

  constructor(id: string, currencyCode: number, ) {
    this.id = id;
    this.currencyCode = currencyCode;
  }

  public toString(): string {
    return this.id;
  }

};
