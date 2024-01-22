import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {

  constructor() { }
  
  private usuarioAgregadoSource = new Subject<void>();
  usuarioAgregado$ = this.usuarioAgregadoSource.asObservable();
  emitirUsuarioAgregado() {
    this.usuarioAgregadoSource.next();
  }

  private solicitudAgregadoSource = new Subject<void>();
  solicitudAgregado$ = this.solicitudAgregadoSource.asObservable();
  emitirSolicitudAgregado() {
    this.solicitudAgregadoSource.next();
  }

}
