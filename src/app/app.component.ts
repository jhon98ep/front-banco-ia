import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './Service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-banco-ia';

  usuario_actual: any;

  constructor(   
    private router: Router ,
    private authService: AuthService
  ) {  
    this.initializeApp();
  }

  async initializeApp() {
    if(localStorage.getItem('usuarioLoggueado') == 'true'){
      console.log('usuario loggueado');
    }else{
      this.authService.setLoggueado2(false);
      localStorage.removeItem('usuarioActual');
      localStorage.removeItem('token');
      this.router.navigateByUrl('/login')
    }
  }
}
