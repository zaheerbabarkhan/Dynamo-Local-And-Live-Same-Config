import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { dynamo } from '@libs/dynamo.config';
const filterUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	try {
		const data = event.body;
		const params = {
			TableName: 'MyFirstEvertableOfDynamoDB',
			ExpressionAttributeValues: {
				':firstName': data.firstName,
			},
			FilterExpression: 'begins_with (firstName, :firstName)',
			ProjectionExpression: 'firstName, lastName',
		};
		const scannedData = await dynamo.scan(params).promise();
		return formatJSONResponse({
			message: scannedData,
			status: 'Data Saved',
		});
	} catch (error) {
		return formatJSONResponse({
			message: error,
		});
	}
};

export const main = middyfy(filterUser);
