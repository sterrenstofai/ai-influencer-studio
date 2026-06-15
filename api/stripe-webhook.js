import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { buffer } from 'micro'

export const config = { api: { bodyParser: false } }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const sig  = req.headers['stripe-signature']
  const buf  = await buffer(req)
  let event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  const sub = event.data.object

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const customerId = sub.customer
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile) {
        await supabase.from('subscriptions').upsert({
          user_id:            profile.id,
          stripe_sub_id:      sub.id,
          plan_id:            sub.items.data[0]?.price?.id,
          status:             sub.status,
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          cancel_at_period_end: sub.cancel_at_period_end,
        }, { onConflict: 'user_id' })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const customerId = sub.customer
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile) {
        await supabase.from('subscriptions')
          .update({ status: 'canceled' })
          .eq('user_id', profile.id)
      }
      break
    }
  }

  res.status(200).json({ received: true })
}
