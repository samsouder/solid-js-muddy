Learning opportunity for [Vite](https://vitejs.dev/), [Vitest](https://vitest.dev/), and [Solid-JS](https://www.solidjs.com/) implemented entirely in Typescript.

Lots of sharp edges still with how to appropriately setup all four to be happy, but works well now.

Hopefully this can help serve as a better template for those wanting to experiment with these projects.

## Requirements

* NodeJS (uses NPM as the package manager)
* Create `.env.local` file at project root with `VITE_OPENWEATHER_API_KEY=[INSERT API KEY HERE]`

## Install

`npm i`

## Run Locally

`npm run dev`

## Build

`npm run build`

## Test (Watch)

`npm run test`

### Test Coverage

`npx vitest run --coverage`
