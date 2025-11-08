# WayForPay Integration Setup

This guide will help you set up WayForPay payment integration for your ReviewLink application.

## Prerequisites

1. A WayForPay merchant account (https://wayforpay.com/)
2. Firebase project with Firestore and Cloud Functions enabled
3. Firebase CLI installed (`npm install -g firebase-tools`)

## Setup Steps

### 1. Configure WayForPay Merchant Account

1. Sign up at https://wayforpay.com/ and create a merchant account
2. Get your merchant credentials:
   - Merchant Account
   - Secret Key
   - Domain Name

### 2. Configure Firebase Environment Variables

#### For Firebase Cloud Functions:

```bash
cd functions
firebase functions:config:set \
  wayforpay.merchant_account="your_merchant_account" \
  wayforpay.secret_key="your_secret_key" \
  wayforpay.domain_name="https://yourdomain.com"
```

Or create a `.env` file in the `functions` directory based on `.env.example`:

```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Configure Frontend Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
# Edit .env with your Firebase configuration
```

### 4. Deploy Firebase Cloud Functions

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

This will deploy:
- `createWayForPayPayment` - Creates payment sessions
- `wayforpayWebhook` - Handles payment callbacks from WayForPay

### 5. Configure WayForPay Webhook

1. Log in to your WayForPay merchant dashboard
2. Navigate to Settings > API
3. Set the Service URL (webhook) to:
   ```
   https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/wayforpayWebhook
   ```
4. Set the Return URL to:
   ```
   https://yourdomain.com/payment/success
   ```

### 6. Test the Integration

1. Run your application locally:
   ```bash
   npm run dev
   ```

2. Log in and navigate to the Pricing page
3. Select a plan and complete the test payment
4. Verify that:
   - Payment is created in Firestore (`payments` collection)
   - User is redirected to WayForPay payment page
   - After successful payment, user is redirected to success page
   - User's plan is updated in Firestore (`users` collection)

## Payment Flow

1. User selects a plan on PricingPage
2. Frontend calls `createWayForPayPayment` Cloud Function
3. Cloud Function creates a payment record and returns form data
4. Frontend submits form to WayForPay
5. User completes payment on WayForPay
6. WayForPay sends webhook to `wayforpayWebhook` Cloud Function
7. Cloud Function updates payment status and user plan
8. User is redirected to success/cancel page

## Plans Configuration

The following plans are available:

- **Free Plan**: 0 UAH (automatically activated)
- **Starter Plan**: 150 UAH/month (~5 USD)
- **Business Plan**: 360 UAH/month (~12 USD)
- **Pro Plan**: 600 UAH/month (~20 USD)

To modify plan pricing, edit `/functions/src/createWayForPayPayment.ts`.

## Security Notes

- Never commit `.env` files to version control
- Keep your WayForPay Secret Key confidential
- All signatures are verified using HMAC MD5
- Payment data is stored securely in Firestore

## Troubleshooting

### Payment not being created

- Check Firebase Functions logs: `firebase functions:log`
- Verify environment variables are set correctly
- Ensure user is authenticated

### Webhook not receiving callbacks

- Verify webhook URL in WayForPay dashboard
- Check that Cloud Function is deployed: `firebase functions:list`
- Review Cloud Functions logs for errors

### User plan not updating

- Verify webhook signature validation is passing
- Check Firestore security rules allow updates
- Review payment document in Firestore for status

## Support

For WayForPay API documentation, visit:
https://wiki.wayforpay.com/
