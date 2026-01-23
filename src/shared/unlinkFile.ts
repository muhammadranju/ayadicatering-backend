import fs from 'fs';
import path from 'path';

const unlinkFile = (file: string) => {
  let filePath = file;
  if (filePath.startsWith('/')) {
    filePath = filePath.substring(1);
  }
  filePath = path.join('uploads', filePath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export default unlinkFile;
