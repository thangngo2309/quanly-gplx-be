import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserPhoneEmail1784174121903 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `UPDATE "user" SET "phone_number" = '0123456789' WHERE "phone_number" IS NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "user" ALTER COLUMN "phone_number" SET NOT NULL`
        );

        await queryRunner.query(
            `UPDATE "user" SET "email" = 'clonengato1@gmail.com' WHERE "email" IS NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`
        );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
