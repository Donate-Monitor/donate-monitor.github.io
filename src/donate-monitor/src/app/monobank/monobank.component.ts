import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

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
      this.clientInfo = response;
 
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


// clientId: '45JkoMSKNk',
// name: 'Ламзін Олег',
// webHookUrl: '',
// permissions: 'psfj',
// accounts: Array(3), …}
// accounts: Array(3)
// 0: { id: 'c4sTeBeEoyDQGXpV4PO9Vg', sendId: '45JkoMSKNk', currencyCode: 980, cashbackType: 'UAH', balance: 5287604, … } 
// 1: { id: '8jhGhDeBx_8sIRxZltZMKA', sendId: '6XcS5yGBH7', currencyCode: 840, cashbackType: 'UAH', balance: 0, … } 
// 2: { id: '6ibWwkOD45VPQEQC_Q9omA', sendId: '6Us9GQgxF5', currencyCode: 978, cashbackType: 'UAH', balance: 16684, … } length: 3[[Prototype]]: Array(0)clientId: "45JkoMSKNk"
// jars: (2)[{… }, {… }]name: "Ламзін Олег"permissions: "psfj"webHookUrl: ""[[Prototype]]: Object