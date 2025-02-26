'use server'

import { supabase } from "@/services/supabase-client"

export async function addMovieToBasket({
    movieOpensearchId,
    userId
}: {
    movieOpensearchId: string;
    userId: string
}){
        const res = await supabase.rpc("add_movie_to_user_basket", 
            { movie_id_input: movieOpensearchId, user_id_input: userId})
        return res
}