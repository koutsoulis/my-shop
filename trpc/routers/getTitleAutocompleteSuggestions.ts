import { baseProcedure } from "../init";
import { z } from "zod";
import { opensearchRequest } from "@/services/opensearchRequest";
import { TitlesInContext } from "@/app/(main)/movies/interfaces";

export const getTitleAutocompleteSuggestions = baseProcedure.input(z.object({
    minYear: z.number(),
    maxYear: z.number(),
    genres: z.string().array(),
    directorOption: z.string().array(),
})).output(TitlesInContext)
.query(async (opts)  => {

    const directorFilter = opts.input.directorOption.map( director => {
        return {
        "term": {"directors.keyword": director}
      }})
    
      const genresShouldPartial = opts.input.genres.map(genre => {
        return {
          "term": {
              "genres.keyword": genre
          }
        }
      })
    
      const genresShould = genresShouldPartial.length > 0 ? genresShouldPartial : [{"match_all": {}}]
    
      const searchContextAggregation = {
        "searchContextAggregation": {
          "filter": {
            "bool": {
              "minimum_should_match": 1,
              "should": genresShould,
              "filter": [...directorFilter, { "range": { "year": { "gte": opts.input.minYear, "lte": opts.input.maxYear }}}]
            }
          },
          "aggs": {
            "titles": {
              "terms": {
                  "field": "title.keyword",
                  "size": 10000
              }
            }
          }
        }
      }
    
      const query = {
        "size": 0,
        "aggs": searchContextAggregation
      }

    const responseData = await opensearchRequest(query)

    return responseData.aggregations.searchContextAggregation;
})
