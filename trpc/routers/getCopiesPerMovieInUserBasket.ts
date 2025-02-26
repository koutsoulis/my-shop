import { z } from "zod";
import { baseProcedure } from "../init";
import { supabase } from "@/services/supabase-client";


export const getCopiesPerMovieInUserBasket = baseProcedure.input(z.object({
    userID: z.string()
})).output(
    z.map(z.string(), z.number())
).query(async (opts) => {
    const quantities = await supabase.from("basket_movies").select('quantity, movie_id').eq("user_id", opts.input.userID)

    const countPerMovieID = new Map<string, number>()
    quantities.data?.forEach(row => 
        countPerMovieID.set(row.movie_id, (countPerMovieID.get(row.movie_id) ?? 0) + row.quantity) 
    )
    return countPerMovieID
})