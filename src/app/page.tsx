import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DocumentList from "@/components/DocumentList";
import UploadButton from "@/components/UploadButton";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const documents = await prisma.document.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { chats: true },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Documents</h1>
        <UploadButton />
      </div>
      <DocumentList documents={documents} />
    </div>
  );
}
