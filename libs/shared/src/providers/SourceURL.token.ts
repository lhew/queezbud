import { InjectionToken } from '@angular/core';

export const SOURCE_URL_TOKEN = new InjectionToken<string>('SOURCE_URL_TOKEN', {
    providedIn: 'root',
    factory: () => 'http://localhost:8888/v1/projects/queezbud/databases/queezbud-db/documents/',
});