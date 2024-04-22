import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/users', title: 'Users',  icon:'person', class: '' },
    { path: '/product', title: 'Products',  icon:'inventory', class: '' },
    { path: '/orders', title: 'Orders',  icon:'list_alt', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() isExpanded: boolean = true;
  @Output() toggleMenu = new EventEmitter();
  routeLinks: any[] = [];

  constructor() { }

  ngOnInit() {
    this.routeLinks = ROUTES.filter(menuItem => menuItem);
  }
}
