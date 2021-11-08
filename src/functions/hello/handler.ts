import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {v4} from 'uuid'
import * as AWS from 'aws-sdk';
import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  
  try {
    const id = v4();
  const dynamo = process.env.IS_OFFLINE ? new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  }) : new AWS.DynamoDB.DocumentClient();


  
  const params = {
    TableName: 'MyFirstEvertableOfDynamoDB',
    Item: {
      ID: id,
      Name: event.body.name
    }
  }
  console.log(process.env);
  
    await dynamo.put(params).promise()
    return formatJSONResponse({
      message:  await dynamo.scan({TableName: 'MyFirstEvertableOfDynamoDB',}).promise(),
      status: "Data Saved"
    });
  } catch (error) {
    return formatJSONResponse({
      message: error
    });
  }

}

export const main = middyfy(hello);
