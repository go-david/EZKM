import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public title = '';

  public open = false;

  constructor(
    private ar: ActivatedRoute,
  ) {
    this.title = this.ar.snapshot.data.title;

    console.log(this.title);


  }

  ngOnInit() {

    // const deg = ((remain / total).toFixed(2)) * 2 * Math.PI;
  }



}
