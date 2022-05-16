import { describe, expect, it } from "vitest";
import { Client } from "./client";

describe("articles", () => {
  it("create and list", async () => {
    const created = await Client.mutation({
      createArticle: [
        { url: "https://google.com", title: "My Upload" },
        {
          id: true,
        },
      ],
    });

    const result = await Client.query({
      articles: {
        id: true,
      },
    });

    expect(
      result.articles.find((x) => x.id === created.createArticle.id)
    ).not.toBeNull();
  });
});
