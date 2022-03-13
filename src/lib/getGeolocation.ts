export const getGeolocation = async (): Promise<GeolocationPosition> => {
  /* c8 ignore next 3 */
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
