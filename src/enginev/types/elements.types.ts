export interface UIComponent {
  name: string;
  description: string;
  demo_code: string;
  examples: string[];

  required?: boolean;
}

export interface IconComponent {
  name: string;
  description?: string;
  demo_code: string;

  required?: boolean;
}
