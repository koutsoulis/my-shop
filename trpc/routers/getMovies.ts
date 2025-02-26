import { baseProcedure } from "../init";
import { z } from "zod";
import { opensearchRequest } from "@/services/opensearchRequest";
import { GetMoviesIn, OpenSearchResultList, TitlesInContext } from "@/app/(main)/movies/interfaces";
import { time } from "console";

export const getMovies = baseProcedure.input(GetMoviesIn).output(OpenSearchResultList)
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

      const searchTerm = opts.input.searchTerm

      const mustQuery = searchTerm.length > 0 ? {multi_match:{
        query: searchTerm,
        type: "phrase",
        fields: ["title", "plot"]
      }} : {"match_all": {}}

      const yearRangeFilter = [{ "range": { "year": { "gte": opts.input.minYear, "lte": opts.input.maxYear }}}]

      const query = {
        from: (opts.input.page - 1) * 6,
        size: 6,
        query: {
          bool: {
            minimum_should_match: 1,
            filter: [...directorFilter, ...yearRangeFilter],
            should: genresShould,
            must: mustQuery
          }
        },
      }


    const openSearchResultList = await opensearchRequest(query)

    return openSearchResultList;
})
