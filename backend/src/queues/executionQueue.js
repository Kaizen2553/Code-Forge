//inititalizing queue to take in jobs from the frontend

import {Queue, QueueEvents} from 'bullmq';
import {connection} from '../config/redis.js'

export const executionQueue = new Queue('execution',{
    connection,
});

//WHAT IS QUEUEEVENTS HERE?
//QUEUEVENTS IS BASICALLY A EVENT LISTENER SUBSCRIBED TO THE REDIS PUBSUB CHANNEL THAT READS EVENTS EMITTED BY BULLMQ AND TELLS THE CALLER ABOUT THE FINISHED JOBS BY USING WAITUNTILFINISHED FUNCTION

export const queueEvents = new QueueEvents('execution',{
    connection,
});
//THIS ENSURES THAT BEFORE BEING USED THE QUEEVENTS IS CONNECTED TO THE REDIS SERVER
await queueEvents.waitUntilReady();