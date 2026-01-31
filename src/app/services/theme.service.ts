import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private darkModeSignal = signal<boolean>(this.getInitialMode());

    darkMode = this.darkModeSignal.asReadonly();

    constructor() {
        this.applyTheme();
    }

    toggleDarkMode() {
        this.darkModeSignal.update(mode => !mode);
        this.saveMode();
        this.applyTheme();
    }

    private getInitialMode(): boolean {
        const saved = localStorage.getItem('dark-mode');
        return saved ? saved === 'true' : true;
    }

    private saveMode() {
        localStorage.setItem('dark-mode', this.darkMode().toString());
    }

    private applyTheme() {
        if (this.darkMode()) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
}
