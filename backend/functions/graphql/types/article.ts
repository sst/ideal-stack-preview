import { Article, ArticleRow } from "@my-sst-app/core/article";
import { builder } from "../builder";

const ArticleType = builder.objectRef<ArticleRow>("Article").implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeID("title"),
    url: t.exposeID("url"),
  }),
});

builder.queryFields((t) => ({
  articles: t.field({
    type: [ArticleType],
    resolve: () => Article.list(),
  }),
  article: t.field({
    type: ArticleType,
    args: {
      articleID: t.arg.string({ required: true }),
    },
    resolve: (_, vars) => Article.fromID(vars.articleID),
  }),
}));

builder.mutationField("createArticle", (t) =>
  t.field({
    type: ArticleType,
    args: {
      title: t.arg.string({ required: true }),
      url: t.arg.string({ required: true }),
    },
    resolve: (_, args) => Article.create(args.title, args.url),
  })
);
