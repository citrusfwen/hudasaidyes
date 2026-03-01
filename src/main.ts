import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { IMAGE_CONFIG } from '@angular/common';

bootstrapApplication(AppComponent, {
    providers: [
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true
      }
    }
  ]
}).catch((err) => console.error(err));
