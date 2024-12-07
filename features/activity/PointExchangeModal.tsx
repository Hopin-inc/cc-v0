"use client";

import { useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HalfModal } from "@/components/elements";
import { Check, Download } from "lucide-react";
import { exchangeItems, type ExchangeItem } from "@/data/exchangeItems";
import { useCurrentUserContext } from "@/contexts/UserContext";

interface PointExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export function PointExchangeModal({
  isOpen,
  onClose,
  title,
}: PointExchangeModalProps) {
  const { currentUser } = useCurrentUserContext();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [exchangedItem, setExchangedItem] = useState<ExchangeItem | null>(null);

  const handleClose = () => {
    setExchangedItem(null);
    setSelectedItem(null);
    onClose();
  };

  const handleExchange = () => {
    if (selectedItem && currentUser) {
      const item = exchangeItems.find((item) => item.id === selectedItem);
      if (item && item.points <= currentUser.available_points) {
        setExchangedItem(item);
        // #TODO: ポイントを消費する処理を追加
      }
    }
  };

  const handleSaveQRCode = () => {
    const svg = document.getElementById("qr-code");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      // @ts-ignore
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `qr-code-${exchangedItem?.name}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    }
  };

  return (
    <HalfModal isOpen={isOpen} onClose={handleClose} title={title}>
      <div className="flex flex-col">
        {!exchangedItem ? (
          <>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                利用可能ポイント:{" "}
                <span className="font-bold text-foreground">
                  {currentUser?.available_points ?? 0}pt
                </span>
              </p>
            </div>

            <div className="overflow-y-auto py-4" style={{ height: "400px" }}>
              <RadioGroup
                value={selectedItem || ""}
                onValueChange={setSelectedItem}
                className="space-y-4 px-4"
              >
                {exchangeItems.map((item) => {
                  const isDisabled =
                    item.points > (currentUser?.available_points ?? 0);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-start space-x-4 p-3 border border-gray-300 rounded-lg transition-colors ${
                        isDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <RadioGroupItem
                        value={item.id}
                        id={item.id}
                        className="mt-1"
                        disabled={isDisabled}
                      />
                      <div className="flex gap-3 flex-1 min-w-0">
                        <div className="w-20 h-20 relative flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <label
                            htmlFor={item.id}
                            className={`font-medium cursor-pointer block text-sm ${
                              isDisabled ? "cursor-not-allowed" : ""
                            }`}
                          >
                            {item.name}
                          </label>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                          <p className="text-xs font-semibold text-foreground mt-1">
                            {item.points}pt
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            <div className="p-4 pt-6 border-t bg-background">
              <Button
                onClick={handleExchange}
                disabled={
                  !selectedItem ||
                  (exchangeItems.find((item) => item.id === selectedItem)
                    ?.points || 0) > (currentUser?.available_points ?? 0)
                }
                className="w-full"
              >
                選択したアイテムと交換する
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 pb-6 space-y-4">
            <div className="bg-green-100 text-green-800 p-2 rounded-full">
              <Check className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">
                {exchangedItem?.name}と交換しました！
              </h3>
              <p className="text-sm text-muted-foreground">
                以下のQRコードを保存して、サービス利用時に提示してください。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <QRCodeSVG
                id="qr-code"
                value={JSON.stringify({
                  item: typeof exchangedItem === "string" ? exchangedItem : "",
                  id: typeof currentUser?.id === "string" ? currentUser.id : "",
                  date: new Date().toISOString(),
                })}
                size={200}
              />
            </div>
            <Button
              onClick={handleSaveQRCode}
              className="flex items-center space-x-2 w-full"
            >
              <Download className="w-4 h-4" />
              <span>QRコードを保存</span>
            </Button>
          </div>
        )}
      </div>
    </HalfModal>
  );
}
