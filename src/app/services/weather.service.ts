import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    private apiKey = 'b8fbdd30ccbb293e23c38076403403d6';
    private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

    constructor(private http: HttpClient) { }

    getWeather(city: string = 'Sao Paulo'): Observable<any> {
        const params = new HttpParams()
            .set('q', city)
            .set('units', 'metric')
            .set('lang', 'pt_br')
            .set('appid', this.apiKey);

        return this.http.get(this.baseUrl, { params }).pipe(
            tap({
                error: (err) => {
                    if (err.status === 401) {
                        console.error('ERRO CRÍTICO: Chave da API (API KEY) inválida ou expirada no OpenWeatherMap.');
                    }
                }
            })
        );
    }

    getWeatherByCoords(lat: number, lon: number): Observable<any> {
        const params = new HttpParams()
            .set('lat', lat.toString())
            .set('lon', lon.toString())
            .set('units', 'metric')
            .set('lang', 'pt_br')
            .set('appid', this.apiKey);

        return this.http.get(this.baseUrl, { params });
    }
}
