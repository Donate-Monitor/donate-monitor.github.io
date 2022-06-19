import { HttpClient, HttpHeaders } from '@angular/common/http';

export class MonoApi {
    token: string;
    http: HttpClient;

    constructor(token: string, http: HttpClient) {
        this.token = token;
        this.http = http;
    }

    async fetchClientInfo(): Promise<ClientInfo> {
        let response = await this.http.get("https://api.monobank.ua/personal/client-info", {
            headers: new HttpHeaders({
                'X-token': this.token
            })
        });

        return new Promise<ClientInfo>((resolve, reject) => {
            response.subscribe(response => {
                console.log("Response from server: ", response);
                let clientInfo = new ClientInfo(response);
                resolve(clientInfo);
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
    id?: string;

    value(): string;
}
