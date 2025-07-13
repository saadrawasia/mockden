import { subscriptions } from '@backend/db/schema';
import type {
	SubscriptionCreatedNotification,
	SubscriptionNotification,
} from '@paddle/paddle-node-sdk';
import { eq } from 'drizzle-orm';
import db from '../db/client';
import { NotFoundError } from '../utils/errors';
import { getUserByClerkId, updateUser } from './userService';

type User = {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	clerkUserId: string;
	planTier: string | null;
	createdAt: Date;
	updatedAt: Date;
	subscription: {
		id: number;
		userId: number;
		subscriptionId: string;
		paddleCustomerId: string;
		productId: string;
		status: string;
		startDate: string;
		nextBillDate: string;
		createdAt: Date;
		updatedAt: Date;
	};
};

type Payload = {
	userId: number;
	subscriptionId: string;
	paddleCustomerId: string;
	productId: string;
	status: string;
	startDate: string;
	nextBillDate: string;
};

async function upsertSubscription(user: User, payload: Payload) {
	let subscription = null;

	if (user.subscription) {
		subscription = await db.update(subscriptions).set(payload).returning();
	} else {
		subscription = await db.insert(subscriptions).values(payload).returning();
	}

	await updateUser({ ...user, planTier: 'pro' });

	return subscription[0];
}

export async function subscriptionActivateOrCreate(
	data: SubscriptionCreatedNotification | SubscriptionNotification
) {
	const clerkId =
		data.customData && 'clerkId' in data.customData ? (data.customData.clerkId as string) : '';
	if (!clerkId) {
		throw new NotFoundError('clerkId not found.');
	}
	const user = await getUserByClerkId(clerkId);
	if (!user) {
		throw new NotFoundError('User not found');
	}

	const payload = {
		userId: user.id,
		subscriptionId: data.id,
		paddleCustomerId: data.customerId,
		productId: data.items[0].product?.id || '',
		status: data.status,
		startDate: data.startedAt as string,
		nextBillDate: data.nextBilledAt as string,
	};
	return await upsertSubscription(user, payload);
}

export async function subscriptionCancel(data: SubscriptionNotification) {
	const clerkId =
		data.customData && 'clerkId' in data.customData ? (data.customData.clerkId as string) : '';
	if (!clerkId) {
		throw new NotFoundError('clerkId not found.');
	}
	const user = await getUserByClerkId(clerkId);
	if (!user) {
		throw new NotFoundError('User not found');
	}

	await db.delete(subscriptions).where(eq(subscriptions.subscriptionId, data.id));
	await updateUser({ ...user, planTier: 'free' });
}
