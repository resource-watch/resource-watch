export interface WYSIWYGContentItem {
  categories: string[];
  datasetId: string;
  widgetId: string;
}

export interface WYSIWYGItem {
  id: number;
  type: 'widget' | 'embed' | 'text' | 'image' | 'video' | 'grid' | 'mini-explore';
  content: WYSIWYGContentItem;
}
