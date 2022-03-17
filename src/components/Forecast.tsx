import { WeatherData } from "../lib/getWeather";

const Forecast = (props: { loading: boolean; forecast?: WeatherData }) => {
  const loadingClass = props.loading
    ? "grid justify-items-center animate-pulse"
    : "grid justify-items-center";

  return (
    <aside class={loadingClass}>
      <h3 class="text-2xl mt-6 mb-3 font-semibold">Forecast</h3>
      <dl class="w-3/4">
        <div class="grid grid-cols-2 gap-2">
          <dt class="text-lg font-medium text-gray-500 dark:text-gray-300 text-right">
            Average Temperature:
          </dt>
          <dd class="text-3xl leading-7 text-gray-900 dark:text-gray-100 text-left">
            {props.forecast?.averageTemperature.toFixed() ?? 0} &deg;
          </dd>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-4">
          <dt class="text-lg font-medium text-gray-500 dark:text-gray-300 text-right">
            Precipitation Total:
          </dt>
          <dd class="text-3xl leading-7 text-gray-900 dark:text-gray-100 text-left">
            {props.forecast?.precipitation.toPrecision(2) ?? 0} &Prime;
          </dd>
        </div>
      </dl>
    </aside>
  );
};

export default Forecast;
