import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject, catchError, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url_api = environment.url;
  private loggueado = localStorage.getItem('usuarioLoggueado') == 'true' ? true : false;
  private loggueado2 : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.loggueado);

  usuario_actual : any;
  usuario_actual_id : number = 0;
  usuario_actual_perfil_id : number = 0;
  usuario_actual_token : string = "";

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) { }

  getLoggueado2(){
    return this.loggueado2.asObservable();
  }

  setLoggueado2(valor : boolean = false):void {
    localStorage.setItem('usuarioLoggueado', JSON.stringify(valor));
    this.loggueado2.next(valor);
  }

  cargarUsuario(){
    if(this.loggueado2.getValue() == true){
      this.usuario_actual = localStorage.getItem('usuarioActual');
      this.usuario_actual = JSON.parse(this.usuario_actual);
      this.usuario_actual_id = this.usuario_actual.usuario_id;
      this.usuario_actual_perfil_id = this.usuario_actual.perfil_id;
      this.usuario_actual_token = this.usuario_actual.token;
    }else{
      this.setLoggueado2(false)
      localStorage.removeItem('usuarioActual');
      this.router.navigate(['/login'])
    }
  }

  getAuthorizationToken(){
    let token_ls : any = localStorage.getItem('token');
    let token = JSON.parse(token_ls);
    return token
  }

  iniciarSesion(credenciales: any){
    let usuario = credenciales.usuario
    let contrasenia = credenciales.contrasenia
    let datos = {
      "usuario" : usuario,
      "contrasenia" : contrasenia,
    }
    this.login(datos).subscribe((resp: any) => {
      if(resp.estado == true) {
        localStorage.setItem('usuarioActual', JSON.stringify(resp.usuario))
        localStorage.setItem('token', JSON.stringify(resp.token))
        this.setLoggueado2(true)
        this.router.navigate(['/inicio'])
      }else{
        this.router.navigate(['/login'])
      }
    })
  }

  cerrarSesion(){
    let datos = {
      "usuario_id" : this.usuario_actual_id,
      "token" : this.usuario_actual_token
    }
    /* this.login(datos).subscribe((resp: any) => {
      if(resp.resultado == 'valido') { */
        this.setLoggueado2(false)
        localStorage.removeItem('usuarioActual');
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login')
      /* }else{
        console.log(resp)
      }
    }) */
  }

  login(datos : any){
    return this.httpClient.post(`${this.url_api}login` , datos)
    .pipe(
      catchError(this.errorHandler)
    )
  } 

  errorHandler(error : any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
 }
}

