import { HttpClient, HttpHeaders } from '@angular/common/http';

export class MonoApi {
    token: string;
    http: HttpClient;

    constructor(token: string, http: HttpClient) {
        this.token = token;
        this.http = http;
    }

    async fetchClientInfo(): Promise<ClientInfo> {
        let response = this.http.get("https://api.monobank.ua/personal/client-info", {
            headers: new HttpHeaders({
                'X-token': this.token
            })
        });

        return new Promise<ClientInfo>((resolve) => {
            response.subscribe(response => {
                console.log("Response from server: ", response);
                let clientInfo = new ClientInfo(response);
                resolve(clientInfo);
            });
        });
    }

    async fetchTransactions(accountID: string): Promise<Transaction[]> {
        // UTC time in seconds.
        let toTime = Math.round(new Date().getTime() / 1000);
        // now - 31 days - 1 hour in seconds.
        let fromTime = toTime - 2682000;

        let response = this.http.get(`https://api.monobank.ua/personal/statement/${accountID}/${fromTime}/${toTime}`, {
            headers: new HttpHeaders({
                'X-token': this.token
            })
        });

        return new Promise<Transaction[]>((resolve, reject) => {
            response.subscribe(response => {
                console.log("Response from server: ", response);
                let transactions = new Array<Transaction>();
                
                if (!Array.isArray(response)) {
                    reject("Error happened: " + response);
                    return;
                }
                
                response.forEach(item => {
                    transactions.push(new Transaction(item));
                });
                resolve(transactions);
            });
        });
    }
}

export class ClientInfo {
    clientId: string;
    name: string;
    accounts: Account[];
    jars: Jar[];

    constructor(o: any) {
        this.clientId = o.clientId;
        this.name = o.name;

        this.accounts = new Array<Account>();
        o.accounts.forEach((element: any) => {
            this.accounts.push(new Account(element));
        });

        this.jars = new Array<Jar>();
        o.jars.forEach((element: any) => {
            this.jars.push(new Jar(element));
        });
    }

    cardsAndJars(): Array<AccountEntity> {
        let arr = new Array<AccountEntity>();
        return arr.concat(this.accounts, this.jars);
    }
}

export class Account implements AccountEntity {
    id: string;
    maskedPan: string;

    constructor(o: any) {
        this.id = o.id;
        this.maskedPan = o.maskedPan[0];
    }

    value(): string {
        return this.maskedPan;
    }
}

export class Jar implements AccountEntity {
    id: string;
    title: string;
    description: string;

    constructor(o: any) {
        this.id = o.id;
        this.title = o.title;
        this.description = o.description;
    }

    value(): string {
        return this.title;
    }
}

export interface AccountEntity {
    id: string;

    value(): string;
}

export class Transaction {
    time: number;
    description: string;
    amount: number;

    constructor(o: any) {
        this.time = o.time;
        this.description = o.description;
        this.amount = o.amount;
    }
}
