//inititalizing queue to take in jobs from the frontend

import {Queue} from 'bullmq';
import {connection} from '../config/redis.js'

export const executionQueue = new Queue('execution',{
    connection,
});