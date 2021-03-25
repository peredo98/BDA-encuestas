import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header-navbar',
  templateUrl: './header-navbar.component.html',
  styleUrls: ['./header-navbar.component.scss']
})
export class HeaderNavbarComponent implements OnInit {

  @Input()
  section: string;

  constructor() {}

  ngOnInit(): void {
  }

}
