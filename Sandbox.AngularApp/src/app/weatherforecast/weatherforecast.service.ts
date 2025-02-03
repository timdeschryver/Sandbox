import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { WeatherForecast } from "./weatherforecast.model";

@Injectable({
    providedIn: 'root'
})
export class WeatherForecastService {
    private readonly http= inject(HttpClient);

    getWeatherForecast(): Observable<WeatherForecast[]> {
        return this.http.get<WeatherForecast[]>('/api/weatherforecast');
    }
}