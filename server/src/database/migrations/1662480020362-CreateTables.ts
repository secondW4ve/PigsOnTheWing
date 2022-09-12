import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1662480020362 implements MigrationInterface {
  name = 'CreateTables1662480020362';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.collection (
        id uuid DEFAULT uuid_generate_v4 (),
        name varchar(255) NOT NULL,
        description varchar(1000),
        CONSTRAINT collection_pkey PRIMARY KEY (id)
      )
    `);

    await queryRunner.query(`
      CREATE TYPE request_methods as ENUM (
        'GET',
        'POST',
        'PUT',
        'DELETE'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.request (
        id uuid DEFAULT uuid_generate_v4 (),
        name varchar(255) NOT NULL,
        description varchar(1000),
        method request_methods NOT NULL,
        body TEXT,
        collection_id uuid NOT NULL,
        CONSTRAINT request_pkey PRIMARY KEY (id),
        CONSTRAINT collection_fkey FOREIGN KEY (collection_id) REFERENCES public.collection(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.header (
        id uuid DEFAULT uuid_generate_v4 (),
        name varchar(255) NOT NULL,
        value varchar(255) NOT NULL,
        request_id uuid NOT NULL,
        CONSTRAINT header_pkey PRIMARY KEY (id),
        CONSTRAINT request_fkey FOREIGN KEY (request_id) REFERENCES public.request(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.user (
        id uuid DEFAULT uuid_generate_v4 (),
        username varchar(255) NOT NULL,
        "password" varchar(255) NOT NULL,
        CONSTRAINT user_pkey PRIMARY KEY (id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.user_collection (
        user_id uuid NOT NULL,
        collection_id uuid NOT NULL,
        CONSTRAINT user_fkey FOREIGN KEY (user_id) REFERENCES public.user(id) ON DELETE CASCADE,
        CONSTRAINT collection_fkey FOREIGN KEY (collection_id) REFERENCES public.collection(id) ON DELETE CASCADE
      )
    `);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
