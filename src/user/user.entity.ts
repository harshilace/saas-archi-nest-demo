import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @CreateDateColumn({ nullable: true })
    created_at: Date;

    @UpdateDateColumn({ nullable: true })
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}