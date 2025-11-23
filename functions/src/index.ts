import * as admin from 'firebase-admin';

admin.initializeApp();

export { createWayForPayPayment } from './createWayForPayPayment';
export { wayforpayWebhook } from './wayforpayWebhook';
export { checkExpiredSubscriptions } from './checkExpiredSubscriptions';
