import type { JSX } from "react";
import { tryJsonParse } from "./utils";

export function renderMarkdown(text: string) {
  // Split into paragraphs by double line breaks
  const parseJson = tryJsonParse<{
    message: string;
  }>(text);
  text = parseJson?.message || text;
  const paragraphs = text.split(/\n{2,}/);

  return (
    <>
      {paragraphs.map((para, i) => {
        // Handle bullet lists
        if (para.trim().startsWith("-")) {
          const items = para
            .split("\n")
            .filter((line) => line.trim().startsWith("-"))
            .map((line, idx) => (
              <li key={idx}>{parseInlineMarkdown(line.replace(/^- /, ""))}</li>
            ));
          return (
            <ul className="list-disc pl-5 mb-2" key={i}>
              {items}
            </ul>
          );
        }
        // Otherwise, treat as a paragraph
        return (
          <p className="mb-1" key={i}>
            {parseInlineMarkdown(para)}
          </p>
        );
      })}
    </>
  );
}

// Helper for bold, italics, and links
function parseInlineMarkdown(text: string) {
  // Replace links [text](url)
  let elements: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text))) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }
    elements.push(
      <a
        key={match[2] + match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-blue-600"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  // Now handle bold (**text**) and italics (*text*) in each string part
  elements = elements.flatMap((el, idx) => {
    if (typeof el !== "string") return el;
    const boldItalicsRegex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
    const parts: (string | JSX.Element)[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = boldItalicsRegex.exec(el))) {
      if (m.index > last) parts.push(el.slice(last, m.index));
      const matchText = m[0];
      if (matchText.startsWith("**")) {
        parts.push(<b key={idx + "-b-" + m.index}>{matchText.slice(2, -2)}</b>);
      } else if (matchText.startsWith("*")) {
        parts.push(<i key={idx + "-i-" + m.index}>{matchText.slice(1, -1)}</i>);
      }
      last = m.index + matchText.length;
    }
    if (last < el.length) parts.push(el.slice(last));
    return parts;
  });

  return elements;
}
