# angular-express-rules-engine

`npm install`

Create a file for the Environment setup for the AWS Cognito authentication in the path 

/client/src/environments/environment.ts and replace with your values.

``` 
export const environment = {
cognitoClientId: 'your_Cognito_Client_ID',
cognitoDomain: 'Your_Cognito_Domain',
redirectUri: 'URL'
};
```

## Frontend

`cd client`

`npm install`

Run with `ng serve` in client
Create a component with `ng generate component COMPONENT_NAME`

## Backend
`cd server`

`npm install`

Edit [index.ts](server/src/index.ts) file for routes. Add additional ts files in src directory. 

Run with `npm run dev` in server. 


