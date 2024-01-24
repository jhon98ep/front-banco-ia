import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from '../Service/api.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-usuarios-ver',
  templateUrl: './usuarios-ver.component.html',
  styleUrl: './usuarios-ver.component.css'
})
export class UsuariosVerComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
  ) { }

  editar: boolean = false;
  usuario_ver_id: number = 0;
  usuario_ver_informacion: any;
  nombre = "";
  apellido = "";
  usuario = "";
  numero_documento = "";
  tipo_documento_id = 0;
  rol_id = 0;


  usuario_actual : any;
  usuario_actual_id : number = 0;
  usuario_actual_perfil_id : number = 0;
  cargando = false;

  roles = [];
  tipo_documento = [];

  editar_usuario = this.formBuilder.group({
    rol_id: 0,
    tipo_documento_id: 0,
    nombre: '',
    apellido: '',
    usuario: '',
    numero_documento: ''
  });

  ngOnInit(): void {
    if(localStorage.getItem('usuarioLoggueado') == 'true'){
      this.usuario_actual = localStorage.getItem('usuarioActual');
      this.usuario_actual = JSON.parse(this.usuario_actual);
      this.usuario_actual_id = this.usuario_actual.usuario_id;
      this.usuario_actual_perfil_id = this.usuario_actual.rol_id;
    }else{
      this.router.navigateByUrl('/login')
    }
    this.activatedRoute.paramMap.subscribe((parametros: ParamMap) => {
      this.usuario_ver_id = parseInt(parametros.get("id")!);
    })
    this.obtenerUsuario(this.usuario_ver_id);
  }

  obtenerUsuario(id: number){
    this.cargando = true;
    let datos = {}
    this.apiService.peticionGet(datos, 'usuarios/'+id).subscribe((resp: any) => {
      if(resp.estado == true) {
        this.usuario_ver_informacion = resp.usuario; 
        this.cargando = false;
      }
    })
  }

  async listarRoles(pagina: number = -1){
    let datos = {
      "pagina" : pagina,
      "usuario_id" : this.usuario_actual_id,
    }
    this.apiService.peticionGet(datos, 'roles').subscribe((resp: any) => {
      this.roles = [];
      if(resp.estado == true) {
          this.roles = resp.datos;
      }else{
          
      }
    });
  }

  async listarTipoDocumentos(pagina: number = -1){
    let datos = {
      "pagina" : pagina,
      "usuario_id" : this.usuario_actual_id,
    }
    this.apiService.peticionGet(datos, 'listaMaestra/2/opciones').subscribe((resp: any) => {
      this.tipo_documento = [];
      if(resp.estado == true) {
          this.tipo_documento = resp.datos;
      }else{
          
      }
    });
  }

  editarInformacion(){
    this.editar = !this.editar;   
    this.nombre = this.usuario_ver_informacion.nombre;
    this.apellido = this.usuario_ver_informacion.apellido;
    this.usuario = this.usuario_ver_informacion.usuario;
    this.numero_documento = this.usuario_ver_informacion.numero_documento;
    this.rol_id = this.usuario_ver_informacion.rol_id;
    this.tipo_documento_id = this.usuario_ver_informacion.tipo_documento_id;
    this.listarRoles();
    this.listarTipoDocumentos();
  }

  actualizarInformacion(){
    this.cargando = true;
    let datos = this.editar_usuario.value;
    datos.nombre = this.nombre;
    datos.apellido = this.apellido;
    datos.usuario = this.usuario;
    datos.numero_documento = this.numero_documento;
    datos.rol_id = this.rol_id;
    datos.tipo_documento_id = this.tipo_documento_id;
    this.apiService.peticionPatch(datos, 'usuarios/'+this.usuario_ver_id).subscribe((resp: any) => {
      if(resp.estado == true) {
        this.cargando = false;
        this.router.navigateByUrl('/usuarios')
      }else{
          console.log(resp)
      }
    }); 
  }
}
