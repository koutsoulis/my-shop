import { z } from "zod";
import { baseProcedure } from "../init";
import { supabase } from "@/services/supabase-client";


export const getMovieCopiesInAllBaskets = baseProcedure.input(z.object({
    movieOpensearchIDs: z.string().array()
})).output(
    z.map(z.string(), z.number())
).query(async (opts) => {
    const quantities = await supabase.from("basket_movies").select('quantity, movie_id').in("movie_id", opts.input.movieOpensearchIDs)

    const countPerMovieID = new Map<string, number>(
        opts.input.movieOpensearchIDs.map(movieID => [movieID, 0])
    )
    quantities.data?.forEach(row => 
        countPerMovieID.set(row.movie_id, countPerMovieID.get(row.movie_id)! + row.quantity) 
    )
    return countPerMovieID
})