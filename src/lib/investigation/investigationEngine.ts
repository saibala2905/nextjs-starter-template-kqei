import allEntities from "@/data/entities.json";
import allRelationships from "@/data/relationships.json";

import {
  Entity,
  Relationship,
} from "@/types/investigation";

import {
  buildEdges,
  buildNodes,
} from "./graph";

export interface InvestigationStatistics {
  entityCount: number;
  relationshipCount: number;

  highRiskEntities: number;

  averageRisk: number;

  averageConfidence: number;
}

export interface InvestigationResult {
  entities: Entity[];

  relationships: Relationship[];

  nodes: ReturnType<typeof buildNodes>;

  edges: ReturnType<typeof buildEdges>;

  statistics: InvestigationStatistics;

  recommendations: string[];
}

interface BuildOptions {
  depth?: number;
}

export function buildInvestigation(
  selectedEntities: Entity[],
  options: BuildOptions = {}
): InvestigationResult {

  const depth = options.depth ?? 1;

  const entityMap = new Map(
    allEntities.map((entity) => [entity.id, entity])
  );

  const discoveredEntities = new Map<
    string,
    Entity
  >();

  selectedEntities.forEach((entity) =>
    discoveredEntities.set(entity.id, entity)
  );

  const discoveredRelationships: Relationship[] = [];

  let frontier = selectedEntities.map(
    (entity) => entity.id
  );

  const visited = new Set(frontier);

  for (let level = 0; level < depth; level++) {

    const nextFrontier: string[] = [];

    allRelationships.forEach((relationship) => {

      const connected =
        frontier.includes(relationship.source) ||
        frontier.includes(relationship.target);

      if (!connected) return;

      discoveredRelationships.push(relationship);

      [relationship.source, relationship.target].forEach(
        (id) => {

          if (!visited.has(id)) {

            visited.add(id);

            nextFrontier.push(id);

            const entity = entityMap.get(id);

            if (entity) {

              discoveredEntities.set(
                entity.id,
                entity
              );

            }

          }

        }
      );

    });

    frontier = nextFrontier;

  }

  const entities = Array.from(
    discoveredEntities.values()
  );

  const relationships =
    discoveredRelationships;

  const statistics = {

    entityCount: entities.length,

    relationshipCount:
      relationships.length,

    highRiskEntities:
      entities.filter(
        (entity) => entity.risk >= 80
      ).length,

    averageRisk:

      entities.length === 0
        ? 0
        : Math.round(

            entities.reduce(
              (sum, entity) =>
                sum + entity.risk,
              0
            ) / entities.length

          ),

    averageConfidence:

      relationships.length === 0
        ? 0
        : Math.round(

            relationships.reduce(
              (sum, relationship) =>
                sum + relationship.confidence,
              0
            ) / relationships.length

          ),

  };

  const recommendations: string[] = [];

  if (statistics.highRiskEntities > 0) {

    recommendations.push(
      "Review high-risk entities first."
    );

  }

  if (statistics.relationshipCount > 8) {

    recommendations.push(
      "Large network detected. Expand investigation."
    );

  }

  if (statistics.averageConfidence < 60) {

    recommendations.push(
      "Low confidence links detected. Validate intelligence."
    );

  }

  if (recommendations.length === 0) {

    recommendations.push(
      "No immediate action recommended."
    );

  }

  return {

    entities,

    relationships,

    nodes: buildNodes(entities),

    edges: buildEdges(relationships),

    statistics,

    recommendations,

  };

}