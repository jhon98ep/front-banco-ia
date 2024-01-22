import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { end } from '@popperjs/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url_api = environment.url;

  constructor(
    private httpClient: HttpClient,
  ) { }

  peticionPost(datos : any, endPoint : string){
    return this.httpClient.post(this.url_api + endPoint, datos)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  peticionGet(datos : any, endPoint : string){
    return this.httpClient.get(this.url_api + endPoint)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  peticionPatch(datos : any, endPoint : string){
    return this.httpClient.patch(this.url_api + endPoint, datos)
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
