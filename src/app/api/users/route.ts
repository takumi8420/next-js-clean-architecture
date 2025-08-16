import { NextRequest, NextResponse } from 'next/server';
import { createServerContainer } from '@/di/serverContainer';
import { IUserRepository } from '@/domain/repositories/UserRepository';
import { TYPES } from '@/di/types';
import { UserMapper } from '@/application/mappers/UserMapper';
import { Email } from '@/domain/valueObjects/Email';

export async function GET(request: NextRequest) {
  try {
    const container = createServerContainer();
    const userRepository = container.get<IUserRepository>(TYPES.UserRepository);

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (email) {
      // メールアドレスで検索
      const user = await userRepository.findByEmail(new Email(email));
      return NextResponse.json(user ? [UserMapper.toDto(user)] : []);
    }

    // 全ユーザーを取得
    const users = await userRepository.findAll();
    const userDTOs = users.map((user) => UserMapper.toDto(user));

    return NextResponse.json(userDTOs);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
