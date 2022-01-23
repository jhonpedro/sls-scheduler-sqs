import { SQS } from '@aws-sdk/client-sqs'
import { NEWS_LETTER_QUEUE_NAME } from 'src/utils/constants'

const handler = async () => {
	console.info('Running')

	const sqsClient = new SQS({ region: 'us-east-2' })

	await sqsClient.sendMessage({
		MessageBody: JSON.stringify({ email: 'pedrobarros2010@gmail.com' }),
		QueueUrl: `https://sqs.us-east-2.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/${NEWS_LETTER_QUEUE_NAME}`,
		MessageGroupId: 'test',
	})

	console.info('Completed')
	return true
}

export const main = handler
