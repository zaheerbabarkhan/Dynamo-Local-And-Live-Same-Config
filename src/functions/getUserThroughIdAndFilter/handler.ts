import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { dynamo } from '@libs/dynamo.config';

const getUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	try {
		const id = event.pathParameters.id;
		const query = {
			TableName: 'MyFirstEvertableOfDynamoDB',
			KeyConditionExpression: 'ID = :id',
			ExpressionAttributeValues: {
				':id': id,
				':firstName': event.body.firstName,
			},
			FilterExpression: 'begins_with (firstName, :firstName)',
		};
		const queriedValue = await dynamo.query(query).promise();
		return formatJSONResponse({
			message: queriedValue,
		});
	} catch (error) {
		return formatJSONResponse({
			message: error,
		});
	}
};

export const main = middyfy(getUser);
