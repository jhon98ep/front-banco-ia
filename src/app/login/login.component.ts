import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  error : string = '';

  constructor(
    private router: Router,
    private authRestService: AuthService,
    private formBuilder: FormBuilder,
  ) { }

  formulario_inicio_sesion = this.formBuilder.group({
    usuario: '',
    contrasenia: '',
  });

  ngOnInit(): void {
    if(localStorage.getItem('usuarioLoggueado') == 'true'){
      this.router.navigateByUrl('/inicio')
    }else{
      localStorage.removeItem('usuarioActual');
    }
  }
  
  iniciarSesion() {
    this.authRestService.iniciarSesion(this.formulario_inicio_sesion.value);
  }
}
