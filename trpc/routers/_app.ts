import { createTRPCRouter } from '../init';
import { getCopiesPerMovieInUserBasket } from './getCopiesPerMovieInUserBasket';
import { getDirectors } from './getDirectors';
import { getGenreSuggestionsInContext } from './getGenreSuggestionsInContext';
import { getMovieCopiesInAllBaskets } from './getMovieCopiesInAllBaskets';
import { getMovies } from './getMovies';
import { getMoviesByIDs } from './getMoviesByIDs';
import { getOrderReceipt } from './getOrderReceipt';
import { getTitleAutocompleteSuggestions } from './getTitleAutocompleteSuggestions';

export const trpcRouter = createTRPCRouter({
    getDirectors,
    getGenreSuggestionsInContext,
    getTitleAutocompleteSuggestions,
    getMovies,
    getMovieCopiesInAllBaskets,
    getCopiesPerMovieInUserBasket,
    getOrderReceipt,
    getMoviesByIDs
});

// export type definition of API
export type TRPCRouter = typeof trpcRouter;