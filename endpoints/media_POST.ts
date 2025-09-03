import { db } from '../helpers/db';
import { getServerUserSession } from '../helpers/getServerUserSession';
import superjson from "superjson";
import { schema, OutputType } from "./media_POST.schema";
import { nanoid } from "nanoid";

// This is a placeholder for a real file storage service.
// In a real app, you would upload to S3, Cloudinary, etc., and store the URL.
async function uploadFile(fileData: string, fileType: string): Promise<string> {
  // For now, we return a data URL. This is NOT suitable for production with large files.
  console.log(`Simulating upload for file of type ${fileType}. In production, this should upload to a cloud storage service.`);
  return `data:${fileType};base64,${fileData}`;
}

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== "admin") {
      return new Response(
        superjson.stringify({ error: "Forbidden" }),
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const input = schema.parse({
      file: formData.get("file"),
      altText: formData.get("altText"),
      description: formData.get("description")
    });

    const file = input.file;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileData = fileBuffer.toString("base64");

    const fileUrl = await uploadFile(fileData, file.type);

    const newMediaItem = await db.
    insertInto("mediaLibrary").
    values({
      filename: `${nanoid()}.${file.name.split('.').pop()}`,
      originalFilename: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileUrl: fileUrl,
      altText: input.altText,
      description: input.description,
      uploadedBy: user.id
    }).
    returningAll().
    executeTakeFirstOrThrow();

    return new Response(
      superjson.stringify({ mediaItem: newMediaItem } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error uploading media:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 400 }
    );
  }
}