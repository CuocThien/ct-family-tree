export interface TranslationResources {
  welcome: string;
  dashboard: string;
  members: string;
  tree: string;
  settings: string;
  login: string;
  logout: string;
  register: string;
  loading: string;
  error: string;
  success: string;
  cancel: string;
  save: string;
  delete: string;
  edit: string;
  add: string;
  search: string;
  noResults: string;
  confirmDelete: string;
}

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      en: TranslationResources;
      vi: TranslationResources;
    };
  }
}
