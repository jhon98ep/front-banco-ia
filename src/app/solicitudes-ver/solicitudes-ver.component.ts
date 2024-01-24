import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from '../Service/api.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-solicitudes-ver',
  templateUrl: './solicitudes-ver.component.html',
  styleUrl: './solicitudes-ver.component.css'
})
export class SolicitudesVerComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
  ) { }

  estados : any;

  solicitud_ver_informacion : any;
  solicitud_ver_id : number = 0;

  usuario_actual : any;
  usuario_actual_id : number = 0;
  usuario_actual_perfil_id : number = 0;
  cargando = false;

  observacion : string = "";
  estado_id = 0;
  cambiar_estado = false;
  autorizado_cambiar = false;

  ngOnInit(): void {
    if(localStorage.getItem('usuarioLoggueado') == 'true'){
      this.usuario_actual = localStorage.getItem('usuarioActual');
      this.usuario_actual = JSON.parse(this.usuario_actual);
      this.usuario_actual_id = this.usuario_actual.id;
      this.usuario_actual_perfil_id = this.usuario_actual.rol_id;
    }else{
      this.router.navigateByUrl('/login')
    }
    this.activatedRoute.paramMap.subscribe((parametros: ParamMap) => {
      this.solicitud_ver_id = parseInt(parametros.get("id")!);
    })
    if(this.usuario_actual_perfil_id == 3 || this.usuario_actual_perfil_id == 4){
      
      this.autorizado_cambiar = true;
    }
    this.obtenerSolicitud(this.solicitud_ver_id);
    this.listarEstados();
  }

  obtenerSolicitud(id: number){
    this.cargando = true;
    let datos = {}
    this.apiService.peticionGet(datos, 'solicitudCredito/'+id).subscribe((resp: any) => {
      if(resp.estado == true) {
        this.solicitud_ver_informacion = resp.solicitud; 
        this.estado_id = this.solicitud_ver_informacion.estado_id
        this.observacion = this.solicitud_ver_informacion.observaciones
        this.cargando = false;
      }
    })
  }

  actualizarEstado(){
    this.cargando = true;
    let estado = this.usuario_actual_perfil_id == 3 ? this.estado_id : 4;
    let datos = {
      estado_id : estado,
      observaciones : this.observacion,
      cliente_solicitante_id : this.solicitud_ver_informacion.cliente_solicitante_id,
      usuario_aprobador_id : this.usuario_actual_id
    };
    this.apiService.peticionPatch(datos, 'solicitudCredito/'+this.solicitud_ver_id).subscribe((resp: any) => {
      if(resp.estado == true) {
        this.cargando = false;
        this.router.navigateByUrl('/solicitudes')
      }else{
          console.log(resp)
      }
    }); 
  }

  cambiarEstado(){
    this.cambiar_estado = !this.cambiar_estado
  }

  async listarEstados(pagina: number = -1){
    let datos = {}
    let endPoint = 'listaMaestra/1/opciones?pagina='+pagina;
    endPoint = this.usuario_actual_perfil_id == 4 ? endPoint+'&gerente='+1 : endPoint;
    endPoint = this.usuario_actual_perfil_id == 3 ? endPoint+'&asesor='+1 : endPoint;
    this.apiService.peticionGet(datos, endPoint).subscribe((resp: any) => {
      this.estados = [];
      if(resp.estado == true) {
          this.estados = resp.datos;
      }else{
          
      }
    });
  }
}
