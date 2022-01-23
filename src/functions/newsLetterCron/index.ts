import { handlerPath } from '@libs/handlerResolver'
import { AWS } from '@serverless/typescript'

export const newsLetterCron: AWS['functions'][''] = {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
    {schedule: 'cron(* * * * ? *)'}
  ],
}
