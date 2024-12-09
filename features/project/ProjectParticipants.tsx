"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Network, Node, Edge, Options } from "vis-network";
import { DataSet } from "vis-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "@/styles/project-participants.css";
import { useRouter } from "next/navigation";
import { roleColors } from "@/data";
import { useFeedState } from "@/hooks/useFeedState";
import { generateParticipantsFromFeed } from "@/utils/mapParticipants";
import { ParticipantsByYear } from "@/types";
import { useCurrentProjectContext } from "@/contexts/ProjectContext";

export function ProjectParticipants() {
  const router = useRouter();
  const { feedItems } = useFeedState();
  const { currentProject } = useCurrentProjectContext();
  const participantsByYear = generateParticipantsFromFeed(
    currentProject,
    feedItems
  );

  const [selectedYear, setSelectedYear] = useState<string>(
    Object.keys(participantsByYear)[0] || "2024"
  );

  const handleNodeClick = useCallback(
    (userId: string) => {
      router.push(`/u/${userId}`);
    },
    [router]
  );

  const { networkRef } = useProjectParticipantsNetwork({
    participantsByYear,
    selectedYear,
    onNodeClick: handleNodeClick,
  });

  const handleYearChange = useCallback((year: string) => {
    setSelectedYear(year);
  }, []);

  if (!participantsByYear) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-muted-foreground/80">
          関係者マップ
        </CardTitle>
        <Select value={selectedYear} onValueChange={handleYearChange}>
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
          className="w-full h-[500px]"
          style={{ minHeight: "500px", minWidth: "100%" }}
        />
        {/* #TODO: 役割の定義・見せ方は検討 */}
        {/* <div className="mt-4 p-3 bg-background/80 backdrop-blur-sm rounded shadow-md">
          <h3 className="text-xs font-semibold mb-2 text-foreground">役割</h3>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(roleColors)
              .filter(([role]) => role !== "プロジェクト")
              .map(([role, color]) => (
                <div key={role} className="flex items-center">
                  <div
                    className="w-2 h-2 mr-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                    {role}
                  </span>
                </div>
              ))}
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}

type UseProjectParticipantsNetworkProps = {
  participantsByYear: ParticipantsByYear;
  selectedYear: string;
  onNodeClick: (userId: string) => void;
};

interface CustomNode extends Node {
  label: string;
  group: string;
  image: string;
  originalSize: number;
  opacity: number;
}

const useProjectParticipantsNetwork = ({
  participantsByYear,
  selectedYear,
  onNodeClick,
}: UseProjectParticipantsNetworkProps) => {
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstanceRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!networkRef.current) return;
    if (!participantsByYear) return;

    const participants = participantsByYear[Number(selectedYear)];
    if (!participants) return;

    // Clean up previous network
    if (networkInstanceRef.current) {
      networkInstanceRef.current.destroy();
      networkInstanceRef.current = null;
    }

    const numNodes = participants.length - 1;
    const radius = 200;

    const positions: Record<number, { x: number; y: number }> = {};
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

    const nodes = new DataSet<CustomNode>(
      participants.map((p) => ({
        id: p.id,
        label: p.label,
        group: p.role,
        image: p.image,
        shape: "circularImage",
        size: p.id === 0 ? 80 : 24 + p.frequency * 4,
        originalSize: p.id === 0 ? 80 : 24 + p.frequency * 4,
        opacity: 1.0,
        borderWidth: 6,
        fixed: true,
        x: positions[p.id].x,
        y: positions[p.id].y,
      }))
    );

    const edges = new DataSet<Edge>(
      participants.slice(1).map((p, index) => ({
        id: index,
        from: 0,
        to: p.id,
        width: 1 + p.frequency,
        smooth: {
          enabled: true,
          type: "curved",
          roundness: 0.5,
        },
      }))
    );

    const options: Options = {
      clickToUse: false,
      nodes: {
        borderWidth: 6,
        borderWidthSelected: 8,
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
        hover: true,
      },
    };

    try {
      const network = new Network(
        networkRef.current,
        { nodes, edges },
        options
      );

      network.on("click", (params: { nodes: string[] }) => {
        if (params.nodes.length > 0) {
          const nodeId = Number(params.nodes[0]);
          const clickedNode = participants.find((p) => p.id === nodeId);
          if (clickedNode?.userId) {
            onNodeClick(clickedNode.userId);
          }
        }
      });

      network.on("hoverNode", function (params) {
        // @ts-ignore
        const node = nodes.get(params.node) as CustomNode;
        if (node.id === 0) return;
        document.body.style.cursor = "pointer";
        nodes.update({
          id: params.node,
          borderWidth: 8,
          size: node.originalSize * 1.1,
        });
      });

      network.on("blurNode", function (params) {
        // @ts-ignore
        const node = nodes.get(params.node) as CustomNode;
        if (node.id === 0) return;
        document.body.style.cursor = "default";
        nodes.update({
          id: params.node,
          borderWidth: 6,
          size: node.originalSize,
        });
      });

      network.once("afterDrawing", () => {
        network.fit({
          animation: {
            duration: 1000,
            easingFunction: "easeOutQuart",
          },
        });
      });

      networkInstanceRef.current = network;
    } catch (error) {
      console.error("Error initializing network:", error);
    }

    return () => {
      if (networkInstanceRef.current) {
        networkInstanceRef.current.off("click");
        networkInstanceRef.current.off("blurNode");
        networkInstanceRef.current.off("hoverNode");
        networkInstanceRef.current.destroy();
        networkInstanceRef.current = null;
      }
    };
  }, [selectedYear, onNodeClick, participantsByYear]);

  return { networkRef };
};
