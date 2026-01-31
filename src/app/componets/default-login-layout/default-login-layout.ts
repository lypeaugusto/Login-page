import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-default-login-layout',
    standalone: true,
    imports: [],
    templateUrl: './default-login-layout.html',
    styleUrl: './default-login-layout.scss',
})
export class DefaultLoginLayout {

    @Input() title: string = 'Login into your account';
    @Input() primaryButtonText: string = 'Login now';
    @Input() secondaryButtonText: string = 'Sign up';
    @Input() isPrimaryButtonDisabled: boolean = false;

    @Output() submit = new EventEmitter<void>();
    @Output() navigate = new EventEmitter<void>();


    onSubmitClick() {
        this.submit.emit();
    }

    onNavigateClick() {
        this.navigate.emit();
    }
}
