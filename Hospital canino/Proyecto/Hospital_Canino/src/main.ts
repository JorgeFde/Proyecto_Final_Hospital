// Se modifica el main ts para agregar la anumacuones del provideAnimations
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations'; // ✅ IMPORTANTE
import { AppComponent } from './app/app.component';
const appConfig = {
  providers: [provideAnimations()] // ✅ AÑADIDO
};
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));