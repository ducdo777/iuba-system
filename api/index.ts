import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express, { Request, Response } from 'express';
import compression from 'compression';
import { AppModule } from '../src/app.module';

let cachedApp: express.Application;
let appInitPromise: Promise<express.Application> | null = null;

async function createNestApp() {
  if (cachedApp) {
    return cachedApp;
  }

  // Prevent multiple simultaneous initializations
  if (appInitPromise) {
    return appInitPromise;
  }

  appInitPromise = (async () => {
    const expressApp = express();
    
    // Enable compression for better performance
    expressApp.use(compression());
    
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      {
        logger: process.env.NODE_ENV === 'development' ? ['log', 'error', 'warn'] : ['error'],
      },
    );

    app.enableCors({
      origin: true,
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
    cachedApp = expressApp;
    appInitPromise = null;

    return cachedApp;
  })();

  return appInitPromise;
}

export default async function handler(req: Request, res: Response) {
  try {
    const app = await createNestApp();
    return app(req, res);
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
