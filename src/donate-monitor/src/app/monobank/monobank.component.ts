import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MonoApi, ClientInfo, AccountEntity, Transaction } from './api';

@Component({
  selector: 'app-monobank',
  templateUrl: './monobank.component.html',
  styleUrls: ['./monobank.component.css']
})
export class MonobankComponent implements OnInit {
  token = new FormControl('');

  clientInfo: ClientInfo | null = null;
  selectedEntity: AccountEntity | null = null;
  monoApi: MonoApi | null = null;

  transactions: Transaction[] = [];
  // transactions: Transaction[] = [
  //   new Transaction({
  //     time: 1656961787,
  //     amount: 9900,
  //     description: "Від: 99",
  //   }),
  //   new Transaction({
  //     time: 1656961787,
  //     amount: 10000,
  //     description: "Від: 100",
  //   }),
  //   new Transaction({
  //     time: 1656961787,
  //     amount: 20000,
  //     description: "Від: 200 sdjdjds dfkjsdklfj ljfdkfjsdl jdskfjdslfj skfsdjsd fdsfdsfdsfsdf dsf dsf dsf sdf dsf sdfsdf ds fdsfds fds fsdf",
  //   })
  // ];
  showTransactionsDescription = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  public transactionsColumns(): string[] {
    if (this.showTransactionsDescription) {
      return ['date', 'time', 'amount', 'description'];
    }
    return ['date', 'time', 'amount'];
  }

  public async onFetchAcountInfo() {
    const token = this.token.value || '';
    this.monoApi = new MonoApi(token, this.http);
    this.clientInfo = await this.monoApi.fetchClientInfo();
  }

  public async onFetchTransactions() {
    console.log(this.selectedEntity);
    this.transactions = await this.monoApi!.fetchTransactions(this.selectedEntity!.id);
    console.log(this.transactions);
  }
};
