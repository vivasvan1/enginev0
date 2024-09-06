import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  private readonly users: User[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    return this.users.find((user) => user.id === id);
  }

  create(userDto: UserDto): User {
    const user = { ...userDto } as User;
    user.id = this.users.length + 1;
    this.users.push(user);
    return user;
  }
}
