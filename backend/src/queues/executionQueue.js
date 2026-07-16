//inititalizing queue to take in jobs from the frontend

import {Queue, QueueEvents} from 'bullmq';
import {connection} from '../config/redis.js'

export const executionQueue = new Queue('execution',{
    connection,
});

export const queueEvents = new QueueEvents('execution',{
    connection,
});

await queueEvents.waitUntilReady();