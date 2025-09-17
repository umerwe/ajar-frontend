import z from "zod";

export const SearchBarSchema = z.object({
  name: z.string().min(1, "Please enter a search term")
});

export type SearchBar = z.infer<typeof SearchBarSchema>;
