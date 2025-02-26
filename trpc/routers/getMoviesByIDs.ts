import { z } from "zod";
import { baseProcedure } from "../init";
import { supabase } from "@/services/supabase-client";


export const getMoviesByIDs = baseProcedure.input(z.object({
    opensearch_movie_ids: z.string().array()
})).output(
    z.map(z.string(), z.object({
        title: z.string(),
        image_url: z.string().nullable()
    }))
).query(async (opts) => {
    const movieTitles = 
    await supabase.from("movies").select('opensearch_id, title, image_url').in("opensearch_id", opts.input.opensearch_movie_ids)

    const movieTitleByID = new Map<string, {title: string, image_url: string | null}>()
    movieTitles.data?.forEach(row => 
        movieTitleByID.set(row.opensearch_id, {title: row.title, image_url: row.image_url}) 
    )
    return movieTitleByID
})