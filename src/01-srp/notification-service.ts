export interface NotificationService {
    notify(email: string, message: string): void;
}

export class ConsoleEmailNotifier implements NotificationService {

    notify(email: string, message: string): void {
        if (!email.includes('@')) {
            throw new Error(`Correo inválido: "${email}"`);
        }
        console.log(`Enviando correo a ${email}: ${message}`);
    }
}
