import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SplitScreen from "@/components/SplitScreen";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { userId } = await auth();

  const { documentId } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
      userId,
    },
  });

  if (!document) {
    redirect("/");
  }

  return <SplitScreen documentId={documentId} pdfUrl={document.url} />;
}
