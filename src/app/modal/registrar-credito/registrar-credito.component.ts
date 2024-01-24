import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ApiService } from '../../Service/api.service';
import { FormBuilder } from '@angular/forms';
import { ComunicacionService } from '../../Service/comunicacion.service';
import { OpenAIService } from '../../Service/open-ai.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-registrar-credito',
  templateUrl: './registrar-credito.component.html',
  styleUrl: './registrar-credito.component.css'
})
export class RegistrarCreditoComponent {

  constructor(
    public bsModalRef: BsModalRef,
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private comunicacionService: ComunicacionService,
    private openIAService: OpenAIService
  ) {}

  tipo_credito = [];
  cuotas = [];
  pagina_actual = 0;
  pagina_final = 0;
  total_registros = 0;

  cuota_selecionada : any;
  tipo_credito_selecionado : any;
  usuario_actual : any;
  usuario_actual_id : number = 0;
  mensaje_ia : string = '';
  botonActivo = false;
  cargando = false;

  registrar_solicitud_creditos = this.formBuilder.group({
    cliente_solicitante_id: 0,
    cuotas_solicitadas_id: 0,
    tipo_credito_id: 0,
    valor_solicitado: 0,
    descripcion: '',
    observaciones: ''
  });

  guardarDatos(): void {
    let datos = this.registrar_solicitud_creditos.value;
    datos.cliente_solicitante_id = this.usuario_actual_id;
    this.apiService.peticionPost(datos, 'solicitudCredito').subscribe((resp: any) => {
      if(resp.estado == true) {
          this.comunicacionService.emitirSolicitudAgregado();
          this.bsModalRef.hide();
      }else{
          console.log(resp)
      }
    });
    this.bsModalRef.hide();
    this.router.navigateByUrl('/solicitudes')
  }

  ngOnInit(): void {
    if(localStorage.getItem('usuarioLoggueado') == 'true'){
      this.usuario_actual = localStorage.getItem('usuarioActual');
      this.usuario_actual = JSON.parse(this.usuario_actual);
      this.usuario_actual_id = this.usuario_actual.id;
    }else{
      this.router.navigateByUrl('/login')
    }
    this.listarNumeroCuotas();
    this.listarTipoCreditos();
  }

  async calcularCuotaIA(){
    let valores = this.registrar_solicitud_creditos.value;
    this.cargando = true;
    if(valores.valor_solicitado != 0){
      const datos = {}
      this.apiService.peticionGet(datos, 'opcionListaMaestra/'+valores.cuotas_solicitadas_id).subscribe((resp: any) => {
        if(resp.estado == true) {
            this.cuota_selecionada = resp.opcion.etiqueta;
            this.apiService.peticionGet(datos, 'tipoCredito/'+valores.tipo_credito_id).subscribe((resp: any) => {
              if(resp.estado == true) {
                  this.tipo_credito_selecionado = resp.tipo_credito.porcentaje_interes;
                  let prompt = 'calcula y dame el valor de la cuota de un prestamos con valor de '
                  +valores.valor_solicitado+' a un plazo de '+this.cuota_selecionada+' meses con un interes de '+this.tipo_credito_selecionado+' %'
        
                  this.openIAService.generarValorCuota(prompt).subscribe(response => {
                      this.mensaje_ia = response.choices[0].message.content;
                      this.botonActivo = true;
                      this.cargando = false;
                    },
                    error => {
                      console.error('Error al llamar a OpenAI:', error);
                    }
                  );
              }
            });
        }
      });
    }else{
      this.mensaje_ia = "Complete el formulario por favor"
    }
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

  async obtenerNumeroCuotas(id: any): Promise<any>{
    let datos = {}
    this.apiService.peticionGet(datos, 'opcionListaMaestra/'+id).subscribe((resp: any) => {
      if(resp.estado == true) {
          console.log(resp)
      }
    });
  }

  async obtenerTipoCredito(id: any): Promise<any>{
    let datos = {}
    this.apiService.peticionGet(datos, 'tipoCredito/'+id).subscribe((resp: any) => {
      if(resp.estado == true) {
          console.log(resp)
      }
    });
  }

  async listarTipoCreditos(pagina: number = -1){
    let datos = {
      "pagina" : pagina,
      "usuario_id" : this.usuario_actual_id,
    }
    this.apiService.peticionGet(datos, 'tipoCredito').subscribe((resp: any) => {
      this.tipo_credito = [];
      if(resp.estado == true) {
          this.tipo_credito = resp.datos;
      }else{
          
      }
    });
  }
}
