let chai      = require('chai');
let multipart = require('../multipart');
let fs        = require('fs');

const expect = chai.expect;

describe('Upload tests', () => {

  it('should accept jpeg images', () => {
    let filename = 'test.txt';
    let boundary = '--------------------------726963471261442896443806';

    let body = `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`;
    body += 'Content-Type: text/plain\r\n';
    body += '\r\n';
    body += fs.readFileSync(`test/${filename}`);
    body += '\r\n';
    body += `--${boundary}--\r\n`;

    let req = {
      body:    new Buffer(body),
      headers: {'Content-Type': `multipart/form-data; boundary=${boundary}`}
    };

    let getBoundary = multipart.getBoundary(req.headers['Content-Type']);
    let parts = multipart.parse(req.body, getBoundary);

    expect(Array.isArray(parts)).to.eql(true);
    expect(parts.length).to.eql(1);
    expect(parts[0].filename).to.eql(filename);
    expect(parts[0].type).to.eql('text/plain');
    expect(parts[0].name).to.eql('file');
  });

});
