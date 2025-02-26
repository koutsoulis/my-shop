"use server";

import {
  Badge,
  Card,
  CardSection,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import NextImage from "next/image";
import React from "react";
import { Movie, OpenSearchResultList } from "../interfaces";
import { Session } from "next-auth";
import { BuyButton } from "./BuyButton";
import { trpc } from "@/trpc/server";

function Demo({
  movie,
  userUUID,
  moviesInBasketGlobal,
  moviesInBasketUser,
}: {
  movie: Movie;
  userUUID: string | undefined;
  moviesInBasketGlobal: number;
  moviesInBasketUser: number | undefined;
}) {
  const displayTitle = `${movie._source.title} (${movie._source.year})`;
  const countInOtherUserBaskets =
    moviesInBasketGlobal - (moviesInBasketUser ?? 0);
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      {countInOtherUserBaskets > 0 && (
        <Tooltip
          children={
            <p className="text-red-500 absolute top-5 right-5">{`${countInOtherUserBaskets} in baskets`}</p>
          }
          label="excluding current user's basket"
        ></Tooltip>
      )}
      <CardSection>
        <Group justify="center">
          <Image
            className="aspect-square"
            component={NextImage}
            fit="contain"
            src={movie._source.image_url}
            h={200}
            height={240}
            width={240}
            alt="no picture associated with movie"
          />
          <Stack>
            {movie._source.genres.map((genre) => (
              <Badge>{genre}</Badge>
            ))}
          </Stack>
        </Group>
      </CardSection>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{displayTitle}</Text>
      </Group>

      <Text size="sm" c="dimmed">
        {movie._source.plot}
      </Text>
      <BuyButton movieOpensearchId={movie._source.id} userId={userUUID!} />
    </Card>
  );
}

export const SearchResults: React.FC<{
  openSearchResultList: OpenSearchResultList;
  session: Session | null;
}> = async ({ openSearchResultList, session }) => {
  const globalCountPerMovieID = await trpc.getMovieCopiesInAllBaskets({
    movieOpensearchIDs: openSearchResultList.hits.hits.map(
      (hit) => hit._source.id
    ),
  });

  const userCountPerMovieID =
    session?.user?.id != undefined
      ? await trpc.getCopiesPerMovieInUserBasket({ userID: session?.user?.id })
      : undefined;

  const cards: JSX.Element[] | undefined =
    openSearchResultList.hits?.hits?.map<JSX.Element>((movie, idx) => {
      return Demo({
        movie,
        userUUID: session?.user?.id,
        moviesInBasketGlobal: globalCountPerMovieID.get(movie._source.id) ?? 0,
        moviesInBasketUser: userCountPerMovieID?.get(movie._source.id),
      });
    });

  return (
    <SimpleGrid type="container" cols={3}>
      {cards}
    </SimpleGrid>
  );
};
