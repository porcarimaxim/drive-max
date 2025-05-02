import { db } from "~/server/db";
import { mockFolders } from "~/lib/mock-data";
import { folders_table } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export default async function SandboxPage() {
  const user = await auth();
  if (!user.userId) {
    throw new Error("User not found");
  }

  const folders = await db
    .select()
    .from(folders_table)
    .where(eq(folders_table.ownerId, user.userId));
  console.log({ folders });
  return (
    <div className="flex flex-col gap-4">
      {"Seed Function"}
      <form
        action={async () => {
          "use server";
          const user = await auth();
          if (!user.userId) {
            throw new Error("User not found");
          }

          const rootFolder = await db
            .insert(folders_table)
            .values({
              name: "My Root",
              parent: null,
              ownerId: user.userId,
            })
            .$returningId();

          await db.insert(folders_table).values(
            mockFolders.map((folder) => ({
              name: folder.name,
              parent: rootFolder[0]!.id,
              ownerId: user.userId,
            })),
          );

          // const fileInsert = await db.insert(files_table).values(mockFiles.map((file, index) => ({
          //     name: file.name,
          //     parent: (index % 3) + 1,
          //     size: 5000,
          //     url: file.url,
          //     ownerId: user.userId
          // })));
        }}
      >
        <button type="submit">Seed</button>
      </form>
    </div>
  );
}
