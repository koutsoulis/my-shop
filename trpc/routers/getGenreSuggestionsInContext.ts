import { baseProcedure } from "../init";
import { z } from "zod";
import { opensearchRequest } from "@/services/opensearchRequest";
import { GenresInContext } from "@/app/(main)/movies/interfaces";

export const getGenreSuggestionsInContext = baseProcedure.input(z.object({
    minYear: z.number(),
    maxYear: z.number(),
    directorOption: z.string().array(),
})).output(GenresInContext)
.query(async (opts)  => {

    const directorFilter = opts.input.directorOption.map(director => {
        return {"term": {"directors.keyword": director}}
    })
  
    const searchContextAggregation = {
      "searchContextAggregation": {
        "filter": {
          "bool": {
            "filter": [...directorFilter, { "range": { "year": { "gte": opts.input.minYear, "lte": opts.input.maxYear }}}]
          }
        },
        "aggs": {
          "genres": {
              "terms": {
                  "field": "genres.keyword",
                  "size": 1000
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
