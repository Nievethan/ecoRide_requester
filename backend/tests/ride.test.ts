import request from 'supertest';
import app from '../src/app';
import sequelize from '../src/database';

describe('Ride API Endpoints', () => {

    afterAll(async () => {
        await sequelize.close();
    });
    
    it('should block the request and return 400 if fare is a string', async () => {
        const response = await request(app)
            .post('/api/rides')
            .send({
                pickupLocation: "Oshawa",
                dropoffLocation: "Toronto",
                fare: "Twenty Bucks", // Invalid Entry
                userId: 1
            });

        // Expecting error response
        expect(response.status).toBe(400);
        
        // Expecting validation errors in response body
        expect(response.body.errors).toBeDefined();
        
        // Expecting specific 'fare' error
        expect(response.body.errors[0].path).toBe('fare');
    });

     it('should block the request and return 400 if pickupLocation is an integer', async () => {
        const response = await request(app)
            .post('/api/rides')
            .send({
                pickupLocation: 123, // Invalid Entry
                dropoffLocation: "Toronto",
                fare: "20.00", 
                userId: 1
            });

        // Expecting error response
        expect(response.status).toBe(400);
        
        // Expecting validation errors in response body
        expect(response.body.errors).toBeDefined();
        
        // Expecting specific 'pickupLocation' error
        expect(response.body.errors[0].path).toBe('pickupLocation');
    });

    it('should block the request and return 400 if dropoffLocation is an integer', async () => {
        const response = await request(app)
            .post('/api/rides')
            .send({
                pickupLocation: "Oshawa",
                dropoffLocation: 456, // Invalid Entry
                fare: "20.00", 
                userId: 1
            });

        // Expecting error response
        expect(response.status).toBe(400);
        
        // Expecting validation errors in response body
        expect(response.body.errors).toBeDefined();
        
        // Expecting specific 'dropoffLocation' error
        expect(response.body.errors[0].path).toBe('dropoffLocation');
    });

    it('should successfully create a ride and return 201', async () => {
        const response = await request(app)
            .post('/api/rides')
            .send({
                pickupLocation: "Oshawa",
                dropoffLocation: "Toronto",
                fare: 45.50,
                userId: 1
            });

        // Expecting successful creation status
        expect(response.status).toBe(201);
        
        // Expecting database to return new ride data
        expect(response.body.ride.pickupLocation).toBe("Oshawa");
        expect(parseFloat(response.body.ride.fare)).toBe(45.5);
    });

    it('should fetch the ride data and return 200', async () => {
        const response = await request(app)
            .get('/api/rides'); 

        // Expecting successful retrieval status
        expect(response.status).toBe(200);

        // Expect the api to return an array of rides
        expect(Array.isArray(response.body)).toBe(true);
        
        // Expecting database to return correct ride data
        expect(response.body[0].dropoffLocation).toBe("Toronto");
        expect(response.body[0].pickupLocation).toBe("Oshawa");
    });

    it('should return 404 if user does not exist when creating a ride', async () => {
        const response = await request(app)
            .post('/api/rides')
            .send({
                pickupLocation: "Oshawa",
                dropoffLocation: "Toronto",
                fare: 30.00,
                userId: 9999 // Non-existent user ID
            });
            
        // Expecting not found status
        expect(response.status).toBe(404);

        // Expecting error message in response body
        expect(response.body.error).toBe('User not found');
    });

});