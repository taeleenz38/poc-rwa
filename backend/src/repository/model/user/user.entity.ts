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


    @Column({
        type: 'varchar',
        name: 'country',
        nullable: true
    })
    country: string;

    @Column({
        type: 'date',
        name: 'birthdate',
        nullable: true
    })
    birthdate: Date;

    @Column({
        type: 'varchar',
        name: 'id_number',
        nullable: true
    })
    idNumber: string;

    @Column({
        type: 'varchar',
        name: 'id_document',
        nullable: true
    })
    idDocument: string;

    @Column({
        type: 'date',
        name: 'id_expiry',
        nullable: true
    })
    idExpiry: Date;

    @Column({
        type: 'varchar',
        name: 'wallet_address',
        nullable: true
    })
    walletAddress: string;

    @Column({
        type: 'boolean',
        name: 'is_active',
        nullable: false,
        default: false
    })
    isActive: boolean;

    @Column({
        type: 'varchar',
        name: 'verification_id',
        nullable: true
    })
    verificationId: string;

    @OneToMany(() => Document, (document) => document.user)
    documents: Promise<Document[]>;

}