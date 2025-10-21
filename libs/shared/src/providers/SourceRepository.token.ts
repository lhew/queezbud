import { InjectionToken } from '@angular/core';

export const SOURCE_REPOSITORY = new InjectionToken<string>('SOURCE_REPOSITORY', {
    providedIn: 'root',
    factory: () => 'rest',
});