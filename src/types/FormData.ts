export enum FormField {
  FRAG = 'frag',
  LOAD = 'load',
  WAX = 'wax',
}

export interface FormData {
  [FormField.FRAG]: string
  [FormField.LOAD]: string
  [FormField.WAX]: string
}
