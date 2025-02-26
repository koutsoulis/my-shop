import { supabase } from "@/services/supabase-client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    const stripeEvent: Stripe.Event = await req.json()

    switch(stripeEvent.type) {
        case "checkout.session.completed":{
            const userID = stripeEvent.data.object.client_reference_id!
            const stripePaymentID = stripeEvent.data.object.payment_intent as string
            await supabase.rpc("move_basket_to_order", {stripe_payment_id_arg: stripePaymentID, user_id_arg: userID})
            break;
        }
        case "charge.updated":{
            const stripePaymentID = stripeEvent.data.object.payment_intent as string
            const stripeReceiptURL = stripeEvent.data.object.receipt_url as string
            await supabase.from("orders").update({stripe_receipt_url: stripeReceiptURL}).eq("stripe_payment_id", stripePaymentID)
            break;
            }
        default:
            return new NextResponse()
    }
    return new NextResponse()
}