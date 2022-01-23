import { SQSEvent } from 'aws-lambda'
import { createTransport } from 'nodemailer'
import { render } from 'ejs'

const handler = async (event: SQSEvent) => {
	console.info('Running')

	const messageInput = JSON.parse(event.Records[0].body) as { email: string }

	const transport = createTransport({
		host: process.env.SMTP_HOST,
		port: +process.env.SMTP_PORT,
		secure: false,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD,
		},
	})

  // Should setup copy of .ejs files
	const html = render(`
    <!DOCTYPE html>
    <html lang="pt-Br">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <h1>Olá, aqui está a sua news letter</h1>
      <br>
      <p>Aí tem esses, esses e esses artigos essa semana aqui.</p>
    </body>
    </html>
  `)

	await transport.sendMail({
		from: process.env.SMTP_FROM,
		to: messageInput.email,
		subject: 'News Letter',
		html: html,
	})

	console.info('Completed')
	return true
}

export const main = handler
