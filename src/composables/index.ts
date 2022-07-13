interface TemplateData {
  [key: string]: string;
}

export const useTemplate = (template: string, data: TemplateData) => {
  for(const [key, value] of Object.entries(data)) {
    template = template.replaceAll(`[${key}]`, `${value}`);
  }

  return template;
}