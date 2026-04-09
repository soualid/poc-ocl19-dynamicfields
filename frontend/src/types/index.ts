export interface FormTemplate {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  field_definitions?: FieldDefinition[];
  created_at: string;
  updated_at: string;
}

export interface FieldDefinition {
  id?: number;
  form_template_id?: number;
  field_name: string;
  field_label: string;
  field_type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  validation_rules: Record<string, unknown> | null;
  options: SelectOption[] | null;
  sort_order: number;
  is_required: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface Entity {
  id: number;
  form_template_id: number;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FieldProps {
  definition: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}
