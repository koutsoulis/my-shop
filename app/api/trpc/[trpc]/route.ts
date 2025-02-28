import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/trpc/init';
import { trpcRouter } from '@/trpc/routers/_app';

const ONE_YEAR_IN_SECONDS = 31536000; // max cache duration

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: trpcRouter,
    createContext: createTRPCContext,
    responseMeta(opts){
      return {
        headers: new Headers([
          [
            'cache-control',
            `public, s-maxage=${ONE_YEAR_IN_SECONDS}, stale-while-revalidate=${ONE_YEAR_IN_SECONDS}`,
          ],
        ]),
      };
    }
  });

export { handler as GET, handler as POST };