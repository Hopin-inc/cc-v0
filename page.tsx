"use client";

import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { participantsByYear, roleColors } from "@/data";
import "@/styles/project-participants.css";

export function ProjectParticipants() {
  const networkRef = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [network, setNetwork] = useState<Network | null>(null);

  useEffect(() => {
    if (!networkRef.current) return;

    const participants = participantsByYear[selectedYear];
    const numNodes = participants.length - 1;
    const radius = 250;

    const positions: { [key: number]: { x: number; y: number } } = {};
    participants.forEach((p, index) => {
      if (index === 0) {
        positions[p.id] = { x: 0, y: 0 };
      } else {
        const angle = ((index - 1) / numNodes) * 2 * Math.PI;
        positions[p.id] = {
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle),
        };
      }
    });

    const nodes = new DataSet(
      participants.map((p) => ({
        id: p.id,
        label: p.label,
        group: p.role,
        image: p.image,
        shape: "circularImage",
        size: p.id === 0 ? 60 : 24 + p.frequency * 2,
        fixed: true,
        x: positions[p.id].x,
        y: positions[p.id].y,
      }))
    );

    const edges = new DataSet(
      participants.slice(1).map((p, index) => ({
        id: index + 1,
        from: 0,
        to: p.id,
        width: 1 + p.frequency / 2,
        smooth: false,
      }))
    );

    const options = {
      nodes: {
        borderWidth: 3,
        borderWidthSelected: 5,
        color: {
          border: "#ffffff",
          background: "#666666",
        },
        font: {
          color: "#000000",
          size: 14,
          face: "Arial",
          vadjust: 20,
        },
        shadow: true,
      },
      edges: {
        color: { color: "#808080", opacity: 0.5 },
        smooth: {
          enabled: true,
          type: "continuous",
          roundness: 0,
        },
      },
      groups: Object.fromEntries(
        Object.entries(roleColors).map(([role, color]) => [
          role,
          { color: { background: color, border: color } },
        ])
      ),
      physics: {
        enabled: false,
      },
      interaction: {
        dragNodes: false,
        dragView: false,
        zoomView: false,
      },
    };

    const newNetwork = new Network(
      networkRef.current,
      { nodes, edges },
      options
    );
    setNetwork(newNetwork);

    newNetwork.once("afterDrawing", () => {
      newNetwork.fit({
        animation: {
          duration: 1000,
          easingFunction: "easeOutQuart",
        },
      });
    });

    return () => {
      newNetwork.destroy();
    };
  }, [selectedYear]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg">関係者マップ</CardTitle>
        <Select
          value={String(selectedYear)}
          onValueChange={(v) => handleYearChange(Number(v))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="年を選択" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(participantsByYear).map((year) => (
              <SelectItem key={year} value={year}>
                {year}年
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="relative">
        <div
          ref={networkRef}
          className="w-full h-[600px]"
          style={{ minHeight: "600px", minWidth: "100%" }}
        />
        <div className="absolute bottom-4 right-4 bg-background p-2 rounded shadow-md z-10">
          <h3 className="text-xs font-semibold mb-2 text-foreground">
            役割の色分け
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(roleColors).map(([role, color]) => (
              <div key={role} className="flex items-center">
                <div
                  className="w-3 h-3 mr-2 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-xs text-muted-foreground">{role}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
