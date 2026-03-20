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
                fare: "Twenty Bucks", // Invlid Entry
                userId: 1
            });

        // Expecting error response
        expect(response.status).toBe(400);
        
        // Expecting validation errors in response body
        expect(response.body.errors).toBeDefined();
        
        // Expecting specific 'fare' error
        expect(response.body.errors[0].path).toBe('fare');
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

});