import { z } from "zod";

export const GetMoviesIn = z.object({
    searchTerm: z.string(),
    minYear: z.number(),
    maxYear: z.number(),
    genres: z.string().array(),
    directorOption: z.string().array(),
    page: z.number()
  })
  
export type GetMoviesIn = z.infer<typeof GetMoviesIn>

export function decodeGetMoviesIn(urlSearchParams: URLSearchParams): GetMoviesIn | undefined {
    try{
        const objectParsed = JSON.parse(decodeURIComponent(urlSearchParams.get("GetMoviesIn") ?? ""))
        return GetMoviesIn.safeParse(objectParsed).data
    } catch (e){
        return undefined
    }
}
export function encodeGetMoviesIn(getMoviesIn: GetMoviesIn): URLSearchParams {
    const urlSearchParams = new URLSearchParams()
    urlSearchParams.append("GetMoviesIn", 
        encodeURIComponent(JSON.stringify(getMoviesIn))
    )
    return urlSearchParams
}

export const Movie = z.object({
    _source: z.object({
      plot: z.string().optional(),
      title: z.string(),
      year: z.number(),
      genres: z.string().array(),
      image_url: z.string().optional(),
      id: z.string()
    })
  })
  
export type Movie = z.infer<typeof Movie>
  
export const OpenSearchResultList = z.object({
    hits: z.object({
    total: z.object({
        value: z.number()
    }),
    hits: Movie.array()
    })
  })

export type OpenSearchResultList = z.infer<typeof OpenSearchResultList>

export const AggBucket = z.object({
    key: z.string(),
    doc_count: z.number()
})

export type AggBucket =  z.infer<typeof AggBucket>


export interface SearchContextAggregationResult{
    genres: {buckets: AggBucket[]};
    directors: {buckets: AggBucket[]};
}

export const DirectorsInContext = z.object({
    directors: z.object({
        buckets: AggBucket.array()
    })
})

export type DirectorsInContext = z.infer<typeof DirectorsInContext>

export const GenresInContext = z.object({
    genres: z.object({
        buckets: AggBucket.array()
    })
})

export type GenresInContext = z.infer<typeof GenresInContext>

export const TitlesInContext = z.object({
    titles: z.object({
        buckets: AggBucket.array()
    })
})

export type TitlesInContext = z.infer<typeof TitlesInContext>

export interface SearchContext {
    minYear: number;
    maxYear: number;
    director: string[];
    genres: string[];
    searchTerm?: string;
}

export function toURLSearchParams(searchContext: SearchContext): URLSearchParams {
    const result = new URLSearchParams()
    result.append("minYear", searchContext.minYear.toString())
    result.append("maxYear", searchContext.maxYear.toString())
    searchContext.director.forEach(director => result.append("director", director))
    searchContext.genres.forEach(genre => result.append("genre", genre))
    !!searchContext.searchTerm && result.append("searchTerm", searchContext.searchTerm!)

    return result
}

export function toSearchContext(uRLSearchParams: URLSearchParams): SearchContext {
    return {
        minYear: Number(uRLSearchParams.get("minYear")!),
        maxYear: Number(uRLSearchParams.get("maxYear")!),
        director: uRLSearchParams.getAll("director"),
        genres: uRLSearchParams.getAll("genre"),
        searchTerm: uRLSearchParams.get("searchTerm") ?? undefined
    }
}
