import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Vercel Blob (or your preferred storage solution)
    const blob = await put(file.name, file, {
      access: "public",
    });

    // Create document record in database
    const document = await prisma.document.create({
      data: {
        title: file.name,
        url: blob.url,
        userId,
        chats: {
          create: {
            userId,
          },
        },
      },
    });

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
