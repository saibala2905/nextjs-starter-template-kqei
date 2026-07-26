import { Edge, MarkerType, Node } from "reactflow";

import {
  Entity,
  Relationship,
} from "@/types/investigation";

/**
 * Converts investigation entities into React Flow nodes.
 */
export function buildNodes(
  entities: Entity[]
): Node[] {
  return entities.map((entity, index) => ({
    id: entity.id,

    type: "entity",

    position: {
      x: 250 * (index % 4),
      y: 180 * Math.floor(index / 4),
    },

    data: {
      entity,
    },
  }));
}

/**
 * Converts relationships into React Flow edges.
 */
export function buildEdges(
  relationships: Relationship[]
): Edge[] {
  return relationships.map((relationship) => ({
    id: relationship.id,

    source: relationship.source,

    target: relationship.target,

    label: relationship.type,

    animated: false,

    markerEnd: {
      type: MarkerType.ArrowClosed,
    },

    data: {
      relationship,
    },
  }));
}

/**
 * Builds the complete investigation graph.
 */
export function buildInvestigationGraph(
  entities: Entity[],
  relationships: Relationship[]
) {
  const entityIds = new Set(
    entities.map((entity) => entity.id)
  );

  /**
   * Only keep relationships where BOTH
   * source and target are part of the
   * current investigation.
   */
  const filteredRelationships =
    relationships.filter(
      (relationship) =>
        entityIds.has(relationship.source) &&
        entityIds.has(relationship.target)
    );

  return {
    nodes: buildNodes(entities),
    edges: buildEdges(filteredRelationships),
  };
}