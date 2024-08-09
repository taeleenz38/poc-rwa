import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Document } from "../documents/document.entity";

@Entity("user")
export class User extends BaseEntity {

    @PrimaryGeneratedColumn({
        name: 'id'
    })
    id: number;

    @Column({
        type: 'varchar',
        name: 'first_name'
    })
    firstName: string;

    @Column({
        type: 'varchar',
        name: 'last_name'
    })
    lastName: string;

    @Column({
        type: 'varchar',
        name: 'email'
    })
    email: string;

    @Column({
        type: 'varchar',
        name: 'password',
        nullable: true
    })
    password: string;

    @OneToMany(() => Document, (document) => document.user)
    documents: Promise<Document[]>;

}