import {FlatCompat} from '@eslint/eslintrc';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const compat=new FlatCompat({baseDirectory:path.dirname(fileURLToPath(import.meta.url))});
export default [{ignores:['.next/**','.next-dev/**','node_modules/**','out/**']},...compat.extends('next/core-web-vitals')];
