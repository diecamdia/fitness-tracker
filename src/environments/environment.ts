// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCAeYociJedMNOXAVSv5dliLWmNihwoZvA",
    authDomain: "fitness-traker.firebaseapp.com",
    databaseURL: "https://fitness-traker.firebaseio.com",
    projectId: "fitness-traker",
    storageBucket: "fitness-traker.appspot.com",
    messagingSenderId: "428308513247"
  }
};
