import { ExternalLink } from "lucide-react";

const URL_REGEX = /https?:\/\/[^\s]+/g;

export const formatContent = (content: string) => {
  if (!content) return null;

  // 改行とURLを含むテキストを分割して処理
  const parts = content.split(/(\n|https?:\/\/[^\s]+)/);

  return parts.map((part, index) => {
    if (part.match(URL_REGEX)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-primary hover:underline"
        >
          {part}
          <ExternalLink className="h-3 w-3" />
        </a>
      );
    }
    if (part === "\n") {
      return <br key={index} />;
    }
    return part;
  });
};
