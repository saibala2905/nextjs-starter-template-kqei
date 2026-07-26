export interface Entity {
  id: string;

  type: string;

  label: string;

  description?: string;

  risk: number;

  confidence: number;

  tags: string[];

  properties: Record<string, unknown>;
}

export interface Relationship {
  id: string;

  source: string;

  target: string;

  type: string;

  confidence: number;

  description?: string;
}

export interface Investigation {
  id: string;

  title: string;

  description?: string;

  entities: Entity[];

  relationships: Relationship[];

  createdAt: string;

  updatedAt: string;
}