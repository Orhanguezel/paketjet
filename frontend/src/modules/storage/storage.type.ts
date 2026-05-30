export interface StorageAssetRef {
  id: string;
  name: string;
  bucket: string;
  folder: string | null;
  path: string;
  mime: string;
  width: number | null;
  height: number | null;
  url: string;
}
