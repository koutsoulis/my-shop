import { Pagination, ScrollArea } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  decodeGetMoviesIn,
  encodeGetMoviesIn,
  GetMoviesIn,
} from "../../interfaces";
import { trpc } from "@/trpc/server";
import { SearchResults } from "../SearchResults";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function Page({
  searchParams,
  params,
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
