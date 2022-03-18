import { WeatherData } from "../lib/getWeather";

const Forecast = (props: { loading: boolean; forecast?: WeatherData }) => {
  const loadingClass = props.loading ? "animate-pulse" : "";

  return (
    <aside class={loadingClass}>
      <h3 class="text-2xl mb-3 font-semibold">Forecast</h3>
      <dl class="">
        <dt class="text-lg font-medium text-gray-500 dark:text-gray-300">
          Average Temperature:
        </dt>
        <dd class="text-3xl leading-7 text-gray-900 dark:text-gray-100">
          {props.forecast?.averageTemperature.toFixed() ?? 0} &deg;
        </dd>
        <dt class="pt-4 text-lg font-medium text-gray-500 dark:text-gray-300">
          Precipitation Total:
        </dt>
        <dd class="text-3xl leading-7 text-gray-900 dark:text-gray-100">
          {props.forecast?.precipitation.toPrecision(2) ?? 0} &Prime;
        </dd>
      </dl>
    </aside>
  );
};

export default Forecast;
