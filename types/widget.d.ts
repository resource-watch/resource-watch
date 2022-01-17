export interface APIWidgetSpec {
  id: string;
  name: string;
  dataset: string;
  slug: string;
  description?: string;
  application: string[];
  type?: string;
  userId: string;
  iso: string[];
  provider: string;
  userId: string;
  default: boolean;
  protected: boolean;
  published: boolean;
  verified: boolean;
  freeze: boolean;
  env: string;
  template: boolean;
  defaultEditableWidget: boolean;
  widgetConfig: Record<string, string | number | boolean | unknown>;
  source?: string;
  sourceUrl?: string;
  authors?: string;
  thumbnailUrl?: string;
  metadata?: Record<string, string | number | boolean | unknown>[];
  createdAt: string;
  updatedAt: string;
}
