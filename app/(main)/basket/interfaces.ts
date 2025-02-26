import { z } from "zod";


export const BasketContents = z.object({
    contents: z.object({
        price: z.number(),
        title: z.string(),
        quantity: z.number()
    }).array(),
    totalPrice: z.number()
})

export type BasketContents = z.infer<typeof BasketContents>

export type Basket = {
    name: string;
    userID: string;
    price: number;
}