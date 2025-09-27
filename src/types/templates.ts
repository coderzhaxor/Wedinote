export interface TemplateProps {
  id?: number;
  userId?: string;
  content: string;
  createdAt?: string;
}

export interface VariableProps {
  id?: string;
  templateId?: number;
  key: string;
  value: string;
}
