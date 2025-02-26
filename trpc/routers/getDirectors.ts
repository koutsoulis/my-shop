import { baseProcedure } from "../init";
import { z } from "zod";
import {DirectorsInContext} from "@/app/(main)/movies/interfaces"
import { opensearchRequest } from "@/services/opensearchRequest";

export const getDirectors = baseProcedure.input(z.object({
    minYear: z.number(),
    maxYear: z.number(),
    genres: z.string().array(),
})).output(DirectorsInContext)
.query(async (opts)  => {


    const genres = opts.input.genres

    const genresShouldPartial = genres.map(genre => {
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
              "filter": { "range": { "year": { "gte": opts.input.minYear, "lte": opts.input.maxYear }}},
              "minimum_should_match": 1,
              "should": genresShould
            }
          },
          "aggs": {
            "directors": {
              "terms": {
                  "field": "directors.keyword",
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
