import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const config = {
    api: {
      bodyParser: false,
    },
  };


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const buf = await buffer(req);
      const sig = req.headers['stripe-signature'] as string;
  
      let event: Stripe.Event;
  
      try {
        event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        res.status(400).send(`Webhook Error: ${errorMessage}`);
        return;
      }
  
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Handle the successful donation
        // You can update your database or send a thank you email here
        console.log('Donation successful:', session);
      }
  
      res.json({ received: true });
    } else {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }
  }