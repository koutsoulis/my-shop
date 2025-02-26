import { z } from "zod";
import { baseProcedure } from "../init";
import { supabase } from "@/services/supabase-client";


export const getOrderReceipt = baseProcedure.input(z.object({
    orderID: z.number()
})).output(
    z.string()
).query(async (opts) => {
    const receipt_url = await supabase
        .from("orders")
        .select("stripe_receipt_url")
        .eq("id", opts.input.orderID);

    return receipt_url.data?.at(0)?.stripe_receipt_url!
})