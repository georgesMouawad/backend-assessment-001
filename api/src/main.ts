import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';

dotenv.config();

async function bootstrap() {

  const chainId = parseInt(process.env.JUSTANAME_CHAIN_ID as string);
  const origin = process.env.JUSTANAME_ORIGIN as string;
  const domain = process.env.JUSTANAME_DOMAIN as string;
  const apiKey = process.env.JUSTANAME_API_KEY as string;

  if (!chainId) {
    throw new Error('ChainId is required');
  }

  if (chainId !== 1 && chainId !== 11155111) {
    throw new Error('ChainId is not supported');
  }

  if (!origin) {
    throw new Error('Origin is required');
  }

  if (!domain) {
    throw new Error('Domain is required');
  }

  if (!apiKey) {
    throw new Error('API Key is required');
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  app.use(
    session({
      name: 'justasession',
      secret: 'mysecretkeymysecretkey',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, sameSite: true }
    })
  );

  app.use((req, res, next) => {
    req.session = req.session || {};
    next();
  });

  await app.listen(3001);
  console.log('Server is running')
}
bootstrap();
