// Central configuration for the static web app.
//
// New deployments should only need to edit this file.
// Do NOT commit secrets here.

window.APP_CONFIG = {
  aws: {
    region: "ap-south-1",
    s3Bucket: "doc-parser-app-as",
    cognito: {
      // Example: "ap-south-1_XXXXXXXXX"
      userPoolId: "ap-south-1_72jrSgVgi",
      // Example: "xxxxxxxxxxxxxxxxxxxxxxxxxx"
      clientId: "73o39h36c36r253ijh5sstnj7e",
      // Example: "ap-south-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      identityPoolId: "ap-south-1:572e2fdb-95bc-4675-ba7d-aec010896169",
      // Example: "https://<your-domain>.auth.<region>.amazoncognito.com"
      hostedUiDomain: "https://ap-south-172jrsgvgi.auth.ap-south-1.amazoncognito.com",
      // MUST match the Cognito app client's Allowed Callback URLs exactly
      redirectUri: "https://doc-parser-app-as.s3.ap-south-1.amazonaws.com/doc-parser.html",
    },
  },
  api: {
    processUrl: "https://11ghprcjk7.execute-api.ap-south-1.amazonaws.com/process",
  },
};

