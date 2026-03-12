import dotenv from 'dotenv'
import AppError from '../app/errorHelpers/AppError'
import status from 'http-status'

dotenv.config()

interface EnvConfig {
  PORT: number
  NODE_ENV: string
  DATABASE_URL: string
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  ACCESS_TOKEN_SECRET: string
  REFRESH_TOKEN_SECRET: string
  ACCESS_TOKEN_EXPIRES_IN: string
  REFRESH_TOKEN_EXPIRES_IN: string
  BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: string
  BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string
}

const envConfig = (): EnvConfig => {
  const requiredEnvVariables = [
    'PORT',
    'NODE_ENV',
    'DATABASE_URL',
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_URL',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'ACCESS_TOKEN_EXPIRES_IN',
    'REFRESH_TOKEN_EXPIRES_IN',
    'BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN',
    'BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE'
  ]
  requiredEnvVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      // throw new Error(`Environment variable ${envVar} is required`)
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${envVar} is required`
      )
    }
  })
  return {
    PORT: parseInt(process.env.PORT || '5000'),
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || '',
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || '',
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || '',
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env
      .BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as string,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env
      .BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string
  }
}

export const envVariables = envConfig()
