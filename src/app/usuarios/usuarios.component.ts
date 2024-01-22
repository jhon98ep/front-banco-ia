import { Component } from '@angular/core';
import { ApiService } from '../Service/api.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  constructor(
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
  ) { }

  usuarios = [];
  cuotas = [];
  pagina_actual = 0;
  pagina_final = 0;
  total_registros = 0;

  usuario_actual : any;
  usuario_actual_id : number = 0;
  usuario_actual_token : string = "";

  filtros_busqueda_creditos = this.formBuilder.group({
    filtro_numero_cuotas: '',
    numero_cuenta: '',
  });

  ngOnInit(): void {
    if(localStorage.getItem('usuarioLoggueado') == 'true'){
      this.usuario_actual = localStorage.getItem('usuarioActual');
      this.usuario_actual = JSON.parse(this.usuario_actual);
      this.usuario_actual_id = this.usuario_actual.usuario_id;
      this.usuario_actual_token = this.usuario_actual.token;
    }else{
      this.router.navigateByUrl('/login')
    }
    this.listarUsuarios(1);
    this.listarNumeroCuotas();
  }

  async listarUsuarios(pagina: number){
    let datos = {
      "pagina" : pagina,
      "usuario_id" : this.usuario_actual_id,
    }
    console.log('listando usuarios')
    this.apiService.peticionGet(datos, 'usuarios').subscribe((resp: any) => {
      this.usuarios = [];
      if(resp.estado == true) {
          window.scrollTo(0, 0);
          this.total_registros = resp.total_registros;
          this.pagina_actual = resp.pagina_actual;
          this.pagina_final = resp.total_paginas;
          this.usuarios = resp.datos;
      }else{
          
      }
    });
  }

  async listarNumeroCuotas(pagina: number = -1){
    let datos = {
      "pagina" : pagina,
      "usuario_id" : this.usuario_actual_id,
    }
    this.apiService.peticionGet(datos, 'listaMaestra/3/opciones').subscribe((resp: any) => {
      this.cuotas = [];
      if(resp.estado == true) {
          this.cuotas = resp.datos;
      }else{
          
      }
    });
  }

  verUsuario(id : string){
    
  }

  filtrarUsuarios(){
    let datos = {
      "pagina" : -1,
      "usuario_id" : this.usuario_actual_id,
    }
    let datos_unidos = {...datos, ...this.filtros_busqueda_creditos.value}
    this.apiService.peticionGet(datos_unidos, 'usuarios').subscribe((resp: any) => {
      this.usuarios = [];
      if(resp.resultado =! 'valido') {
      }else{
          window.scrollTo(0, 0);
          this.total_registros = resp.total_registros;
          this.pagina_actual = resp.pagina_actual;
          this.pagina_final = resp.total_paginas;
          this.usuarios = resp.datos;
      }
    })
  }
}
