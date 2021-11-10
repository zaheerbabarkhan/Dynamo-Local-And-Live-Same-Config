import type { AWS } from '@serverless/typescript';

import hello from '@functions/addUser';
import update from '@functions/updateUser';
import getUser from '@functions/getUserThroughIdAndFilter';
import filterUser from '@functions/filterUser';
import conditionalUpdate from '@functions/conditionalUpdate';
const serverlessConfiguration: AWS = {
	service: 'dynamo-crud-for-the-first',
	frameworkVersion: '2',
	custom: {
		'dynamodb': {
			'stages': ['dev'],
			'start': {
				'migrate': true,
				'seed': true,
			},
		},
		TableName: 'MyFirstEvertableOfDynamoDB',
	},
	plugins: [
		'serverless-esbuild',
		'serverless-offline',
		'serverless-dynamodb-local',
	],
	provider: {
		name: 'aws',
		runtime: 'nodejs14.x',
		region: 'eu-west-2',
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
		},
		lambdaHashingVersion: '20201221',
		'iamRoleStatements': [
			{
				'Effect': 'Allow',
				'Action': ['dynamodb:PutItem', 'dynamodb:Scan'],
				Resource:
					'arn:aws:dynamodb:${self:provider.region}:*:table/${self:custom.TableName}',
			},
		],
	},
	// import the function via paths
	functions: { hello, update, getUser, filterUser, conditionalUpdate },
	resources: {
		Resources: {
			dynamoTable: {
				Type: 'AWS::DynamoDB::Table',
				Properties: {
					TableName: '${self:custom.TableName}',
					BillingMode: 'PAY_PER_REQUEST',
					AttributeDefinitions: [
						{
							AttributeName: 'ID',
							AttributeType: 'S',
						},
					],
					KeySchema: [
						{
							AttributeName: 'ID',
							KeyType: 'HASH',
						},
					],
				},
			},
		},
	},
};

module.exports = serverlessConfiguration;
