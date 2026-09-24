/* Sena onboarding link builder, for the marketing website.
 *
 *   <script src="https://<sena-app>/sena-demo-link.js"></script>
 *   const url = senaDemoLink('https://<sena-app>', {
 *     industry: 'Insurance', country: 'South Africa', department: 'Distribution'
 *   });
 *   // → https://<sena-app>/onboarding-generic?d=1.KxwXFhs...
 *
 * Or copy the function into your own bundle: it has no dependencies and runs
 * in any browser. The three answers travel inside one opaque parameter; Sena
 * writes the prospect's onboarding demo from them when the link opens.
 *
 * Keep this file in sync with src/lib/demo/link-codec.js (same key, same
 * version prefix). */
(function (global) {
  var KEY = 'rwazi-sena-onboarding-2026';
  var VERSION = '1';

  function bytesOf(str) { return new TextEncoder().encode(str); }
  function xor(bytes) {
    var k = bytesOf(KEY);
    var out = new Uint8Array(bytes.length);
    for (var i = 0; i < bytes.length; i++) out[i] = bytes[i] ^ k[i % k.length];
    return out;
  }
  function toBase64url(bytes) {
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function clip(v) { return String(v || '').trim().slice(0, 80); }

  function encodeSenaDemo(answers) {
    var payload = JSON.stringify({
      i: clip(answers.industry), c: clip(answers.country), d: clip(answers.department)
    });
    return VERSION + '.' + toBase64url(xor(bytesOf(payload)));
  }

  function senaDemoLink(origin, answers) {
    return String(origin).replace(/\/$/, '') + '/onboarding-generic?d=' + encodeSenaDemo(answers);
  }

  global.encodeSenaDemo = encodeSenaDemo;
  global.senaDemoLink = senaDemoLink;
})(typeof window !== 'undefined' ? window : globalThis);
