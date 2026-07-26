import { create } from "zustand";
import type { Edge, Node } from "reactflow";

import {
  Entity,
  Investigation,
  Relationship,
} from "@/types/investigation";

interface InvestigationStore {
  // ==========================
  // Investigation
  // ==========================

  investigation: Investigation | null;

  // ==========================
  // Investigation Data
  // ==========================

  entities: Entity[];
  relationships: Relationship[];

  // ==========================
  // React Flow Canvas
  // ==========================

  canvasNodes: Node[];
  canvasEdges: Edge[];

  // ==========================
  // Current Selection
  // ==========================

  selectedEntity: Entity | null;
  selectedRelationship: Relationship | null;

  // ==========================
  // Search
  // ==========================

  searchResults: Entity[];

  // ==========================
  // Investigation
  // ==========================

  loadInvestigation: (
    data: Investigation
  ) => void;

  // ==========================
  // Entity Actions
  // ==========================

  addEntity: (entity: Entity) => void;

  removeEntity: (
    entityId: string
  ) => void;

  // ==========================
  // Relationship Actions
  // ==========================

  addRelationship: (
    relationship: Relationship
  ) => void;

  removeRelationship: (
    relationshipId: string
  ) => void;

  // ==========================
  // Canvas Actions
  // ==========================

  setCanvas: (
    nodes: Node[],
    edges: Edge[]
  ) => void;

  clearCanvasGraph: () => void;

  // ==========================
  // Selection
  // ==========================

  selectEntity: (
    entity: Entity | null
  ) => void;

  selectRelationship: (
    relationship: Relationship | null
  ) => void;

  // ==========================
  // Search
  // ==========================

  setSearchResults: (
    results: Entity[]
  ) => void;

  // ==========================
  // Utility
  // ==========================

  clearCanvas: () => void;

  reset: () => void;
}

export const useInvestigationStore =
  create<InvestigationStore>((set) => ({

    // ==========================
    // Initial State
    // ==========================

    investigation: null,

    entities: [],

    relationships: [],

    canvasNodes: [],

    canvasEdges: [],

    selectedEntity: null,

    selectedRelationship: null,

    searchResults: [],

    // ==========================
    // Investigation
    // ==========================

    loadInvestigation: (data) =>
      set({
        investigation: data,
        entities: data.entities,
        relationships: data.relationships,
      }),

    // ==========================
    // Entity Actions
    // ==========================

    addEntity: (entity) =>
      set((state) => ({
        entities: [...state.entities, entity],
      })),

    removeEntity: (entityId) =>
      set((state) => ({
        entities: state.entities.filter(
          (entity) => entity.id !== entityId
        ),

        relationships:
          state.relationships.filter(
            (relationship) =>
              relationship.source !== entityId &&
              relationship.target !== entityId
          ),

        selectedEntity:
          state.selectedEntity?.id === entityId
            ? null
            : state.selectedEntity,
      })),

    // ==========================
    // Relationship Actions
    // ==========================

    addRelationship: (
      relationship
    ) =>
      set((state) => ({
        relationships: [
          ...state.relationships,
          relationship,
        ],
      })),

    removeRelationship: (
      relationshipId
    ) =>
      set((state) => ({
        relationships:
          state.relationships.filter(
            (relationship) =>
              relationship.id !==
              relationshipId
          ),

        selectedRelationship:
          state.selectedRelationship?.id ===
          relationshipId
            ? null
            : state.selectedRelationship,
      })),

    // ==========================
    // React Flow Canvas
    // ==========================

    setCanvas: (nodes, edges) =>
      set({
        canvasNodes: nodes,
        canvasEdges: edges,
      }),

    clearCanvasGraph: () =>
      set({
        canvasNodes: [],
        canvasEdges: [],
      }),

    // ==========================
    // Selection
    // ==========================

    selectEntity: (entity) =>
      set({
        selectedEntity: entity,
      }),

    selectRelationship: (
      relationship
    ) =>
      set({
        selectedRelationship: relationship,
      }),

    // ==========================
    // Search
    // ==========================

    setSearchResults: (
      results
    ) =>
      set({
        searchResults: results,
      }),

    // ==========================
    // Utility
    // ==========================

    clearCanvas: () =>
      set({
        entities: [],
        relationships: [],

        canvasNodes: [],
        canvasEdges: [],

        selectedEntity: null,
        selectedRelationship: null,
      }),

    reset: () =>
      set({
        investigation: null,

        entities: [],
        relationships: [],

        canvasNodes: [],
        canvasEdges: [],

        selectedEntity: null,
        selectedRelationship: null,

        searchResults: [],
      }),

  }));