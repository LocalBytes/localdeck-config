export enum FileType {
  Import = 'import',
  LocalDeck = 'localDeck',
  Other = 'other',
}

export const FileTypes = [FileType.Import, FileType.LocalDeck, FileType.Other]

export interface IndexFile {
  path: string
  filename: string
  name: string
  type: FileType

}
