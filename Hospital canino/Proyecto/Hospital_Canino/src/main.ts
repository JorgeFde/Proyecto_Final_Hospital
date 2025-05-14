import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
// ✅ AngularFire imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth'; // Firebase auth
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBkwI3XmGYNdolSMBoJFqNTGhfM4RTPd_Y",
  authDomain: "hospital-canino-frontend.firebaseapp.com",
  projectId: "hospital-canino-frontend",
  storageBucket: "hospital-canino-frontend.firebasestorage.app",
  messagingSenderId: "440021040783",
  appId: "1:440021040783:web:cd55cd3f4787f8ece13afa"
};
// Configuración para bootstrapApplication
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()) // firebase auth
  ]
}).catch(err => console.error(err));
