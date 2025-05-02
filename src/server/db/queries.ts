import "server-only";

import { folders_table as foldersSchema, files_table as filesSchema } from "./schema";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";

export const QUERIES = {
    getAllParentsForFolder,
    getFolders,
    getFiles,
}

async function getAllParentsForFolder(folderId: number) {
    const parents = [];
    let currentId: number | null = folderId;
    while (currentId !== null) {
        const folder = await db.selectDistinct().from(foldersSchema).where(eq(foldersSchema.id, currentId));

        if (!folder[0]) {
            throw new Error("Parent folder not found");
        }

        parents.unshift  (folder[0]);
        currentId = folder[0].parent;
    }

    return parents;
}

function getFolders(folderId: number) {
    return db
        .select()
        .from(foldersSchema)
        .where(eq(foldersSchema.parent, folderId));
}

function getFiles(folderId: number) {
    return db
        .select()
        .from(filesSchema)
        .where(eq(filesSchema.parent, folderId));
}
