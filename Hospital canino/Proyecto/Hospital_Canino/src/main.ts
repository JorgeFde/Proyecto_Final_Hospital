import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
// ✅ AngularFire imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA5rq-sXrEXbu6IsBLqgxYKH1JhIpUCy7U",
  authDomain: "petshome-66b13.firebaseapp.com",
  projectId: "petshome-66b13",
  storageBucket: "petshome-66b13.appspot.com",  // ⚠️ corregido: terminaba en ".app" y debería ser ".appspot.com"
  messagingSenderId: "719590596672",
  appId: "1:719590596672:web:5caf97b876aab3a59b7fa5",
  measurementId: "G-KH5ZC185BE"
};
// Configuración para bootstrapApplication
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
  ]
}).catch(err => console.error(err));
