import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { v4 } from 'uuid';
import schema from './schema';
import { dynamo } from '@libs/dynamo.config';
const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	try {
		const data = event.body;
		const id = v4();

		const params = {
			TableName: 'MyFirstEvertableOfDynamoDB',
			Item: {
				ID: id,
				firstName: data.firstName,
				lastName: data.lastName,
				age: data.age,
			},
		};
		await dynamo.put(params).promise();
		return formatJSONResponse({
			message: await dynamo
				.scan({ TableName: 'MyFirstEvertableOfDynamoDB' })
				.promise(),
			status: 'Data Saved',
		});
	} catch (error) {
		return formatJSONResponse({
			message: error,
		});
	}
};

export const main = middyfy(hello);
