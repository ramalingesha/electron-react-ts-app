export interface ExtConfig {
  xtype?: string;
  layout?: string;
  region?: string;
  title?: string;
  items?: ExtConfig[];
  [key: string]: any;
}

export interface ParsedComponent {
  id?: string;
  xtype: string;
  config: ExtConfig;
  children?: ParsedComponent[];
}