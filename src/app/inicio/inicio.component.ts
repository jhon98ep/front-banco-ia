import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../Service/api.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  contadores : any;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('usuarioLoggueado') == 'true'){
    }else{
      this.router.navigateByUrl('/login')
    }
  }
}
