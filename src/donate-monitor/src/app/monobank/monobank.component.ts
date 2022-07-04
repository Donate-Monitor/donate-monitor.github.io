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
  //     description: "Від: Онуфрій Козаченко",
  //   }),
  //   new Transaction({
  //     time: 1656961787,
  //     amount: 10000,
  //     description: "Від: Онуфрій Козаченко",
  //   }),
  //   new Transaction({
  //     time: 1656961787,
  //     amount: 10000,
  //     description: "Від: Онуфрій Козаченко sdjdjds dfkjsdklfj ljfdkfjsdl jdskfjdslfj skfsdjsd fdsfdsfdsfsdf dsf dsf dsf sdf dsf sdfsdf ds fdsfds fds fsdf",
  //   })    
  // ];
  transactionsColumns: string[] = ['date', 'time', 'amount', 'description'];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
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
