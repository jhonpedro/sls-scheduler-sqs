import type { AWS } from '@serverless/typescript'

import { newsLetterMail } from '@functions/newsLetterMail'
import { newsLetterCron } from '@functions/newsLetterCron'

import { NEWS_LETTER_QUEUE_NAME } from 'src/utils/constants'

const serverlessConfiguration: AWS = {
	service: 'sls-schedule-mail',
	frameworkVersion: '2',
	useDotenv: true,
	provider: {
		name: 'aws',
		runtime: 'nodejs14.x',
		region: 'us-east-2',
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
			STAGE: '${opt:stage}, "dev"',
			AWS_ACCOUNT_ID: '${env:AWS_ACCOUNT_ID}',
			SMTP_HOST: '${env:SMTP_HOST}',
			SMTP_PORT: '${env:SMTP_PORT}',
			SMTP_USER: '${env:SMTP_USER}',
			SMTP_PASSWORD: '${env:SMTP_PASSWORD}',
			SMTP_FROM: '${env:SMTP_FROM}',
		},
		lambdaHashingVersion: '20201221',
		iam: {
			role: {
				statements: [{ Effect: 'Allow', Resource: '*', Action: ['sqs:*'] }],
			},
		},
	},
	custom: {
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ['aws-sdk'],
			target: 'node14',
			define: { 'require.resolve': undefined },
			platform: 'node',
		},
	},
	plugins: ['serverless-esbuild'],

	// import the function via paths
	functions: { newsLetterMail, newsLetterCron },
	resources: {
		Resources: {
			// https://docs.aws.amazon.com/pt_br/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html
			NewsLetterQueueFifo: {
				Type: 'AWS::SQS::Queue',
				Properties: {
					QueueName: NEWS_LETTER_QUEUE_NAME,
					FifoQueue: true,
					ContentBasedDeduplication: true,
				},
			},
		},
	},
}

module.exports = serverlessConfiguration
