import status from 'http-status'
import {
  Role,
  User,
  UserStatus
} from '../../../../generated/prisma/client/client'
import AppError from '../../errorHelpers/AppError'
import { auth } from '../../lib/auth'
import { prisma } from '../../lib/prisma'

const registerPatient = async (payload: User & { password: string }) => {
  const { name, email, password } = payload
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password
      //* this value have default value so you can skip it also
      // needPasswordChange: false,
      // role: Role.PATIENT
    }
  })
  if (!data.user) {
    // throw new Error('Failed to Register')
    throw new AppError(status.BAD_REQUEST, 'Failed to Register')
  }
  try {
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name,
          email
        }
      })
      return patientTx
    })
    return { ...data, patient }
  } catch (error) {
    console.log('Transaction error : ', error)
    await prisma.user.delete({
      where: {
        id: data.user.id
      }
    })
    throw error
  }
}

const loginUser = async (payload: User & { password: string }) => {
  const { email, password } = payload
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  })
  if (!data.user) {
    // throw new Error('Failed to Login')
    throw new AppError(status.BAD_REQUEST, 'Failed to Login')
  }
  if (data.user.status !== UserStatus.ACTIVE) {
    throw new AppError(status.FORBIDDEN, 'User is not active')
  }
  if (data.user.isDeleted) {
    throw new AppError(status.GONE, 'User is deleted')
  }
  return data
}

export const AuthService = {
  registerPatient,
  loginUser
}
