import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Force load .env from root
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
    let app: INestApplication<App>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/auth/login (POST) - Success with Admin credentials', async () => {
        const adminCredentials = {
            email: 'admin@admin.com',
            password: 'Admin123!',
        };

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(adminCredentials)
            .expect(201); // NestJS default success code for POST is 201

        // Validation logic
        expect(response.body).toHaveProperty('access_token');
        expect(typeof response.body.access_token).toBe('string');
        console.log('✅ Token received:', response.body.access_token.substring(0, 20) + '...');
    });

    it('/auth/login (POST) - Fail with bad password', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'admin@admin.com', password: 'WrongPassword' })
            .expect(401); // Unauthorized
    });
});
