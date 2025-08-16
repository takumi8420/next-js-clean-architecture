import { NextRequest, NextResponse } from 'next/server';
import { createServerContainer } from '@/di/serverContainer';
import { IUserRepository } from '@/domain/repositories/UserRepository';
import { TYPES } from '@/di/types';
import { UserMapper } from '@/application/mappers/UserMapper';
import { toUserId } from '@/domain/valueObjects/UserId';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const container = createServerContainer();
    const userRepository = container.get<IUserRepository>(TYPES.UserRepository);

    const user = await userRepository.findById(toUserId(id));

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(UserMapper.toDto(user));
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const container = createServerContainer();
    const userRepository = container.get<IUserRepository>(TYPES.UserRepository);

    const userId = toUserId(id);
    const user = await userRepository.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();

    // 更新可能なフィールドのみ更新
    if (body.name) {
      user.updateName(body.name);
    }
    if (body.status) {
      user.updateStatus(body.status);
    }

    await userRepository.save(user);

    return NextResponse.json(UserMapper.toDto(user));
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const container = createServerContainer();
    const userRepository = container.get<IUserRepository>(TYPES.UserRepository);

    await userRepository.delete(toUserId(id));

    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
