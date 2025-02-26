import { Basket } from "@/app/(main)/basket/interfaces";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest,
  { params }: { params: { basket: string } }) {

    const basket: Basket = JSON.parse(decodeURIComponent(params.basket));

      try {
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                product_data: {
                  name: basket.name,
                },
                currency: "USD",
                unit_amount: basket.price
              },
              quantity: 1,
            },
          ],
          client_reference_id: basket.userID,
          mode: 'payment',
          success_url: `${req.headers.get("origin")}/orders`,
          cancel_url: `${req.headers.get("origin")}/basket/purchase-outcome/canceled`,
        });
        return NextResponse.redirect(session.url!, {status: 303})
      } catch (err: any) {
        return NextResponse.json({error: err.message}, {status: err.statusCode ?? 500})
      }

  }