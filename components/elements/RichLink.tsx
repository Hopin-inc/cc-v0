import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface RichLinkProps {
  url: string;
  title: string;
  description: string;
  image: string;
}

export function RichLink({ url, title, description, image }: RichLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block no-underline"
    >
      <Card className="overflow-hidden">
        <div className="flex">
          <div className="relative w-1/3 aspect-video">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image%201986%202-tvZbelhdD0uuNkI1tii4T6jY51q9QF.png"
              alt="石垣のある伝統的な日本家屋の路地"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <CardContent className="w-2/3 p-4">
            <h3 className="text-sm font-semibold mb-2 line-clamp-1">{title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
            <div className="flex items-center mt-2 text-[10px] text-muted-foreground">
              <ExternalLink className="w-3 h-3 mr-1" />
              {new URL(url).hostname}
            </div>
          </CardContent>
        </div>
      </Card>
    </a>
  );
}
