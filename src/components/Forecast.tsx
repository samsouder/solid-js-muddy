import { WeatherData } from "../lib/getWeather";

const Forecast = (props: { loading: boolean; forecast?: WeatherData }) => {
  const loadingClass = props.loading ? "animate-pulse" : "";
  const tempString = !props.loading
    ? `${props.forecast?.averageTemperature.toFixed()} °`
    : "—";
  const precipString = !props.loading
    ? `${props.forecast?.precipitation.toFixed()} ″`
    : "—";

  return (
    <aside class={loadingClass}>
      <h3 class="text-2xl mb-3 font-semibold">Forecast</h3>
      <dl class="">
        <dt class="text-lg font-medium text-gray-500 dark:text-gray-300">
          Average Temperature:
        </dt>
        <dd class="text-3xl leading-7 text-gray-900 dark:text-gray-100">
          {tempString}
        </dd>
        <dt class="pt-4 text-lg font-medium text-gray-500 dark:text-gray-300">
          Precipitation Total:
        </dt>
        <dd class="text-3xl leading-7 text-gray-900 dark:text-gray-100">
          {precipString}
        </dd>
      </dl>
    </aside>
  );
};

export default Forecast;
