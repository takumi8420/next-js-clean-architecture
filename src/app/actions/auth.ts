'use server';

import { createServerContainer } from '@/di/serverContainer';
import { LoginUseCase } from '@/application/useCases/LoginUseCase';
import { ValidateTokenUseCase } from '@/application/useCases/ValidateTokenUseCase';
import { TYPES } from '@/di/types';
import { cookies } from 'next/headers';

const AUTH_COOKIE_NAME = 'auth-token';

export async function login(email: string, password: string) {
  try {
    const container = createServerContainer();
    const loginUseCase = container.get<LoginUseCase>(TYPES.LoginUseCase);

    const result = await loginUseCase.execute({ email, password });

    // トークンをcookieに保存
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: result.expiresAt,
      path: '/',
    });

    return { success: true, user: result.user };
  } catch {
    return { success: false, error: 'Invalid credentials' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  return { success: true };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const container = createServerContainer();
    const validateTokenUseCase = container.get<ValidateTokenUseCase>(TYPES.ValidateTokenUseCase);

    const result = await validateTokenUseCase.execute({ token });
    return result.user;
  } catch {
    return null;
  }
}
