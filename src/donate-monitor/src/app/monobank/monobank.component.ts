import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-monobank',
  templateUrl: './monobank.component.html',
  styleUrls: ['./monobank.component.css']
})
export class MonobankComponent implements OnInit {
  token = new FormControl('');

  constructor() { }

  ngOnInit(): void {
  }

  public onRun(): void {
    console.log("onRun: ", this.token.value);
  }
}
