import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { DocumentStatus } from "./documentstatus.enum";

@Entity("document")
export class Document extends BaseEntity {


    @PrimaryGeneratedColumn({
        name: 'id'
    })
    id: number;

    @Column({
        type: 'varchar',
        name: 'xid',
        nullable: true
    })
    xid: string;

    @Column({
        type: 'varchar',
        name: 'name'
    })
    name: string;

    @Column({
        type: 'varchar',
        name: 'url',
        nullable: true
    })
    url: string;

    @Column({
        type: 'varchar',
        name: 'fileName'
    })
    fileName: string;

    @Column({
        type: 'varchar',
        name: 'status'
    })
    status: DocumentStatus;

    @Column({
        type: 'varchar',
        name: 'external_status',
        nullable: true
    })
    externalProvierDocStatus: string;

    @Column({
        type: 'varchar',
        name: 'type'
    })
    type: DocType;

    @Column({
        type: 'varchar',
        name: 'signature_id',
        nullable: true
    })
    signatureId: string

    @ManyToOne(() => User, (user) => user.documents)
    @JoinColumn({ name: 'id', referencedColumnName: 'id' })
    user: User;
}

export enum DocType {
    AGREEMENT = 'Agreement'
}