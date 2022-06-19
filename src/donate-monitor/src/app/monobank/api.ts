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

        let cmp = (a:AccountEntity, b:AccountEntity) => {
            if (a.getShortDescription() > b.getShortDescription()) {
                return 1;
            }
            if (a.getShortDescription() < b.getShortDescription()) {
                return -1;
            }
            return 0;
        };
        this.accounts = this.accounts.sort(cmp);
        this.jars = this.jars.sort(cmp);
    }

    cardsAndJars(): Array<AccountEntity> {
        let arr = new Array<AccountEntity>();
        return arr.concat(this.jars, this.accounts);
    }
}

export class Account implements AccountEntity {
    id: string;
    sendId: string;
    balance: number;
    currencyCode: number;
    maskedPan: string;

    constructor(o: any) {
        this.id = o.id;
        this.sendId = o.sendId;
        this.balance = o.balance;
        this.currencyCode = o.currencyCode;
        this.maskedPan = o.maskedPan[0];
    }

    getShortDescription(): string {
        return this.maskedPan;
    }
    getUrl() : string {
        return "";
    }
    getLongDescription(): string {
        return "";
    }
    getBalance(): string {
        return formatMoney(this.balance, this.currencyCode);
    }
}

export class Jar implements AccountEntity {
    id: string;
    sendId: string;
    title: string;
    description: string;
    currencyCode: number;
    balance: number;
    goal: number;

    constructor(o: any) {
        this.id = o.id;
        this.sendId = o.sendId;
        this.title = o.title;
        this.description = o.description;
        this.currencyCode = o.currencyCode;
        this.balance = o.balance;
        this.goal = o.goal;
    }

    getShortDescription(): string {
        return this.title;
    }
    getUrl() : string {
        return `https://send.monobank.ua/${this.sendId}`;
    }
    getLongDescription(): string {
        return this.description;
    }
    getBalance(): string {
        if (!this.goal) {
            return formatMoney(this.balance, this.currencyCode);
        }
        return `${formatMoney(this.balance, this.currencyCode)} ouf ot ${formatMoney(this.goal, this.currencyCode)}`;
    }
}

export interface AccountEntity {
    id: string;

    getShortDescription(): string;
    getUrl(): string;
    getLongDescription(): string;
    getBalance(): string;
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

function formatMoney(money: number, currencyCode: number): string {
    let s = `${(money / 100).toFixed(0)}`;
    let m = "";
    for (let i = 0; i < s.length; i++) {
        if (i > 0 && (s.length - i) % 3 == 0) {
            m += " ";
        }
        m += s[i];
    }

    return `${m}${currencySymbol(currencyCode)}`;
}

function currencySymbol(currencyCode: number): string {
    switch (currencyCode) {
        case 840: {
            return "$";
        }
        case 978: {
            return "€";
        }
        case 980: {
            return "₴";
        }
        default: {
            return ` "${currencyCode}"`;
        }
    }
}
