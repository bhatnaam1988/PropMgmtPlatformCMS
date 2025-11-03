import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = 'swiss_alpine_journey';
const COLLECTION_NAME = 'bookings';

let cachedClient = null;
let cachedDb = null;

/**
 * Connect to MongoDB
 * @returns {Promise<Object>} Database instance
 */
async function connectToDatabase() {
  if (cachedDb) {
    return { db: cachedDb, client: cachedClient };
  }

  if (!MONGO_URL) {
    throw new Error('MONGO_URL is not defined');
  }

  const client = await MongoClient.connect(MONGO_URL);
  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { db, client };
}

/**
 * Create a new booking record
 * @param {Object} bookingData - Booking details
 * @returns {Promise<Object>} Created booking
 */
export async function createBooking(bookingData) {
  const { db } = await connectToDatabase();
  const bookings = db.collection(COLLECTION_NAME);

  const booking = {
    bookingId: uuidv4(),
    ...bookingData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await bookings.insertOne(booking);
  return booking;
}

/**
 * Update booking with Uplisting booking ID
 * @param {string} stripePaymentIntentId - Stripe Payment Intent ID
 * @param {string} uplistingBookingId - Uplisting booking ID
 * @param {string} bookingStatus - Booking status
 * @returns {Promise<Object>} Updated booking
 */
export async function updateBookingWithUplisting(stripePaymentIntentId, uplistingBookingId, bookingStatus = 'confirmed') {
  const { db } = await connectToDatabase();
  const bookings = db.collection(COLLECTION_NAME);

  const result = await bookings.findOneAndUpdate(
    { stripePaymentIntentId },
    {
      $set: {
        uplistingBookingId,
        bookingStatus,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  return result;
}

/**
 * Find booking by Stripe Payment Intent ID
 * @param {string} stripePaymentIntentId - Stripe Payment Intent ID
 * @returns {Promise<Object|null>} Booking or null
 */
export async function findBookingByPaymentIntent(stripePaymentIntentId) {
  const { db } = await connectToDatabase();
  const bookings = db.collection(COLLECTION_NAME);

  return await bookings.findOne({ stripePaymentIntentId });
}

/**
 * Find booking by booking ID
 * @param {string} bookingId - Internal booking ID
 * @returns {Promise<Object|null>} Booking or null
 */
export async function findBookingById(bookingId) {
  const { db } = await connectToDatabase();
  const bookings = db.collection(COLLECTION_NAME);

  return await bookings.findOne({ bookingId });
}

/**
 * Update booking status
 * @param {string} stripePaymentIntentId - Stripe Payment Intent ID
 * @param {string} paymentStatus - Payment status
 * @param {string} bookingStatus - Booking status
 * @param {Object} additionalData - Additional data to update
 * @returns {Promise<Object>} Updated booking
 */
export async function updateBookingStatus(stripePaymentIntentId, paymentStatus, bookingStatus, additionalData = {}) {
  const { db } = await connectToDatabase();
  const bookings = db.collection(COLLECTION_NAME);

  const result = await bookings.findOneAndUpdate(
    { stripePaymentIntentId },
    {
      $set: {
        paymentStatus,
        bookingStatus,
        ...additionalData,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  return result;
}

/**
 * Mark booking as requiring manual review
 * @param {string} stripePaymentIntentId - Stripe Payment Intent ID
 * @param {string} reason - Reason for manual review
 * @returns {Promise<Object>} Updated booking
 */
export async function markForManualReview(stripePaymentIntentId, reason) {
  const { db } = await connectToDatabase();
  const bookings = db.collection(COLLECTION_NAME);

  const result = await bookings.findOneAndUpdate(
    { stripePaymentIntentId },
    {
      $set: {
        requiresManualReview: true,
        manualReviewReason: reason,
        bookingStatus: 'pending_manual_review',
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  return result;
}

/**
 * Check if payment intent already processed (idempotency)
 * @param {string} stripePaymentIntentId - Stripe Payment Intent ID
 * @returns {Promise<boolean>} True if already processed
 */
export async function isPaymentIntentProcessed(stripePaymentIntentId) {
  const booking = await findBookingByPaymentIntent(stripePaymentIntentId);
  return booking !== null && booking.paymentStatus === 'succeeded';
}
