import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Chat {
  id: string;
}

interface Document {
  id: string;
  title: string;
  createdAt: Date;
  chats: Chat[];
}

interface DocumentListProps {
  documents: Document[];
}

export default function DocumentList({ documents }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          No documents yet. Upload one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <Link
          key={doc.id}
          href={`/chat/${doc.id}`}
          className="block p-6 border rounded-lg hover:border-blue-500 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold truncate">{doc.title}</h3>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(doc.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <span className="text-sm text-gray-400">
              {doc.chats.length} chat{doc.chats.length !== 1 ? "s" : ""}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
