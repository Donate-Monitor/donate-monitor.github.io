import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MonoApi, ClientInfo, AccountEntity } from './api';

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
    let tr = await this.monoApi!.fetchTransactions(this.selectedEntity!.id);
    console.log(tr);
  }
};
