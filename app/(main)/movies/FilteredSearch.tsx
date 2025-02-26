"use client";
import { trpc } from "@/trpc/client";
import {
  AppShell,
  Autocomplete,
  Button,
  ComboboxItem,
  ComboboxLikeRenderOptionInput,
  Container,
  Flex,
  Group,
  MultiSelect,
  Pagination,
  RangeSlider,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDidUpdate, usePagination } from "@mantine/hooks";
import { createHash } from "crypto";
import { Session } from "next-auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  decodeGetMoviesIn,
  encodeGetMoviesIn,
  GetMoviesIn,
  OpenSearchResultList,
} from "./interfaces";

import { skipToken } from "@tanstack/react-query";
import { SearchResults } from "./search/SearchResults";

export default function FilteredSearch({
  session,
}: {
  session: Session | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [actualSearchParams, setActualSearchParams] = useState<
    GetMoviesIn | undefined
  >(decodeGetMoviesIn(searchParams));

  useDidUpdate(() => {
    actualSearchParams &&
      router.replace(
        `/movies/search/${encodeGetMoviesIn(actualSearchParams)}?` +
          encodeGetMoviesIn(actualSearchParams)
      );
  }, [actualSearchParams]);

  // const [data, setData] = useState<OpenSearchResultList | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<{
    minYear: number;
    maxYear: number;
  }>({
    minYear: actualSearchParams?.minYear ?? 1920,
    maxYear: actualSearchParams?.maxYear ?? 2018,
  });
  const [selectedDirectorOption, setSelectedDirectorOption] = useState<
    string[]
  >(actualSearchParams?.directorOption ?? []);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    actualSearchParams?.genres ?? []
  );
  const [tentativeSearchTerm, setTentativeSearchTerm] = useState<string>(
    actualSearchParams?.searchTerm ?? ""
  );
  const searchResultsQuery = trpc.getMovies.useQuery(
    actualSearchParams ? actualSearchParams : skipToken,
    { staleTime: Infinity, refetchOnWindowFocus: false }
  );

  const directorsInContextQuery = trpc.getDirectors.useQuery(
    {
      minYear: selectedTimeRange.minYear,
      maxYear: selectedTimeRange.maxYear,
      genres: selectedGenres,
    },
    { staleTime: Infinity, refetchOnWindowFocus: false }
  );

  const hitsPerDirector = new Map(
    directorsInContextQuery.data?.directors.buckets?.map((bucket) => [
      bucket.key,
      bucket.doc_count,
    ])
  );

  const genresInContextQuery = trpc.getGenreSuggestionsInContext.useQuery(
    {
      minYear: selectedTimeRange.minYear,
      maxYear: selectedTimeRange.maxYear,
      directorOption: selectedDirectorOption,
    },
    { staleTime: Infinity, refetchOnWindowFocus: false }
  );

  const hitsPerGenre = new Map(
    genresInContextQuery.data?.genres.buckets?.map((bucket) => [
      bucket.key,
      bucket.doc_count,
    ])
  );

  const titlesInContextQuery = trpc.getTitleAutocompleteSuggestions.useQuery(
    {
      minYear: selectedTimeRange.minYear,
      maxYear: selectedTimeRange.maxYear,
      directorOption: selectedDirectorOption,
      genres: selectedGenres,
    },
    { staleTime: Infinity, refetchOnWindowFocus: false }
  );

  function renderDirector(
    item: ComboboxLikeRenderOptionInput<ComboboxItem>
  ): React.ReactNode {
    return (
      <Text>
        {item.option.value} {hitsPerDirector.get(item.option.value)} hits
      </Text>
    );
  }

  function renderGenre(
    item: ComboboxLikeRenderOptionInput<ComboboxItem>
  ): React.ReactNode {
    return (
      <Text>
        {item.option.value} {hitsPerGenre.get(item.option.value)} hits
      </Text>
    );
  }

  const selectGenresElement = (
    <MultiSelect
      disabled={genresInContextQuery.isPending}
      key={
        createHash("sha256")
          .update(JSON.stringify([selectedDirectorOption, selectedTimeRange]))
          .digest("hex")
          .toString() + "genres"
      }
      defaultValue={selectedGenres}
      label="Genres"
      placeholder="select genres"
      data={genresInContextQuery.data?.genres.buckets.map(
        (bucket) => bucket.key
      )}
      renderOption={renderGenre}
      searchable
      onChange={(selectedGenres) => setSelectedGenres(selectedGenres)}
    />
  );

  const selectDirectorElement = (
    <Select
      disabled={directorsInContextQuery.isFetching}
      key={
        createHash("sha256")
          .update(JSON.stringify([selectedGenres, selectedTimeRange]))
          .digest("hex")
          .toString() + "directors"
      }
      limit={20}
      defaultValue={selectedDirectorOption.at(0)}
      label="Director"
      placeholder="select director (showing top 20)"
      defaultSearchValue={selectedDirectorOption.at(0)}
      data={directorsInContextQuery.data?.directors.buckets.map(
        (bucket) => bucket.key
      )}
      renderOption={renderDirector}
      searchable
      onChange={async (directorSelected) =>
        setSelectedDirectorOption(directorSelected ? [directorSelected] : [])
      }
    />
  );

  // function navigateToSearch(getMoviesIn: GetMoviesIn) {
  //   const getMoviesInEncodedAsSearchParams = encodeGetMoviesIn(getMoviesIn);
  //   router.replace(`/movies/search?${getMoviesInEncodedAsSearchParams}`);
  // }

  const totalArticles = searchResultsQuery.data?.hits?.total?.value ?? 0;

  const articlesPerPage = 6;

  const totalPages = Math.ceil(totalArticles / articlesPerPage);

  return (
    // <Container className="max-w-full max-h-full">
    <div className="px-5">
      <Group>
        <Tooltip label="Discover tailored movie suggestions based on your selected director, genres, and time period.">
          <Autocomplete
            className="grow"
            disabled={titlesInContextQuery.isPending}
            data={titlesInContextQuery.data?.titles.buckets.map(
              (bck) => bck.key
            )}
            limit={5}
            placeholder="Search titles and summaries. Auto-suggests top 5 as you type."
            defaultValue={tentativeSearchTerm}
            onOptionSubmit={(value) => {
              setTentativeSearchTerm(value);
              setActualSearchParams({
                searchTerm: value,
                directorOption: selectedDirectorOption,
                genres: selectedGenres,
                minYear: selectedTimeRange.minYear,
                maxYear: selectedTimeRange.maxYear,
                page: 1,
              });
            }}
            onKeyDown={(key) => {
              key.code == "Enter" &&
                setActualSearchParams({
                  searchTerm: tentativeSearchTerm,
                  directorOption: selectedDirectorOption,
                  genres: selectedGenres,
                  minYear: selectedTimeRange.minYear,
                  maxYear: selectedTimeRange.maxYear,
                  page: 1,
                });
            }}
            onChange={(value) => {
              setTentativeSearchTerm(value);
            }}
          />
        </Tooltip>
        <Button
          onClick={() =>
            setActualSearchParams({
              searchTerm: tentativeSearchTerm,
              directorOption: selectedDirectorOption,
              genres: selectedGenres,
              minYear: selectedTimeRange.minYear,
              maxYear: selectedTimeRange.maxYear,
              page: 1,
            })
          }
        >
          Search
        </Button>
      </Group>
      <RangeSlider
        className="mt-12"
        minRange={0}
        min={1920}
        max={2018}
        defaultValue={[selectedTimeRange.minYear, selectedTimeRange.maxYear]}
        step={1}
        labelAlwaysOn
        onChangeEnd={async ([minYear, maxYear]) => {
          setSelectedTimeRange({ minYear: minYear, maxYear: maxYear });
        }}
      />
      <Group grow>
        <Tooltip label="Only directors of selected genres and time period available for selection.">
          {selectDirectorElement}
        </Tooltip>
        <Tooltip label="Only genres of selected director and time period available for selection.">
          {selectGenresElement}
        </Tooltip>
      </Group>
      <Pagination
        // key={actualSearchParams?.searchTerm}
        value={actualSearchParams?.page}
        onChange={(page) =>
          setActualSearchParams({
            ...actualSearchParams!,
            page: page,
          })
        }
        total={totalPages}
      />
      {/* </Container> */}
    </div>
  );
}
