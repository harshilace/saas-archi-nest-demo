import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async getUsers(): Promise<User[]> {
        const fields = ['user.user_id', 'user.name', 'user.email', 'user.created_at'];
        const users = await this.userRepository.createQueryBuilder('user')
            .select(fields)
            .getMany();

        return users;
    }

    async getUser(user_id): Promise<User | null> {
        const fields = ['user.user_id', 'user.name', 'user.email', 'user.created_at'];
        const user = await this.userRepository.createQueryBuilder('user')
            .select(fields)
            .where({ user_id })
            .getOne();
        return user;
    }

    async findOne(email: string): Promise<User | undefined> {
        const user = await this.userRepository.findOneBy({ 'email': email });
        return user;
    }

    async addUser(user): Promise<any> {
        const data = await new Promise(resolve => {
            const data = this.userRepository.save(user);
            resolve(data);
        });
        
        return  {
            'user_id': data['user_id'],
            'name': data['name'],
            'email': data['email'],
            'created_at': data['created_at'],
        };
    }
}
