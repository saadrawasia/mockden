import { subscriptions } from '@backend/db/schema';
import type {
	SubscriptionCreatedNotification,
	SubscriptionNotification,
} from '@paddle/paddle-node-sdk';
import { eq } from 'drizzle-orm';
import db from '../db/client';
import { NotFoundError } from '../utils/errors';
import { paddle } from '../utils/paddle';
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
		nextBillDate: string | null;
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
	nextBillDate: string | null;
};

async function upsertSubscription(user: User, payload: Payload) {
	let subscription = null;

	if (user.subscription) {
		subscription = await db
			.update(subscriptions)
			.set(payload)
			.where(eq(subscriptions.userId, user.id))
			.returning();
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
		nextBillDate: data.nextBilledAt,
	};
	return await upsertSubscription(user, payload);
}

export async function subscriptionCancel(data: SubscriptionNotification) {
	const existingSubscription = await db.query.subscriptions.findFirst({
		where: fields => eq(fields.subscriptionId, data.id),
		with: {
			user: true,
		},
	});

	if (!existingSubscription) {
		throw new NotFoundError('Subscription not found');
	}

	await db.delete(subscriptions).where(eq(subscriptions.subscriptionId, data.id));
	await updateUser({ ...existingSubscription.user, planTier: 'free' });
}

export async function getPaddleSubscription(subId: string) {
	try {
		// Pass the subscription id to get
		const subscription = await paddle.subscriptions.get(subId);
		// Returns a subscription entity
		return subscription;
	} catch (e) {
		throw new NotFoundError('Subscription not found');
	}
}

export async function subscriptionUpdate(data: SubscriptionNotification) {
	const existingSubscription = await db.query.subscriptions.findFirst({
		where: fields => eq(fields.subscriptionId, data.id),
		with: {
			user: true,
		},
	});

	const user = existingSubscription?.user;

	if (!existingSubscription) {
		throw new NotFoundError('Subscription not found');
	}

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
		nextBillDate: data.nextBilledAt,
	};

	const subscription = await db
		.update(subscriptions)
		.set(payload)
		.where(eq(subscriptions.userId, user.id))
		.returning();

	return subscription[0];
}
