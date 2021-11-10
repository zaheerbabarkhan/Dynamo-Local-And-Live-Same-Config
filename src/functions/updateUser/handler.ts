import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { dynamo } from '@libs/dynamo.config';

const update: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	try {
		const query = {
			TableName: 'MyFirstEvertableOfDynamoDB',
			Key: {
				ID: event.body.ID,
			},
			UpdateExpression: 'set firstName = :updatedName',
			ExpressionAttributeValues: {
				':updatedName': event.body.firstName,
			},
			ReturnValues: 'UPDATED_NEW',
		};
		const updatedValue = await dynamo.update(query).promise();
		return formatJSONResponse({
			message: updatedValue,
		});
	} catch (error) {
		return formatJSONResponse({
			message: error,
		});
	}
};

export const main = middyfy(update);
