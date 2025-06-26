export interface ExtComponent {
  xtype: string;
  config: Record<string, any>;
  children?: ExtComponent[];
}

export interface ParsedFile {
  path: string;
  content: string;
  components: ExtComponent[];
}