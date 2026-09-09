import path from 'node:path';

export function validateUpload(buffer: Buffer, mime: string): void {
  const signatures: Record<string, () => boolean> = {
    'image/png': () => buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])),
    'image/jpeg': () => buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255,
    'image/webp': () => buffer.toString('ascii',0,4) === 'RIFF' && buffer.toString('ascii',8,12) === 'WEBP',
    'image/gif': () => /^GIF8[79]a/.test(buffer.toString('ascii',0,6)),
    'video/mp4': () => buffer.toString('ascii',4,8) === 'ftyp',
  };
  if (!buffer.length || buffer.length > 20 * 1024 * 1024 || !signatures[mime]?.()) {
    throw Object.assign(new Error('unsupported_or_oversized_file'), { statusCode: 400 });
  }
}

export function safeStoragePath(root: string, relative: string): string {
  if (!relative || relative.includes('\\') || relative.split('/').some(part => part === '..' || part === '.')) {
    throw Object.assign(new Error('invalid_storage_path'), { statusCode: 400 });
  }
  const base = path.resolve(root);
  const resolved = path.resolve(base, relative);
  if (!resolved.startsWith(base + path.sep)) throw Object.assign(new Error('invalid_storage_path'), { statusCode: 400 });
  return resolved;
}

export function safeUploadName(publicId:string,mime:string){
 const extensions:Record<string,string>={'image/png':'.png','image/jpeg':'.jpg','image/webp':'.webp','image/gif':'.gif','video/mp4':'.mp4'};
 const extension=extensions[mime];
 if(!extension)throw Object.assign(new Error('unsupported_file_type'),{statusCode:400});
 const base=publicId.replace(/[^a-zA-Z0-9_-]/g,'-').slice(0,180)||'asset';
 return base+extension;
}
