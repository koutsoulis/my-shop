import { ScrollArea } from "@mantine/core";
import { Suspense } from "react";
import {
  decodeGetMoviesIn,
} from "../../interfaces";
import { trpc } from "@/trpc/server";
import { SearchResults } from "../SearchResults";
import { auth } from "@/auth";

export default async function Page({
  searchParams,
}: {
  searchParams: string;
  params: { slug: string };
}) {
  const urlSearchParams = new URLSearchParams(searchParams);
  const getMoviesIn = decodeGetMoviesIn(urlSearchParams)!;
  const searchResults = await trpc.getMovies(getMoviesIn);
  const session = await auth();

  return (
    <ScrollArea>
      <Suspense fallback={<div>loading search results</div>}>
        <SearchResults
          openSearchResultList={searchResults}
          session={session}
        ></SearchResults>
      </Suspense>
    </ScrollArea>
  );
}
