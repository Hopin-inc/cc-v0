import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Facebook, Twitter, Instagram, Globe } from "lucide-react";
import Link from "next/link";

export function ProjectDescription() {
  return (
    <Card>
      <CardHeader className="py-4">
        <CardTitle className="text-xl font-semibold">
          プロジェクト概要
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base text-muted-foreground mb-4">
          「空き家未来工房」は、地域の空き家をリノベーションし、新たな価値を生む場へと変えるプロジェクトです。住まいや店舗、交流拠点など多用途で活用し、地域住民や外部の協力者が集う場所を創出します。体験型プログラムやワークショップも実施し、空き家を未来への資産に変える挑戦を地域とともに進めています。
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-3">
            <Link
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ホームページ"
            >
              <Globe className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
          </div>
          <Button className="w-auto text-base">
            <Heart className="mr-2 h-4 w-4" /> 応援する
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
