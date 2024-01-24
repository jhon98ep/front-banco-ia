import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(private http: HttpClient) {}

  generarValorCuota(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+environment.clave_openIA,
    });
    
    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
            "role": "system",
            "content": "tu eres un asistente que ayudara a calcular el valor de las cuotas de un prestamos, sin explicar la formula, solo dar el resultado."
        },
        {
            "role": "user",
            "content": prompt
        }
      ],
      max_tokens: 100,
    };

    return this.http.post<any>(this.apiUrl, requestBody, { headers });
  }

}
