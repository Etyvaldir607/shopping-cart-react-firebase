// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    authUrl: '',
    api: '',
    subPath: '',
    loginUrl: '',

    firebase: {
      apiKey: "AIzaSyC5eh0QwG6OGrLlc8tIN6cTodYuc1EYfM4",
      authDomain: "ecommerce-pizza-great.firebaseapp.com",
      projectId: "ecommerce-pizza-great",
      storageBucket: "ecommerce-pizza-great.appspot.com",
      messagingSenderId: "335807739464",
      appId: "1:335807739464:web:45d4e4594ac7074a19ca7d"
    }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
