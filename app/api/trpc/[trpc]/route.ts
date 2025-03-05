import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/trpc/init';
import { trpcRouter } from '@/trpc/routers/_app';

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
            `public, max-age=${0}, s-maxage=${0}, stale-while-revalidate=${0}`,
          ],
        ]),
      };
    }
  });

export { handler as GET, handler as POST };