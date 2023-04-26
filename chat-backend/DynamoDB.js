const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { defaultProvider } = require("@aws-sdk/credential-provider-node");

let client = null;

if (process.env.ENVIRONMENT === 'development') {
  // ローカル環境
  client = new DynamoDBClient({
    credentials: defaultProvider({
      accessKeyId: "dummy",
      secretAccessKey: "dummy",
    }),
    region: process.env.AWS_REGION,
    endpoint: process.env.DYNAMO_ENDPOINT,
    sslEnabled: false
  });
} else {
  // 本番環境
  client = new DynamoDBClient({
    region: process.env.AWS_REGION,
  });
}

const dynamoDB = DynamoDBDocumentClient.from(client);

module.exports = dynamoDB;