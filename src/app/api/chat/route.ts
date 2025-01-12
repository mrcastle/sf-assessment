import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { messages, documentId } = await req.json();

  // Fetch document and relevant context
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { chats: { include: { messages: true } } },
  });

  if (!document) {
    return new Response("Document not found", { status: 404 });
  }

  // Create system message with document context
  const systemMessage = {
    role: "system",
    content: `You are an AI tutor helping with a document. You can control the PDF viewer by including commands in your response metadata.
    To highlight text: {highlight: {page: number, bounds: {x, y, width, height}}}
    To change page: {page: number}
    Always reference page numbers when quoting the document.`,
  };

  const result = streamText({
    model: openai("gpt-4"),
    messages: [systemMessage, ...messages],
  });

  // Example metadata for PDF control
  // const metadata = {
  //   page: 1,
  //   highlights: [
  //     {
  //       page: 1,
  //       bounds: { x: 10, y: 20, width: 30, height: 10 },
  //       type: "highlight",
  //     },
  //   ],
  // };

  // Store the conversation in the database
  await prisma.message.create({
    data: {
      content: messages[messages.length - 1].content,
      role: "user",
      chat: {
        connect: {
          id: document.chats[0]?.id,
        },
      },
    },
  });

  return result.toDataStreamResponse();
}
