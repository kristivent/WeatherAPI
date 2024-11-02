import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number | null;
  humidity: number | null;
  windSpeed: string | null;

  constructor(temperature: number | null = null, humidity: number | null = null, description: string | null = null) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = description;
  }
}

// TODO: Complete the WeatherService class
// TODO: Define the baseURL, API key, and city name properties
class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private cityName: string | null = null;

  constructor() {
    this.baseURL = "https://api.openweathermap.org";
    this.apiKey = process.env.WEATHER_API_KEY || "";
    if (!this.apiKey) throw new Error("API key is missing");
  }
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
    if (!response.ok) throw new Error("Failed to fetch location data");
    return response.json();
  }

  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat: lat, lon: lon };
  }

  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    if (!response.ok) throw new Error("Failed to fetch weather data");
    return response.json();
  }

  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any): Weather {
    const temperature = response.main.temp;
    const humidity = response.main.humidity;
    const windSpeed = response.weather[0].windSpeed;
    return new Weather(temperature, humidity, windSpeed);
  }

  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = [];

    forecastArray.push(currentWeather);

    weatherData.forEach((data: any) => {
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      const windSpeed = data.weather[0].description;

      const forecast = new Weather(temperature, humidity, windSpeed);
      forecastArray.push(forecast);
    });

    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  public async getWeatherForCity(city: string): Promise<Weather> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData);
  }
}

export default new WeatherService();
