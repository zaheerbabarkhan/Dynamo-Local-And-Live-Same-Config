import * as AWS from 'aws-sdk';

export const dynamo = process.env.IS_OFFLINE
	? new AWS.DynamoDB.DocumentClient({
			region: 'localhost',
			endpoint: 'http://localhost:8000',
	  })
	: new AWS.DynamoDB.DocumentClient();
