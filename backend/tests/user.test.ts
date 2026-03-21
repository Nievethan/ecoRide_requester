import request from 'supertest';
import app from '../src/app';
import sequelize from '../src/database';

describe('User API Endpoints', () => {

    afterAll(async () => {
        await sequelize.close();
    });

    it('should successfully create a user and return 201', async () => {
        // Generate a unique email address for testing to avoid conflicts with existing users
        const uniqueEmail = `john.doe.${Date.now()}@example.com`;

        const response = await request(app)
            .post('/api/users')
            .send({
                name: "John Doe",
                email: uniqueEmail,
            });

        // Expecting success response
        expect(response.status).toBe(201);
        
        // Expecting success message in response body
        expect(response.body.message).toBe('User created successfully!');
        
        // Expecting user data in response body
        expect(response.body.user).toBeDefined();
        expect(response.body.user.name).toBe("John Doe");
        expect(response.body.user.email).toBe(uniqueEmail);
    });

    it('should block the request and return 400 if email is missing', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                name: "Jane Doe",
                // Missing email field
            });

        // Expecting error response
        expect(response.status).toBe(400);
        
        // Expecting error message in response body
        expect(response.body.errors).toBeDefined();
    });

    it('should block the request and return 400 if name is missing', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                email: "jane.doe@example.com",
                // Missing name field
            });

        // Expecting error response
        expect(response.status).toBe(400);

        // Expecting error message in response body
        expect(response.body.errors).toBeDefined();
    });

    it('should block the request and return 500 if email is not unique', async () => {
        const uniqueEmail = `john.doe.${Date.now()}@example.com`;

        // Create a user with a unique email
        await request(app)
            .post('/api/users')
            .send({
                name: "John Doe",
                email: uniqueEmail,
            });

        // Attempt to create another user with the same email
        const response = await request(app)
            .post('/api/users')
            .send({
                name: "Jane Doe",
                email: uniqueEmail, // Duplicate email
            });

        // Expecting error response
        expect(response.status).toBe(500);
        
        // Expecting error message in response body
        expect(response.body.error).toBe('Failed to create user');
    });

    it('should return 200 and an array of users when fetching all users', async () => {
        const response = await request(app)
            .get(`/api/users`);

        // Expecting success response
        expect(response.status).toBe(200);

        // Expecting an array of users in response body
        expect(Array.isArray(response.body)).toBe(true);

        // Expecting user objects to have specific properties
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('email');
        expect(response.body[0]).toHaveProperty('role');
    });

});