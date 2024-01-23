import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RegistrarUsuarioComponent } from '../modal/registrar-usuario/registrar-usuario.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  bsModalRef: BsModalRef | undefined;
  error : string = '';

  constructor(
    private router: Router,
    private authRestService: AuthService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
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

  registrarme(): void{
    this.router.navigateByUrl('/registrarme')
  }
}
