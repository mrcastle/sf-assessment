"use client";

import { useRef } from "react";
import { Worker, Viewer, RenderPage } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface Highlight {
  page: number;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  type: "highlight" | "circle";
}

interface PDFViewerProps {
  url: string;
  currentPage?: number;
  highlights?: Highlight[];
  onPageChange?: (page: number) => void;
}

export default function PDFViewer({
  url,
  currentPage = 1,
  highlights = [],
  onPageChange = () => {},
}: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const renderPage: RenderPage = (props) => {
    const pageHighlights = highlights.filter(
      (h) => h.page === props.pageIndex + 1
    );

    return (
      <>
        {props.canvasLayer.children}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {pageHighlights.map((highlight, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: `${highlight.bounds.x}%`,
                top: `${highlight.bounds.y}%`,
                width: `${highlight.bounds.width}%`,
                height: `${highlight.bounds.height}%`,
                backgroundColor:
                  highlight.type === "highlight"
                    ? "rgba(255, 255, 0, 0.3)"
                    : "transparent",
                border: highlight.type === "circle" ? "2px solid red" : "none",
                borderRadius: highlight.type === "circle" ? "50%" : "0",
                pointerEvents: "none",
              }}
            />
          ))}
        </div>
        {props.annotationLayer.children}
      </>
    );
  };

  return (
    <div ref={containerRef} className="h-full">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={url}
          plugins={[defaultLayoutPluginInstance]}
          initialPage={currentPage - 1}
          onPageChange={(e) => onPageChange(e.currentPage + 1)}
          renderPage={renderPage}
        />
      </Worker>
    </div>
  );
}
