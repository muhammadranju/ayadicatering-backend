const mime = require('mime');
try {
  const type = mime.lookup('file.json');
  console.log('Lookup result:', type);
  if (type === 'application/json') {
    console.log('SUCCESS: mime.lookup is working');
    process.exit(0);
  } else {
    console.error('FAILURE: mime.lookup returned unexpected:', type);
    process.exit(1);
  }
} catch (error) {
  console.error('ERROR:', error);
  process.exit(1);
}
