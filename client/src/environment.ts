export const environment = {
  production: false,
  cognito: {
    userPoolId: 'us-east-2_aUy6eVBLl',  // Replace with your User Pool ID
    userPoolWebClientId: '45hrc14o258efargko3bn6tnpk',  // App client ID
    region: 'us-east-2',  // Replace with your region
    hostedUI: 'https://hrushikesh.auth.us-east-2.amazoncognito.com/login?client_id=45hrc14o258efargko3bn6tnpk&response_type=code&scope=email+openid+phone&redirect_uri=http://localhost:4200'
  }
};
