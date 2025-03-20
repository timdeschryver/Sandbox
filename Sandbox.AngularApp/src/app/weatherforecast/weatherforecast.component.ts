import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WeatherForecastService } from '@/weatherforecast/weatherforecast.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-weather-forecast',
	templateUrl: './weatherforecast.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DatePipe],
})
export default class WeatherForecastComponent {
	private readonly weatherForecastService = inject(WeatherForecastService);

	protected readonly weatherforecast = rxResource({
		loader: () => this.weatherForecastService.getWeatherForecast(),
	});

	protected refresh() {
		this.weatherforecast.reload();
	}
}
