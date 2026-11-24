import type { StructureResolver } from "sanity/structure";

// The Studio sidebar, organized around the actual jobs:
//   1. Change the homepage banners
//   2. Review new submissions, then publish them
//   3. Read what came in through the site (intro requests, email signups)
export const structure: StructureResolver = (S) => {
  const portraitsByStatus = (title: string, status: string) =>
    S.listItem()
      .title(title)
      .schemaType("root")
      .child(
        S.documentList()
          .title(title)
          .schemaType("root")
          .filter('_type == "root" && status == $status')
          .params({ status })
          .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
      );

  return S.list()
    .title("Roots")
    .items([
      S.listItem()
        .title("Homepage photos")
        .id("homepage")
        .child(S.document().schemaType("homepage").documentId("homepage").title("Homepage photos")),
      S.divider(),

      S.listItem()
        .title("Portraits")
        .schemaType("root")
        .child(
          S.list()
            .title("Portraits")
            .items([
              portraitsByStatus("New submissions — review these", "submitted"),
              portraitsByStatus("Waiting on more info", "needs_info"),
              portraitsByStatus("Approved, not yet live", "approved"),
              portraitsByStatus("Published (live on the site)", "published"),
              portraitsByStatus("Declined", "declined"),
              S.divider(),
              S.listItem()
                .title("All portraits")
                .schemaType("root")
                .child(S.documentTypeList("root").title("All portraits")),
            ])
        ),
      S.documentTypeListItem("collection").title("Collections"),
      S.documentTypeListItem("tripPhoto").title("Trip photos"),
      S.divider(),

      S.listItem()
        .title("Introduction requests")
        .schemaType("connectRequest")
        .child(
          S.documentTypeList("connectRequest")
            .title("Introduction requests")
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
        ),
      S.listItem()
        .title("Email signups")
        .schemaType("subscriber")
        .child(
          S.documentTypeList("subscriber")
            .title("Email signups")
            .defaultOrdering([{ field: "subscribedAt", direction: "desc" }])
        ),
    ]);
};
