"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  Node,
} from "reactflow";

import { useInvestigationStore } from "@/store/investigationStore";
import { nodeTypes } from "./nodeRegistry";

export default function InvestigationCanvas() {

  const {
    canvasNodes,
    canvasEdges,
    selectEntity,
  } = useInvestigationStore();

  const handleNodeClick = (
    _: React.MouseEvent,
    node: Node
  ) => {

    if (node.data?.entity) {
      selectEntity(node.data.entity);
    }

  };

  return (

    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

      {/* ========================= */}
      {/* Header */}
      {/* ========================= */}

      <div className="border-b px-6 py-5">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Investigation Canvas
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Visualize entity relationships and criminal intelligence.
            </p>

          </div>

          <div className="flex gap-2">

            <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {canvasNodes.length} Nodes
            </div>

            <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              {canvasEdges.length} Relationships
            </div>

          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* Canvas */}
      {/* ========================= */}

      <div className="h-[700px] w-full">

        {canvasNodes.length === 0 ? (

          <div className="flex h-full items-center justify-center bg-slate-50">

            <div className="max-w-md text-center">

              <h3 className="text-xl font-semibold text-slate-700">
                Investigation Ready
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Search and add one or more entities to your investigation.
                Then click
                <span className="mx-1 font-semibold text-blue-600">
                  Build Investigation Graph
                </span>
                to automatically discover related entities and visualize the
                investigation network.
              </p>

            </div>

          </div>

        ) : (

          <ReactFlow
            nodes={canvasNodes}
            edges={canvasEdges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{
              padding: 0.2,
            }}
            defaultEdgeOptions={{
              animated: true,
            }}
            onNodeClick={handleNodeClick}
            proOptions={{
              hideAttribution: true,
            }}
          >

            <Background
              variant={BackgroundVariant.Dots}
              gap={18}
              size={1.2}
            />

            <Controls
              position="bottom-left"
              showInteractive={false}
            />

            <MiniMap
              pannable
              zoomable
              position="bottom-right"
            />

          </ReactFlow>

        )}

      </div>

    </div>

  );

}