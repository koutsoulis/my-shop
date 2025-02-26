"use client";

import { Button } from "@mantine/core";
import { addMovieToBasket } from "../actions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sleep } from "@/utils/sleep";
import { notifications } from "@mantine/notifications";

export function BuyButton({
  movieOpensearchId,
  userId,
}: {
  movieOpensearchId: string;
  userId: string | undefined;
}) {
  const mutation = useMutation({
    mutationFn: async () => {
      const moviesInBasket = await addMovieToBasket({
        movieOpensearchId: movieOpensearchId,
        userId: userId!,
      });

      const outcome = moviesInBasket.data
        ? `Movie added to basket. ${moviesInBasket.data} copies in basket.`
        : `Adding movie to basket failed: ${JSON.stringify(
            moviesInBasket.error
          )}`;

      notifications.show({
        message: outcome,
      });
    },
  });

  return (
    <Button
      disabled={!userId}
      loading={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      {userId ? "Add to basket" : "Not signed in"}
    </Button>
  );
}
