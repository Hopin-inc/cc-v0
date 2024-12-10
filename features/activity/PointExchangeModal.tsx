"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HalfModal } from "@/components/elements";
import { Check, Download, Gift } from "lucide-react";
import { useCurrentUserContext } from "@/contexts/UserContext";
import { useProjectPrizeItems } from "@/hooks/useProjectPrizeItems";
import { ProjectPrizeItem } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [exchangedItem, setExchangedItem] = useState<ProjectPrizeItem | null>(
    null
  );
  const { prizeItems, isLoading, error, fetchPrizeItems } =
    useProjectPrizeItems();

  useEffect(() => {
    if (isOpen) {
      fetchPrizeItems().catch(console.error);
    }
  }, [isOpen, fetchPrizeItems]);

  const handleClose = () => {
    setExchangedItem(null);
    setSelectedItem(null);
    onClose();
  };

  const handleExchange = () => {
    if (selectedItem && currentUser) {
      const item = prizeItems.find((item) => String(item.id) === selectedItem);
      if (item && item.point <= currentUser.available_points) {
        setExchangedItem(item);
        // #TODO: ポイントを消費する処理を追加
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
              {isLoading ? (
                <div className="space-y-4 px-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-4 p-3 border border-gray-300 rounded-lg"
                    >
                      <Skeleton className="h-4 w-4 mt-1 rounded-full" />
                      <div className="flex gap-3 flex-1 min-w-0">
                        <Skeleton className="w-20 h-20 rounded-md flex-shrink-0" />
                        <div className="flex-1 min-w-0 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-red-500">エラーが発生しました</p>
                </div>
              ) : prizeItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 px-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Gift className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      特典がありません
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      現在交換可能な特典はありません。また後でチェックしてください。
                    </p>
                  </div>
                </div>
              ) : (
                <RadioGroup
                  value={selectedItem || ""}
                  onValueChange={setSelectedItem}
                  className="space-y-4 px-4"
                >
                  {prizeItems.map((item) => {
                    const isDisabled =
                      item.point > (currentUser?.available_points ?? 0);
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
                          value={String(item.id)}
                          id={String(item.id)}
                          className="mt-1"
                          disabled={isDisabled}
                        />
                        <div className="flex gap-3 flex-1 min-w-0">
                          <div className="w-20 h-20 relative flex-shrink-0">
                            {item.thumbnail_url ? (
                              <Image
                                src={item.thumbnail_url}
                                alt={item.name}
                                fill
                                className="rounded-md object-cover"
                              />
                            ) : (
                              <div className="w-full h-full rounded-md bg-muted flex items-center justify-center">
                                <Gift className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <label
                              htmlFor={String(item.id)}
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
                              {item.point}pt
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              )}
            </div>

            <div className="p-4 pt-6 border-t bg-background">
              <Button
                onClick={handleExchange}
                disabled={
                  !selectedItem ||
                  (prizeItems.find((item) => String(item.id) === selectedItem)
                    ?.point || 0) > (currentUser?.available_points ?? 0)
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
                  item_id: exchangedItem?.id,
                  user_id: currentUser?.id,
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
