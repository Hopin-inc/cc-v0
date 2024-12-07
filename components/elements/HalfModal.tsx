"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HalfModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export const HalfModal: React.FC<HalfModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // セレクトボックスのポータルコンテナをクリックした場合は無視
      const selectPortal = document.getElementById("select-portal-root");
      if (selectPortal?.contains(event.target as Node)) {
        return;
      }

      // モーダルの外側をクリックした場合のみ閉じる
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-hidden="true"
      />
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <div
          ref={modalRef}
          className="bg-background w-full max-w-md flex flex-col rounded-t-2xl"
          style={{ maxHeight: "calc(90vh - env(safe-area-inset-bottom))" }}
        >
          <div className="sticky top-0 bg-background z-10 px-4 py-4 border-b rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-9 w-9"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">閉じる</span>
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );

  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return null;

  return createPortal(modalContent, portalRoot);
};
