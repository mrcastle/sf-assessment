"use client";

import { FC } from "react";
import ChatInterface from "./ChatInterface";
import PDFViewer from "./PDFViewer";

interface SplitScreenProps {
  documentId: string;
  pdfUrl: string;
}

const SplitScreen: FC<SplitScreenProps> = ({ documentId, pdfUrl }) => {
  return (
    <div className="flex h-screen">
      <div className="w-1/2">
        <PDFViewer url={pdfUrl} />
      </div>
      <div className="w-1/2">
        <ChatInterface documentId={documentId} />
      </div>
    </div>
  );
};

export default SplitScreen;
