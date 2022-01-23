import { handlerPath } from '@libs/handlerResolver'
import { AWS } from '@serverless/typescript'
import { NEWS_LETTER_QUEUE_NAME } from 'src/utils/constants'

export const newsLetterMail: AWS['functions'][''] = {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			sqs: {
				arn: {
					'Fn::Join': [
						':',
						[
							'arn',
							'aws',
							'sqs',
							{ Ref: 'AWS::Region' },
							{ Ref: 'AWS::AccountId' },
							NEWS_LETTER_QUEUE_NAME,
						],
					],
				},
			},
		},
	],
}

