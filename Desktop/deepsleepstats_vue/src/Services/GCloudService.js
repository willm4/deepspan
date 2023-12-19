/* eslint-disable no-undef */

export default class GCloudService {


  // static async initialize(){
  //   gapi.load("client:auth2", () => {
  //     gapi.auth2.init({ client_id: process.env.VUE_APP_GCLOUD_CLIENT_ID });
  //   });
  // }

  // static async authenticate() {
  //   gapi.auth2.getAuthInstance()
  //     .signIn({ scope: "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/cloud-platform.read-only https://www.googleapis.com/auth/logging.admin https://www.googleapis.com/auth/logging.read" })
  //     .then(() => {
  //       console.log("Sign-in successful");
  //     })
  //     .catch((err) => {
  //       console.error("Error signing in", err);
  //     });
  // }

  // static async load() {
  //   gapi.client.setApiKey(process.env.VUE_APP_GCLOUD_API_KEY);
  //   gapi.client.load("https://logging.googleapis.com/$discovery/rest?version=v2")
  //     .then(() => {
  //       console.log("GAPI client loaded for API");
  //     })
  //     .catch((err) => {
  //       console.error("Error loading GAPI client for API", err);
  //     });
  // }

  // static  async execute() {
  //   gapi.client.logging.entries.list({
  //     resource: {
  //       resourceNames: ["projects/sleepnet"],
  //       filter: "timestamp>2023-12-11 AND resource.type=gae_app"
  //     }
  //   })
  //     .then((response) => {
  //       console.log("Response", response);
  //     })
  //     .catch((err) => {
  //       console.error("Execute error", err);
  //     });
  // }
    
  static authGoogle(){
    const self = this;
    window.onload = function () {
      console.log('GOOGLE INITIALIZING ')
      google.accounts.id.initialize({
        scope: "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/cloud-platform.read-only https://www.googleapis.com/auth/logging.admin https://www.googleapis.com/auth/logging.read",
        //client_id: process.env.VUE_APP_GCLOUD_CLIENT_ID,
        client_id: "481422764072-jfm8pc5b2vbao84ubaj1iij068fh4sgi.apps.googleusercontent.com",
        callback: (response)=>{
          console.log('GOT GCLOUD RESPONSE ', response)
           self.execute();
        }
      });
      google.accounts.id.prompt();
    };
  }

    static getGcloudDate(){


        function authenticate() {
          return gapi.auth2.getAuthInstance()
              .signIn({scope: "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/cloud-platform.read-only https://www.googleapis.com/auth/logging.admin https://www.googleapis.com/auth/logging.read"})
              .then(function() { console.log("Sign-in successful"); },
                    function(err) { console.error("Error signing in", err); });
        }
        function loadClient() {
          //gapi.client.setApiKey(process.env.VUE_APP_GCLOUD_API_KEY);
          gapi.client.setApiKey("AIzaSyBP4lLlp4aMoQ7AR7Q7B__PS9fVaUzN9eg");

          return gapi.client.load("https://logging.googleapis.com/$discovery/rest?version=v2")
              .then(function() { console.log("GAPI client loaded for API"); },
                    function(err) { console.error("Error loading GAPI client for API", err); });
        }
        // Make sure the client is loaded and sign-in is complete before calling this method.
        gapi.load("client:auth2", function() {
            console.log("GCLOUD CLIENT ID " ,process.env.VUE_APP_GCLOUD_CLIENT_ID)
            //gapi.auth2.init({client_id: process.env.VUE_APP_GCLOUD_CLIENT_ID});
            gapi.auth2.init({client_id: "481422764072-jfm8pc5b2vbao84ubaj1iij068fh4sgi.apps.googleusercontent.com"});
            authenticate().then(loadClient);
        });
      }
      static  execute() {
        gapi.load("client:auth2", function(){
          //gapi.auth2.init({client_id: process.env.VUE_APP_GCLOUD_CLIENT_ID});
        //   gapi.auth2.init({client_id: "481422764072-jfm8pc5b2vbao84ubaj1iij068fh4sgi.apps.googleusercontent.com"});
        //   gapi.client.setApiKey("AIzaSyBP4lLlp4aMoQ7AR7Q7B__PS9fVaUzN9eg");
        //  // gapi.client.setApiKey(process.env.VUE_APP_GCLOUD_API_KEY);
          gapi.client.load("https://logging.googleapis.com/$discovery/rest?version=v2")
              .then(function() { 

                return gapi.client.logging.entries.list({
                  "resource": {
                      "resourceNames": [
                        "projects/sleepnet"
                      ],
                      "filter": "timestamp&gt;2023-12-11 AND resource.type = gae_app"
                    }
              })
                  .then(function(response) {
                          // Handle the results here (response.result has the parsed body).
                          console.log("Response", response);
                        },
                        function(err) { console.error("Execute error", err); });
               },
                    function(err) { console.error("Error loading GAPI client for API", err); });
        });
      }
}