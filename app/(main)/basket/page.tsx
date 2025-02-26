import { auth } from "@/auth";
import { supabase } from "@/services/supabase-client";
import { Button, Group, Stack, Tooltip } from "@mantine/core";
import { Basket, BasketContents } from "./interfaces";
import { loadStripe } from "@stripe/stripe-js";
import { IconBrandStripe } from "@tabler/icons-react";
import { redirect } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default async function Page() {
  const session = await auth();
  const user_id = session?.user?.id;
  user_id ?? redirect("/movies");

  function priceInCents(movieTitle?: string): number {
    return movieTitle?.length ?? 0;
  }

  const postgresResponse = user_id
    ? await supabase.rpc("get_movies_in_user_basket", { user_id_arg: user_id })
    : undefined;

  let totalCost = 0;
  postgresResponse?.data
    ?.map((movie) => priceInCents(movie.title))
    .forEach((cost) => (totalCost += cost));

  const basketContentsContents = postgresResponse?.data?.map((movie) => {
    return {
      title: movie.title,
      price: priceInCents(movie.title),
      quantity: movie.quantity,
    };
  });

  let totalPrice: number = 0;
  basketContentsContents?.forEach(
    (item) => (totalPrice += item.quantity * item.price)
  );

  const basketContents: BasketContents | undefined =
    basketContentsContents != undefined
      ? {
          contents: basketContentsContents!,
          totalPrice: totalPrice,
        }
      : undefined;

  const basket: Basket | undefined =
    basketContents && user_id
      ? {
          name: basketContents.contents.map((item) => item.title).join(" + "),
          price: basketContents.totalPrice,
          userID: user_id,
        }
      : undefined;

  return (
    <div>
      <Stack>
        {postgresResponse?.data?.map((movie) => {
          return (
            <div>
              {movie.quantity} copies of "{movie.title}" for{" "}
              {movie.quantity * priceInCents(movie.title)} cents of a euro.
            </div>
          );
        })}
      </Stack>
      {basket && basket.price > 50 ? (
        <form
          action={`/api/create-checkout-session/${encodeURIComponent(
            JSON.stringify(basket)
          )}`}
          method="POST"
        >
          <Group>
            <Button type="submit">
              Checkout via Stripe {<IconBrandStripe></IconBrandStripe>}
            </Button>
            <p>
              (Fill out the Stripe form with card number 4242 4242 4242 4242 and
              arbitrary values for the rest.)
            </p>
          </Group>
        </form>
      ) : (
        <p>
          Add contents worth more than 50 cents of a euro in total to your
          basket before checking out.
        </p>
      )}
    </div>
  );
}
