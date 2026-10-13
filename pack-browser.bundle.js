var process=globalThis.process||{};process.browser=true;process.env=process.env||{};process.cwd=process.cwd||function(){return"/"};process.nextTick=process.nextTick||function(fn){var a=[].slice.call(arguments,1);setTimeout(function(){fn.apply(null,a)},0)};globalThis.process=process;
var MugenPacker = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require2() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/base64-js/index.js
  var require_base64_js = __commonJS({
    "node_modules/base64-js/index.js"(exports) {
      "use strict";
      init_browser_shims();
      exports.byteLength = byteLength;
      exports.toByteArray = toByteArray;
      exports.fromByteArray = fromByteArray;
      var lookup = [];
      var revLookup = [];
      var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }
      var i;
      var len;
      revLookup["-".charCodeAt(0)] = 62;
      revLookup["_".charCodeAt(0)] = 63;
      function getLens(b64) {
        var len2 = b64.length;
        if (len2 % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        var validLen = b64.indexOf("=");
        if (validLen === -1) validLen = len2;
        var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
        return [validLen, placeHoldersLen];
      }
      function byteLength(b64) {
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function _byteLength(b64, validLen, placeHoldersLen) {
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function toByteArray(b64) {
        var tmp;
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
        var curByte = 0;
        var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
        var i2;
        for (i2 = 0; i2 < len2; i2 += 4) {
          tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
          arr[curByte++] = tmp >> 16 & 255;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 2) {
          tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 1) {
          tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        return arr;
      }
      function tripletToBase64(num) {
        return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
      }
      function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i2 = start; i2 < end; i2 += 3) {
          tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
          output.push(tripletToBase64(tmp));
        }
        return output.join("");
      }
      function fromByteArray(uint8) {
        var tmp;
        var len2 = uint8.length;
        var extraBytes = len2 % 3;
        var parts = [];
        var maxChunkLength = 16383;
        for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
          parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
        }
        if (extraBytes === 1) {
          tmp = uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
          );
        } else if (extraBytes === 2) {
          tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
          );
        }
        return parts.join("");
      }
    }
  });

  // node_modules/ieee754/index.js
  var require_ieee754 = __commonJS({
    "node_modules/ieee754/index.js"(exports) {
      init_browser_shims();
      exports.read = function(buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];
        i += d;
        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
      };
      exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
        value = Math.abs(value);
        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
        }
        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
        }
        buffer[offset + i - d] |= s * 128;
      };
    }
  });

  // node_modules/buffer/index.js
  var require_buffer = __commonJS({
    "node_modules/buffer/index.js"(exports) {
      "use strict";
      init_browser_shims();
      var base64 = require_base64_js();
      var ieee754 = require_ieee754();
      var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
      exports.Buffer = Buffer2;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      var K_MAX_LENGTH = 2147483647;
      exports.kMaxLength = K_MAX_LENGTH;
      Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
      if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
        console.error(
          "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
        );
      }
      function typedArraySupport() {
        try {
          const arr = new Uint8Array(1);
          const proto = { foo: function() {
            return 42;
          } };
          Object.setPrototypeOf(proto, Uint8Array.prototype);
          Object.setPrototypeOf(arr, proto);
          return arr.foo() === 42;
        } catch (e) {
          return false;
        }
      }
      Object.defineProperty(Buffer2.prototype, "parent", {
        enumerable: true,
        get: function() {
          if (!Buffer2.isBuffer(this)) return void 0;
          return this.buffer;
        }
      });
      Object.defineProperty(Buffer2.prototype, "offset", {
        enumerable: true,
        get: function() {
          if (!Buffer2.isBuffer(this)) return void 0;
          return this.byteOffset;
        }
      });
      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"');
        }
        const buf = new Uint8Array(length);
        Object.setPrototypeOf(buf, Buffer2.prototype);
        return buf;
      }
      function Buffer2(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          if (typeof encodingOrOffset === "string") {
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          }
          return allocUnsafe(arg);
        }
        return from(arg, encodingOrOffset, length);
      }
      Buffer2.poolSize = 8192;
      function from(value, encodingOrOffset, length) {
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        if (ArrayBuffer.isView(value)) {
          return fromArrayView(value);
        }
        if (value == null) {
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
          );
        }
        if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "number") {
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        }
        const valueOf = value.valueOf && value.valueOf();
        if (valueOf != null && valueOf !== value) {
          return Buffer2.from(valueOf, encodingOrOffset, length);
        }
        const b = fromObject(value);
        if (b) return b;
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
          return Buffer2.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
        }
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      Buffer2.from = function(value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length);
      };
      Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(Buffer2, Uint8Array);
      function assertSize(size) {
        if (typeof size !== "number") {
          throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
      }
      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== void 0) {
          return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }
      Buffer2.alloc = function(size, fill, encoding) {
        return alloc(size, fill, encoding);
      };
      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }
      Buffer2.allocUnsafe = function(size) {
        return allocUnsafe(size);
      };
      Buffer2.allocUnsafeSlow = function(size) {
        return allocUnsafe(size);
      };
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer2.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        const length = byteLength(string, encoding) | 0;
        let buf = createBuffer(length);
        const actual = buf.write(string, encoding);
        if (actual !== length) {
          buf = buf.slice(0, actual);
        }
        return buf;
      }
      function fromArrayLike(array) {
        const length = array.length < 0 ? 0 : checked(array.length) | 0;
        const buf = createBuffer(length);
        for (let i = 0; i < length; i += 1) {
          buf[i] = array[i] & 255;
        }
        return buf;
      }
      function fromArrayView(arrayView) {
        if (isInstance(arrayView, Uint8Array)) {
          const copy = new Uint8Array(arrayView);
          return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
        }
        return fromArrayLike(arrayView);
      }
      function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds');
        }
        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds');
        }
        let buf;
        if (byteOffset === void 0 && length === void 0) {
          buf = new Uint8Array(array);
        } else if (length === void 0) {
          buf = new Uint8Array(array, byteOffset);
        } else {
          buf = new Uint8Array(array, byteOffset, length);
        }
        Object.setPrototypeOf(buf, Buffer2.prototype);
        return buf;
      }
      function fromObject(obj) {
        if (Buffer2.isBuffer(obj)) {
          const len = checked(obj.length) | 0;
          const buf = createBuffer(len);
          if (buf.length === 0) {
            return buf;
          }
          obj.copy(buf, 0, 0, len);
          return buf;
        }
        if (obj.length !== void 0) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      function checked(length) {
        if (length >= K_MAX_LENGTH) {
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
        }
        return length | 0;
      }
      function SlowBuffer(length) {
        if (+length != length) {
          length = 0;
        }
        return Buffer2.alloc(+length);
      }
      Buffer2.isBuffer = function isBuffer(b) {
        return b != null && b._isBuffer === true && b !== Buffer2.prototype;
      };
      Buffer2.compare = function compare(a, b) {
        if (isInstance(a, Uint8Array)) a = Buffer2.from(a, a.offset, a.byteLength);
        if (isInstance(b, Uint8Array)) b = Buffer2.from(b, b.offset, b.byteLength);
        if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        }
        if (a === b) return 0;
        let x = a.length;
        let y = b.length;
        for (let i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer2.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      };
      Buffer2.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        if (list.length === 0) {
          return Buffer2.alloc(0);
        }
        let i;
        if (length === void 0) {
          length = 0;
          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }
        const buffer = Buffer2.allocUnsafe(length);
        let pos = 0;
        for (i = 0; i < list.length; ++i) {
          let buf = list[i];
          if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) {
              if (!Buffer2.isBuffer(buf)) buf = Buffer2.from(buf);
              buf.copy(buffer, pos);
            } else {
              Uint8Array.prototype.set.call(
                buffer,
                buf,
                pos
              );
            }
          } else if (!Buffer2.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          } else {
            buf.copy(buffer, pos);
          }
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer2.isBuffer(string)) {
          return string.length;
        }
        if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
          return string.byteLength;
        }
        if (typeof string !== "string") {
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
          );
        }
        const len = string.length;
        const mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len === 0) return 0;
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "ascii":
            case "latin1":
            case "binary":
              return len;
            case "utf8":
            case "utf-8":
              return utf8ToBytes(string).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return len * 2;
            case "hex":
              return len >>> 1;
            case "base64":
              return base64ToBytes(string).length;
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes(string).length;
              }
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer2.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        let loweredCase = false;
        if (start === void 0 || start < 0) {
          start = 0;
        }
        if (start > this.length) {
          return "";
        }
        if (end === void 0 || end > this.length) {
          end = this.length;
        }
        if (end <= 0) {
          return "";
        }
        end >>>= 0;
        start >>>= 0;
        if (end <= start) {
          return "";
        }
        if (!encoding) encoding = "utf8";
        while (true) {
          switch (encoding) {
            case "hex":
              return hexSlice(this, start, end);
            case "utf8":
            case "utf-8":
              return utf8Slice(this, start, end);
            case "ascii":
              return asciiSlice(this, start, end);
            case "latin1":
            case "binary":
              return latin1Slice(this, start, end);
            case "base64":
              return base64Slice(this, start, end);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return utf16leSlice(this, start, end);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = (encoding + "").toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer2.prototype._isBuffer = true;
      function swap(b, n, m) {
        const i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer2.prototype.swap16 = function swap16() {
        const len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        }
        for (let i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }
        return this;
      };
      Buffer2.prototype.swap32 = function swap32() {
        const len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        }
        for (let i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer2.prototype.swap64 = function swap64() {
        const len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        }
        for (let i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer2.prototype.toString = function toString() {
        const length = this.length;
        if (length === 0) return "";
        if (arguments.length === 0) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
      Buffer2.prototype.equals = function equals(b) {
        if (!Buffer2.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return Buffer2.compare(this, b) === 0;
      };
      Buffer2.prototype.inspect = function inspect() {
        let str = "";
        const max = exports.INSPECT_MAX_BYTES;
        str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
        if (this.length > max) str += " ... ";
        return "<Buffer " + str + ">";
      };
      if (customInspectSymbol) {
        Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
      }
      Buffer2.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, Uint8Array)) {
          target = Buffer2.from(target, target.offset, target.byteLength);
        }
        if (!Buffer2.isBuffer(target)) {
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
          );
        }
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = target ? target.length : 0;
        }
        if (thisStart === void 0) {
          thisStart = 0;
        }
        if (thisEnd === void 0) {
          thisEnd = this.length;
        }
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError("out of range index");
        }
        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        let x = thisEnd - thisStart;
        let y = end - start;
        const len = Math.min(x, y);
        const thisCopy = this.slice(thisStart, thisEnd);
        const targetCopy = target.slice(start, end);
        for (let i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (buffer.length === 0) return -1;
        if (typeof byteOffset === "string") {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 2147483647) {
          byteOffset = 2147483647;
        } else if (byteOffset < -2147483648) {
          byteOffset = -2147483648;
        }
        byteOffset = +byteOffset;
        if (numberIsNaN(byteOffset)) {
          byteOffset = dir ? 0 : buffer.length - 1;
        }
        if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          else byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0;
          else return -1;
        }
        if (typeof val === "string") {
          val = Buffer2.from(val, encoding);
        }
        if (Buffer2.isBuffer(val)) {
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === "number") {
          val = val & 255;
          if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        let indexSize = 1;
        let arrLength = arr.length;
        let valLength = val.length;
        if (encoding !== void 0) {
          encoding = String(encoding).toLowerCase();
          if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i2) {
          if (indexSize === 1) {
            return buf[i2];
          } else {
            return buf.readUInt16BE(i2 * indexSize);
          }
        }
        let i;
        if (dir) {
          let foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1) foundIndex = i;
              if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1) i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
          for (i = byteOffset; i >= 0; i--) {
            let found = true;
            for (let j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
              }
            }
            if (found) return i;
          }
        }
        return -1;
      }
      Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };
      Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        const remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        const strLen = string.length;
        if (length > strLen / 2) {
          length = strLen / 2;
        }
        let i;
        for (i = 0; i < length; ++i) {
          const parsed = parseInt(string.substr(i * 2, 2), 16);
          if (numberIsNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer2.prototype.write = function write(string, offset, length, encoding) {
        if (offset === void 0) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (length === void 0 && typeof offset === "string") {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === void 0) encoding = "utf8";
          } else {
            encoding = length;
            length = void 0;
          }
        } else {
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        }
        const remaining = this.length - offset;
        if (length === void 0 || length > remaining) length = remaining;
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError("Attempt to write outside buffer bounds");
        }
        if (!encoding) encoding = "utf8";
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "hex":
              return hexWrite(this, string, offset, length);
            case "utf8":
            case "utf-8":
              return utf8Write(this, string, offset, length);
            case "ascii":
            case "latin1":
            case "binary":
              return asciiWrite(this, string, offset, length);
            case "base64":
              return base64Write(this, string, offset, length);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ucs2Write(this, string, offset, length);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };
      Buffer2.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        const res = [];
        let i = start;
        while (i < end) {
          const firstByte = buf[i];
          let codePoint = null;
          let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 128) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf[i + 1];
                if ((secondByte & 192) === 128) {
                  tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                  if (tempCodePoint > 127) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                  if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                fourthByte = buf[i + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                  if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }
          if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        const len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints);
        }
        let res = "";
        let i = 0;
        while (i < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
          );
        }
        return res;
      }
      function asciiSlice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 127);
        }
        return ret;
      }
      function latin1Slice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i]);
        }
        return ret;
      }
      function hexSlice(buf, start, end) {
        const len = buf.length;
        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;
        let out = "";
        for (let i = start; i < end; ++i) {
          out += hexSliceLookupTable[buf[i]];
        }
        return out;
      }
      function utf16leSlice(buf, start, end) {
        const bytes = buf.slice(start, end);
        let res = "";
        for (let i = 0; i < bytes.length - 1; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }
      Buffer2.prototype.slice = function slice(start, end) {
        const len = this.length;
        start = ~~start;
        end = end === void 0 ? len : ~~end;
        if (start < 0) {
          start += len;
          if (start < 0) start = 0;
        } else if (start > len) {
          start = len;
        }
        if (end < 0) {
          end += len;
          if (end < 0) end = 0;
        } else if (end > len) {
          end = len;
        }
        if (end < start) end = start;
        const newBuf = this.subarray(start, end);
        Object.setPrototypeOf(newBuf, Buffer2.prototype);
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        return val;
      };
      Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength2, this.length);
        }
        let val = this[offset + --byteLength2];
        let mul = 1;
        while (byteLength2 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength2] * mul;
        }
        return val;
      };
      Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
      };
      Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer2.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
        const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
      });
      Buffer2.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
        return (BigInt(hi) << BigInt(32)) + BigInt(lo);
      });
      Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let i = byteLength2;
        let mul = 1;
        let val = this[offset + --i];
        while (i > 0 && (mul *= 256)) {
          val += this[offset + --i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        if (!(this[offset] & 128)) return this[offset];
        return (255 - this[offset] + 1) * -1;
      };
      Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset] | this[offset + 1] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset + 1] | this[offset] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer2.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
        return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
      });
      Buffer2.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = (first << 24) + // Overflow
        this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
      });
      Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer2.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let mul = 1;
        let i = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
        return offset + 4;
      };
      Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      function wrtBigUInt64LE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        return offset;
      }
      function wrtBigUInt64BE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset + 7] = lo;
        lo = lo >> 8;
        buf[offset + 6] = lo;
        lo = lo >> 8;
        buf[offset + 5] = lo;
        lo = lo >> 8;
        buf[offset + 4] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset + 3] = hi;
        hi = hi >> 8;
        buf[offset + 2] = hi;
        hi = hi >> 8;
        buf[offset + 1] = hi;
        hi = hi >> 8;
        buf[offset] = hi;
        return offset + 8;
      }
      Buffer2.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer2.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = 0;
        let mul = 1;
        let sub = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        let sub = 0;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
        if (value < 0) value = 255 + value + 1;
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
      };
      Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (value < 0) value = 4294967295 + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      Buffer2.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      Buffer2.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
        if (!Buffer2.isBuffer(target)) throw new TypeError("argument should be a Buffer");
        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (targetStart >= target.length) targetStart = target.length;
        if (!targetStart) targetStart = 0;
        if (end > 0 && end < start) end = start;
        if (end === start) return 0;
        if (target.length === 0 || this.length === 0) return 0;
        if (targetStart < 0) {
          throw new RangeError("targetStart out of bounds");
        }
        if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        if (end > this.length) end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }
        const len = end - start;
        if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
          this.copyWithin(targetStart, start, end);
        } else {
          Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
          );
        }
        return len;
      };
      Buffer2.prototype.fill = function fill(val, start, end, encoding) {
        if (typeof val === "string") {
          if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
          }
          if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
          }
          if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") {
              val = code;
            }
          }
        } else if (typeof val === "number") {
          val = val & 255;
        } else if (typeof val === "boolean") {
          val = Number(val);
        }
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError("Out of range index");
        }
        if (end <= start) {
          return this;
        }
        start = start >>> 0;
        end = end === void 0 ? this.length : end >>> 0;
        if (!val) val = 0;
        let i;
        if (typeof val === "number") {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          const bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
          const len = bytes.length;
          if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
          }
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }
        return this;
      };
      var errors = {};
      function E(sym, getMessage, Base) {
        errors[sym] = class NodeError extends Base {
          constructor() {
            super();
            Object.defineProperty(this, "message", {
              value: getMessage.apply(this, arguments),
              writable: true,
              configurable: true
            });
            this.name = `${this.name} [${sym}]`;
            this.stack;
            delete this.name;
          }
          get code() {
            return sym;
          }
          set code(value) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${sym}]: ${this.message}`;
          }
        };
      }
      E(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(name) {
          if (name) {
            return `${name} is outside of buffer bounds`;
          }
          return "Attempt to access memory outside buffer bounds";
        },
        RangeError
      );
      E(
        "ERR_INVALID_ARG_TYPE",
        function(name, actual) {
          return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        function(str, range, input) {
          let msg = `The value of "${str}" is out of range.`;
          let received = input;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          }
          msg += ` It must be ${range}. Received ${received}`;
          return msg;
        },
        RangeError
      );
      function addNumericalSeparator(val) {
        let res = "";
        let i = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i >= start + 4; i -= 3) {
          res = `_${val.slice(i - 3, i)}${res}`;
        }
        return `${val.slice(0, i)}${res}`;
      }
      function checkBounds(buf, offset, byteLength2) {
        validateNumber(offset, "offset");
        if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
          boundsError(offset, buf.length - (byteLength2 + 1));
        }
      }
      function checkIntBI(value, min, max, buf, offset, byteLength2) {
        if (value > max || value < min) {
          const n = typeof min === "bigint" ? "n" : "";
          let range;
          if (byteLength2 > 3) {
            if (min === 0 || min === BigInt(0)) {
              range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
            } else {
              range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
            }
          } else {
            range = `>= ${min}${n} and <= ${max}${n}`;
          }
          throw new errors.ERR_OUT_OF_RANGE("value", range, value);
        }
        checkBounds(buf, offset, byteLength2);
      }
      function validateNumber(value, name) {
        if (typeof value !== "number") {
          throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
        }
      }
      function boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
          validateNumber(value, type);
          throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) {
          throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
        }
        throw new errors.ERR_OUT_OF_RANGE(
          type || "offset",
          `>= ${type ? 1 : 0} and <= ${length}`,
          value
        );
      }
      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = str.split("=")[0];
        str = str.trim().replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) {
          str = str + "=";
        }
        return str;
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        let codePoint;
        const length = string.length;
        let leadSurrogate = null;
        const bytes = [];
        for (let i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              } else if (i + 1 === length) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
          } else if (leadSurrogate) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
          }
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(
              codePoint >> 6 | 192,
              codePoint & 63 | 128
            );
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(
              codePoint >> 12 | 224,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else if (codePoint < 1114112) {
            if ((units -= 4) < 0) break;
            bytes.push(
              codePoint >> 18 | 240,
              codePoint >> 12 & 63 | 128,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else {
            throw new Error("Invalid code point");
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          byteArray.push(str.charCodeAt(i) & 255);
        }
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        let c, hi, lo;
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        let i;
        for (i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isInstance(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
      }
      function numberIsNaN(obj) {
        return obj !== obj;
      }
      var hexSliceLookupTable = (function() {
        const alphabet = "0123456789abcdef";
        const table = new Array(256);
        for (let i = 0; i < 16; ++i) {
          const i16 = i * 16;
          for (let j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i] + alphabet[j];
          }
        }
        return table;
      })();
      function defineBigIntMethod(fn) {
        return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
      }
      function BufferBigIntNotDefined() {
        throw new Error("BigInt not supported");
      }
    }
  });

  // tools/browser-shims.js
  var import_buffer, existing, proc;
  var init_browser_shims = __esm({
    "tools/browser-shims.js"() {
      import_buffer = __toESM(require_buffer());
      if (typeof globalThis.Buffer === "undefined") {
        globalThis.Buffer = import_buffer.Buffer;
      }
      existing = typeof globalThis.process !== "undefined" ? globalThis.process : null;
      proc = existing && typeof existing === "object" ? existing : {};
      if (!proc.env) proc.env = {};
      if (typeof proc.cwd !== "function") {
        proc.cwd = function cwd() {
          return "/";
        };
      }
      if (typeof proc.nextTick !== "function") {
        proc.nextTick = function nextTick(fn) {
          const args = Array.prototype.slice.call(arguments, 1);
          setTimeout(function() {
            fn.apply(null, args);
          }, 0);
        };
      }
      proc.browser = true;
      globalThis.process = proc;
    }
  });

  // node_modules/path-browserify/index.js
  var require_path_browserify = __commonJS({
    "node_modules/path-browserify/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      function assertPath(path) {
        if (typeof path !== "string") {
          throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
        }
      }
      function normalizeStringPosix(path, allowAboveRoot) {
        var res = "";
        var lastSegmentLength = 0;
        var lastSlash = -1;
        var dots = 0;
        var code;
        for (var i = 0; i <= path.length; ++i) {
          if (i < path.length)
            code = path.charCodeAt(i);
          else if (code === 47)
            break;
          else
            code = 47;
          if (code === 47) {
            if (lastSlash === i - 1 || dots === 1) {
            } else if (lastSlash !== i - 1 && dots === 2) {
              if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                if (res.length > 2) {
                  var lastSlashIndex = res.lastIndexOf("/");
                  if (lastSlashIndex !== res.length - 1) {
                    if (lastSlashIndex === -1) {
                      res = "";
                      lastSegmentLength = 0;
                    } else {
                      res = res.slice(0, lastSlashIndex);
                      lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
                    }
                    lastSlash = i;
                    dots = 0;
                    continue;
                  }
                } else if (res.length === 2 || res.length === 1) {
                  res = "";
                  lastSegmentLength = 0;
                  lastSlash = i;
                  dots = 0;
                  continue;
                }
              }
              if (allowAboveRoot) {
                if (res.length > 0)
                  res += "/..";
                else
                  res = "..";
                lastSegmentLength = 2;
              }
            } else {
              if (res.length > 0)
                res += "/" + path.slice(lastSlash + 1, i);
              else
                res = path.slice(lastSlash + 1, i);
              lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
          } else if (code === 46 && dots !== -1) {
            ++dots;
          } else {
            dots = -1;
          }
        }
        return res;
      }
      function _format(sep, pathObject) {
        var dir = pathObject.dir || pathObject.root;
        var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
        if (!dir) {
          return base;
        }
        if (dir === pathObject.root) {
          return dir + base;
        }
        return dir + sep + base;
      }
      var posix = {
        // path.resolve([from ...], to)
        resolve: function resolve() {
          var resolvedPath = "";
          var resolvedAbsolute = false;
          var cwd;
          for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path;
            if (i >= 0)
              path = arguments[i];
            else {
              if (cwd === void 0)
                cwd = process.cwd();
              path = cwd;
            }
            assertPath(path);
            if (path.length === 0) {
              continue;
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charCodeAt(0) === 47;
          }
          resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
          if (resolvedAbsolute) {
            if (resolvedPath.length > 0)
              return "/" + resolvedPath;
            else
              return "/";
          } else if (resolvedPath.length > 0) {
            return resolvedPath;
          } else {
            return ".";
          }
        },
        normalize: function normalize(path) {
          assertPath(path);
          if (path.length === 0) return ".";
          var isAbsolute = path.charCodeAt(0) === 47;
          var trailingSeparator = path.charCodeAt(path.length - 1) === 47;
          path = normalizeStringPosix(path, !isAbsolute);
          if (path.length === 0 && !isAbsolute) path = ".";
          if (path.length > 0 && trailingSeparator) path += "/";
          if (isAbsolute) return "/" + path;
          return path;
        },
        isAbsolute: function isAbsolute(path) {
          assertPath(path);
          return path.length > 0 && path.charCodeAt(0) === 47;
        },
        join: function join() {
          if (arguments.length === 0)
            return ".";
          var joined;
          for (var i = 0; i < arguments.length; ++i) {
            var arg = arguments[i];
            assertPath(arg);
            if (arg.length > 0) {
              if (joined === void 0)
                joined = arg;
              else
                joined += "/" + arg;
            }
          }
          if (joined === void 0)
            return ".";
          return posix.normalize(joined);
        },
        relative: function relative(from, to) {
          assertPath(from);
          assertPath(to);
          if (from === to) return "";
          from = posix.resolve(from);
          to = posix.resolve(to);
          if (from === to) return "";
          var fromStart = 1;
          for (; fromStart < from.length; ++fromStart) {
            if (from.charCodeAt(fromStart) !== 47)
              break;
          }
          var fromEnd = from.length;
          var fromLen = fromEnd - fromStart;
          var toStart = 1;
          for (; toStart < to.length; ++toStart) {
            if (to.charCodeAt(toStart) !== 47)
              break;
          }
          var toEnd = to.length;
          var toLen = toEnd - toStart;
          var length = fromLen < toLen ? fromLen : toLen;
          var lastCommonSep = -1;
          var i = 0;
          for (; i <= length; ++i) {
            if (i === length) {
              if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 47) {
                  return to.slice(toStart + i + 1);
                } else if (i === 0) {
                  return to.slice(toStart + i);
                }
              } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 47) {
                  lastCommonSep = i;
                } else if (i === 0) {
                  lastCommonSep = 0;
                }
              }
              break;
            }
            var fromCode = from.charCodeAt(fromStart + i);
            var toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
              break;
            else if (fromCode === 47)
              lastCommonSep = i;
          }
          var out = "";
          for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === 47) {
              if (out.length === 0)
                out += "..";
              else
                out += "/..";
            }
          }
          if (out.length > 0)
            return out + to.slice(toStart + lastCommonSep);
          else {
            toStart += lastCommonSep;
            if (to.charCodeAt(toStart) === 47)
              ++toStart;
            return to.slice(toStart);
          }
        },
        _makeLong: function _makeLong(path) {
          return path;
        },
        dirname: function dirname(path) {
          assertPath(path);
          if (path.length === 0) return ".";
          var code = path.charCodeAt(0);
          var hasRoot = code === 47;
          var end = -1;
          var matchedSlash = true;
          for (var i = path.length - 1; i >= 1; --i) {
            code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                end = i;
                break;
              }
            } else {
              matchedSlash = false;
            }
          }
          if (end === -1) return hasRoot ? "/" : ".";
          if (hasRoot && end === 1) return "//";
          return path.slice(0, end);
        },
        basename: function basename(path, ext) {
          if (ext !== void 0 && typeof ext !== "string") throw new TypeError('"ext" argument must be a string');
          assertPath(path);
          var start = 0;
          var end = -1;
          var matchedSlash = true;
          var i;
          if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path) return "";
            var extIdx = ext.length - 1;
            var firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= 0; --i) {
              var code = path.charCodeAt(i);
              if (code === 47) {
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else {
                if (firstNonSlashEnd === -1) {
                  matchedSlash = false;
                  firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                  if (code === ext.charCodeAt(extIdx)) {
                    if (--extIdx === -1) {
                      end = i;
                    }
                  } else {
                    extIdx = -1;
                    end = firstNonSlashEnd;
                  }
                }
              }
            }
            if (start === end) end = firstNonSlashEnd;
            else if (end === -1) end = path.length;
            return path.slice(start, end);
          } else {
            for (i = path.length - 1; i >= 0; --i) {
              if (path.charCodeAt(i) === 47) {
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
              }
            }
            if (end === -1) return "";
            return path.slice(start, end);
          }
        },
        extname: function extname(path) {
          assertPath(path);
          var startDot = -1;
          var startPart = 0;
          var end = -1;
          var matchedSlash = true;
          var preDotState = 0;
          for (var i = path.length - 1; i >= 0; --i) {
            var code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                startPart = i + 1;
                break;
              }
              continue;
            }
            if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
            if (code === 46) {
              if (startDot === -1)
                startDot = i;
              else if (preDotState !== 1)
                preDotState = 1;
            } else if (startDot !== -1) {
              preDotState = -1;
            }
          }
          if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
          preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
          preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            return "";
          }
          return path.slice(startDot, end);
        },
        format: function format(pathObject) {
          if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
          }
          return _format("/", pathObject);
        },
        parse: function parse(path) {
          assertPath(path);
          var ret = { root: "", dir: "", base: "", ext: "", name: "" };
          if (path.length === 0) return ret;
          var code = path.charCodeAt(0);
          var isAbsolute = code === 47;
          var start;
          if (isAbsolute) {
            ret.root = "/";
            start = 1;
          } else {
            start = 0;
          }
          var startDot = -1;
          var startPart = 0;
          var end = -1;
          var matchedSlash = true;
          var i = path.length - 1;
          var preDotState = 0;
          for (; i >= start; --i) {
            code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                startPart = i + 1;
                break;
              }
              continue;
            }
            if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
            if (code === 46) {
              if (startDot === -1) startDot = i;
              else if (preDotState !== 1) preDotState = 1;
            } else if (startDot !== -1) {
              preDotState = -1;
            }
          }
          if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
          preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
          preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            if (end !== -1) {
              if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);
              else ret.base = ret.name = path.slice(startPart, end);
            }
          } else {
            if (startPart === 0 && isAbsolute) {
              ret.name = path.slice(1, startDot);
              ret.base = path.slice(1, end);
            } else {
              ret.name = path.slice(startPart, startDot);
              ret.base = path.slice(startPart, end);
            }
            ret.ext = path.slice(startDot, end);
          }
          if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
          else if (isAbsolute) ret.dir = "/";
          return ret;
        },
        sep: "/",
        delimiter: ":",
        win32: null,
        posix: null
      };
      posix.posix = posix;
      module.exports = posix;
    }
  });

  // tools/memfs.js
  var require_memfs = __commonJS({
    "tools/memfs.js"(exports, module) {
      init_browser_shims();
      var path = require_path_browserify();
      var store = /* @__PURE__ */ new Map();
      function norm(p) {
        let s = String(p).replace(/\\/g, "/");
        if (!s.startsWith("/")) s = `/${s}`;
        s = s.replace(/\/+/g, "/");
        if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
        return s;
      }
      function ensureParentDirs(filePath) {
        const parts = norm(filePath).split("/").filter(Boolean);
        let cur = "";
        for (let i = 0; i < parts.length - 1; i++) {
          cur += `/${parts[i]}`;
          if (!store.has(cur)) store.set(cur, { __dir: true });
        }
      }
      function isDir(entry) {
        return entry && typeof entry === "object" && entry.__dir === true;
      }
      var fs = {
        __reset() {
          store.clear();
        },
        existsSync(p) {
          return store.has(norm(p));
        },
        mkdirSync(p, opts) {
          const n = norm(p);
          if (opts && opts.recursive) {
            const parts = n.split("/").filter(Boolean);
            let cur = "";
            for (const part of parts) {
              cur += `/${part}`;
              if (!store.has(cur)) store.set(cur, { __dir: true });
              else if (!isDir(store.get(cur)) && store.get(cur)) {
              }
            }
            return;
          }
          if (!store.has(n)) store.set(n, { __dir: true });
        },
        writeFileSync(p, data) {
          const n = norm(p);
          ensureParentDirs(n);
          const buf = import_buffer.Buffer.isBuffer(data) ? data : import_buffer.Buffer.from(data);
          store.set(n, buf);
        },
        readFileSync(p, encoding) {
          const n = norm(p);
          const entry = store.get(n);
          if (!entry || isDir(entry)) {
            const err = new Error(`ENOENT: no such file '${p}'`);
            err.code = "ENOENT";
            throw err;
          }
          if (encoding === "utf8" || encoding === "utf-8") return entry.toString("utf8");
          if (encoding === "latin1" || encoding === "binary" || encoding === "ascii") {
            return entry.toString(encoding === "ascii" ? "ascii" : "latin1");
          }
          return entry;
        },
        copyFileSync(src, dest) {
          const data = fs.readFileSync(src);
          fs.writeFileSync(dest, data);
        },
        readdirSync(p) {
          const n = norm(p);
          const prefix = n === "/" ? "/" : `${n}/`;
          const names = /* @__PURE__ */ new Set();
          for (const key of store.keys()) {
            if (!key.startsWith(prefix)) continue;
            const rest = key.slice(prefix.length);
            if (!rest) continue;
            const name = rest.split("/")[0];
            if (name) names.add(name);
          }
          return [...names];
        },
        statSync(p) {
          const n = norm(p);
          const entry = store.get(n);
          if (!entry) {
            const err = new Error(`ENOENT: no such file '${p}'`);
            err.code = "ENOENT";
            throw err;
          }
          if (isDir(entry)) {
            return { isDirectory: () => true, isFile: () => false, size: 0 };
          }
          return { isDirectory: () => false, isFile: () => true, size: entry.length };
        },
        rmSync(p, opts) {
          const n = norm(p);
          if (opts && opts.recursive) {
            for (const key of [...store.keys()]) {
              if (key === n || key.startsWith(`${n}/`)) store.delete(key);
            }
            return;
          }
          store.delete(n);
        }
      };
      module.exports = fs;
    }
  });

  // node_modules/has-symbols/shams.js
  var require_shams = __commonJS({
    "node_modules/has-symbols/shams.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = function hasSymbols() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var obj = {};
        var sym = /* @__PURE__ */ Symbol("test");
        var symObj = Object(sym);
        if (typeof sym === "string") {
          return false;
        }
        if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
          return false;
        }
        var symVal = 42;
        obj[sym] = symVal;
        for (var _ in obj) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
          return false;
        }
        var syms = Object.getOwnPropertySymbols(obj);
        if (syms.length !== 1 || syms[0] !== sym) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var descriptor = (
            /** @type {PropertyDescriptor} */
            Object.getOwnPropertyDescriptor(obj, sym)
          );
          if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
          }
        }
        return true;
      };
    }
  });

  // node_modules/has-tostringtag/shams.js
  var require_shams2 = __commonJS({
    "node_modules/has-tostringtag/shams.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var hasSymbols = require_shams();
      module.exports = function hasToStringTagShams() {
        return hasSymbols() && !!Symbol.toStringTag;
      };
    }
  });

  // node_modules/es-object-atoms/index.js
  var require_es_object_atoms = __commonJS({
    "node_modules/es-object-atoms/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = Object;
    }
  });

  // node_modules/es-errors/index.js
  var require_es_errors = __commonJS({
    "node_modules/es-errors/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = Error;
    }
  });

  // node_modules/es-errors/eval.js
  var require_eval = __commonJS({
    "node_modules/es-errors/eval.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = EvalError;
    }
  });

  // node_modules/es-errors/range.js
  var require_range = __commonJS({
    "node_modules/es-errors/range.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = RangeError;
    }
  });

  // node_modules/es-errors/ref.js
  var require_ref = __commonJS({
    "node_modules/es-errors/ref.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = ReferenceError;
    }
  });

  // node_modules/es-errors/syntax.js
  var require_syntax = __commonJS({
    "node_modules/es-errors/syntax.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = SyntaxError;
    }
  });

  // node_modules/es-errors/type.js
  var require_type = __commonJS({
    "node_modules/es-errors/type.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = TypeError;
    }
  });

  // node_modules/es-errors/uri.js
  var require_uri = __commonJS({
    "node_modules/es-errors/uri.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = URIError;
    }
  });

  // node_modules/math-intrinsics/abs.js
  var require_abs = __commonJS({
    "node_modules/math-intrinsics/abs.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = Math.abs;
    }
  });

  // node_modules/math-intrinsics/floor.js
  var require_floor = __commonJS({
    "node_modules/math-intrinsics/floor.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = Math.floor;
    }
  });

  // node_modules/math-intrinsics/max.js
  var require_max = __commonJS({
    "node_modules/math-intrinsics/max.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = Math.max;
    }
  });

  // node_modules/math-intrinsics/min.js
  var require_min = __commonJS({
    "node_modules/math-intrinsics/min.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = Math.min;
    }
  });

  // node_modules/math-intrinsics/pow.js
  var require_pow = __commonJS({
    "node_modules/math-intrinsics/pow.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = Math.pow;
    }
  });

  // node_modules/math-intrinsics/round.js
  var require_round = __commonJS({
    "node_modules/math-intrinsics/round.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = Math.round;
    }
  });

  // node_modules/math-intrinsics/isNaN.js
  var require_isNaN = __commonJS({
    "node_modules/math-intrinsics/isNaN.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = Number.isNaN || function isNaN2(a) {
        return a !== a;
      };
    }
  });

  // node_modules/math-intrinsics/sign.js
  var require_sign = __commonJS({
    "node_modules/math-intrinsics/sign.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var $isNaN = require_isNaN();
      module.exports = function sign(number) {
        if ($isNaN(number) || number === 0) {
          return number;
        }
        return number < 0 ? -1 : 1;
      };
    }
  });

  // node_modules/gopd/gOPD.js
  var require_gOPD = __commonJS({
    "node_modules/gopd/gOPD.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = Object.getOwnPropertyDescriptor;
    }
  });

  // node_modules/gopd/index.js
  var require_gopd = __commonJS({
    "node_modules/gopd/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var $gOPD = require_gOPD();
      if ($gOPD) {
        try {
          $gOPD([], "length");
        } catch (e) {
          $gOPD = null;
        }
      }
      module.exports = $gOPD;
    }
  });

  // node_modules/es-define-property/index.js
  var require_es_define_property = __commonJS({
    "node_modules/es-define-property/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var $defineProperty = Object.defineProperty || false;
      if ($defineProperty) {
        try {
          $defineProperty({}, "a", { value: 1 });
        } catch (e) {
          $defineProperty = false;
        }
      }
      module.exports = $defineProperty;
    }
  });

  // node_modules/has-symbols/index.js
  var require_has_symbols = __commonJS({
    "node_modules/has-symbols/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var origSymbol = typeof Symbol !== "undefined" && Symbol;
      var hasSymbolSham = require_shams();
      module.exports = function hasNativeSymbols() {
        if (typeof origSymbol !== "function") {
          return false;
        }
        if (typeof Symbol !== "function") {
          return false;
        }
        if (typeof origSymbol("foo") !== "symbol") {
          return false;
        }
        if (typeof /* @__PURE__ */ Symbol("bar") !== "symbol") {
          return false;
        }
        return hasSymbolSham();
      };
    }
  });

  // node_modules/get-proto/Reflect.getPrototypeOf.js
  var require_Reflect_getPrototypeOf = __commonJS({
    "node_modules/get-proto/Reflect.getPrototypeOf.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
    }
  });

  // node_modules/get-proto/Object.getPrototypeOf.js
  var require_Object_getPrototypeOf = __commonJS({
    "node_modules/get-proto/Object.getPrototypeOf.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var $Object = require_es_object_atoms();
      module.exports = $Object.getPrototypeOf || null;
    }
  });

  // node_modules/function-bind/implementation.js
  var require_implementation = __commonJS({
    "node_modules/function-bind/implementation.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
      var toStr = Object.prototype.toString;
      var max = Math.max;
      var funcType = "[object Function]";
      var concatty = function concatty2(a, b) {
        var arr = [];
        for (var i = 0; i < a.length; i += 1) {
          arr[i] = a[i];
        }
        for (var j = 0; j < b.length; j += 1) {
          arr[j + a.length] = b[j];
        }
        return arr;
      };
      var slicy = function slicy2(arrLike, offset) {
        var arr = [];
        for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
          arr[j] = arrLike[i];
        }
        return arr;
      };
      var joiny = function(arr, joiner) {
        var str = "";
        for (var i = 0; i < arr.length; i += 1) {
          str += arr[i];
          if (i + 1 < arr.length) {
            str += joiner;
          }
        }
        return str;
      };
      module.exports = function bind(that) {
        var target = this;
        if (typeof target !== "function" || toStr.apply(target) !== funcType) {
          throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slicy(arguments, 1);
        var bound;
        var binder = function() {
          if (this instanceof bound) {
            var result = target.apply(
              this,
              concatty(args, arguments)
            );
            if (Object(result) === result) {
              return result;
            }
            return this;
          }
          return target.apply(
            that,
            concatty(args, arguments)
          );
        };
        var boundLength = max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
          boundArgs[i] = "$" + i;
        }
        bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
        if (target.prototype) {
          var Empty = function Empty2() {
          };
          Empty.prototype = target.prototype;
          bound.prototype = new Empty();
          Empty.prototype = null;
        }
        return bound;
      };
    }
  });

  // node_modules/function-bind/index.js
  var require_function_bind = __commonJS({
    "node_modules/function-bind/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var implementation = require_implementation();
      module.exports = Function.prototype.bind || implementation;
    }
  });

  // node_modules/call-bind-apply-helpers/functionCall.js
  var require_functionCall = __commonJS({
    "node_modules/call-bind-apply-helpers/functionCall.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = Function.prototype.call;
    }
  });

  // node_modules/call-bind-apply-helpers/functionApply.js
  var require_functionApply = __commonJS({
    "node_modules/call-bind-apply-helpers/functionApply.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = Function.prototype.apply;
    }
  });

  // node_modules/call-bind-apply-helpers/reflectApply.js
  var require_reflectApply = __commonJS({
    "node_modules/call-bind-apply-helpers/reflectApply.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
    }
  });

  // node_modules/call-bind-apply-helpers/actualApply.js
  var require_actualApply = __commonJS({
    "node_modules/call-bind-apply-helpers/actualApply.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var bind = require_function_bind();
      var $apply = require_functionApply();
      var $call = require_functionCall();
      var $reflectApply = require_reflectApply();
      module.exports = $reflectApply || bind.call($call, $apply);
    }
  });

  // node_modules/call-bind-apply-helpers/index.js
  var require_call_bind_apply_helpers = __commonJS({
    "node_modules/call-bind-apply-helpers/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var bind = require_function_bind();
      var $TypeError = require_type();
      var $call = require_functionCall();
      var $actualApply = require_actualApply();
      module.exports = function callBindBasic(args) {
        if (args.length < 1 || typeof args[0] !== "function") {
          throw new $TypeError("a function is required");
        }
        return $actualApply(bind, $call, args);
      };
    }
  });

  // node_modules/dunder-proto/get.js
  var require_get = __commonJS({
    "node_modules/dunder-proto/get.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var callBind = require_call_bind_apply_helpers();
      var gOPD = require_gopd();
      var hasProtoAccessor;
      try {
        hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
        [].__proto__ === Array.prototype;
      } catch (e) {
        if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
          throw e;
        }
      }
      var desc = !!hasProtoAccessor && gOPD && gOPD(
        Object.prototype,
        /** @type {keyof typeof Object.prototype} */
        "__proto__"
      );
      var $Object = Object;
      var $getPrototypeOf = $Object.getPrototypeOf;
      module.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
        /** @type {import('./get')} */
        function getDunder(value) {
          return $getPrototypeOf(value == null ? value : $Object(value));
        }
      ) : false;
    }
  });

  // node_modules/get-proto/index.js
  var require_get_proto = __commonJS({
    "node_modules/get-proto/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var reflectGetProto = require_Reflect_getPrototypeOf();
      var originalGetProto = require_Object_getPrototypeOf();
      var getDunderProto = require_get();
      module.exports = reflectGetProto ? function getProto(O) {
        return reflectGetProto(O);
      } : originalGetProto ? function getProto(O) {
        if (!O || typeof O !== "object" && typeof O !== "function") {
          throw new TypeError("getProto: not an object");
        }
        return originalGetProto(O);
      } : getDunderProto ? function getProto(O) {
        return getDunderProto(O);
      } : null;
    }
  });

  // node_modules/hasown/index.js
  var require_hasown = __commonJS({
    "node_modules/hasown/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var call = Function.prototype.call;
      var $hasOwn = Object.prototype.hasOwnProperty;
      var bind = require_function_bind();
      module.exports = bind.call(call, $hasOwn);
    }
  });

  // node_modules/get-intrinsic/index.js
  var require_get_intrinsic = __commonJS({
    "node_modules/get-intrinsic/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var undefined2;
      var $Object = require_es_object_atoms();
      var $Error = require_es_errors();
      var $EvalError = require_eval();
      var $RangeError = require_range();
      var $ReferenceError = require_ref();
      var $SyntaxError = require_syntax();
      var $TypeError = require_type();
      var $URIError = require_uri();
      var abs = require_abs();
      var floor = require_floor();
      var max = require_max();
      var min = require_min();
      var pow = require_pow();
      var round = require_round();
      var sign = require_sign();
      var $Function = Function;
      var getEvalledConstructor = function(expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
        } catch (e) {
        }
      };
      var $gOPD = require_gopd();
      var $defineProperty = require_es_define_property();
      var throwTypeError = function() {
        throw new $TypeError();
      };
      var ThrowTypeError = $gOPD ? (function() {
        try {
          arguments.callee;
          return throwTypeError;
        } catch (calleeThrows) {
          try {
            return $gOPD(arguments, "callee").get;
          } catch (gOPDthrows) {
            return throwTypeError;
          }
        }
      })() : throwTypeError;
      var hasSymbols = require_has_symbols()();
      var getProto = require_get_proto();
      var $ObjectGPO = require_Object_getPrototypeOf();
      var $ReflectGPO = require_Reflect_getPrototypeOf();
      var $apply = require_functionApply();
      var $call = require_functionCall();
      var needsEval = {};
      var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
      var INTRINSICS = {
        __proto__: null,
        "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
        "%Array%": Array,
        "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
        "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
        "%AsyncFromSyncIteratorPrototype%": undefined2,
        "%AsyncFunction%": needsEval,
        "%AsyncGenerator%": needsEval,
        "%AsyncGeneratorFunction%": needsEval,
        "%AsyncIteratorPrototype%": needsEval,
        "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
        "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
        "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
        "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
        "%Boolean%": Boolean,
        "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
        "%Date%": Date,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": $Error,
        "%eval%": eval,
        // eslint-disable-line no-eval
        "%EvalError%": $EvalError,
        "%Float16Array%": typeof Float16Array === "undefined" ? undefined2 : Float16Array,
        "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
        "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
        "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
        "%Function%": $Function,
        "%GeneratorFunction%": needsEval,
        "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
        "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
        "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
        "%JSON%": typeof JSON === "object" ? JSON : undefined2,
        "%Map%": typeof Map === "undefined" ? undefined2 : Map,
        "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
        "%Math%": Math,
        "%Number%": Number,
        "%Object%": $Object,
        "%Object.getOwnPropertyDescriptor%": $gOPD,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
        "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
        "%RangeError%": $RangeError,
        "%ReferenceError%": $ReferenceError,
        "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
        "%RegExp%": RegExp,
        "%Set%": typeof Set === "undefined" ? undefined2 : Set,
        "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
        "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
        "%String%": String,
        "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
        "%Symbol%": hasSymbols ? Symbol : undefined2,
        "%SyntaxError%": $SyntaxError,
        "%ThrowTypeError%": ThrowTypeError,
        "%TypedArray%": TypedArray,
        "%TypeError%": $TypeError,
        "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
        "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
        "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
        "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
        "%URIError%": $URIError,
        "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
        "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
        "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
        "%Function.prototype.call%": $call,
        "%Function.prototype.apply%": $apply,
        "%Object.defineProperty%": $defineProperty,
        "%Object.getPrototypeOf%": $ObjectGPO,
        "%Math.abs%": abs,
        "%Math.floor%": floor,
        "%Math.max%": max,
        "%Math.min%": min,
        "%Math.pow%": pow,
        "%Math.round%": round,
        "%Math.sign%": sign,
        "%Reflect.getPrototypeOf%": $ReflectGPO
      };
      if (getProto) {
        try {
          null.error;
        } catch (e) {
          errorProto = getProto(getProto(e));
          INTRINSICS["%Error.prototype%"] = errorProto;
        }
      }
      var errorProto;
      var doEval = function doEval2(name) {
        var value;
        if (name === "%AsyncFunction%") {
          value = getEvalledConstructor("async function () {}");
        } else if (name === "%GeneratorFunction%") {
          value = getEvalledConstructor("function* () {}");
        } else if (name === "%AsyncGeneratorFunction%") {
          value = getEvalledConstructor("async function* () {}");
        } else if (name === "%AsyncGenerator%") {
          var fn = doEval2("%AsyncGeneratorFunction%");
          if (fn) {
            value = fn.prototype;
          }
        } else if (name === "%AsyncIteratorPrototype%") {
          var gen = doEval2("%AsyncGenerator%");
          if (gen && getProto) {
            value = getProto(gen.prototype);
          }
        }
        INTRINSICS[name] = value;
        return value;
      };
      var LEGACY_ALIASES = {
        __proto__: null,
        "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
        "%ArrayPrototype%": ["Array", "prototype"],
        "%ArrayProto_entries%": ["Array", "prototype", "entries"],
        "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
        "%ArrayProto_keys%": ["Array", "prototype", "keys"],
        "%ArrayProto_values%": ["Array", "prototype", "values"],
        "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
        "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
        "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
        "%BooleanPrototype%": ["Boolean", "prototype"],
        "%DataViewPrototype%": ["DataView", "prototype"],
        "%DatePrototype%": ["Date", "prototype"],
        "%ErrorPrototype%": ["Error", "prototype"],
        "%EvalErrorPrototype%": ["EvalError", "prototype"],
        "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
        "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
        "%FunctionPrototype%": ["Function", "prototype"],
        "%Generator%": ["GeneratorFunction", "prototype"],
        "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
        "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
        "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
        "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
        "%JSONParse%": ["JSON", "parse"],
        "%JSONStringify%": ["JSON", "stringify"],
        "%MapPrototype%": ["Map", "prototype"],
        "%NumberPrototype%": ["Number", "prototype"],
        "%ObjectPrototype%": ["Object", "prototype"],
        "%ObjProto_toString%": ["Object", "prototype", "toString"],
        "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
        "%PromisePrototype%": ["Promise", "prototype"],
        "%PromiseProto_then%": ["Promise", "prototype", "then"],
        "%Promise_all%": ["Promise", "all"],
        "%Promise_reject%": ["Promise", "reject"],
        "%Promise_resolve%": ["Promise", "resolve"],
        "%RangeErrorPrototype%": ["RangeError", "prototype"],
        "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
        "%RegExpPrototype%": ["RegExp", "prototype"],
        "%SetPrototype%": ["Set", "prototype"],
        "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
        "%StringPrototype%": ["String", "prototype"],
        "%SymbolPrototype%": ["Symbol", "prototype"],
        "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
        "%TypedArrayPrototype%": ["TypedArray", "prototype"],
        "%TypeErrorPrototype%": ["TypeError", "prototype"],
        "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
        "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
        "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
        "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
        "%URIErrorPrototype%": ["URIError", "prototype"],
        "%WeakMapPrototype%": ["WeakMap", "prototype"],
        "%WeakSetPrototype%": ["WeakSet", "prototype"]
      };
      var bind = require_function_bind();
      var hasOwn = require_hasown();
      var $concat = bind.call($call, Array.prototype.concat);
      var $spliceApply = bind.call($apply, Array.prototype.splice);
      var $replace = bind.call($call, String.prototype.replace);
      var $strSlice = bind.call($call, String.prototype.slice);
      var $exec = bind.call($call, RegExp.prototype.exec);
      var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = function stringToPath2(string) {
        var first = $strSlice(string, 0, 1);
        var last = $strSlice(string, -1);
        if (first === "%" && last !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
        } else if (last === "%" && first !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
        }
        var result = [];
        $replace(string, rePropName, function(match, number, quote, subString) {
          result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
        });
        return result;
      };
      var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
        var intrinsicName = name;
        var alias;
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName];
          intrinsicName = "%" + alias[0] + "%";
        }
        if (hasOwn(INTRINSICS, intrinsicName)) {
          var value = INTRINSICS[intrinsicName];
          if (value === needsEval) {
            value = doEval(intrinsicName);
          }
          if (typeof value === "undefined" && !allowMissing) {
            throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
          }
          return {
            alias,
            name: intrinsicName,
            value
          };
        }
        throw new $SyntaxError("intrinsic " + name + " does not exist!");
      };
      module.exports = function GetIntrinsic(name, allowMissing) {
        if (typeof name !== "string" || name.length === 0) {
          throw new $TypeError("intrinsic name must be a non-empty string");
        }
        if (arguments.length > 1 && typeof allowMissing !== "boolean") {
          throw new $TypeError('"allowMissing" argument must be a boolean');
        }
        if ($exec(/^%?[^%]*%?$/, name) === null) {
          throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
        }
        var parts = stringToPath(name);
        var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
        var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
        var intrinsicRealName = intrinsic.name;
        var value = intrinsic.value;
        var skipFurtherCaching = false;
        var alias = intrinsic.alias;
        if (alias) {
          intrinsicBaseName = alias[0];
          $spliceApply(parts, $concat([0, 1], alias));
        }
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
          var part = parts[i];
          var first = $strSlice(part, 0, 1);
          var last = $strSlice(part, -1);
          if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
            throw new $SyntaxError("property names with quotes must have matching quotes");
          }
          if (part === "constructor" || !isOwn) {
            skipFurtherCaching = true;
          }
          intrinsicBaseName += "." + part;
          intrinsicRealName = "%" + intrinsicBaseName + "%";
          if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
              }
              return void undefined2;
            }
            if ($gOPD && i + 1 >= parts.length) {
              var desc = $gOPD(value, part);
              isOwn = !!desc;
              if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
                value = desc.get;
              } else {
                value = value[part];
              }
            } else {
              isOwn = hasOwn(value, part);
              value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value;
            }
          }
        }
        return value;
      };
    }
  });

  // node_modules/call-bound/index.js
  var require_call_bound = __commonJS({
    "node_modules/call-bound/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var GetIntrinsic = require_get_intrinsic();
      var callBindBasic = require_call_bind_apply_helpers();
      var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
      module.exports = function callBoundIntrinsic(name, allowMissing) {
        var intrinsic = (
          /** @type {(this: unknown, ...args: unknown[]) => unknown} */
          GetIntrinsic(name, !!allowMissing)
        );
        if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
          return callBindBasic(
            /** @type {const} */
            [intrinsic]
          );
        }
        return intrinsic;
      };
    }
  });

  // node_modules/is-arguments/index.js
  var require_is_arguments = __commonJS({
    "node_modules/is-arguments/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var hasToStringTag = require_shams2()();
      var callBound = require_call_bound();
      var $toString = callBound("Object.prototype.toString");
      var isStandardArguments = function isArguments(value) {
        if (hasToStringTag && value && typeof value === "object" && Symbol.toStringTag in value) {
          return false;
        }
        return $toString(value) === "[object Arguments]";
      };
      var isLegacyArguments = function isArguments(value) {
        if (isStandardArguments(value)) {
          return true;
        }
        return value !== null && typeof value === "object" && "length" in value && typeof value.length === "number" && value.length >= 0 && $toString(value) !== "[object Array]" && "callee" in value && $toString(value.callee) === "[object Function]";
      };
      var supportsStandardArguments = (function() {
        return isStandardArguments(arguments);
      })();
      isStandardArguments.isLegacyArguments = isLegacyArguments;
      module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
    }
  });

  // node_modules/is-regex/index.js
  var require_is_regex = __commonJS({
    "node_modules/is-regex/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var callBound = require_call_bound();
      var hasToStringTag = require_shams2()();
      var hasOwn = require_hasown();
      var gOPD = require_gopd();
      var fn;
      if (hasToStringTag) {
        $exec = callBound("RegExp.prototype.exec");
        isRegexMarker = {};
        throwRegexMarker = function() {
          throw isRegexMarker;
        };
        badStringifier = {
          toString: throwRegexMarker,
          valueOf: throwRegexMarker
        };
        if (typeof Symbol.toPrimitive === "symbol") {
          badStringifier[Symbol.toPrimitive] = throwRegexMarker;
        }
        fn = function isRegex(value) {
          if (!value || typeof value !== "object") {
            return false;
          }
          var descriptor = (
            /** @type {NonNullable<typeof gOPD>} */
            gOPD(
              /** @type {{ lastIndex?: unknown }} */
              value,
              "lastIndex"
            )
          );
          var hasLastIndexDataProperty = descriptor && hasOwn(descriptor, "value");
          if (!hasLastIndexDataProperty) {
            return false;
          }
          try {
            $exec(
              value,
              /** @type {string} */
              /** @type {unknown} */
              badStringifier
            );
          } catch (e) {
            return e === isRegexMarker;
          }
        };
      } else {
        $toString = callBound("Object.prototype.toString");
        regexClass = "[object RegExp]";
        fn = function isRegex(value) {
          if (!value || typeof value !== "object" && typeof value !== "function") {
            return false;
          }
          return $toString(value) === regexClass;
        };
      }
      var $exec;
      var isRegexMarker;
      var throwRegexMarker;
      var badStringifier;
      var $toString;
      var regexClass;
      module.exports = fn;
    }
  });

  // node_modules/safe-regex-test/index.js
  var require_safe_regex_test = __commonJS({
    "node_modules/safe-regex-test/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var callBound = require_call_bound();
      var isRegex = require_is_regex();
      var $exec = callBound("RegExp.prototype.exec");
      var $TypeError = require_type();
      module.exports = function regexTester(regex) {
        if (!isRegex(regex)) {
          throw new $TypeError("`regex` must be a RegExp");
        }
        return function test(s) {
          return $exec(regex, s) !== null;
        };
      };
    }
  });

  // node_modules/generator-function/index.js
  var require_generator_function = __commonJS({
    "node_modules/generator-function/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var cached = (
        /** @type {GeneratorFunctionConstructor} */
        function* () {
        }.constructor
      );
      module.exports = () => cached;
    }
  });

  // node_modules/is-generator-function/index.js
  var require_is_generator_function = __commonJS({
    "node_modules/is-generator-function/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var callBound = require_call_bound();
      var safeRegexTest = require_safe_regex_test();
      var isFnRegex = safeRegexTest(/^\s*(?:function)?\*/);
      var hasToStringTag = require_shams2()();
      var getProto = require_get_proto();
      var toStr = callBound("Object.prototype.toString");
      var fnToStr = callBound("Function.prototype.toString");
      var getGeneratorFunction = require_generator_function();
      module.exports = function isGeneratorFunction(fn) {
        if (typeof fn !== "function") {
          return false;
        }
        if (isFnRegex(fnToStr(fn))) {
          return true;
        }
        if (!hasToStringTag) {
          var str = toStr(fn);
          return str === "[object GeneratorFunction]";
        }
        if (!getProto) {
          return false;
        }
        var GeneratorFunction = getGeneratorFunction();
        return GeneratorFunction && getProto(fn) === GeneratorFunction.prototype;
      };
    }
  });

  // node_modules/is-callable/index.js
  var require_is_callable = __commonJS({
    "node_modules/is-callable/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var fnToStr = Function.prototype.toString;
      var reflectApply = typeof Reflect === "object" && Reflect !== null && Reflect.apply;
      var badArrayLike;
      var isCallableMarker;
      if (typeof reflectApply === "function" && typeof Object.defineProperty === "function") {
        try {
          badArrayLike = Object.defineProperty({}, "length", {
            get: function() {
              throw isCallableMarker;
            }
          });
          isCallableMarker = {};
          reflectApply(function() {
            throw 42;
          }, null, badArrayLike);
        } catch (_) {
          if (_ !== isCallableMarker) {
            reflectApply = null;
          }
        }
      } else {
        reflectApply = null;
      }
      var constructorRegex = /^\s*class\b/;
      var isES6ClassFn = function isES6ClassFunction(value) {
        try {
          var fnStr = fnToStr.call(value);
          return constructorRegex.test(fnStr);
        } catch (e) {
          return false;
        }
      };
      var tryFunctionObject = function tryFunctionToStr(value) {
        try {
          if (isES6ClassFn(value)) {
            return false;
          }
          fnToStr.call(value);
          return true;
        } catch (e) {
          return false;
        }
      };
      var toStr = Object.prototype.toString;
      var objectClass = "[object Object]";
      var fnClass = "[object Function]";
      var genClass = "[object GeneratorFunction]";
      var ddaClass = "[object HTMLAllCollection]";
      var ddaClass2 = "[object HTML document.all class]";
      var ddaClass3 = "[object HTMLCollection]";
      var hasToStringTag = typeof Symbol === "function" && !!Symbol.toStringTag;
      var isIE68 = !(0 in [,]);
      var isDDA = function isDocumentDotAll() {
        return false;
      };
      if (typeof document === "object") {
        all = document.all;
        if (toStr.call(all) === toStr.call(document.all)) {
          isDDA = function isDocumentDotAll(value) {
            if ((isIE68 || !value) && (typeof value === "undefined" || typeof value === "object")) {
              try {
                var str = toStr.call(value);
                return (str === ddaClass || str === ddaClass2 || str === ddaClass3 || str === objectClass) && value("") == null;
              } catch (e) {
              }
            }
            return false;
          };
        }
      }
      var all;
      module.exports = reflectApply ? function isCallable(value) {
        if (isDDA(value)) {
          return true;
        }
        if (!value) {
          return false;
        }
        if (typeof value !== "function" && typeof value !== "object") {
          return false;
        }
        try {
          reflectApply(value, null, badArrayLike);
        } catch (e) {
          if (e !== isCallableMarker) {
            return false;
          }
        }
        return !isES6ClassFn(value) && tryFunctionObject(value);
      } : function isCallable(value) {
        if (isDDA(value)) {
          return true;
        }
        if (!value) {
          return false;
        }
        if (typeof value !== "function" && typeof value !== "object") {
          return false;
        }
        if (hasToStringTag) {
          return tryFunctionObject(value);
        }
        if (isES6ClassFn(value)) {
          return false;
        }
        var strClass = toStr.call(value);
        if (strClass !== fnClass && strClass !== genClass && !/^\[object HTML/.test(strClass)) {
          return false;
        }
        return tryFunctionObject(value);
      };
    }
  });

  // node_modules/for-each/index.js
  var require_for_each = __commonJS({
    "node_modules/for-each/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var isCallable = require_is_callable();
      var toStr = Object.prototype.toString;
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var forEachArray = function forEachArray2(array, iterator, receiver) {
        for (var i = 0, len = array.length; i < len; i++) {
          if (hasOwnProperty.call(array, i)) {
            if (receiver == null) {
              iterator(array[i], i, array);
            } else {
              iterator.call(receiver, array[i], i, array);
            }
          }
        }
      };
      var forEachString = function forEachString2(string, iterator, receiver) {
        for (var i = 0, len = string.length; i < len; i++) {
          if (receiver == null) {
            iterator(string.charAt(i), i, string);
          } else {
            iterator.call(receiver, string.charAt(i), i, string);
          }
        }
      };
      var forEachObject = function forEachObject2(object, iterator, receiver) {
        for (var k in object) {
          if (hasOwnProperty.call(object, k)) {
            if (receiver == null) {
              iterator(object[k], k, object);
            } else {
              iterator.call(receiver, object[k], k, object);
            }
          }
        }
      };
      function isArray(x) {
        return toStr.call(x) === "[object Array]";
      }
      module.exports = function forEach(list, iterator, thisArg) {
        if (!isCallable(iterator)) {
          throw new TypeError("iterator must be a function");
        }
        var receiver;
        if (arguments.length >= 3) {
          receiver = thisArg;
        }
        if (isArray(list)) {
          forEachArray(list, iterator, receiver);
        } else if (typeof list === "string") {
          forEachString(list, iterator, receiver);
        } else {
          forEachObject(list, iterator, receiver);
        }
      };
    }
  });

  // node_modules/possible-typed-array-names/index.js
  var require_possible_typed_array_names = __commonJS({
    "node_modules/possible-typed-array-names/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = [
        "Float16Array",
        "Float32Array",
        "Float64Array",
        "Int8Array",
        "Int16Array",
        "Int32Array",
        "Uint8Array",
        "Uint8ClampedArray",
        "Uint16Array",
        "Uint32Array",
        "BigInt64Array",
        "BigUint64Array"
      ];
    }
  });

  // node_modules/available-typed-arrays/index.js
  var require_available_typed_arrays = __commonJS({
    "node_modules/available-typed-arrays/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var possibleNames = require_possible_typed_array_names();
      var g = typeof globalThis === "undefined" ? globalThis : globalThis;
      module.exports = function availableTypedArrays() {
        var out = [];
        for (var i = 0; i < possibleNames.length; i++) {
          if (typeof g[possibleNames[i]] === "function") {
            out[out.length] = possibleNames[i];
          }
        }
        return out;
      };
    }
  });

  // node_modules/define-data-property/index.js
  var require_define_data_property = __commonJS({
    "node_modules/define-data-property/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var $defineProperty = require_es_define_property();
      var $SyntaxError = require_syntax();
      var $TypeError = require_type();
      var gopd = require_gopd();
      module.exports = function defineDataProperty(obj, property, value) {
        if (!obj || typeof obj !== "object" && typeof obj !== "function") {
          throw new $TypeError("`obj` must be an object or a function`");
        }
        if (typeof property !== "string" && typeof property !== "symbol") {
          throw new $TypeError("`property` must be a string or a symbol`");
        }
        if (arguments.length > 3 && typeof arguments[3] !== "boolean" && arguments[3] !== null) {
          throw new $TypeError("`nonEnumerable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 4 && typeof arguments[4] !== "boolean" && arguments[4] !== null) {
          throw new $TypeError("`nonWritable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 5 && typeof arguments[5] !== "boolean" && arguments[5] !== null) {
          throw new $TypeError("`nonConfigurable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 6 && typeof arguments[6] !== "boolean") {
          throw new $TypeError("`loose`, if provided, must be a boolean");
        }
        var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
        var nonWritable = arguments.length > 4 ? arguments[4] : null;
        var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
        var loose = arguments.length > 6 ? arguments[6] : false;
        var desc = !!gopd && gopd(obj, property);
        if ($defineProperty) {
          $defineProperty(obj, property, {
            configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
            enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
            value,
            writable: nonWritable === null && desc ? desc.writable : !nonWritable
          });
        } else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) {
          obj[property] = value;
        } else {
          throw new $SyntaxError("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
        }
      };
    }
  });

  // node_modules/has-property-descriptors/index.js
  var require_has_property_descriptors = __commonJS({
    "node_modules/has-property-descriptors/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var $defineProperty = require_es_define_property();
      var hasPropertyDescriptors = function hasPropertyDescriptors2() {
        return !!$defineProperty;
      };
      hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
        if (!$defineProperty) {
          return null;
        }
        try {
          return $defineProperty([], "length", { value: 1 }).length !== 1;
        } catch (e) {
          return true;
        }
      };
      module.exports = hasPropertyDescriptors;
    }
  });

  // node_modules/set-function-length/index.js
  var require_set_function_length = __commonJS({
    "node_modules/set-function-length/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var GetIntrinsic = require_get_intrinsic();
      var define = require_define_data_property();
      var hasDescriptors = require_has_property_descriptors()();
      var gOPD = require_gopd();
      var $TypeError = require_type();
      var $floor = GetIntrinsic("%Math.floor%");
      module.exports = function setFunctionLength(fn, length) {
        if (typeof fn !== "function") {
          throw new $TypeError("`fn` is not a function");
        }
        if (typeof length !== "number" || length < 0 || length > 4294967295 || $floor(length) !== length) {
          throw new $TypeError("`length` must be a positive 32-bit integer");
        }
        var loose = arguments.length > 2 && !!arguments[2];
        var functionLengthIsConfigurable = true;
        var functionLengthIsWritable = true;
        if ("length" in fn && gOPD) {
          var desc = gOPD(fn, "length");
          if (desc && !desc.configurable) {
            functionLengthIsConfigurable = false;
          }
          if (desc && !desc.writable) {
            functionLengthIsWritable = false;
          }
        }
        if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
          if (hasDescriptors) {
            define(
              /** @type {Parameters<define>[0]} */
              fn,
              "length",
              length,
              true,
              true
            );
          } else {
            define(
              /** @type {Parameters<define>[0]} */
              fn,
              "length",
              length
            );
          }
        }
        return fn;
      };
    }
  });

  // node_modules/call-bind-apply-helpers/applyBind.js
  var require_applyBind = __commonJS({
    "node_modules/call-bind-apply-helpers/applyBind.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var bind = require_function_bind();
      var $apply = require_functionApply();
      var actualApply = require_actualApply();
      module.exports = function applyBind() {
        return actualApply(bind, $apply, arguments);
      };
    }
  });

  // node_modules/call-bind/index.js
  var require_call_bind = __commonJS({
    "node_modules/call-bind/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var setFunctionLength = require_set_function_length();
      var $defineProperty = require_es_define_property();
      var callBindBasic = require_call_bind_apply_helpers();
      var applyBind = require_applyBind();
      module.exports = function callBind(originalFunction) {
        var func = callBindBasic(arguments);
        var adjustedLength = 1 + originalFunction.length - (arguments.length - 1);
        return setFunctionLength(
          func,
          adjustedLength > 0 ? adjustedLength : 0,
          true
        );
      };
      if ($defineProperty) {
        $defineProperty(module.exports, "apply", { value: applyBind });
      } else {
        module.exports.apply = applyBind;
      }
    }
  });

  // node_modules/which-typed-array/index.js
  var require_which_typed_array = __commonJS({
    "node_modules/which-typed-array/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var forEach = require_for_each();
      var availableTypedArrays = require_available_typed_arrays();
      var callBind = require_call_bind();
      var callBound = require_call_bound();
      var gOPD = require_gopd();
      var getProto = require_get_proto();
      var $toString = callBound("Object.prototype.toString");
      var hasToStringTag = require_shams2()();
      var g = typeof globalThis === "undefined" ? globalThis : globalThis;
      var typedArrays = availableTypedArrays();
      var $slice = callBound("String.prototype.slice");
      var $indexOf = callBound("Array.prototype.indexOf", true) || function indexOf(array, value) {
        for (var i = 0; i < array.length; i += 1) {
          if (array[i] === value) {
            return i;
          }
        }
        return -1;
      };
      var cache = { __proto__: null };
      if (hasToStringTag && gOPD && getProto) {
        forEach(typedArrays, function(typedArray) {
          var arr = new g[typedArray]();
          if (Symbol.toStringTag in arr && getProto) {
            var proto = getProto(arr);
            var descriptor = gOPD(proto, Symbol.toStringTag);
            if (!descriptor && proto) {
              var superProto = getProto(proto);
              descriptor = gOPD(superProto, Symbol.toStringTag);
            }
            if (descriptor && descriptor.get) {
              var bound = callBind(descriptor.get);
              cache[
                /** @type {`$${TypedArrayName}`} */
                "$" + typedArray
              ] = bound;
            }
          }
        });
      } else {
        forEach(typedArrays, function(typedArray) {
          var arr = new g[typedArray]();
          var fn = arr.slice || arr.set;
          if (fn) {
            var bound = (
              /** @type {typeof BoundSlice | typeof BoundSet} */
              // @ts-expect-error TODO FIXME
              callBind(fn)
            );
            cache[
              /** @type {`$${TypedArrayName}`} */
              "$" + typedArray
            ] = bound;
          }
        });
      }
      function tryTypedArrays(value) {
        var found = false;
        forEach(
          /** @type {Record<`$${TypedArrayName}`, Getter>} */
          cache,
          /** @param {Getter} getter @param {`$${TypedArrayName}`} typedArray */
          function(getter, typedArray) {
            if (!found) {
              try {
                if ("$" + getter(value) === typedArray) {
                  found = /** @type {TypedArrayName} */
                  $slice(typedArray, 1);
                }
              } catch (e) {
              }
            }
          }
        );
        return found;
      }
      function trySlices(value) {
        var found = false;
        forEach(
          /** @type {Record<`$${TypedArrayName}`, Getter>} */
          cache,
          /** @param {Getter} getter @param {`$${TypedArrayName}`} name */
          function(getter, name) {
            if (!found) {
              try {
                getter(value);
                found = /** @type {TypedArrayName} */
                $slice(name, 1);
              } catch (e) {
              }
            }
          }
        );
        return found;
      }
      function isTATag(tag) {
        return $indexOf(typedArrays, tag) > -1;
      }
      function whichTypedArray(value) {
        if (!value || typeof value !== "object") {
          return false;
        }
        if (!hasToStringTag) {
          var tag = $slice($toString(value), 8, -1);
          if (isTATag(tag)) {
            return tag;
          }
          if (tag !== "Object") {
            return false;
          }
          return trySlices(value);
        }
        if (!gOPD) {
          return null;
        }
        return tryTypedArrays(value);
      }
      module.exports = whichTypedArray;
    }
  });

  // node_modules/is-typed-array/index.js
  var require_is_typed_array = __commonJS({
    "node_modules/is-typed-array/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var whichTypedArray = require_which_typed_array();
      module.exports = function isTypedArray(value) {
        return !!whichTypedArray(value);
      };
    }
  });

  // node_modules/util/support/types.js
  var require_types = __commonJS({
    "node_modules/util/support/types.js"(exports) {
      "use strict";
      init_browser_shims();
      var isArgumentsObject = require_is_arguments();
      var isGeneratorFunction = require_is_generator_function();
      var whichTypedArray = require_which_typed_array();
      var isTypedArray = require_is_typed_array();
      function uncurryThis(f) {
        return f.call.bind(f);
      }
      var BigIntSupported = typeof BigInt !== "undefined";
      var SymbolSupported = typeof Symbol !== "undefined";
      var ObjectToString = uncurryThis(Object.prototype.toString);
      var numberValue = uncurryThis(Number.prototype.valueOf);
      var stringValue = uncurryThis(String.prototype.valueOf);
      var booleanValue = uncurryThis(Boolean.prototype.valueOf);
      if (BigIntSupported) {
        bigIntValue = uncurryThis(BigInt.prototype.valueOf);
      }
      var bigIntValue;
      if (SymbolSupported) {
        symbolValue = uncurryThis(Symbol.prototype.valueOf);
      }
      var symbolValue;
      function checkBoxedPrimitive(value, prototypeValueOf) {
        if (typeof value !== "object") {
          return false;
        }
        try {
          prototypeValueOf(value);
          return true;
        } catch (e) {
          return false;
        }
      }
      exports.isArgumentsObject = isArgumentsObject;
      exports.isGeneratorFunction = isGeneratorFunction;
      exports.isTypedArray = isTypedArray;
      function isPromise(input) {
        return typeof Promise !== "undefined" && input instanceof Promise || input !== null && typeof input === "object" && typeof input.then === "function" && typeof input.catch === "function";
      }
      exports.isPromise = isPromise;
      function isArrayBufferView(value) {
        if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
          return ArrayBuffer.isView(value);
        }
        return isTypedArray(value) || isDataView(value);
      }
      exports.isArrayBufferView = isArrayBufferView;
      function isUint8Array(value) {
        return whichTypedArray(value) === "Uint8Array";
      }
      exports.isUint8Array = isUint8Array;
      function isUint8ClampedArray(value) {
        return whichTypedArray(value) === "Uint8ClampedArray";
      }
      exports.isUint8ClampedArray = isUint8ClampedArray;
      function isUint16Array(value) {
        return whichTypedArray(value) === "Uint16Array";
      }
      exports.isUint16Array = isUint16Array;
      function isUint32Array(value) {
        return whichTypedArray(value) === "Uint32Array";
      }
      exports.isUint32Array = isUint32Array;
      function isInt8Array(value) {
        return whichTypedArray(value) === "Int8Array";
      }
      exports.isInt8Array = isInt8Array;
      function isInt16Array(value) {
        return whichTypedArray(value) === "Int16Array";
      }
      exports.isInt16Array = isInt16Array;
      function isInt32Array(value) {
        return whichTypedArray(value) === "Int32Array";
      }
      exports.isInt32Array = isInt32Array;
      function isFloat32Array(value) {
        return whichTypedArray(value) === "Float32Array";
      }
      exports.isFloat32Array = isFloat32Array;
      function isFloat64Array(value) {
        return whichTypedArray(value) === "Float64Array";
      }
      exports.isFloat64Array = isFloat64Array;
      function isBigInt64Array(value) {
        return whichTypedArray(value) === "BigInt64Array";
      }
      exports.isBigInt64Array = isBigInt64Array;
      function isBigUint64Array(value) {
        return whichTypedArray(value) === "BigUint64Array";
      }
      exports.isBigUint64Array = isBigUint64Array;
      function isMapToString(value) {
        return ObjectToString(value) === "[object Map]";
      }
      isMapToString.working = typeof Map !== "undefined" && isMapToString(/* @__PURE__ */ new Map());
      function isMap(value) {
        if (typeof Map === "undefined") {
          return false;
        }
        return isMapToString.working ? isMapToString(value) : value instanceof Map;
      }
      exports.isMap = isMap;
      function isSetToString(value) {
        return ObjectToString(value) === "[object Set]";
      }
      isSetToString.working = typeof Set !== "undefined" && isSetToString(/* @__PURE__ */ new Set());
      function isSet(value) {
        if (typeof Set === "undefined") {
          return false;
        }
        return isSetToString.working ? isSetToString(value) : value instanceof Set;
      }
      exports.isSet = isSet;
      function isWeakMapToString(value) {
        return ObjectToString(value) === "[object WeakMap]";
      }
      isWeakMapToString.working = typeof WeakMap !== "undefined" && isWeakMapToString(/* @__PURE__ */ new WeakMap());
      function isWeakMap(value) {
        if (typeof WeakMap === "undefined") {
          return false;
        }
        return isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap;
      }
      exports.isWeakMap = isWeakMap;
      function isWeakSetToString(value) {
        return ObjectToString(value) === "[object WeakSet]";
      }
      isWeakSetToString.working = typeof WeakSet !== "undefined" && isWeakSetToString(/* @__PURE__ */ new WeakSet());
      function isWeakSet(value) {
        return isWeakSetToString(value);
      }
      exports.isWeakSet = isWeakSet;
      function isArrayBufferToString(value) {
        return ObjectToString(value) === "[object ArrayBuffer]";
      }
      isArrayBufferToString.working = typeof ArrayBuffer !== "undefined" && isArrayBufferToString(new ArrayBuffer());
      function isArrayBuffer(value) {
        if (typeof ArrayBuffer === "undefined") {
          return false;
        }
        return isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer;
      }
      exports.isArrayBuffer = isArrayBuffer;
      function isDataViewToString(value) {
        return ObjectToString(value) === "[object DataView]";
      }
      isDataViewToString.working = typeof ArrayBuffer !== "undefined" && typeof DataView !== "undefined" && isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));
      function isDataView(value) {
        if (typeof DataView === "undefined") {
          return false;
        }
        return isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView;
      }
      exports.isDataView = isDataView;
      var SharedArrayBufferCopy = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : void 0;
      function isSharedArrayBufferToString(value) {
        return ObjectToString(value) === "[object SharedArrayBuffer]";
      }
      function isSharedArrayBuffer(value) {
        if (typeof SharedArrayBufferCopy === "undefined") {
          return false;
        }
        if (typeof isSharedArrayBufferToString.working === "undefined") {
          isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
        }
        return isSharedArrayBufferToString.working ? isSharedArrayBufferToString(value) : value instanceof SharedArrayBufferCopy;
      }
      exports.isSharedArrayBuffer = isSharedArrayBuffer;
      function isAsyncFunction(value) {
        return ObjectToString(value) === "[object AsyncFunction]";
      }
      exports.isAsyncFunction = isAsyncFunction;
      function isMapIterator(value) {
        return ObjectToString(value) === "[object Map Iterator]";
      }
      exports.isMapIterator = isMapIterator;
      function isSetIterator(value) {
        return ObjectToString(value) === "[object Set Iterator]";
      }
      exports.isSetIterator = isSetIterator;
      function isGeneratorObject(value) {
        return ObjectToString(value) === "[object Generator]";
      }
      exports.isGeneratorObject = isGeneratorObject;
      function isWebAssemblyCompiledModule(value) {
        return ObjectToString(value) === "[object WebAssembly.Module]";
      }
      exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;
      function isNumberObject(value) {
        return checkBoxedPrimitive(value, numberValue);
      }
      exports.isNumberObject = isNumberObject;
      function isStringObject(value) {
        return checkBoxedPrimitive(value, stringValue);
      }
      exports.isStringObject = isStringObject;
      function isBooleanObject(value) {
        return checkBoxedPrimitive(value, booleanValue);
      }
      exports.isBooleanObject = isBooleanObject;
      function isBigIntObject(value) {
        return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
      }
      exports.isBigIntObject = isBigIntObject;
      function isSymbolObject(value) {
        return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
      }
      exports.isSymbolObject = isSymbolObject;
      function isBoxedPrimitive(value) {
        return isNumberObject(value) || isStringObject(value) || isBooleanObject(value) || isBigIntObject(value) || isSymbolObject(value);
      }
      exports.isBoxedPrimitive = isBoxedPrimitive;
      function isAnyArrayBuffer(value) {
        return typeof Uint8Array !== "undefined" && (isArrayBuffer(value) || isSharedArrayBuffer(value));
      }
      exports.isAnyArrayBuffer = isAnyArrayBuffer;
      ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(method) {
        Object.defineProperty(exports, method, {
          enumerable: false,
          value: function() {
            throw new Error(method + " is not supported in userland");
          }
        });
      });
    }
  });

  // node_modules/util/support/isBufferBrowser.js
  var require_isBufferBrowser = __commonJS({
    "node_modules/util/support/isBufferBrowser.js"(exports, module) {
      init_browser_shims();
      module.exports = function isBuffer(arg) {
        return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
      };
    }
  });

  // node_modules/inherits/inherits_browser.js
  var require_inherits_browser = __commonJS({
    "node_modules/inherits/inherits_browser.js"(exports, module) {
      init_browser_shims();
      if (typeof Object.create === "function") {
        module.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
              constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
              }
            });
          }
        };
      } else {
        module.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function() {
            };
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
          }
        };
      }
    }
  });

  // node_modules/util/util.js
  var require_util = __commonJS({
    "node_modules/util/util.js"(exports) {
      init_browser_shims();
      var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors2(obj) {
        var keys = Object.keys(obj);
        var descriptors = {};
        for (var i = 0; i < keys.length; i++) {
          descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
        }
        return descriptors;
      };
      var formatRegExp = /%[sdj%]/g;
      exports.format = function(f) {
        if (!isString(f)) {
          var objects = [];
          for (var i = 0; i < arguments.length; i++) {
            objects.push(inspect(arguments[i]));
          }
          return objects.join(" ");
        }
        var i = 1;
        var args = arguments;
        var len = args.length;
        var str = String(f).replace(formatRegExp, function(x2) {
          if (x2 === "%%") return "%";
          if (i >= len) return x2;
          switch (x2) {
            case "%s":
              return String(args[i++]);
            case "%d":
              return Number(args[i++]);
            case "%j":
              try {
                return JSON.stringify(args[i++]);
              } catch (_) {
                return "[Circular]";
              }
            default:
              return x2;
          }
        });
        for (var x = args[i]; i < len; x = args[++i]) {
          if (isNull(x) || !isObject(x)) {
            str += " " + x;
          } else {
            str += " " + inspect(x);
          }
        }
        return str;
      };
      exports.deprecate = function(fn, msg) {
        if (typeof process !== "undefined" && process.noDeprecation === true) {
          return fn;
        }
        if (typeof process === "undefined") {
          return function() {
            return exports.deprecate(fn, msg).apply(this, arguments);
          };
        }
        var warned = false;
        function deprecated() {
          if (!warned) {
            if (process.throwDeprecation) {
              throw new Error(msg);
            } else if (process.traceDeprecation) {
              console.trace(msg);
            } else {
              console.error(msg);
            }
            warned = true;
          }
          return fn.apply(this, arguments);
        }
        return deprecated;
      };
      var debugs = {};
      var debugEnvRegex = /^$/;
      if (false) {
        debugEnv = false;
        debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase();
        debugEnvRegex = new RegExp("^" + debugEnv + "$", "i");
      }
      var debugEnv;
      exports.debuglog = function(set) {
        set = set.toUpperCase();
        if (!debugs[set]) {
          if (debugEnvRegex.test(set)) {
            var pid = process.pid;
            debugs[set] = function() {
              var msg = exports.format.apply(exports, arguments);
              console.error("%s %d: %s", set, pid, msg);
            };
          } else {
            debugs[set] = function() {
            };
          }
        }
        return debugs[set];
      };
      function inspect(obj, opts) {
        var ctx = {
          seen: [],
          stylize: stylizeNoColor
        };
        if (arguments.length >= 3) ctx.depth = arguments[2];
        if (arguments.length >= 4) ctx.colors = arguments[3];
        if (isBoolean(opts)) {
          ctx.showHidden = opts;
        } else if (opts) {
          exports._extend(ctx, opts);
        }
        if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
        if (isUndefined(ctx.depth)) ctx.depth = 2;
        if (isUndefined(ctx.colors)) ctx.colors = false;
        if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
        if (ctx.colors) ctx.stylize = stylizeWithColor;
        return formatValue(ctx, obj, ctx.depth);
      }
      exports.inspect = inspect;
      inspect.colors = {
        "bold": [1, 22],
        "italic": [3, 23],
        "underline": [4, 24],
        "inverse": [7, 27],
        "white": [37, 39],
        "grey": [90, 39],
        "black": [30, 39],
        "blue": [34, 39],
        "cyan": [36, 39],
        "green": [32, 39],
        "magenta": [35, 39],
        "red": [31, 39],
        "yellow": [33, 39]
      };
      inspect.styles = {
        "special": "cyan",
        "number": "yellow",
        "boolean": "yellow",
        "undefined": "grey",
        "null": "bold",
        "string": "green",
        "date": "magenta",
        // "name": intentionally not styling
        "regexp": "red"
      };
      function stylizeWithColor(str, styleType) {
        var style = inspect.styles[styleType];
        if (style) {
          return "\x1B[" + inspect.colors[style][0] + "m" + str + "\x1B[" + inspect.colors[style][1] + "m";
        } else {
          return str;
        }
      }
      function stylizeNoColor(str, styleType) {
        return str;
      }
      function arrayToHash(array) {
        var hash = {};
        array.forEach(function(val, idx) {
          hash[val] = true;
        });
        return hash;
      }
      function formatValue(ctx, value, recurseTimes) {
        if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
        value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
          var ret = value.inspect(recurseTimes, ctx);
          if (!isString(ret)) {
            ret = formatValue(ctx, ret, recurseTimes);
          }
          return ret;
        }
        var primitive = formatPrimitive(ctx, value);
        if (primitive) {
          return primitive;
        }
        var keys = Object.keys(value);
        var visibleKeys = arrayToHash(keys);
        if (ctx.showHidden) {
          keys = Object.getOwnPropertyNames(value);
        }
        if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
          return formatError(value);
        }
        if (keys.length === 0) {
          if (isFunction(value)) {
            var name = value.name ? ": " + value.name : "";
            return ctx.stylize("[Function" + name + "]", "special");
          }
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
          }
          if (isDate(value)) {
            return ctx.stylize(Date.prototype.toString.call(value), "date");
          }
          if (isError(value)) {
            return formatError(value);
          }
        }
        var base = "", array = false, braces = ["{", "}"];
        if (isArray(value)) {
          array = true;
          braces = ["[", "]"];
        }
        if (isFunction(value)) {
          var n = value.name ? ": " + value.name : "";
          base = " [Function" + n + "]";
        }
        if (isRegExp(value)) {
          base = " " + RegExp.prototype.toString.call(value);
        }
        if (isDate(value)) {
          base = " " + Date.prototype.toUTCString.call(value);
        }
        if (isError(value)) {
          base = " " + formatError(value);
        }
        if (keys.length === 0 && (!array || value.length == 0)) {
          return braces[0] + base + braces[1];
        }
        if (recurseTimes < 0) {
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
          } else {
            return ctx.stylize("[Object]", "special");
          }
        }
        ctx.seen.push(value);
        var output;
        if (array) {
          output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
        } else {
          output = keys.map(function(key) {
            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
          });
        }
        ctx.seen.pop();
        return reduceToSingleString(output, base, braces);
      }
      function formatPrimitive(ctx, value) {
        if (isUndefined(value))
          return ctx.stylize("undefined", "undefined");
        if (isString(value)) {
          var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
          return ctx.stylize(simple, "string");
        }
        if (isNumber(value))
          return ctx.stylize("" + value, "number");
        if (isBoolean(value))
          return ctx.stylize("" + value, "boolean");
        if (isNull(value))
          return ctx.stylize("null", "null");
      }
      function formatError(value) {
        return "[" + Error.prototype.toString.call(value) + "]";
      }
      function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
        var output = [];
        for (var i = 0, l = value.length; i < l; ++i) {
          if (hasOwnProperty(value, String(i))) {
            output.push(formatProperty(
              ctx,
              value,
              recurseTimes,
              visibleKeys,
              String(i),
              true
            ));
          } else {
            output.push("");
          }
        }
        keys.forEach(function(key) {
          if (!key.match(/^\d+$/)) {
            output.push(formatProperty(
              ctx,
              value,
              recurseTimes,
              visibleKeys,
              key,
              true
            ));
          }
        });
        return output;
      }
      function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
        var name, str, desc;
        desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
        if (desc.get) {
          if (desc.set) {
            str = ctx.stylize("[Getter/Setter]", "special");
          } else {
            str = ctx.stylize("[Getter]", "special");
          }
        } else {
          if (desc.set) {
            str = ctx.stylize("[Setter]", "special");
          }
        }
        if (!hasOwnProperty(visibleKeys, key)) {
          name = "[" + key + "]";
        }
        if (!str) {
          if (ctx.seen.indexOf(desc.value) < 0) {
            if (isNull(recurseTimes)) {
              str = formatValue(ctx, desc.value, null);
            } else {
              str = formatValue(ctx, desc.value, recurseTimes - 1);
            }
            if (str.indexOf("\n") > -1) {
              if (array) {
                str = str.split("\n").map(function(line) {
                  return "  " + line;
                }).join("\n").slice(2);
              } else {
                str = "\n" + str.split("\n").map(function(line) {
                  return "   " + line;
                }).join("\n");
              }
            }
          } else {
            str = ctx.stylize("[Circular]", "special");
          }
        }
        if (isUndefined(name)) {
          if (array && key.match(/^\d+$/)) {
            return str;
          }
          name = JSON.stringify("" + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.slice(1, -1);
            name = ctx.stylize(name, "name");
          } else {
            name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
            name = ctx.stylize(name, "string");
          }
        }
        return name + ": " + str;
      }
      function reduceToSingleString(output, base, braces) {
        var numLinesEst = 0;
        var length = output.reduce(function(prev, cur) {
          numLinesEst++;
          if (cur.indexOf("\n") >= 0) numLinesEst++;
          return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
        }, 0);
        if (length > 60) {
          return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
        }
        return braces[0] + base + " " + output.join(", ") + " " + braces[1];
      }
      exports.types = require_types();
      function isArray(ar) {
        return Array.isArray(ar);
      }
      exports.isArray = isArray;
      function isBoolean(arg) {
        return typeof arg === "boolean";
      }
      exports.isBoolean = isBoolean;
      function isNull(arg) {
        return arg === null;
      }
      exports.isNull = isNull;
      function isNullOrUndefined(arg) {
        return arg == null;
      }
      exports.isNullOrUndefined = isNullOrUndefined;
      function isNumber(arg) {
        return typeof arg === "number";
      }
      exports.isNumber = isNumber;
      function isString(arg) {
        return typeof arg === "string";
      }
      exports.isString = isString;
      function isSymbol(arg) {
        return typeof arg === "symbol";
      }
      exports.isSymbol = isSymbol;
      function isUndefined(arg) {
        return arg === void 0;
      }
      exports.isUndefined = isUndefined;
      function isRegExp(re) {
        return isObject(re) && objectToString(re) === "[object RegExp]";
      }
      exports.isRegExp = isRegExp;
      exports.types.isRegExp = isRegExp;
      function isObject(arg) {
        return typeof arg === "object" && arg !== null;
      }
      exports.isObject = isObject;
      function isDate(d) {
        return isObject(d) && objectToString(d) === "[object Date]";
      }
      exports.isDate = isDate;
      exports.types.isDate = isDate;
      function isError(e) {
        return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
      }
      exports.isError = isError;
      exports.types.isNativeError = isError;
      function isFunction(arg) {
        return typeof arg === "function";
      }
      exports.isFunction = isFunction;
      function isPrimitive(arg) {
        return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
        typeof arg === "undefined";
      }
      exports.isPrimitive = isPrimitive;
      exports.isBuffer = require_isBufferBrowser();
      function objectToString(o) {
        return Object.prototype.toString.call(o);
      }
      function pad(n) {
        return n < 10 ? "0" + n.toString(10) : n.toString(10);
      }
      var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      function timestamp() {
        var d = /* @__PURE__ */ new Date();
        var time = [
          pad(d.getHours()),
          pad(d.getMinutes()),
          pad(d.getSeconds())
        ].join(":");
        return [d.getDate(), months[d.getMonth()], time].join(" ");
      }
      exports.log = function() {
        console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments));
      };
      exports.inherits = require_inherits_browser();
      exports._extend = function(origin, add) {
        if (!add || !isObject(add)) return origin;
        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
          origin[keys[i]] = add[keys[i]];
        }
        return origin;
      };
      function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      }
      var kCustomPromisifiedSymbol = typeof Symbol !== "undefined" ? /* @__PURE__ */ Symbol("util.promisify.custom") : void 0;
      exports.promisify = function promisify(original) {
        if (typeof original !== "function")
          throw new TypeError('The "original" argument must be of type Function');
        if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
          var fn = original[kCustomPromisifiedSymbol];
          if (typeof fn !== "function") {
            throw new TypeError('The "util.promisify.custom" argument must be of type Function');
          }
          Object.defineProperty(fn, kCustomPromisifiedSymbol, {
            value: fn,
            enumerable: false,
            writable: false,
            configurable: true
          });
          return fn;
        }
        function fn() {
          var promiseResolve, promiseReject;
          var promise = new Promise(function(resolve, reject) {
            promiseResolve = resolve;
            promiseReject = reject;
          });
          var args = [];
          for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
          }
          args.push(function(err, value) {
            if (err) {
              promiseReject(err);
            } else {
              promiseResolve(value);
            }
          });
          try {
            original.apply(this, args);
          } catch (err) {
            promiseReject(err);
          }
          return promise;
        }
        Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
        if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
          value: fn,
          enumerable: false,
          writable: false,
          configurable: true
        });
        return Object.defineProperties(
          fn,
          getOwnPropertyDescriptors(original)
        );
      };
      exports.promisify.custom = kCustomPromisifiedSymbol;
      function callbackifyOnRejected(reason, cb) {
        if (!reason) {
          var newReason = new Error("Promise was rejected with a falsy value");
          newReason.reason = reason;
          reason = newReason;
        }
        return cb(reason);
      }
      function callbackify(original) {
        if (typeof original !== "function") {
          throw new TypeError('The "original" argument must be of type Function');
        }
        function callbackified() {
          var args = [];
          for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
          }
          var maybeCb = args.pop();
          if (typeof maybeCb !== "function") {
            throw new TypeError("The last argument must be of type Function");
          }
          var self2 = this;
          var cb = function() {
            return maybeCb.apply(self2, arguments);
          };
          original.apply(this, args).then(
            function(ret) {
              process.nextTick(cb.bind(null, null, ret));
            },
            function(rej) {
              process.nextTick(callbackifyOnRejected.bind(null, rej, cb));
            }
          );
        }
        Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
        Object.defineProperties(
          callbackified,
          getOwnPropertyDescriptors(original)
        );
        return callbackified;
      }
      exports.callbackify = callbackify;
    }
  });

  // node_modules/events/events.js
  var require_events = __commonJS({
    "node_modules/events/events.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var R = typeof Reflect === "object" ? Reflect : null;
      var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
        return Function.prototype.apply.call(target, receiver, args);
      };
      var ReflectOwnKeys;
      if (R && typeof R.ownKeys === "function") {
        ReflectOwnKeys = R.ownKeys;
      } else if (Object.getOwnPropertySymbols) {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
        };
      } else {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target);
        };
      }
      function ProcessEmitWarning(warning) {
        if (console && console.warn) console.warn(warning);
      }
      var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
        return value !== value;
      };
      function EventEmitter() {
        EventEmitter.init.call(this);
      }
      module.exports = EventEmitter;
      module.exports.once = once;
      EventEmitter.EventEmitter = EventEmitter;
      EventEmitter.prototype._events = void 0;
      EventEmitter.prototype._eventsCount = 0;
      EventEmitter.prototype._maxListeners = void 0;
      var defaultMaxListeners = 10;
      function checkListener(listener) {
        if (typeof listener !== "function") {
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
        }
      }
      Object.defineProperty(EventEmitter, "defaultMaxListeners", {
        enumerable: true,
        get: function() {
          return defaultMaxListeners;
        },
        set: function(arg) {
          if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
            throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
          }
          defaultMaxListeners = arg;
        }
      });
      EventEmitter.init = function() {
        if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        }
        this._maxListeners = this._maxListeners || void 0;
      };
      EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
        if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
        }
        this._maxListeners = n;
        return this;
      };
      function _getMaxListeners(that) {
        if (that._maxListeners === void 0)
          return EventEmitter.defaultMaxListeners;
        return that._maxListeners;
      }
      EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
        return _getMaxListeners(this);
      };
      EventEmitter.prototype.emit = function emit(type) {
        var args = [];
        for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
        var doError = type === "error";
        var events = this._events;
        if (events !== void 0)
          doError = doError && events.error === void 0;
        else if (!doError)
          return false;
        if (doError) {
          var er;
          if (args.length > 0)
            er = args[0];
          if (er instanceof Error) {
            throw er;
          }
          var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
          err.context = er;
          throw err;
        }
        var handler = events[type];
        if (handler === void 0)
          return false;
        if (typeof handler === "function") {
          ReflectApply(handler, this, args);
        } else {
          var len = handler.length;
          var listeners = arrayClone(handler, len);
          for (var i = 0; i < len; ++i)
            ReflectApply(listeners[i], this, args);
        }
        return true;
      };
      function _addListener(target, type, listener, prepend) {
        var m;
        var events;
        var existing2;
        checkListener(listener);
        events = target._events;
        if (events === void 0) {
          events = target._events = /* @__PURE__ */ Object.create(null);
          target._eventsCount = 0;
        } else {
          if (events.newListener !== void 0) {
            target.emit(
              "newListener",
              type,
              listener.listener ? listener.listener : listener
            );
            events = target._events;
          }
          existing2 = events[type];
        }
        if (existing2 === void 0) {
          existing2 = events[type] = listener;
          ++target._eventsCount;
        } else {
          if (typeof existing2 === "function") {
            existing2 = events[type] = prepend ? [listener, existing2] : [existing2, listener];
          } else if (prepend) {
            existing2.unshift(listener);
          } else {
            existing2.push(listener);
          }
          m = _getMaxListeners(target);
          if (m > 0 && existing2.length > m && !existing2.warned) {
            existing2.warned = true;
            var w = new Error("Possible EventEmitter memory leak detected. " + existing2.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
            w.name = "MaxListenersExceededWarning";
            w.emitter = target;
            w.type = type;
            w.count = existing2.length;
            ProcessEmitWarning(w);
          }
        }
        return target;
      }
      EventEmitter.prototype.addListener = function addListener(type, listener) {
        return _addListener(this, type, listener, false);
      };
      EventEmitter.prototype.on = EventEmitter.prototype.addListener;
      EventEmitter.prototype.prependListener = function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };
      function onceWrapper() {
        if (!this.fired) {
          this.target.removeListener(this.type, this.wrapFn);
          this.fired = true;
          if (arguments.length === 0)
            return this.listener.call(this.target);
          return this.listener.apply(this.target, arguments);
        }
      }
      function _onceWrap(target, type, listener) {
        var state = { fired: false, wrapFn: void 0, target, type, listener };
        var wrapped = onceWrapper.bind(state);
        wrapped.listener = listener;
        state.wrapFn = wrapped;
        return wrapped;
      }
      EventEmitter.prototype.once = function once2(type, listener) {
        checkListener(listener);
        this.on(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
        checkListener(listener);
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter.prototype.removeListener = function removeListener(type, listener) {
        var list, events, position, i, originalListener;
        checkListener(listener);
        events = this._events;
        if (events === void 0)
          return this;
        list = events[type];
        if (list === void 0)
          return this;
        if (list === listener || list.listener === listener) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else {
            delete events[type];
            if (events.removeListener)
              this.emit("removeListener", type, list.listener || listener);
          }
        } else if (typeof list !== "function") {
          position = -1;
          for (i = list.length - 1; i >= 0; i--) {
            if (list[i] === listener || list[i].listener === listener) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }
          if (position < 0)
            return this;
          if (position === 0)
            list.shift();
          else {
            spliceOne(list, position);
          }
          if (list.length === 1)
            events[type] = list[0];
          if (events.removeListener !== void 0)
            this.emit("removeListener", type, originalListener || listener);
        }
        return this;
      };
      EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
      EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
        var listeners, events, i;
        events = this._events;
        if (events === void 0)
          return this;
        if (events.removeListener === void 0) {
          if (arguments.length === 0) {
            this._events = /* @__PURE__ */ Object.create(null);
            this._eventsCount = 0;
          } else if (events[type] !== void 0) {
            if (--this._eventsCount === 0)
              this._events = /* @__PURE__ */ Object.create(null);
            else
              delete events[type];
          }
          return this;
        }
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          var key;
          for (i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key === "removeListener") continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners("removeListener");
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
          return this;
        }
        listeners = events[type];
        if (typeof listeners === "function") {
          this.removeListener(type, listeners);
        } else if (listeners !== void 0) {
          for (i = listeners.length - 1; i >= 0; i--) {
            this.removeListener(type, listeners[i]);
          }
        }
        return this;
      };
      function _listeners(target, type, unwrap) {
        var events = target._events;
        if (events === void 0)
          return [];
        var evlistener = events[type];
        if (evlistener === void 0)
          return [];
        if (typeof evlistener === "function")
          return unwrap ? [evlistener.listener || evlistener] : [evlistener];
        return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
      }
      EventEmitter.prototype.listeners = function listeners(type) {
        return _listeners(this, type, true);
      };
      EventEmitter.prototype.rawListeners = function rawListeners(type) {
        return _listeners(this, type, false);
      };
      EventEmitter.listenerCount = function(emitter, type) {
        if (typeof emitter.listenerCount === "function") {
          return emitter.listenerCount(type);
        } else {
          return listenerCount.call(emitter, type);
        }
      };
      EventEmitter.prototype.listenerCount = listenerCount;
      function listenerCount(type) {
        var events = this._events;
        if (events !== void 0) {
          var evlistener = events[type];
          if (typeof evlistener === "function") {
            return 1;
          } else if (evlistener !== void 0) {
            return evlistener.length;
          }
        }
        return 0;
      }
      EventEmitter.prototype.eventNames = function eventNames() {
        return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
      };
      function arrayClone(arr, n) {
        var copy = new Array(n);
        for (var i = 0; i < n; ++i)
          copy[i] = arr[i];
        return copy;
      }
      function spliceOne(list, index) {
        for (; index + 1 < list.length; index++)
          list[index] = list[index + 1];
        list.pop();
      }
      function unwrapListeners(arr) {
        var ret = new Array(arr.length);
        for (var i = 0; i < ret.length; ++i) {
          ret[i] = arr[i].listener || arr[i];
        }
        return ret;
      }
      function once(emitter, name) {
        return new Promise(function(resolve, reject) {
          function errorListener(err) {
            emitter.removeListener(name, resolver);
            reject(err);
          }
          function resolver() {
            if (typeof emitter.removeListener === "function") {
              emitter.removeListener("error", errorListener);
            }
            resolve([].slice.call(arguments));
          }
          ;
          eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
          if (name !== "error") {
            addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
          }
        });
      }
      function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
        if (typeof emitter.on === "function") {
          eventTargetAgnosticAddListener(emitter, "error", handler, flags);
        }
      }
      function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
        if (typeof emitter.on === "function") {
          if (flags.once) {
            emitter.once(name, listener);
          } else {
            emitter.on(name, listener);
          }
        } else if (typeof emitter.addEventListener === "function") {
          emitter.addEventListener(name, function wrapListener(arg) {
            if (flags.once) {
              emitter.removeEventListener(name, wrapListener);
            }
            listener(arg);
          });
        } else {
          throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
        }
      }
    }
  });

  // node_modules/stream-browserify/node_modules/readable-stream/lib/internal/streams/stream-browser.js
  var require_stream_browser = __commonJS({
    "node_modules/stream-browserify/node_modules/readable-stream/lib/internal/streams/stream-browser.js"(exports, module) {
      init_browser_shims();
      module.exports = require_events().EventEmitter;
    }
  });

  // node_modules/stream-browserify/node_modules/readable-stream/lib/internal/streams/buffer_list.js
  var require_buffer_list = __commonJS({
    "node_modules/stream-browserify/node_modules/readable-stream/lib/internal/streams/buffer_list.js"(exports, module) {
      "use strict";
      init_browser_shims();
      function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys.push.apply(keys, symbols);
        }
        return keys;
      }
      function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = null != arguments[i] ? arguments[i] : {};
          i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
            _defineProperty(target, key, source[key]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
        return target;
      }
      function _defineProperty(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, "string");
        return typeof key === "symbol" ? key : String(key);
      }
      function _toPrimitive(input, hint) {
        if (typeof input !== "object" || input === null) return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== void 0) {
          var res = prim.call(input, hint || "default");
          if (typeof res !== "object") return res;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (hint === "string" ? String : Number)(input);
      }
      var _require = require_buffer();
      var Buffer2 = _require.Buffer;
      var _require2 = require_util();
      var inspect = _require2.inspect;
      var custom = inspect && inspect.custom || "inspect";
      function copyBuffer(src, target, offset) {
        Buffer2.prototype.copy.call(src, target, offset);
      }
      module.exports = /* @__PURE__ */ (function() {
        function BufferList() {
          _classCallCheck(this, BufferList);
          this.head = null;
          this.tail = null;
          this.length = 0;
        }
        _createClass(BufferList, [{
          key: "push",
          value: function push(v) {
            var entry = {
              data: v,
              next: null
            };
            if (this.length > 0) this.tail.next = entry;
            else this.head = entry;
            this.tail = entry;
            ++this.length;
          }
        }, {
          key: "unshift",
          value: function unshift(v) {
            var entry = {
              data: v,
              next: this.head
            };
            if (this.length === 0) this.tail = entry;
            this.head = entry;
            ++this.length;
          }
        }, {
          key: "shift",
          value: function shift() {
            if (this.length === 0) return;
            var ret = this.head.data;
            if (this.length === 1) this.head = this.tail = null;
            else this.head = this.head.next;
            --this.length;
            return ret;
          }
        }, {
          key: "clear",
          value: function clear() {
            this.head = this.tail = null;
            this.length = 0;
          }
        }, {
          key: "join",
          value: function join(s) {
            if (this.length === 0) return "";
            var p = this.head;
            var ret = "" + p.data;
            while (p = p.next) ret += s + p.data;
            return ret;
          }
        }, {
          key: "concat",
          value: function concat(n) {
            if (this.length === 0) return Buffer2.alloc(0);
            var ret = Buffer2.allocUnsafe(n >>> 0);
            var p = this.head;
            var i = 0;
            while (p) {
              copyBuffer(p.data, ret, i);
              i += p.data.length;
              p = p.next;
            }
            return ret;
          }
          // Consumes a specified amount of bytes or characters from the buffered data.
        }, {
          key: "consume",
          value: function consume(n, hasStrings) {
            var ret;
            if (n < this.head.data.length) {
              ret = this.head.data.slice(0, n);
              this.head.data = this.head.data.slice(n);
            } else if (n === this.head.data.length) {
              ret = this.shift();
            } else {
              ret = hasStrings ? this._getString(n) : this._getBuffer(n);
            }
            return ret;
          }
        }, {
          key: "first",
          value: function first() {
            return this.head.data;
          }
          // Consumes a specified amount of characters from the buffered data.
        }, {
          key: "_getString",
          value: function _getString(n) {
            var p = this.head;
            var c = 1;
            var ret = p.data;
            n -= ret.length;
            while (p = p.next) {
              var str = p.data;
              var nb = n > str.length ? str.length : n;
              if (nb === str.length) ret += str;
              else ret += str.slice(0, n);
              n -= nb;
              if (n === 0) {
                if (nb === str.length) {
                  ++c;
                  if (p.next) this.head = p.next;
                  else this.head = this.tail = null;
                } else {
                  this.head = p;
                  p.data = str.slice(nb);
                }
                break;
              }
              ++c;
            }
            this.length -= c;
            return ret;
          }
          // Consumes a specified amount of bytes from the buffered data.
        }, {
          key: "_getBuffer",
          value: function _getBuffer(n) {
            var ret = Buffer2.allocUnsafe(n);
            var p = this.head;
            var c = 1;
            p.data.copy(ret);
            n -= p.data.length;
            while (p = p.next) {
              var buf = p.data;
              var nb = n > buf.length ? buf.length : n;
              buf.copy(ret, ret.length - n, 0, nb);
              n -= nb;
              if (n === 0) {
                if (nb === buf.length) {
                  ++c;
                  if (p.next) this.head = p.next;
                  else this.head = this.tail = null;
                } else {
                  this.head = p;
                  p.data = buf.slice(nb);
                }
                break;
              }
              ++c;
            }
            this.length -= c;
            return ret;
          }
          // Make sure the linked list only shows the minimal necessary information.
        }, {
          key: custom,
          value: function value(_, options) {
            return inspect(this, _objectSpread(_objectSpread({}, options), {}, {
              // Only inspect one level.
              depth: 0,
              // It should not recurse.
              customInspect: false
            }));
          }
        }]);
        return BufferList;
      })();
    }
  });

  // node_modules/stream-browserify/node_modules/readable-stream/lib/internal/streams/destroy.js
  var require_destroy = __commonJS({
    "node_modules/stream-browserify/node_modules/readable-stream/lib/internal/streams/destroy.js"(exports, module) {
      "use strict";
      init_browser_shims();
      function destroy(err, cb) {
        var _this = this;
        var readableDestroyed = this._readableState && this._readableState.destroyed;
        var writableDestroyed = this._writableState && this._writableState.destroyed;
        if (readableDestroyed || writableDestroyed) {
          if (cb) {
            cb(err);
          } else if (err) {
            if (!this._writableState) {
              process.nextTick(emitErrorNT, this, err);
            } else if (!this._writableState.errorEmitted) {
              this._writableState.errorEmitted = true;
              process.nextTick(emitErrorNT, this, err);
            }
          }
          return this;
        }
        if (this._readableState) {
          this._readableState.destroyed = true;
        }
        if (this._writableState) {
          this._writableState.destroyed = true;
        }
        this._destroy(err || null, function(err2) {
          if (!cb && err2) {
            if (!_this._writableState) {
              process.nextTick(emitErrorAndCloseNT, _this, err2);
            } else if (!_this._writableState.errorEmitted) {
              _this._writableState.errorEmitted = true;
              process.nextTick(emitErrorAndCloseNT, _this, err2);
            } else {
              process.nextTick(emitCloseNT, _this);
            }
          } else if (cb) {
            process.nextTick(emitCloseNT, _this);
            cb(err2);
          } else {
            process.nextTick(emitCloseNT, _this);
          }
        });
        return this;
      }
      function emitErrorAndCloseNT(self2, err) {
        emitErrorNT(self2, err);
        emitCloseNT(self2);
      }
      function emitCloseNT(self2) {
        if (self2._writableState && !self2._writableState.emitClose) return;
        if (self2._readableState && !self2._readableState.emitClose) return;
        self2.emit("close");
      }
      function undestroy() {
        if (this._readableState) {
          this._readableState.destroyed = false;
          this._readableState.reading = false;
          this._readableState.ended = false;
          this._readableState.endEmitted = false;
        }
        if (this._writableState) {
          this._writableState.destroyed = false;
          this._writableState.ended = false;
          this._writableState.ending = false;
          this._writableState.finalCalled = false;
          this._writableState.prefinished = false;
          this._writableState.finished = false;
          this._writableState.errorEmitted = false;
        }
      }
      function emitErrorNT(self2, err) {
        self2.emit("error", err);
      }
      function errorOrDestroy(stream, err) {
        var rState = stream._readableState;
        var wState = stream._writableState;
        if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);
        else stream.emit("error", err);
      }
      module.exports = {
        destroy,
        undestroy,
        errorOrDestroy
      };
    }
  });

  // node_modules/stream-browserify/node_modules/readable-stream/errors-browser.js
  var require_errors_browser = __commonJS({
    "node_modules/stream-browserify/node_modules/readable-stream/errors-browser.js"(exports, module) {
      "use strict";
      init_browser_shims();
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        subClass.__proto__ = superClass;
      }
      var codes = {};
      function createErrorType(code, message, Base) {
        if (!Base) {
          Base = Error;
        }
        function getMessage(arg1, arg2, arg3) {
          if (typeof message === "string") {
            return message;
          } else {
            return message(arg1, arg2, arg3);
          }
        }
        var NodeError = /* @__PURE__ */ (function(_Base) {
          _inheritsLoose(NodeError2, _Base);
          function NodeError2(arg1, arg2, arg3) {
            return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
          }
          return NodeError2;
        })(Base);
        NodeError.prototype.name = Base.name;
        NodeError.prototype.code = code;
        codes[code] = NodeError;
      }
      function oneOf(expected, thing) {
        if (Array.isArray(expected)) {
          var len = expected.length;
          expected = expected.map(function(i) {
            return String(i);
          });
          if (len > 2) {
            return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(", "), ", or ") + expected[len - 1];
          } else if (len === 2) {
            return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
          } else {
            return "of ".concat(thing, " ").concat(expected[0]);
          }
        } else {
          return "of ".concat(thing, " ").concat(String(expected));
        }
      }
      function startsWith(str, search, pos) {
        return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
      }
      function endsWith(str, search, this_len) {
        if (this_len === void 0 || this_len > str.length) {
          this_len = str.length;
        }
        return str.substring(this_len - search.length, this_len) === search;
      }
      function includes(str, search, start) {
        if (typeof start !== "number") {
          start = 0;
        }
        if (start + search.length > str.length) {
          return false;
        } else {
          return str.indexOf(search, start) !== -1;
        }
      }
      createErrorType("ERR_INVALID_OPT_VALUE", function(name, value) {
        return 'The value "' + value + '" is invalid for option "' + name + '"';
      }, TypeError);
      createErrorType("ERR_INVALID_ARG_TYPE", function(name, expected, actual) {
        var determiner;
        if (typeof expected === "string" && startsWith(expected, "not ")) {
          determiner = "must not be";
          expected = expected.replace(/^not /, "");
        } else {
          determiner = "must be";
        }
        var msg;
        if (endsWith(name, " argument")) {
          msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
        } else {
          var type = includes(name, ".") ? "property" : "argument";
          msg = 'The "'.concat(name, '" ').concat(type, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
        }
        msg += ". Received type ".concat(typeof actual);
        return msg;
      }, TypeError);
      createErrorType("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
      createErrorType("ERR_METHOD_NOT_IMPLEMENTED", function(name) {
        return "The " + name + " method is not implemented";
      });
      createErrorType("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
      createErrorType("ERR_STREAM_DESTROYED", function(name) {
        return "Cannot call " + name + " after a stream was destroyed";
      });
      createErrorType("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
      createErrorType("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
      createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
      createErrorType("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
      createErrorType("ERR_UNKNOWN_ENCODING", function(arg) {
        return "Unknown encoding: " + arg;
      }, TypeError);
      createErrorType("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
      module.exports.codes = codes;
    }
  });

  // node_modules/stream-browserify/node_modules/readable-stream/lib/internal/streams/state.js
  var require_state = __commonJS({
    "node_modules/stream-browserify/node_modules/readable-stream/lib/internal/streams/state.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var ERR_INVALID_OPT_VALUE = require_errors_browser().codes.ERR_INVALID_OPT_VALUE;
      function highWaterMarkFrom(options, isDuplex, duplexKey) {
        return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
      }
      function getHighWaterMark(state, options, duplexKey, isDuplex) {
        var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
        if (hwm != null) {
          if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
            var name = isDuplex ? duplexKey : "highWaterMark";
            throw new ERR_INVALID_OPT_VALUE(name, hwm);
          }
          return Math.floor(hwm);
        }
        return state.objectMode ? 16 : 16 * 1024;
      }
      module.exports = {
        getHighWaterMark
      };
    }
  });

  // node_modules/util-deprecate/browser.js
  var require_browser = __commonJS({
    "node_modules/util-deprecate/browser.js"(exports, module) {
      init_browser_shims();
      module.exports = deprecate;
      function deprecate(fn, msg) {
        if (config("noDeprecation")) {
          return fn;
        }
        var warned = false;
        function deprecated() {
          if (!warned) {
            if (config("throwDeprecation")) {
              throw new Error(msg);
            } else if (config("traceDeprecation")) {
              console.trace(msg);
            } else {
              console.warn(msg);
            }
            warned = true;
          }
          return fn.apply(this, arguments);
        }
        return deprecated;
      }
      function config(name) {
        try {
          if (!globalThis.localStorage) return false;
        } catch (_) {
          return false;
        }
        var val = globalThis.localStorage[name];
        if (null == val) return false;
        return String(val).toLowerCase() === "true";
      }
    }
  });

  // node_modules/stream-browserify/node_modules/readable-stream/lib/_stream_writable.js
  var require_stream_writable = __commonJS({
    "node_modules/stream-browserify/node_modules/readable-stream/lib/_stream_writable.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = Writable;
      function CorkedRequest(state) {
        var _this = this;
        this.next = null;
        this.entry = null;
        this.finish = function() {
          onCorkedFinish(_this, state);
        };
      }
      var Duplex;
      Writable.WritableState = WritableState;
      var internalUtil = {
        deprecate: require_browser()
      };
      var Stream = require_stream_browser();
      var Buffer2 = require_buffer().Buffer;
      var OurUint8Array = (typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
      };
      function _uint8ArrayToBuffer(chunk) {
        return Buffer2.from(chunk);
      }
      function _isUint8Array(obj) {
        return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
      }
      var destroyImpl = require_destroy();
      var _require = require_state();
      var getHighWaterMark = _require.getHighWaterMark;
      var _require$codes = require_errors_browser().codes;
      var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
      var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
      var ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK;
      var ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE;
      var ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
      var ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES;
      var ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END;
      var ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;
      var errorOrDestroy = destroyImpl.errorOrDestroy;
      require_inherits_browser()(Writable, Stream);
      function nop() {
      }
      function WritableState(options, stream, isDuplex) {
        Duplex = Duplex || require_stream_duplex();
        options = options || {};
        if (typeof isDuplex !== "boolean") isDuplex = stream instanceof Duplex;
        this.objectMode = !!options.objectMode;
        if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
        this.highWaterMark = getHighWaterMark(this, options, "writableHighWaterMark", isDuplex);
        this.finalCalled = false;
        this.needDrain = false;
        this.ending = false;
        this.ended = false;
        this.finished = false;
        this.destroyed = false;
        var noDecode = options.decodeStrings === false;
        this.decodeStrings = !noDecode;
        this.defaultEncoding = options.defaultEncoding || "utf8";
        this.length = 0;
        this.writing = false;
        this.corked = 0;
        this.sync = true;
        this.bufferProcessing = false;
        this.onwrite = function(er) {
          onwrite(stream, er);
        };
        this.writecb = null;
        this.writelen = 0;
        this.bufferedRequest = null;
        this.lastBufferedRequest = null;
        this.pendingcb = 0;
        this.prefinished = false;
        this.errorEmitted = false;
        this.emitClose = options.emitClose !== false;
        this.autoDestroy = !!options.autoDestroy;
        this.bufferedRequestCount = 0;
        this.corkedRequestsFree = new CorkedRequest(this);
      }
      WritableState.prototype.getBuffer = function getBuffer() {
        var current = this.bufferedRequest;
        var out = [];
        while (current) {
          out.push(current);
          current = current.next;
        }
        return out;
      };
      (function() {
        try {
          Object.defineProperty(WritableState.prototype, "buffer", {
            get: internalUtil.deprecate(function writableStateBufferGetter() {
              return this.getBuffer();
            }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
          });
        } catch (_) {
        }
      })();
      var realHasInstance;
      if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
        realHasInstance = Function.prototype[Symbol.hasInstance];
        Object.defineProperty(Writable, Symbol.hasInstance, {
          value: function value(object) {
            if (realHasInstance.call(this, object)) return true;
            if (this !== Writable) return false;
            return object && object._writableState instanceof WritableState;
          }
        });
      } else {
        realHasInstance = function realHasInstance2(object) {
          return object instanceof this;
        };
      }
      function Writable(options) {
        Duplex = Duplex || require_stream_duplex();
        var isDuplex = this instanceof Duplex;
        if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
        this._writableState = new WritableState(options, this, isDuplex);
        this.writable = true;
        if (options) {
          if (typeof options.write === "function") this._write = options.write;
          if (typeof options.writev === "function") this._writev = options.writev;
          if (typeof options.destroy === "function") this._destroy = options.destroy;
          if (typeof options.final === "function") this._final = options.final;
        }
        Stream.call(this);
      }
      Writable.prototype.pipe = function() {
        errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
      };
      function writeAfterEnd(stream, cb) {
        var er = new ERR_STREAM_WRITE_AFTER_END();
        errorOrDestroy(stream, er);
        process.nextTick(cb, er);
      }
      function validChunk(stream, state, chunk, cb) {
        var er;
        if (chunk === null) {
          er = new ERR_STREAM_NULL_VALUES();
        } else if (typeof chunk !== "string" && !state.objectMode) {
          er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer"], chunk);
        }
        if (er) {
          errorOrDestroy(stream, er);
          process.nextTick(cb, er);
          return false;
        }
        return true;
      }
      Writable.prototype.write = function(chunk, encoding, cb) {
        var state = this._writableState;
        var ret = false;
        var isBuf = !state.objectMode && _isUint8Array(chunk);
        if (isBuf && !Buffer2.isBuffer(chunk)) {
          chunk = _uint8ArrayToBuffer(chunk);
        }
        if (typeof encoding === "function") {
          cb = encoding;
          encoding = null;
        }
        if (isBuf) encoding = "buffer";
        else if (!encoding) encoding = state.defaultEncoding;
        if (typeof cb !== "function") cb = nop;
        if (state.ending) writeAfterEnd(this, cb);
        else if (isBuf || validChunk(this, state, chunk, cb)) {
          state.pendingcb++;
          ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
        }
        return ret;
      };
      Writable.prototype.cork = function() {
        this._writableState.corked++;
      };
      Writable.prototype.uncork = function() {
        var state = this._writableState;
        if (state.corked) {
          state.corked--;
          if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
        }
      };
      Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
        if (typeof encoding === "string") encoding = encoding.toLowerCase();
        if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
        this._writableState.defaultEncoding = encoding;
        return this;
      };
      Object.defineProperty(Writable.prototype, "writableBuffer", {
        // making it explicit this property is not enumerable
        // because otherwise some prototype manipulation in
        // userland will fail
        enumerable: false,
        get: function get() {
          return this._writableState && this._writableState.getBuffer();
        }
      });
      function decodeChunk(state, chunk, encoding) {
        if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
          chunk = Buffer2.from(chunk, encoding);
        }
        return chunk;
      }
      Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
        // making it explicit this property is not enumerable
        // because otherwise some prototype manipulation in
        // userland will fail
        enumerable: false,
        get: function get() {
          return this._writableState.highWaterMark;
        }
      });
      function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
        if (!isBuf) {
          var newChunk = decodeChunk(state, chunk, encoding);
          if (chunk !== newChunk) {
            isBuf = true;
            encoding = "buffer";
            chunk = newChunk;
          }
        }
        var len = state.objectMode ? 1 : chunk.length;
        state.length += len;
        var ret = state.length < state.highWaterMark;
        if (!ret) state.needDrain = true;
        if (state.writing || state.corked) {
          var last = state.lastBufferedRequest;
          state.lastBufferedRequest = {
            chunk,
            encoding,
            isBuf,
            callback: cb,
            next: null
          };
          if (last) {
            last.next = state.lastBufferedRequest;
          } else {
            state.bufferedRequest = state.lastBufferedRequest;
          }
          state.bufferedRequestCount += 1;
        } else {
          doWrite(stream, state, false, len, chunk, encoding, cb);
        }
        return ret;
      }
      function doWrite(stream, state, writev, len, chunk, encoding, cb) {
        state.writelen = len;
        state.writecb = cb;
        state.writing = true;
        state.sync = true;
        if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED("write"));
        else if (writev) stream._writev(chunk, state.onwrite);
        else stream._write(chunk, encoding, state.onwrite);
        state.sync = false;
      }
      function onwriteError(stream, state, sync, er, cb) {
        --state.pendingcb;
        if (sync) {
          process.nextTick(cb, er);
          process.nextTick(finishMaybe, stream, state);
          stream._writableState.errorEmitted = true;
          errorOrDestroy(stream, er);
        } else {
          cb(er);
          stream._writableState.errorEmitted = true;
          errorOrDestroy(stream, er);
          finishMaybe(stream, state);
        }
      }
      function onwriteStateUpdate(state) {
        state.writing = false;
        state.writecb = null;
        state.length -= state.writelen;
        state.writelen = 0;
      }
      function onwrite(stream, er) {
        var state = stream._writableState;
        var sync = state.sync;
        var cb = state.writecb;
        if (typeof cb !== "function") throw new ERR_MULTIPLE_CALLBACK();
        onwriteStateUpdate(state);
        if (er) onwriteError(stream, state, sync, er, cb);
        else {
          var finished = needFinish(state) || stream.destroyed;
          if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
            clearBuffer(stream, state);
          }
          if (sync) {
            process.nextTick(afterWrite, stream, state, finished, cb);
          } else {
            afterWrite(stream, state, finished, cb);
          }
        }
      }
      function afterWrite(stream, state, finished, cb) {
        if (!finished) onwriteDrain(stream, state);
        state.pendingcb--;
        cb();
        finishMaybe(stream, state);
      }
      function onwriteDrain(stream, state) {
        if (state.length === 0 && state.needDrain) {
          state.needDrain = false;
          stream.emit("drain");
        }
      }
      function clearBuffer(stream, state) {
        state.bufferProcessing = true;
        var entry = state.bufferedRequest;
        if (stream._writev && entry && entry.next) {
          var l = state.bufferedRequestCount;
          var buffer = new Array(l);
          var holder = state.corkedRequestsFree;
          holder.entry = entry;
          var count = 0;
          var allBuffers = true;
          while (entry) {
            buffer[count] = entry;
            if (!entry.isBuf) allBuffers = false;
            entry = entry.next;
            count += 1;
          }
          buffer.allBuffers = allBuffers;
          doWrite(stream, state, true, state.length, buffer, "", holder.finish);
          state.pendingcb++;
          state.lastBufferedRequest = null;
          if (holder.next) {
            state.corkedRequestsFree = holder.next;
            holder.next = null;
          } else {
            state.corkedRequestsFree = new CorkedRequest(state);
          }
          state.bufferedRequestCount = 0;
        } else {
          while (entry) {
            var chunk = entry.chunk;
            var encoding = entry.encoding;
            var cb = entry.callback;
            var len = state.objectMode ? 1 : chunk.length;
            doWrite(stream, state, false, len, chunk, encoding, cb);
            entry = entry.next;
            state.bufferedRequestCount--;
            if (state.writing) {
              break;
            }
          }
          if (entry === null) state.lastBufferedRequest = null;
        }
        state.bufferedRequest = entry;
        state.bufferProcessing = false;
      }
      Writable.prototype._write = function(chunk, encoding, cb) {
        cb(new ERR_METHOD_NOT_IMPLEMENTED("_write()"));
      };
      Writable.prototype._writev = null;
      Writable.prototype.end = function(chunk, encoding, cb) {
        var state = this._writableState;
        if (typeof chunk === "function") {
          cb = chunk;
          chunk = null;
          encoding = null;
        } else if (typeof encoding === "function") {
          cb = encoding;
          encoding = null;
        }
        if (chunk !== null && chunk !== void 0) this.write(chunk, encoding);
        if (state.corked) {
          state.corked = 1;
          this.uncork();
        }
        if (!state.ending) endWritable(this, state, cb);
        return this;
      };
      Object.defineProperty(Writable.prototype, "writableLength", {
        // making it explicit this property is not enumerable
        // because otherwise some prototype manipulation in
        // userland will fail
        enumerable: false,
        get: function get() {
          return this._writableState.length;
        }
      });
      function needFinish(state) {
        return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
      }
      function callFinal(stream, state) {
        stream._final(function(err) {
          state.pendingcb--;
          if (err) {
            errorOrDestroy(stream, err);
          }
          state.prefinished = true;
          stream.emit("prefinish");
          finishMaybe(stream, state);
        });
      }
      function prefinish(stream, state) {
        if (!state.prefinished && !state.finalCalled) {
          if (typeof stream._final === "function" && !state.destroyed) {
            state.pendingcb++;
            state.finalCalled = true;
            process.nextTick(callFinal, stream, state);
          } else {
            state.prefinished = true;
            stream.emit("prefinish");
          }
        }
      }
      function finishMaybe(stream, state) {
        var need = needFinish(state);
        if (need) {
          prefinish(stream, state);
          if (state.pendingcb === 0) {
            state.finished = true;
            stream.emit("finish");
            if (state.autoDestroy) {
              var rState = stream._readableState;
              if (!rState || rState.autoDestroy && rState.endEmitted) {
                stream.destroy();
              }
            }
          }
        }
        return need;
      }
      function endWritable(stream, state, cb) {
        state.ending = true;
        finishMaybe(stream, state);
        if (cb) {
          if (state.finished) process.nextTick(cb);
          else stream.once("finish", cb);
        }
        state.ended = true;
        stream.writable = false;
      }
      function onCorkedFinish(corkReq, state, err) {
        var entry = corkReq.entry;
        corkReq.entry = null;
        while (entry) {
          var cb = entry.callback;
          state.pendingcb--;
          cb(err);
          entry = entry.next;
        }
        state.corkedRequestsFree.next = corkReq;
      }
      Object.defineProperty(Writable.prototype, "destroyed", {
        // making it explicit this property is not enumerable
        // because otherwise some prototype manipulation in
        // userland will fail
        enumerable: false,
        get: function get() {
          if (this._writableState === void 0) {
            return false;
          }
          return this._writableState.destroyed;
        },
        set: function set(value) {
          if (!this._writableState) {
            return;
          }
          this._writableState.destroyed = value;
        }
      });
      Writable.prototype.destroy = destroyImpl.destroy;
      Writable.prototype._undestroy = destroyImpl.undestroy;
      Writable.prototype._destroy = function(err, cb) {
        cb(err);
      };
    }
  });

  // node_modules/stream-browserify/node_modules/readable-stream/lib/_stream_duplex.js
  var require_stream_duplex = __commonJS({
    "node_modules/stream-browserify/node_modules/readable-stream/lib/_stream_duplex.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var objectKeys = Object.keys || function(obj) {
        var keys2 = [];
        for (var key in obj) keys2.push(key);
        return keys2;
      };
      module.exports = Duplex;
      var Readable = require_stream_readable();
      var Writable = require_stream_writable();
      require_inherits_browser()(Duplex, Readable);
      {
        keys = objectKeys(Writable.prototype);
        for (v = 0; v < keys.length; v++) {
          method = keys[v];
          if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
        }
      }
      var keys;
      var method;
      var v;
      function Duplex(options) {
        if (!(this instanceof Duplex)) return new Duplex(options);
        Readable.call(this, options);
        Writable.call(this, options);
        this.allowHalfOpen = true;
        if (options) {
          if (options.readable === false) this.readable = false;
          if (options.writable === false) this.writable = false;
          if (options.allowHalfOpen === false) {
            this.allowHalfOpen = false;
            this.once("end", onend);
          }
        }
      }
      Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
        // making it explicit this property is not enumerable
        // because otherwise some prototype manipulation in
        // userland will fail
        enumerable: false,
        get: function get() {
          return this._writableState.highWaterMark;
        }
      });
      Object.defineProperty(Duplex.prototype, "writableBuffer", {
        // making it explicit this property is not enumerable
        // because otherwise some prototype manipulation in
        // userland will fail
        enumerable: false,
        get: function get() {
          return this._writableState && this._writableState.getBuffer();
        }
      });
      Object.defineProperty(Duplex.prototype, "writableLength", {
        // making it explicit this property is not enumerable
        // because otherwise some prototype manipulation in
        // userland will fail
        enumerable: false,
        get: function get() {
          return this._writableState.length;
        }
      });
      function onend() {
        if (this._writableState.ended) return;
        process.nextTick(onEndNT, this);
      }
      function onEndNT(self2) {
        self2.end();
      }
      Object.defineProperty(Duplex.prototype, "destroyed", {
        // making it explicit this property is not enumerable
        // because otherwise some prototype manipulation in
        // userland will fail
        enumerable: false,
        get: function get() {
          if (this._readableState === void 0 || this._writableState === void 0) {
            return false;
          }
          return this._readableState.destroyed && this._writableState.destroyed;
        },
        set: function set(value) {
          if (this._readableState === void 0 || this._writableState === void 0) {
            return;
          }
          this._readableState.destroyed = value;
          this._writableState.destroyed = value;
        }
      });
    }
  });

  // node_modules/safe-buffer/index.js
  var require_safe_buffer = __commonJS({
    "node_modules/safe-buffer/index.js"(exports, module) {
      init_browser_shims();
      var buffer = require_buffer();
      var Buffer2 = buffer.Buffer;
      function copyProps(src, dst) {
        for (var key in src) {
          dst[key] = src[key];
        }
      }
      if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
        module.exports = buffer;
      } else {
        copyProps(buffer, exports);
        exports.Buffer = SafeBuffer;
      }
      function SafeBuffer(arg, encodingOrOffset, length) {
        return Buffer2(arg, encodingOrOffset, length);
      }
      copyProps(Buffer2, SafeBuffer);
      SafeBuffer.from = function(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          throw new TypeError("Argument must not be a number");
        }
        return Buffer2(arg, encodingOrOffset, length);
      };
      SafeBuffer.alloc = function(size, fill, encoding) {
        if (typeof size !== "number") {
          throw new TypeError("Argument must be a number");
        }
        var buf = Buffer2(size);
        if (fill !== void 0) {
          if (typeof encoding === "string") {
            buf.fill(fill, encoding);
          } else {
            buf.fill(fill);
          }
        } else {
          buf.fill(0);
        }
        return buf;
      };
      SafeBuffer.allocUnsafe = function(size) {
        if (typeof size !== "number") {
          throw new TypeError("Argument must be a number");
        }
        return Buffer2(size);
      };
      SafeBuffer.allocUnsafeSlow = function(size) {
        if (typeof size !== "number") {
          throw new TypeError("Argument must be a number");
        }
        return buffer.SlowBuffer(size);
      };
    }
  });

  // node_modules/string_decoder/lib/string_decoder.js
  var require_string_decoder = __commonJS({
    "node_modules/string_decoder/lib/string_decoder.js"(exports) {
      "use strict";
      init_browser_shims();
      var Buffer2 = require_safe_buffer().Buffer;
      var isEncoding = Buffer2.isEncoding || function(encoding) {
        encoding = "" + encoding;
        switch (encoding && encoding.toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
          case "raw":
            return true;
          default:
            return false;
        }
      };
      function _normalizeEncoding(enc) {
        if (!enc) return "utf8";
        var retried;
        while (true) {
          switch (enc) {
            case "utf8":
            case "utf-8":
              return "utf8";
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return "utf16le";
            case "latin1":
            case "binary":
              return "latin1";
            case "base64":
            case "ascii":
            case "hex":
              return enc;
            default:
              if (retried) return;
              enc = ("" + enc).toLowerCase();
              retried = true;
          }
        }
      }
      function normalizeEncoding(enc) {
        var nenc = _normalizeEncoding(enc);
        if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc))) throw new Error("Unknown encoding: " + enc);
        return nenc || enc;
      }
      exports.StringDecoder = StringDecoder;
      function StringDecoder(encoding) {
        this.encoding = normalizeEncoding(encoding);
        var nb;
        switch (this.encoding) {
          case "utf16le":
            this.text = utf16Text;
            this.end = utf16End;
            nb = 4;
            break;
          case "utf8":
            this.fillLast = utf8FillLast;
            nb = 4;
            break;
          case "base64":
            this.text = base64Text;
            this.end = base64End;
            nb = 3;
            break;
          default:
            this.write = simpleWrite;
            this.end = simpleEnd;
            return;
        }
        this.lastNeed = 0;
        this.lastTotal = 0;
        this.lastChar = Buffer2.allocUnsafe(nb);
      }
      StringDecoder.prototype.write = function(buf) {
        if (buf.length === 0) return "";
        var r;
        var i;
        if (this.lastNeed) {
          r = this.fillLast(buf);
          if (r === void 0) return "";
          i = this.lastNeed;
          this.lastNeed = 0;
        } else {
          i = 0;
        }
        if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
        return r || "";
      };
      StringDecoder.prototype.end = utf8End;
      StringDecoder.prototype.text = utf8Text;
      StringDecoder.prototype.fillLast = function(buf) {
        if (this.lastNeed <= buf.length) {
          buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
          return this.lastChar.toString(this.encoding, 0, this.lastTotal);
        }
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
        this.lastNeed -= buf.length;
      };
      function utf8CheckByte(byte) {
        if (byte <= 127) return 0;
        else if (byte >> 5 === 6) return 2;
        else if (byte >> 4 === 14) return 3;
        else if (byte >> 3 === 30) return 4;
        return byte >> 6 === 2 ? -1 : -2;
      }
      function utf8CheckIncomplete(self2, buf, i) {
        var j = buf.length - 1;
        if (j < i) return 0;
        var nb = utf8CheckByte(buf[j]);
        if (nb >= 0) {
          if (nb > 0) self2.lastNeed = nb - 1;
          return nb;
        }
        if (--j < i || nb === -2) return 0;
        nb = utf8CheckByte(buf[j]);
        if (nb >= 0) {
          if (nb > 0) self2.lastNeed = nb - 2;
          return nb;
        }
        if (--j < i || nb === -2) return 0;
        nb = utf8CheckByte(buf[j]);
        if (nb >= 0) {
          if (nb > 0) {
            if (nb === 2) nb = 0;
            else self2.lastNeed = nb - 3;
          }
          return nb;
        }
        return 0;
      }
      function utf8CheckExtraBytes(self2, buf, p) {
        if ((buf[0] & 192) !== 128) {
          self2.lastNeed = 0;
          return "\uFFFD";
        }
        if (self2.lastNeed > 1 && buf.length > 1) {
          if ((buf[1] & 192) !== 128) {
            self2.lastNeed = 1;
            return "\uFFFD";
          }
          if (self2.lastNeed > 2 && buf.length > 2) {
            if ((buf[2] & 192) !== 128) {
              self2.lastNeed = 2;
              return "\uFFFD";
            }
          }
        }
      }
      function utf8FillLast(buf) {
        var p = this.lastTotal - this.lastNeed;
        var r = utf8CheckExtraBytes(this, buf, p);
        if (r !== void 0) return r;
        if (this.lastNeed <= buf.length) {
          buf.copy(this.lastChar, p, 0, this.lastNeed);
          return this.lastChar.toString(this.encoding, 0, this.lastTotal);
        }
        buf.copy(this.lastChar, p, 0, buf.length);
        this.lastNeed -= buf.length;
      }
      function utf8Text(buf, i) {
        var total = utf8CheckIncomplete(this, buf, i);
        if (!this.lastNeed) return buf.toString("utf8", i);
        this.lastTotal = total;
        var end = buf.length - (total - this.lastNeed);
        buf.copy(this.lastChar, 0, end);
        return buf.toString("utf8", i, end);
      }
      function utf8End(buf) {
        var r = buf && buf.length ? this.write(buf) : "";
        if (this.lastNeed) return r + "\uFFFD";
        return r;
      }
      function utf16Text(buf, i) {
        if ((buf.length - i) % 2 === 0) {
          var r = buf.toString("utf16le", i);
          if (r) {
            var c = r.charCodeAt(r.length - 1);
            if (c >= 55296 && c <= 56319) {
              this.lastNeed = 2;
              this.lastTotal = 4;
              this.lastChar[0] = buf[buf.length - 2];
              this.lastChar[1] = buf[buf.length - 1];
              return r.slice(0, -1);
            }
          }
          return r;
        }
        this.lastNeed = 1;
        this.lastTotal = 2;
        this.lastChar[0] = buf[buf.length - 1];
        return buf.toString("utf16le", i, buf.length - 1);
      }
      function utf16End(buf) {
        var r = buf && buf.length ? this.write(buf) : "";
        if (this.lastNeed) {
          var end = this.lastTotal - this.lastNeed;
          return r + this.lastChar.toString("utf16le", 0, end);
        }
        return r;
      }
      function base64Text(buf, i) {
        var n = (buf.length - i) % 3;
        if (n === 0) return buf.toString("base64", i);
        this.lastNeed = 3 - n;
        this.lastTotal = 3;
        if (n === 1) {
          this.lastChar[0] = buf[buf.length - 1];
        } else {
          this.lastChar[0] = buf[buf.length - 2];
          this.lastChar[1] = buf[buf.length - 1];
        }
        return buf.toString("base64", i, buf.length - n);
      }
      function base64End(buf) {
        var r = buf && buf.length ? this.write(buf) : "";
        if (this.lastNeed) return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
        return r;
      }
      function simpleWrite(buf) {
        return buf.toString(this.encoding);
      }
      function simpleEnd(buf) {
        return buf && buf.length ? this.write(buf) : "";
      }
    }
  });

  // node_modules/stream-browserify/node_modules/readable-stream/lib/internal/streams/end-of-stream.js
  var require_end_of_stream = __commonJS({
    "node_modules/stream-browserify/node_modules/readable-stream/lib/internal/streams/end-of-stream.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var ERR_STREAM_PREMATURE_CLOSE = require_errors_browser().codes.ERR_STREAM_PREMATURE_CLOSE;
      function once(callback) {
        var called = false;
        return function() {
          if (called) return;
          called = true;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          callback.apply(this, args);
        };
      }
      function noop() {
      }
      function isRequest(stream) {
        return stream.setHeader && typeof stream.abort === "function";
      }
      function eos(stream, opts, callback) {
        if (typeof opts === "function") return eos(stream, null, opts);
        if (!opts) opts = {};
        callback = once(callback || noop);
        var readable = opts.readable || opts.readable !== false && stream.readable;
        var writable = opts.writable || opts.writable !== false && stream.writable;
        var onlegacyfinish = function onlegacyfinish2() {
          if (!stream.writable) onfinish();
        };
        var writableEnded = stream._writableState && stream._writableState.finished;
        var onfinish = function onfinish2() {
          writable = false;
          writableEnded = true;
          if (!readable) callback.call(stream);
        };
        var readableEnded = stream._readableState && stream._readableState.endEmitted;
        var onend = function onend2() {
          readable = false;
          readableEnded = true;
          if (!writable) callback.call(stream);
        };
        var onerror = function onerror2(err) {
          callback.call(stream, err);
        };
        var onclose = function onclose2() {
          var err;
          if (readable && !readableEnded) {
            if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
            return callback.call(stream, err);
          }
          if (writable && !writableEnded) {
            if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
            return callback.call(stream, err);
          }
        };
        var onrequest = function onrequest2() {
          stream.req.on("finish", onfinish);
        };
        if (isRequest(stream)) {
          stream.on("complete", onfinish);
          stream.on("abort", onclose);
          if (stream.req) onrequest();
          else stream.on("request", onrequest);
        } else if (writable && !stream._writableState) {
          stream.on("end", onlegacyfinish);
          stream.on("close", onlegacyfinish);
        }
        stream.on("end", onend);
        stream.on("finish", onfinish);
        if (opts.error !== false) stream.on("error", onerror);
        stream.on("close", onclose);
        return function() {
          stream.removeListener("complete", onfinish);
          stream.removeListener("abort", onclose);
          stream.removeListener("request", onrequest);
          if (stream.req) stream.req.removeListener("finish", onfinish);
          stream.removeListener("end", onlegacyfinish);
          stream.removeListener("close", onlegacyfinish);
          stream.removeListener("finish", onfinish);
          stream.removeListener("end", onend);
          stream.removeListener("error", onerror);
          stream.removeListener("close", onclose);
        };
      }
      module.exports = eos;
    }
  });

  // node_modules/stream-browserify/node_modules/readable-stream/lib/internal/streams/async_iterator.js
  var require_async_iterator = __commonJS({
    "node_modules/stream-browserify/node_modules/readable-stream/lib/internal/streams/async_iterator.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var _Object$setPrototypeO;
      function _defineProperty(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, "string");
        return typeof key === "symbol" ? key : String(key);
      }
      function _toPrimitive(input, hint) {
        if (typeof input !== "object" || input === null) return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== void 0) {
          var res = prim.call(input, hint || "default");
          if (typeof res !== "object") return res;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (hint === "string" ? String : Number)(input);
      }
      var finished = require_end_of_stream();
      var kLastResolve = /* @__PURE__ */ Symbol("lastResolve");
      var kLastReject = /* @__PURE__ */ Symbol("lastReject");
      var kError = /* @__PURE__ */ Symbol("error");
      var kEnded = /* @__PURE__ */ Symbol("ended");
      var kLastPromise = /* @__PURE__ */ Symbol("lastPromise");
      var kHandlePromise = /* @__PURE__ */ Symbol("handlePromise");
      var kStream = /* @__PURE__ */ Symbol("stream");
      function createIterResult(value, done) {
        return {
          value,
          done
        };
      }
      function readAndResolve(iter) {
        var resolve = iter[kLastResolve];
        if (resolve !== null) {
          var data = iter[kStream].read();
          if (data !== null) {
            iter[kLastPromise] = null;
            iter[kLastResolve] = null;
            iter[kLastReject] = null;
            resolve(createIterResult(data, false));
          }
        }
      }
      function onReadable(iter) {
        process.nextTick(readAndResolve, iter);
      }
      function wrapForNext(lastPromise, iter) {
        return function(resolve, reject) {
          lastPromise.then(function() {
            if (iter[kEnded]) {
              resolve(createIterResult(void 0, true));
              return;
            }
            iter[kHandlePromise](resolve, reject);
          }, reject);
        };
      }
      var AsyncIteratorPrototype = Object.getPrototypeOf(function() {
      });
      var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
        get stream() {
          return this[kStream];
        },
        next: function next() {
          var _this = this;
          var error = this[kError];
          if (error !== null) {
            return Promise.reject(error);
          }
          if (this[kEnded]) {
            return Promise.resolve(createIterResult(void 0, true));
          }
          if (this[kStream].destroyed) {
            return new Promise(function(resolve, reject) {
              process.nextTick(function() {
                if (_this[kError]) {
                  reject(_this[kError]);
                } else {
                  resolve(createIterResult(void 0, true));
                }
              });
            });
          }
          var lastPromise = this[kLastPromise];
          var promise;
          if (lastPromise) {
            promise = new Promise(wrapForNext(lastPromise, this));
          } else {
            var data = this[kStream].read();
            if (data !== null) {
              return Promise.resolve(createIterResult(data, false));
            }
            promise = new Promise(this[kHandlePromise]);
          }
          this[kLastPromise] = promise;
          return promise;
        }
      }, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function() {
        return this;
      }), _defineProperty(_Object$setPrototypeO, "return", function _return() {
        var _this2 = this;
        return new Promise(function(resolve, reject) {
          _this2[kStream].destroy(null, function(err) {
            if (err) {
              reject(err);
              return;
            }
            resolve(createIterResult(void 0, true));
          });
        });
      }), _Object$setPrototypeO), AsyncIteratorPrototype);
      var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator2(stream) {
        var _Object$create;
        var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
          value: stream,
          writable: true
        }), _defineProperty(_Object$create, kLastResolve, {
          value: null,
          writable: true
        }), _defineProperty(_Object$create, kLastReject, {
          value: null,
          writable: true
        }), _defineProperty(_Object$create, kError, {
          value: null,
          writable: true
        }), _defineProperty(_Object$create, kEnded, {
          value: stream._readableState.endEmitted,
          writable: true
        }), _defineProperty(_Object$create, kHandlePromise, {
          value: function value(resolve, reject) {
            var data = iterator[kStream].read();
            if (data) {
              iterator[kLastPromise] = null;
              iterator[kLastResolve] = null;
              iterator[kLastReject] = null;
              resolve(createIterResult(data, false));
            } else {
              iterator[kLastResolve] = resolve;
              iterator[kLastReject] = reject;
            }
          },
          writable: true
        }), _Object$create));
        iterator[kLastPromise] = null;
        finished(stream, function(err) {
          if (err && err.code !== "ERR_STREAM_PREMATURE_CLOSE") {
            var reject = iterator[kLastReject];
            if (reject !== null) {
              iterator[kLastPromise] = null;
              iterator[kLastResolve] = null;
              iterator[kLastReject] = null;
              reject(err);
            }
            iterator[kError] = err;
            return;
          }
          var resolve = iterator[kLastResolve];
          if (resolve !== null) {
            iterator[kLastPromise] = null;
            iterator[kLastResolve] = null;
            iterator[kLastReject] = null;
            resolve(createIterResult(void 0, true));
          }
          iterator[kEnded] = true;
        });
        stream.on("readable", onReadable.bind(null, iterator));
        return iterator;
      };
      module.exports = createReadableStreamAsyncIterator;
    }
  });

  // node_modules/stream-browserify/node_modules/readable-stream/lib/internal/streams/from-browser.js
  var require_from_browser = __commonJS({
    "node_modules/stream-browserify/node_modules/readable-stream/lib/internal/streams/from-browser.js"(exports, module) {
      init_browser_shims();
      module.exports = function() {
        throw new Error("Readable.from is not available in the browser");
      };
    }
  });

  // node_modules/stream-browserify/node_modules/readable-stream/lib/_stream_readable.js
  var require_stream_readable = __commonJS({
    "node_modules/stream-browserify/node_modules/readable-stream/lib/_stream_readable.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = Readable;
      var Duplex;
      Readable.ReadableState = ReadableState;
      var EE = require_events().EventEmitter;
      var EElistenerCount = function EElistenerCount2(emitter, type) {
        return emitter.listeners(type).length;
      };
      var Stream = require_stream_browser();
      var Buffer2 = require_buffer().Buffer;
      var OurUint8Array = (typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
      };
      function _uint8ArrayToBuffer(chunk) {
        return Buffer2.from(chunk);
      }
      function _isUint8Array(obj) {
        return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
      }
      var debugUtil = require_util();
      var debug;
      if (debugUtil && debugUtil.debuglog) {
        debug = debugUtil.debuglog("stream");
      } else {
        debug = function debug2() {
        };
      }
      var BufferList = require_buffer_list();
      var destroyImpl = require_destroy();
      var _require = require_state();
      var getHighWaterMark = _require.getHighWaterMark;
      var _require$codes = require_errors_browser().codes;
      var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
      var ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF;
      var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
      var ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
      var StringDecoder;
      var createReadableStreamAsyncIterator;
      var from;
      require_inherits_browser()(Readable, Stream);
      var errorOrDestroy = destroyImpl.errorOrDestroy;
      var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
      function prependListener(emitter, event, fn) {
        if (typeof emitter.prependListener === "function") return emitter.prependListener(event, fn);
        if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
        else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);
        else emitter._events[event] = [fn, emitter._events[event]];
      }
      function ReadableState(options, stream, isDuplex) {
        Duplex = Duplex || require_stream_duplex();
        options = options || {};
        if (typeof isDuplex !== "boolean") isDuplex = stream instanceof Duplex;
        this.objectMode = !!options.objectMode;
        if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
        this.highWaterMark = getHighWaterMark(this, options, "readableHighWaterMark", isDuplex);
        this.buffer = new BufferList();
        this.length = 0;
        this.pipes = null;
        this.pipesCount = 0;
        this.flowing = null;
        this.ended = false;
        this.endEmitted = false;
        this.reading = false;
        this.sync = true;
        this.needReadable = false;
        this.emittedReadable = false;
        this.readableListening = false;
        this.resumeScheduled = false;
        this.paused = true;
        this.emitClose = options.emitClose !== false;
        this.autoDestroy = !!options.autoDestroy;
        this.destroyed = false;
        this.defaultEncoding = options.defaultEncoding || "utf8";
        this.awaitDrain = 0;
        this.readingMore = false;
        this.decoder = null;
        this.encoding = null;
        if (options.encoding) {
          if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
          this.decoder = new StringDecoder(options.encoding);
          this.encoding = options.encoding;
        }
      }
      function Readable(options) {
        Duplex = Duplex || require_stream_duplex();
        if (!(this instanceof Readable)) return new Readable(options);
        var isDuplex = this instanceof Duplex;
        this._readableState = new ReadableState(options, this, isDuplex);
        this.readable = true;
        if (options) {
          if (typeof options.read === "function") this._read = options.read;
          if (typeof options.destroy === "function") this._destroy = options.destroy;
        }
        Stream.call(this);
      }
      Object.defineProperty(Readable.prototype, "destroyed", {
        // making it explicit this property is not enumerable
        // because otherwise some prototype manipulation in
        // userland will fail
        enumerable: false,
        get: function get() {
          if (this._readableState === void 0) {
            return false;
          }
          return this._readableState.destroyed;
        },
        set: function set(value) {
          if (!this._readableState) {
            return;
          }
          this._readableState.destroyed = value;
        }
      });
      Readable.prototype.destroy = destroyImpl.destroy;
      Readable.prototype._undestroy = destroyImpl.undestroy;
      Readable.prototype._destroy = function(err, cb) {
        cb(err);
      };
      Readable.prototype.push = function(chunk, encoding) {
        var state = this._readableState;
        var skipChunkCheck;
        if (!state.objectMode) {
          if (typeof chunk === "string") {
            encoding = encoding || state.defaultEncoding;
            if (encoding !== state.encoding) {
              chunk = Buffer2.from(chunk, encoding);
              encoding = "";
            }
            skipChunkCheck = true;
          }
        } else {
          skipChunkCheck = true;
        }
        return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
      };
      Readable.prototype.unshift = function(chunk) {
        return readableAddChunk(this, chunk, null, true, false);
      };
      function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
        debug("readableAddChunk", chunk);
        var state = stream._readableState;
        if (chunk === null) {
          state.reading = false;
          onEofChunk(stream, state);
        } else {
          var er;
          if (!skipChunkCheck) er = chunkInvalid(state, chunk);
          if (er) {
            errorOrDestroy(stream, er);
          } else if (state.objectMode || chunk && chunk.length > 0) {
            if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype) {
              chunk = _uint8ArrayToBuffer(chunk);
            }
            if (addToFront) {
              if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
              else addChunk(stream, state, chunk, true);
            } else if (state.ended) {
              errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
            } else if (state.destroyed) {
              return false;
            } else {
              state.reading = false;
              if (state.decoder && !encoding) {
                chunk = state.decoder.write(chunk);
                if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);
                else maybeReadMore(stream, state);
              } else {
                addChunk(stream, state, chunk, false);
              }
            }
          } else if (!addToFront) {
            state.reading = false;
            maybeReadMore(stream, state);
          }
        }
        return !state.ended && (state.length < state.highWaterMark || state.length === 0);
      }
      function addChunk(stream, state, chunk, addToFront) {
        if (state.flowing && state.length === 0 && !state.sync) {
          state.awaitDrain = 0;
          stream.emit("data", chunk);
        } else {
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) state.buffer.unshift(chunk);
          else state.buffer.push(chunk);
          if (state.needReadable) emitReadable(stream);
        }
        maybeReadMore(stream, state);
      }
      function chunkInvalid(state, chunk) {
        var er;
        if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
          er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
        }
        return er;
      }
      Readable.prototype.isPaused = function() {
        return this._readableState.flowing === false;
      };
      Readable.prototype.setEncoding = function(enc) {
        if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
        var decoder = new StringDecoder(enc);
        this._readableState.decoder = decoder;
        this._readableState.encoding = this._readableState.decoder.encoding;
        var p = this._readableState.buffer.head;
        var content = "";
        while (p !== null) {
          content += decoder.write(p.data);
          p = p.next;
        }
        this._readableState.buffer.clear();
        if (content !== "") this._readableState.buffer.push(content);
        this._readableState.length = content.length;
        return this;
      };
      var MAX_HWM = 1073741824;
      function computeNewHighWaterMark(n) {
        if (n >= MAX_HWM) {
          n = MAX_HWM;
        } else {
          n--;
          n |= n >>> 1;
          n |= n >>> 2;
          n |= n >>> 4;
          n |= n >>> 8;
          n |= n >>> 16;
          n++;
        }
        return n;
      }
      function howMuchToRead(n, state) {
        if (n <= 0 || state.length === 0 && state.ended) return 0;
        if (state.objectMode) return 1;
        if (n !== n) {
          if (state.flowing && state.length) return state.buffer.head.data.length;
          else return state.length;
        }
        if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
        if (n <= state.length) return n;
        if (!state.ended) {
          state.needReadable = true;
          return 0;
        }
        return state.length;
      }
      Readable.prototype.read = function(n) {
        debug("read", n);
        n = parseInt(n, 10);
        var state = this._readableState;
        var nOrig = n;
        if (n !== 0) state.emittedReadable = false;
        if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
          debug("read: emitReadable", state.length, state.ended);
          if (state.length === 0 && state.ended) endReadable(this);
          else emitReadable(this);
          return null;
        }
        n = howMuchToRead(n, state);
        if (n === 0 && state.ended) {
          if (state.length === 0) endReadable(this);
          return null;
        }
        var doRead = state.needReadable;
        debug("need readable", doRead);
        if (state.length === 0 || state.length - n < state.highWaterMark) {
          doRead = true;
          debug("length less than watermark", doRead);
        }
        if (state.ended || state.reading) {
          doRead = false;
          debug("reading or ended", doRead);
        } else if (doRead) {
          debug("do read");
          state.reading = true;
          state.sync = true;
          if (state.length === 0) state.needReadable = true;
          this._read(state.highWaterMark);
          state.sync = false;
          if (!state.reading) n = howMuchToRead(nOrig, state);
        }
        var ret;
        if (n > 0) ret = fromList(n, state);
        else ret = null;
        if (ret === null) {
          state.needReadable = state.length <= state.highWaterMark;
          n = 0;
        } else {
          state.length -= n;
          state.awaitDrain = 0;
        }
        if (state.length === 0) {
          if (!state.ended) state.needReadable = true;
          if (nOrig !== n && state.ended) endReadable(this);
        }
        if (ret !== null) this.emit("data", ret);
        return ret;
      };
      function onEofChunk(stream, state) {
        debug("onEofChunk");
        if (state.ended) return;
        if (state.decoder) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length) {
            state.buffer.push(chunk);
            state.length += state.objectMode ? 1 : chunk.length;
          }
        }
        state.ended = true;
        if (state.sync) {
          emitReadable(stream);
        } else {
          state.needReadable = false;
          if (!state.emittedReadable) {
            state.emittedReadable = true;
            emitReadable_(stream);
          }
        }
      }
      function emitReadable(stream) {
        var state = stream._readableState;
        debug("emitReadable", state.needReadable, state.emittedReadable);
        state.needReadable = false;
        if (!state.emittedReadable) {
          debug("emitReadable", state.flowing);
          state.emittedReadable = true;
          process.nextTick(emitReadable_, stream);
        }
      }
      function emitReadable_(stream) {
        var state = stream._readableState;
        debug("emitReadable_", state.destroyed, state.length, state.ended);
        if (!state.destroyed && (state.length || state.ended)) {
          stream.emit("readable");
          state.emittedReadable = false;
        }
        state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
        flow(stream);
      }
      function maybeReadMore(stream, state) {
        if (!state.readingMore) {
          state.readingMore = true;
          process.nextTick(maybeReadMore_, stream, state);
        }
      }
      function maybeReadMore_(stream, state) {
        while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
          var len = state.length;
          debug("maybeReadMore read 0");
          stream.read(0);
          if (len === state.length)
            break;
        }
        state.readingMore = false;
      }
      Readable.prototype._read = function(n) {
        errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED("_read()"));
      };
      Readable.prototype.pipe = function(dest, pipeOpts) {
        var src = this;
        var state = this._readableState;
        switch (state.pipesCount) {
          case 0:
            state.pipes = dest;
            break;
          case 1:
            state.pipes = [state.pipes, dest];
            break;
          default:
            state.pipes.push(dest);
            break;
        }
        state.pipesCount += 1;
        debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
        var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
        var endFn = doEnd ? onend : unpipe;
        if (state.endEmitted) process.nextTick(endFn);
        else src.once("end", endFn);
        dest.on("unpipe", onunpipe);
        function onunpipe(readable, unpipeInfo) {
          debug("onunpipe");
          if (readable === src) {
            if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
              unpipeInfo.hasUnpiped = true;
              cleanup();
            }
          }
        }
        function onend() {
          debug("onend");
          dest.end();
        }
        var ondrain = pipeOnDrain(src);
        dest.on("drain", ondrain);
        var cleanedUp = false;
        function cleanup() {
          debug("cleanup");
          dest.removeListener("close", onclose);
          dest.removeListener("finish", onfinish);
          dest.removeListener("drain", ondrain);
          dest.removeListener("error", onerror);
          dest.removeListener("unpipe", onunpipe);
          src.removeListener("end", onend);
          src.removeListener("end", unpipe);
          src.removeListener("data", ondata);
          cleanedUp = true;
          if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
        }
        src.on("data", ondata);
        function ondata(chunk) {
          debug("ondata");
          var ret = dest.write(chunk);
          debug("dest.write", ret);
          if (ret === false) {
            if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
              debug("false write response, pause", state.awaitDrain);
              state.awaitDrain++;
            }
            src.pause();
          }
        }
        function onerror(er) {
          debug("onerror", er);
          unpipe();
          dest.removeListener("error", onerror);
          if (EElistenerCount(dest, "error") === 0) errorOrDestroy(dest, er);
        }
        prependListener(dest, "error", onerror);
        function onclose() {
          dest.removeListener("finish", onfinish);
          unpipe();
        }
        dest.once("close", onclose);
        function onfinish() {
          debug("onfinish");
          dest.removeListener("close", onclose);
          unpipe();
        }
        dest.once("finish", onfinish);
        function unpipe() {
          debug("unpipe");
          src.unpipe(dest);
        }
        dest.emit("pipe", src);
        if (!state.flowing) {
          debug("pipe resume");
          src.resume();
        }
        return dest;
      };
      function pipeOnDrain(src) {
        return function pipeOnDrainFunctionResult() {
          var state = src._readableState;
          debug("pipeOnDrain", state.awaitDrain);
          if (state.awaitDrain) state.awaitDrain--;
          if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
            state.flowing = true;
            flow(src);
          }
        };
      }
      Readable.prototype.unpipe = function(dest) {
        var state = this._readableState;
        var unpipeInfo = {
          hasUnpiped: false
        };
        if (state.pipesCount === 0) return this;
        if (state.pipesCount === 1) {
          if (dest && dest !== state.pipes) return this;
          if (!dest) dest = state.pipes;
          state.pipes = null;
          state.pipesCount = 0;
          state.flowing = false;
          if (dest) dest.emit("unpipe", this, unpipeInfo);
          return this;
        }
        if (!dest) {
          var dests = state.pipes;
          var len = state.pipesCount;
          state.pipes = null;
          state.pipesCount = 0;
          state.flowing = false;
          for (var i = 0; i < len; i++) dests[i].emit("unpipe", this, {
            hasUnpiped: false
          });
          return this;
        }
        var index = indexOf(state.pipes, dest);
        if (index === -1) return this;
        state.pipes.splice(index, 1);
        state.pipesCount -= 1;
        if (state.pipesCount === 1) state.pipes = state.pipes[0];
        dest.emit("unpipe", this, unpipeInfo);
        return this;
      };
      Readable.prototype.on = function(ev, fn) {
        var res = Stream.prototype.on.call(this, ev, fn);
        var state = this._readableState;
        if (ev === "data") {
          state.readableListening = this.listenerCount("readable") > 0;
          if (state.flowing !== false) this.resume();
        } else if (ev === "readable") {
          if (!state.endEmitted && !state.readableListening) {
            state.readableListening = state.needReadable = true;
            state.flowing = false;
            state.emittedReadable = false;
            debug("on readable", state.length, state.reading);
            if (state.length) {
              emitReadable(this);
            } else if (!state.reading) {
              process.nextTick(nReadingNextTick, this);
            }
          }
        }
        return res;
      };
      Readable.prototype.addListener = Readable.prototype.on;
      Readable.prototype.removeListener = function(ev, fn) {
        var res = Stream.prototype.removeListener.call(this, ev, fn);
        if (ev === "readable") {
          process.nextTick(updateReadableListening, this);
        }
        return res;
      };
      Readable.prototype.removeAllListeners = function(ev) {
        var res = Stream.prototype.removeAllListeners.apply(this, arguments);
        if (ev === "readable" || ev === void 0) {
          process.nextTick(updateReadableListening, this);
        }
        return res;
      };
      function updateReadableListening(self2) {
        var state = self2._readableState;
        state.readableListening = self2.listenerCount("readable") > 0;
        if (state.resumeScheduled && !state.paused) {
          state.flowing = true;
        } else if (self2.listenerCount("data") > 0) {
          self2.resume();
        }
      }
      function nReadingNextTick(self2) {
        debug("readable nexttick read 0");
        self2.read(0);
      }
      Readable.prototype.resume = function() {
        var state = this._readableState;
        if (!state.flowing) {
          debug("resume");
          state.flowing = !state.readableListening;
          resume(this, state);
        }
        state.paused = false;
        return this;
      };
      function resume(stream, state) {
        if (!state.resumeScheduled) {
          state.resumeScheduled = true;
          process.nextTick(resume_, stream, state);
        }
      }
      function resume_(stream, state) {
        debug("resume", state.reading);
        if (!state.reading) {
          stream.read(0);
        }
        state.resumeScheduled = false;
        stream.emit("resume");
        flow(stream);
        if (state.flowing && !state.reading) stream.read(0);
      }
      Readable.prototype.pause = function() {
        debug("call pause flowing=%j", this._readableState.flowing);
        if (this._readableState.flowing !== false) {
          debug("pause");
          this._readableState.flowing = false;
          this.emit("pause");
        }
        this._readableState.paused = true;
        return this;
      };
      function flow(stream) {
        var state = stream._readableState;
        debug("flow", state.flowing);
        while (state.flowing && stream.read() !== null) ;
      }
      Readable.prototype.wrap = function(stream) {
        var _this = this;
        var state = this._readableState;
        var paused = false;
        stream.on("end", function() {
          debug("wrapped end");
          if (state.decoder && !state.ended) {
            var chunk = state.decoder.end();
            if (chunk && chunk.length) _this.push(chunk);
          }
          _this.push(null);
        });
        stream.on("data", function(chunk) {
          debug("wrapped data");
          if (state.decoder) chunk = state.decoder.write(chunk);
          if (state.objectMode && (chunk === null || chunk === void 0)) return;
          else if (!state.objectMode && (!chunk || !chunk.length)) return;
          var ret = _this.push(chunk);
          if (!ret) {
            paused = true;
            stream.pause();
          }
        });
        for (var i in stream) {
          if (this[i] === void 0 && typeof stream[i] === "function") {
            this[i] = /* @__PURE__ */ (function methodWrap(method) {
              return function methodWrapReturnFunction() {
                return stream[method].apply(stream, arguments);
              };
            })(i);
          }
        }
        for (var n = 0; n < kProxyEvents.length; n++) {
          stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
        }
        this._read = function(n2) {
          debug("wrapped _read", n2);
          if (paused) {
            paused = false;
            stream.resume();
          }
        };
        return this;
      };
      if (typeof Symbol === "function") {
        Readable.prototype[Symbol.asyncIterator] = function() {
          if (createReadableStreamAsyncIterator === void 0) {
            createReadableStreamAsyncIterator = require_async_iterator();
          }
          return createReadableStreamAsyncIterator(this);
        };
      }
      Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
        // making it explicit this property is not enumerable
        // because otherwise some prototype manipulation in
        // userland will fail
        enumerable: false,
        get: function get() {
          return this._readableState.highWaterMark;
        }
      });
      Object.defineProperty(Readable.prototype, "readableBuffer", {
        // making it explicit this property is not enumerable
        // because otherwise some prototype manipulation in
        // userland will fail
        enumerable: false,
        get: function get() {
          return this._readableState && this._readableState.buffer;
        }
      });
      Object.defineProperty(Readable.prototype, "readableFlowing", {
        // making it explicit this property is not enumerable
        // because otherwise some prototype manipulation in
        // userland will fail
        enumerable: false,
        get: function get() {
          return this._readableState.flowing;
        },
        set: function set(state) {
          if (this._readableState) {
            this._readableState.flowing = state;
          }
        }
      });
      Readable._fromList = fromList;
      Object.defineProperty(Readable.prototype, "readableLength", {
        // making it explicit this property is not enumerable
        // because otherwise some prototype manipulation in
        // userland will fail
        enumerable: false,
        get: function get() {
          return this._readableState.length;
        }
      });
      function fromList(n, state) {
        if (state.length === 0) return null;
        var ret;
        if (state.objectMode) ret = state.buffer.shift();
        else if (!n || n >= state.length) {
          if (state.decoder) ret = state.buffer.join("");
          else if (state.buffer.length === 1) ret = state.buffer.first();
          else ret = state.buffer.concat(state.length);
          state.buffer.clear();
        } else {
          ret = state.buffer.consume(n, state.decoder);
        }
        return ret;
      }
      function endReadable(stream) {
        var state = stream._readableState;
        debug("endReadable", state.endEmitted);
        if (!state.endEmitted) {
          state.ended = true;
          process.nextTick(endReadableNT, state, stream);
        }
      }
      function endReadableNT(state, stream) {
        debug("endReadableNT", state.endEmitted, state.length);
        if (!state.endEmitted && state.length === 0) {
          state.endEmitted = true;
          stream.readable = false;
          stream.emit("end");
          if (state.autoDestroy) {
            var wState = stream._writableState;
            if (!wState || wState.autoDestroy && wState.finished) {
              stream.destroy();
            }
          }
        }
      }
      if (typeof Symbol === "function") {
        Readable.from = function(iterable, opts) {
          if (from === void 0) {
            from = require_from_browser();
          }
          return from(Readable, iterable, opts);
        };
      }
      function indexOf(xs, x) {
        for (var i = 0, l = xs.length; i < l; i++) {
          if (xs[i] === x) return i;
        }
        return -1;
      }
    }
  });

  // node_modules/stream-browserify/node_modules/readable-stream/lib/_stream_transform.js
  var require_stream_transform = __commonJS({
    "node_modules/stream-browserify/node_modules/readable-stream/lib/_stream_transform.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = Transform;
      var _require$codes = require_errors_browser().codes;
      var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
      var ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK;
      var ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING;
      var ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;
      var Duplex = require_stream_duplex();
      require_inherits_browser()(Transform, Duplex);
      function afterTransform(er, data) {
        var ts = this._transformState;
        ts.transforming = false;
        var cb = ts.writecb;
        if (cb === null) {
          return this.emit("error", new ERR_MULTIPLE_CALLBACK());
        }
        ts.writechunk = null;
        ts.writecb = null;
        if (data != null)
          this.push(data);
        cb(er);
        var rs = this._readableState;
        rs.reading = false;
        if (rs.needReadable || rs.length < rs.highWaterMark) {
          this._read(rs.highWaterMark);
        }
      }
      function Transform(options) {
        if (!(this instanceof Transform)) return new Transform(options);
        Duplex.call(this, options);
        this._transformState = {
          afterTransform: afterTransform.bind(this),
          needTransform: false,
          transforming: false,
          writecb: null,
          writechunk: null,
          writeencoding: null
        };
        this._readableState.needReadable = true;
        this._readableState.sync = false;
        if (options) {
          if (typeof options.transform === "function") this._transform = options.transform;
          if (typeof options.flush === "function") this._flush = options.flush;
        }
        this.on("prefinish", prefinish);
      }
      function prefinish() {
        var _this = this;
        if (typeof this._flush === "function" && !this._readableState.destroyed) {
          this._flush(function(er, data) {
            done(_this, er, data);
          });
        } else {
          done(this, null, null);
        }
      }
      Transform.prototype.push = function(chunk, encoding) {
        this._transformState.needTransform = false;
        return Duplex.prototype.push.call(this, chunk, encoding);
      };
      Transform.prototype._transform = function(chunk, encoding, cb) {
        cb(new ERR_METHOD_NOT_IMPLEMENTED("_transform()"));
      };
      Transform.prototype._write = function(chunk, encoding, cb) {
        var ts = this._transformState;
        ts.writecb = cb;
        ts.writechunk = chunk;
        ts.writeencoding = encoding;
        if (!ts.transforming) {
          var rs = this._readableState;
          if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
        }
      };
      Transform.prototype._read = function(n) {
        var ts = this._transformState;
        if (ts.writechunk !== null && !ts.transforming) {
          ts.transforming = true;
          this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
        } else {
          ts.needTransform = true;
        }
      };
      Transform.prototype._destroy = function(err, cb) {
        Duplex.prototype._destroy.call(this, err, function(err2) {
          cb(err2);
        });
      };
      function done(stream, er, data) {
        if (er) return stream.emit("error", er);
        if (data != null)
          stream.push(data);
        if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
        if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
        return stream.push(null);
      }
    }
  });

  // node_modules/stream-browserify/node_modules/readable-stream/lib/_stream_passthrough.js
  var require_stream_passthrough = __commonJS({
    "node_modules/stream-browserify/node_modules/readable-stream/lib/_stream_passthrough.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = PassThrough;
      var Transform = require_stream_transform();
      require_inherits_browser()(PassThrough, Transform);
      function PassThrough(options) {
        if (!(this instanceof PassThrough)) return new PassThrough(options);
        Transform.call(this, options);
      }
      PassThrough.prototype._transform = function(chunk, encoding, cb) {
        cb(null, chunk);
      };
    }
  });

  // node_modules/stream-browserify/node_modules/readable-stream/lib/internal/streams/pipeline.js
  var require_pipeline = __commonJS({
    "node_modules/stream-browserify/node_modules/readable-stream/lib/internal/streams/pipeline.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var eos;
      function once(callback) {
        var called = false;
        return function() {
          if (called) return;
          called = true;
          callback.apply(void 0, arguments);
        };
      }
      var _require$codes = require_errors_browser().codes;
      var ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;
      var ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
      function noop(err) {
        if (err) throw err;
      }
      function isRequest(stream) {
        return stream.setHeader && typeof stream.abort === "function";
      }
      function destroyer(stream, reading, writing, callback) {
        callback = once(callback);
        var closed = false;
        stream.on("close", function() {
          closed = true;
        });
        if (eos === void 0) eos = require_end_of_stream();
        eos(stream, {
          readable: reading,
          writable: writing
        }, function(err) {
          if (err) return callback(err);
          closed = true;
          callback();
        });
        var destroyed = false;
        return function(err) {
          if (closed) return;
          if (destroyed) return;
          destroyed = true;
          if (isRequest(stream)) return stream.abort();
          if (typeof stream.destroy === "function") return stream.destroy();
          callback(err || new ERR_STREAM_DESTROYED("pipe"));
        };
      }
      function call(fn) {
        fn();
      }
      function pipe(from, to) {
        return from.pipe(to);
      }
      function popCallback(streams) {
        if (!streams.length) return noop;
        if (typeof streams[streams.length - 1] !== "function") return noop;
        return streams.pop();
      }
      function pipeline() {
        for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
          streams[_key] = arguments[_key];
        }
        var callback = popCallback(streams);
        if (Array.isArray(streams[0])) streams = streams[0];
        if (streams.length < 2) {
          throw new ERR_MISSING_ARGS("streams");
        }
        var error;
        var destroys = streams.map(function(stream, i) {
          var reading = i < streams.length - 1;
          var writing = i > 0;
          return destroyer(stream, reading, writing, function(err) {
            if (!error) error = err;
            if (err) destroys.forEach(call);
            if (reading) return;
            destroys.forEach(call);
            callback(error);
          });
        });
        return streams.reduce(pipe);
      }
      module.exports = pipeline;
    }
  });

  // node_modules/stream-browserify/index.js
  var require_stream_browserify = __commonJS({
    "node_modules/stream-browserify/index.js"(exports, module) {
      init_browser_shims();
      module.exports = Stream;
      var EE = require_events().EventEmitter;
      var inherits = require_inherits_browser();
      inherits(Stream, EE);
      Stream.Readable = require_stream_readable();
      Stream.Writable = require_stream_writable();
      Stream.Duplex = require_stream_duplex();
      Stream.Transform = require_stream_transform();
      Stream.PassThrough = require_stream_passthrough();
      Stream.finished = require_end_of_stream();
      Stream.pipeline = require_pipeline();
      Stream.Stream = Stream;
      function Stream() {
        EE.call(this);
      }
      Stream.prototype.pipe = function(dest, options) {
        var source = this;
        function ondata(chunk) {
          if (dest.writable) {
            if (false === dest.write(chunk) && source.pause) {
              source.pause();
            }
          }
        }
        source.on("data", ondata);
        function ondrain() {
          if (source.readable && source.resume) {
            source.resume();
          }
        }
        dest.on("drain", ondrain);
        if (!dest._isStdio && (!options || options.end !== false)) {
          source.on("end", onend);
          source.on("close", onclose);
        }
        var didOnEnd = false;
        function onend() {
          if (didOnEnd) return;
          didOnEnd = true;
          dest.end();
        }
        function onclose() {
          if (didOnEnd) return;
          didOnEnd = true;
          if (typeof dest.destroy === "function") dest.destroy();
        }
        function onerror(er) {
          cleanup();
          if (EE.listenerCount(this, "error") === 0) {
            throw er;
          }
        }
        source.on("error", onerror);
        dest.on("error", onerror);
        function cleanup() {
          source.removeListener("data", ondata);
          dest.removeListener("drain", ondrain);
          source.removeListener("end", onend);
          source.removeListener("close", onclose);
          source.removeListener("error", onerror);
          dest.removeListener("error", onerror);
          source.removeListener("end", cleanup);
          source.removeListener("close", cleanup);
          dest.removeListener("close", cleanup);
        }
        source.on("end", cleanup);
        source.on("close", cleanup);
        dest.on("close", cleanup);
        dest.emit("pipe", source);
        return dest;
      };
    }
  });

  // node_modules/assert/build/internal/errors.js
  var require_errors = __commonJS({
    "node_modules/assert/build/internal/errors.js"(exports, module) {
      "use strict";
      init_browser_shims();
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, "string");
        return _typeof(key) === "symbol" ? key : String(key);
      }
      function _toPrimitive(input, hint) {
        if (_typeof(input) !== "object" || input === null) return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== void 0) {
          var res = prim.call(input, hint || "default");
          if (_typeof(res) !== "object") return res;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (hint === "string" ? String : Number)(input);
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
        Object.defineProperty(subClass, "prototype", { writable: false });
        if (superClass) _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
          o2.__proto__ = p2;
          return o2;
        };
        return _setPrototypeOf(o, p);
      }
      function _createSuper(Derived) {
        var hasNativeReflectConstruct = _isNativeReflectConstruct();
        return function _createSuperInternal() {
          var Super = _getPrototypeOf(Derived), result;
          if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
          } else {
            result = Super.apply(this, arguments);
          }
          return _possibleConstructorReturn(this, result);
        };
      }
      function _possibleConstructorReturn(self2, call) {
        if (call && (_typeof(call) === "object" || typeof call === "function")) {
          return call;
        } else if (call !== void 0) {
          throw new TypeError("Derived constructors may only return object or undefined");
        }
        return _assertThisInitialized(self2);
      }
      function _assertThisInitialized(self2) {
        if (self2 === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return self2;
      }
      function _isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if (typeof Proxy === "function") return true;
        try {
          Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          }));
          return true;
        } catch (e) {
          return false;
        }
      }
      function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
          return o2.__proto__ || Object.getPrototypeOf(o2);
        };
        return _getPrototypeOf(o);
      }
      var codes = {};
      var assert;
      var util;
      function createErrorType(code, message, Base) {
        if (!Base) {
          Base = Error;
        }
        function getMessage(arg1, arg2, arg3) {
          if (typeof message === "string") {
            return message;
          } else {
            return message(arg1, arg2, arg3);
          }
        }
        var NodeError = /* @__PURE__ */ (function(_Base) {
          _inherits(NodeError2, _Base);
          var _super = _createSuper(NodeError2);
          function NodeError2(arg1, arg2, arg3) {
            var _this;
            _classCallCheck(this, NodeError2);
            _this = _super.call(this, getMessage(arg1, arg2, arg3));
            _this.code = code;
            return _this;
          }
          return _createClass(NodeError2);
        })(Base);
        codes[code] = NodeError;
      }
      function oneOf(expected, thing) {
        if (Array.isArray(expected)) {
          var len = expected.length;
          expected = expected.map(function(i) {
            return String(i);
          });
          if (len > 2) {
            return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(", "), ", or ") + expected[len - 1];
          } else if (len === 2) {
            return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
          } else {
            return "of ".concat(thing, " ").concat(expected[0]);
          }
        } else {
          return "of ".concat(thing, " ").concat(String(expected));
        }
      }
      function startsWith(str, search, pos) {
        return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
      }
      function endsWith(str, search, this_len) {
        if (this_len === void 0 || this_len > str.length) {
          this_len = str.length;
        }
        return str.substring(this_len - search.length, this_len) === search;
      }
      function includes(str, search, start) {
        if (typeof start !== "number") {
          start = 0;
        }
        if (start + search.length > str.length) {
          return false;
        } else {
          return str.indexOf(search, start) !== -1;
        }
      }
      createErrorType("ERR_AMBIGUOUS_ARGUMENT", 'The "%s" argument is ambiguous. %s', TypeError);
      createErrorType("ERR_INVALID_ARG_TYPE", function(name, expected, actual) {
        if (assert === void 0) assert = require_assert();
        assert(typeof name === "string", "'name' must be a string");
        var determiner;
        if (typeof expected === "string" && startsWith(expected, "not ")) {
          determiner = "must not be";
          expected = expected.replace(/^not /, "");
        } else {
          determiner = "must be";
        }
        var msg;
        if (endsWith(name, " argument")) {
          msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
        } else {
          var type = includes(name, ".") ? "property" : "argument";
          msg = 'The "'.concat(name, '" ').concat(type, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
        }
        msg += ". Received type ".concat(_typeof(actual));
        return msg;
      }, TypeError);
      createErrorType("ERR_INVALID_ARG_VALUE", function(name, value) {
        var reason = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "is invalid";
        if (util === void 0) util = require_util();
        var inspected = util.inspect(value);
        if (inspected.length > 128) {
          inspected = "".concat(inspected.slice(0, 128), "...");
        }
        return "The argument '".concat(name, "' ").concat(reason, ". Received ").concat(inspected);
      }, TypeError, RangeError);
      createErrorType("ERR_INVALID_RETURN_VALUE", function(input, name, value) {
        var type;
        if (value && value.constructor && value.constructor.name) {
          type = "instance of ".concat(value.constructor.name);
        } else {
          type = "type ".concat(_typeof(value));
        }
        return "Expected ".concat(input, ' to be returned from the "').concat(name, '"') + " function but got ".concat(type, ".");
      }, TypeError);
      createErrorType("ERR_MISSING_ARGS", function() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        if (assert === void 0) assert = require_assert();
        assert(args.length > 0, "At least one arg needs to be specified");
        var msg = "The ";
        var len = args.length;
        args = args.map(function(a) {
          return '"'.concat(a, '"');
        });
        switch (len) {
          case 1:
            msg += "".concat(args[0], " argument");
            break;
          case 2:
            msg += "".concat(args[0], " and ").concat(args[1], " arguments");
            break;
          default:
            msg += args.slice(0, len - 1).join(", ");
            msg += ", and ".concat(args[len - 1], " arguments");
            break;
        }
        return "".concat(msg, " must be specified");
      }, TypeError);
      module.exports.codes = codes;
    }
  });

  // node_modules/assert/build/internal/assert/assertion_error.js
  var require_assertion_error = __commonJS({
    "node_modules/assert/build/internal/assert/assertion_error.js"(exports, module) {
      "use strict";
      init_browser_shims();
      function ownKeys(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t.push.apply(t, o);
        }
        return t;
      }
      function _objectSpread(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
            _defineProperty(e, r2, t[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
          });
        }
        return e;
      }
      function _defineProperty(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, "string");
        return _typeof(key) === "symbol" ? key : String(key);
      }
      function _toPrimitive(input, hint) {
        if (_typeof(input) !== "object" || input === null) return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== void 0) {
          var res = prim.call(input, hint || "default");
          if (_typeof(res) !== "object") return res;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (hint === "string" ? String : Number)(input);
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
        Object.defineProperty(subClass, "prototype", { writable: false });
        if (superClass) _setPrototypeOf(subClass, superClass);
      }
      function _createSuper(Derived) {
        var hasNativeReflectConstruct = _isNativeReflectConstruct();
        return function _createSuperInternal() {
          var Super = _getPrototypeOf(Derived), result;
          if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
          } else {
            result = Super.apply(this, arguments);
          }
          return _possibleConstructorReturn(this, result);
        };
      }
      function _possibleConstructorReturn(self2, call) {
        if (call && (_typeof(call) === "object" || typeof call === "function")) {
          return call;
        } else if (call !== void 0) {
          throw new TypeError("Derived constructors may only return object or undefined");
        }
        return _assertThisInitialized(self2);
      }
      function _assertThisInitialized(self2) {
        if (self2 === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return self2;
      }
      function _wrapNativeSuper(Class) {
        var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
        _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
          if (Class2 === null || !_isNativeFunction(Class2)) return Class2;
          if (typeof Class2 !== "function") {
            throw new TypeError("Super expression must either be null or a function");
          }
          if (typeof _cache !== "undefined") {
            if (_cache.has(Class2)) return _cache.get(Class2);
            _cache.set(Class2, Wrapper);
          }
          function Wrapper() {
            return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
          }
          Wrapper.prototype = Object.create(Class2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });
          return _setPrototypeOf(Wrapper, Class2);
        };
        return _wrapNativeSuper(Class);
      }
      function _construct(Parent, args, Class) {
        if (_isNativeReflectConstruct()) {
          _construct = Reflect.construct.bind();
        } else {
          _construct = function _construct2(Parent2, args2, Class2) {
            var a = [null];
            a.push.apply(a, args2);
            var Constructor = Function.bind.apply(Parent2, a);
            var instance = new Constructor();
            if (Class2) _setPrototypeOf(instance, Class2.prototype);
            return instance;
          };
        }
        return _construct.apply(null, arguments);
      }
      function _isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if (typeof Proxy === "function") return true;
        try {
          Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          }));
          return true;
        } catch (e) {
          return false;
        }
      }
      function _isNativeFunction(fn) {
        return Function.toString.call(fn).indexOf("[native code]") !== -1;
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
          o2.__proto__ = p2;
          return o2;
        };
        return _setPrototypeOf(o, p);
      }
      function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
          return o2.__proto__ || Object.getPrototypeOf(o2);
        };
        return _getPrototypeOf(o);
      }
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      var _require = require_util();
      var inspect = _require.inspect;
      var _require2 = require_errors();
      var ERR_INVALID_ARG_TYPE = _require2.codes.ERR_INVALID_ARG_TYPE;
      function endsWith(str, search, this_len) {
        if (this_len === void 0 || this_len > str.length) {
          this_len = str.length;
        }
        return str.substring(this_len - search.length, this_len) === search;
      }
      function repeat(str, count) {
        count = Math.floor(count);
        if (str.length == 0 || count == 0) return "";
        var maxCount = str.length * count;
        count = Math.floor(Math.log(count) / Math.log(2));
        while (count) {
          str += str;
          count--;
        }
        str += str.substring(0, maxCount - str.length);
        return str;
      }
      var blue = "";
      var green = "";
      var red = "";
      var white = "";
      var kReadableOperator = {
        deepStrictEqual: "Expected values to be strictly deep-equal:",
        strictEqual: "Expected values to be strictly equal:",
        strictEqualObject: 'Expected "actual" to be reference-equal to "expected":',
        deepEqual: "Expected values to be loosely deep-equal:",
        equal: "Expected values to be loosely equal:",
        notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:',
        notStrictEqual: 'Expected "actual" to be strictly unequal to:',
        notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":',
        notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:',
        notEqual: 'Expected "actual" to be loosely unequal to:',
        notIdentical: "Values identical but not reference-equal:"
      };
      var kMaxShortLength = 10;
      function copyError(source) {
        var keys = Object.keys(source);
        var target = Object.create(Object.getPrototypeOf(source));
        keys.forEach(function(key) {
          target[key] = source[key];
        });
        Object.defineProperty(target, "message", {
          value: source.message
        });
        return target;
      }
      function inspectValue(val) {
        return inspect(val, {
          compact: false,
          customInspect: false,
          depth: 1e3,
          maxArrayLength: Infinity,
          // Assert compares only enumerable properties (with a few exceptions).
          showHidden: false,
          // Having a long line as error is better than wrapping the line for
          // comparison for now.
          // TODO(BridgeAR): `breakLength` should be limited as soon as soon as we
          // have meta information about the inspected properties (i.e., know where
          // in what line the property starts and ends).
          breakLength: Infinity,
          // Assert does not detect proxies currently.
          showProxy: false,
          sorted: true,
          // Inspect getters as we also check them when comparing entries.
          getters: true
        });
      }
      function createErrDiff(actual, expected, operator) {
        var other = "";
        var res = "";
        var lastPos = 0;
        var end = "";
        var skipped = false;
        var actualInspected = inspectValue(actual);
        var actualLines = actualInspected.split("\n");
        var expectedLines = inspectValue(expected).split("\n");
        var i = 0;
        var indicator = "";
        if (operator === "strictEqual" && _typeof(actual) === "object" && _typeof(expected) === "object" && actual !== null && expected !== null) {
          operator = "strictEqualObject";
        }
        if (actualLines.length === 1 && expectedLines.length === 1 && actualLines[0] !== expectedLines[0]) {
          var inputLength = actualLines[0].length + expectedLines[0].length;
          if (inputLength <= kMaxShortLength) {
            if ((_typeof(actual) !== "object" || actual === null) && (_typeof(expected) !== "object" || expected === null) && (actual !== 0 || expected !== 0)) {
              return "".concat(kReadableOperator[operator], "\n\n") + "".concat(actualLines[0], " !== ").concat(expectedLines[0], "\n");
            }
          } else if (operator !== "strictEqualObject") {
            var maxLength = process.stderr && process.stderr.isTTY ? process.stderr.columns : 80;
            if (inputLength < maxLength) {
              while (actualLines[0][i] === expectedLines[0][i]) {
                i++;
              }
              if (i > 2) {
                indicator = "\n  ".concat(repeat(" ", i), "^");
                i = 0;
              }
            }
          }
        }
        var a = actualLines[actualLines.length - 1];
        var b = expectedLines[expectedLines.length - 1];
        while (a === b) {
          if (i++ < 2) {
            end = "\n  ".concat(a).concat(end);
          } else {
            other = a;
          }
          actualLines.pop();
          expectedLines.pop();
          if (actualLines.length === 0 || expectedLines.length === 0) break;
          a = actualLines[actualLines.length - 1];
          b = expectedLines[expectedLines.length - 1];
        }
        var maxLines = Math.max(actualLines.length, expectedLines.length);
        if (maxLines === 0) {
          var _actualLines = actualInspected.split("\n");
          if (_actualLines.length > 30) {
            _actualLines[26] = "".concat(blue, "...").concat(white);
            while (_actualLines.length > 27) {
              _actualLines.pop();
            }
          }
          return "".concat(kReadableOperator.notIdentical, "\n\n").concat(_actualLines.join("\n"), "\n");
        }
        if (i > 3) {
          end = "\n".concat(blue, "...").concat(white).concat(end);
          skipped = true;
        }
        if (other !== "") {
          end = "\n  ".concat(other).concat(end);
          other = "";
        }
        var printedLines = 0;
        var msg = kReadableOperator[operator] + "\n".concat(green, "+ actual").concat(white, " ").concat(red, "- expected").concat(white);
        var skippedMsg = " ".concat(blue, "...").concat(white, " Lines skipped");
        for (i = 0; i < maxLines; i++) {
          var cur = i - lastPos;
          if (actualLines.length < i + 1) {
            if (cur > 1 && i > 2) {
              if (cur > 4) {
                res += "\n".concat(blue, "...").concat(white);
                skipped = true;
              } else if (cur > 3) {
                res += "\n  ".concat(expectedLines[i - 2]);
                printedLines++;
              }
              res += "\n  ".concat(expectedLines[i - 1]);
              printedLines++;
            }
            lastPos = i;
            other += "\n".concat(red, "-").concat(white, " ").concat(expectedLines[i]);
            printedLines++;
          } else if (expectedLines.length < i + 1) {
            if (cur > 1 && i > 2) {
              if (cur > 4) {
                res += "\n".concat(blue, "...").concat(white);
                skipped = true;
              } else if (cur > 3) {
                res += "\n  ".concat(actualLines[i - 2]);
                printedLines++;
              }
              res += "\n  ".concat(actualLines[i - 1]);
              printedLines++;
            }
            lastPos = i;
            res += "\n".concat(green, "+").concat(white, " ").concat(actualLines[i]);
            printedLines++;
          } else {
            var expectedLine = expectedLines[i];
            var actualLine = actualLines[i];
            var divergingLines = actualLine !== expectedLine && (!endsWith(actualLine, ",") || actualLine.slice(0, -1) !== expectedLine);
            if (divergingLines && endsWith(expectedLine, ",") && expectedLine.slice(0, -1) === actualLine) {
              divergingLines = false;
              actualLine += ",";
            }
            if (divergingLines) {
              if (cur > 1 && i > 2) {
                if (cur > 4) {
                  res += "\n".concat(blue, "...").concat(white);
                  skipped = true;
                } else if (cur > 3) {
                  res += "\n  ".concat(actualLines[i - 2]);
                  printedLines++;
                }
                res += "\n  ".concat(actualLines[i - 1]);
                printedLines++;
              }
              lastPos = i;
              res += "\n".concat(green, "+").concat(white, " ").concat(actualLine);
              other += "\n".concat(red, "-").concat(white, " ").concat(expectedLine);
              printedLines += 2;
            } else {
              res += other;
              other = "";
              if (cur === 1 || i === 0) {
                res += "\n  ".concat(actualLine);
                printedLines++;
              }
            }
          }
          if (printedLines > 20 && i < maxLines - 2) {
            return "".concat(msg).concat(skippedMsg, "\n").concat(res, "\n").concat(blue, "...").concat(white).concat(other, "\n") + "".concat(blue, "...").concat(white);
          }
        }
        return "".concat(msg).concat(skipped ? skippedMsg : "", "\n").concat(res).concat(other).concat(end).concat(indicator);
      }
      var AssertionError = /* @__PURE__ */ (function(_Error, _inspect$custom) {
        _inherits(AssertionError2, _Error);
        var _super = _createSuper(AssertionError2);
        function AssertionError2(options) {
          var _this;
          _classCallCheck(this, AssertionError2);
          if (_typeof(options) !== "object" || options === null) {
            throw new ERR_INVALID_ARG_TYPE("options", "Object", options);
          }
          var message = options.message, operator = options.operator, stackStartFn = options.stackStartFn;
          var actual = options.actual, expected = options.expected;
          var limit = Error.stackTraceLimit;
          Error.stackTraceLimit = 0;
          if (message != null) {
            _this = _super.call(this, String(message));
          } else {
            if (process.stderr && process.stderr.isTTY) {
              if (process.stderr && process.stderr.getColorDepth && process.stderr.getColorDepth() !== 1) {
                blue = "\x1B[34m";
                green = "\x1B[32m";
                white = "\x1B[39m";
                red = "\x1B[31m";
              } else {
                blue = "";
                green = "";
                white = "";
                red = "";
              }
            }
            if (_typeof(actual) === "object" && actual !== null && _typeof(expected) === "object" && expected !== null && "stack" in actual && actual instanceof Error && "stack" in expected && expected instanceof Error) {
              actual = copyError(actual);
              expected = copyError(expected);
            }
            if (operator === "deepStrictEqual" || operator === "strictEqual") {
              _this = _super.call(this, createErrDiff(actual, expected, operator));
            } else if (operator === "notDeepStrictEqual" || operator === "notStrictEqual") {
              var base = kReadableOperator[operator];
              var res = inspectValue(actual).split("\n");
              if (operator === "notStrictEqual" && _typeof(actual) === "object" && actual !== null) {
                base = kReadableOperator.notStrictEqualObject;
              }
              if (res.length > 30) {
                res[26] = "".concat(blue, "...").concat(white);
                while (res.length > 27) {
                  res.pop();
                }
              }
              if (res.length === 1) {
                _this = _super.call(this, "".concat(base, " ").concat(res[0]));
              } else {
                _this = _super.call(this, "".concat(base, "\n\n").concat(res.join("\n"), "\n"));
              }
            } else {
              var _res = inspectValue(actual);
              var other = "";
              var knownOperators = kReadableOperator[operator];
              if (operator === "notDeepEqual" || operator === "notEqual") {
                _res = "".concat(kReadableOperator[operator], "\n\n").concat(_res);
                if (_res.length > 1024) {
                  _res = "".concat(_res.slice(0, 1021), "...");
                }
              } else {
                other = "".concat(inspectValue(expected));
                if (_res.length > 512) {
                  _res = "".concat(_res.slice(0, 509), "...");
                }
                if (other.length > 512) {
                  other = "".concat(other.slice(0, 509), "...");
                }
                if (operator === "deepEqual" || operator === "equal") {
                  _res = "".concat(knownOperators, "\n\n").concat(_res, "\n\nshould equal\n\n");
                } else {
                  other = " ".concat(operator, " ").concat(other);
                }
              }
              _this = _super.call(this, "".concat(_res).concat(other));
            }
          }
          Error.stackTraceLimit = limit;
          _this.generatedMessage = !message;
          Object.defineProperty(_assertThisInitialized(_this), "name", {
            value: "AssertionError [ERR_ASSERTION]",
            enumerable: false,
            writable: true,
            configurable: true
          });
          _this.code = "ERR_ASSERTION";
          _this.actual = actual;
          _this.expected = expected;
          _this.operator = operator;
          if (Error.captureStackTrace) {
            Error.captureStackTrace(_assertThisInitialized(_this), stackStartFn);
          }
          _this.stack;
          _this.name = "AssertionError";
          return _possibleConstructorReturn(_this);
        }
        _createClass(AssertionError2, [{
          key: "toString",
          value: function toString() {
            return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
          }
        }, {
          key: _inspect$custom,
          value: function value(recurseTimes, ctx) {
            return inspect(this, _objectSpread(_objectSpread({}, ctx), {}, {
              customInspect: false,
              depth: 0
            }));
          }
        }]);
        return AssertionError2;
      })(/* @__PURE__ */ _wrapNativeSuper(Error), inspect.custom);
      module.exports = AssertionError;
    }
  });

  // node_modules/object-keys/isArguments.js
  var require_isArguments = __commonJS({
    "node_modules/object-keys/isArguments.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var toStr = Object.prototype.toString;
      module.exports = function isArguments(value) {
        var str = toStr.call(value);
        var isArgs = str === "[object Arguments]";
        if (!isArgs) {
          isArgs = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toStr.call(value.callee) === "[object Function]";
        }
        return isArgs;
      };
    }
  });

  // node_modules/object-keys/implementation.js
  var require_implementation2 = __commonJS({
    "node_modules/object-keys/implementation.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var keysShim;
      if (!Object.keys) {
        has = Object.prototype.hasOwnProperty;
        toStr = Object.prototype.toString;
        isArgs = require_isArguments();
        isEnumerable = Object.prototype.propertyIsEnumerable;
        hasDontEnumBug = !isEnumerable.call({ toString: null }, "toString");
        hasProtoEnumBug = isEnumerable.call(function() {
        }, "prototype");
        dontEnums = [
          "toString",
          "toLocaleString",
          "valueOf",
          "hasOwnProperty",
          "isPrototypeOf",
          "propertyIsEnumerable",
          "constructor"
        ];
        equalsConstructorPrototype = function(o) {
          var ctor = o.constructor;
          return ctor && ctor.prototype === o;
        };
        excludedKeys = {
          $applicationCache: true,
          $console: true,
          $external: true,
          $frame: true,
          $frameElement: true,
          $frames: true,
          $innerHeight: true,
          $innerWidth: true,
          $onmozfullscreenchange: true,
          $onmozfullscreenerror: true,
          $outerHeight: true,
          $outerWidth: true,
          $pageXOffset: true,
          $pageYOffset: true,
          $parent: true,
          $scrollLeft: true,
          $scrollTop: true,
          $scrollX: true,
          $scrollY: true,
          $self: true,
          $webkitIndexedDB: true,
          $webkitStorageInfo: true,
          $window: true
        };
        hasAutomationEqualityBug = (function() {
          if (typeof window === "undefined") {
            return false;
          }
          for (var k in window) {
            try {
              if (!excludedKeys["$" + k] && has.call(window, k) && window[k] !== null && typeof window[k] === "object") {
                try {
                  equalsConstructorPrototype(window[k]);
                } catch (e) {
                  return true;
                }
              }
            } catch (e) {
              return true;
            }
          }
          return false;
        })();
        equalsConstructorPrototypeIfNotBuggy = function(o) {
          if (typeof window === "undefined" || !hasAutomationEqualityBug) {
            return equalsConstructorPrototype(o);
          }
          try {
            return equalsConstructorPrototype(o);
          } catch (e) {
            return false;
          }
        };
        keysShim = function keys(object) {
          var isObject = object !== null && typeof object === "object";
          var isFunction = toStr.call(object) === "[object Function]";
          var isArguments = isArgs(object);
          var isString = isObject && toStr.call(object) === "[object String]";
          var theKeys = [];
          if (!isObject && !isFunction && !isArguments) {
            throw new TypeError("Object.keys called on a non-object");
          }
          var skipProto = hasProtoEnumBug && isFunction;
          if (isString && object.length > 0 && !has.call(object, 0)) {
            for (var i = 0; i < object.length; ++i) {
              theKeys.push(String(i));
            }
          }
          if (isArguments && object.length > 0) {
            for (var j = 0; j < object.length; ++j) {
              theKeys.push(String(j));
            }
          } else {
            for (var name in object) {
              if (!(skipProto && name === "prototype") && has.call(object, name)) {
                theKeys.push(String(name));
              }
            }
          }
          if (hasDontEnumBug) {
            var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
            for (var k = 0; k < dontEnums.length; ++k) {
              if (!(skipConstructor && dontEnums[k] === "constructor") && has.call(object, dontEnums[k])) {
                theKeys.push(dontEnums[k]);
              }
            }
          }
          return theKeys;
        };
      }
      var has;
      var toStr;
      var isArgs;
      var isEnumerable;
      var hasDontEnumBug;
      var hasProtoEnumBug;
      var dontEnums;
      var equalsConstructorPrototype;
      var excludedKeys;
      var hasAutomationEqualityBug;
      var equalsConstructorPrototypeIfNotBuggy;
      module.exports = keysShim;
    }
  });

  // node_modules/object-keys/index.js
  var require_object_keys = __commonJS({
    "node_modules/object-keys/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var slice = Array.prototype.slice;
      var isArgs = require_isArguments();
      var origKeys = Object.keys;
      var keysShim = origKeys ? function keys(o) {
        return origKeys(o);
      } : require_implementation2();
      var originalKeys = Object.keys;
      keysShim.shim = function shimObjectKeys() {
        if (Object.keys) {
          var keysWorksWithArguments = (function() {
            var args = Object.keys(arguments);
            return args && args.length === arguments.length;
          })(1, 2);
          if (!keysWorksWithArguments) {
            Object.keys = function keys(object) {
              if (isArgs(object)) {
                return originalKeys(slice.call(object));
              }
              return originalKeys(object);
            };
          }
        } else {
          Object.keys = keysShim;
        }
        return Object.keys || keysShim;
      };
      module.exports = keysShim;
    }
  });

  // node_modules/object.assign/implementation.js
  var require_implementation3 = __commonJS({
    "node_modules/object.assign/implementation.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var objectKeys = require_object_keys();
      var hasSymbols = require_shams()();
      var callBound = require_call_bound();
      var $Object = require_es_object_atoms();
      var $push = callBound("Array.prototype.push");
      var $propIsEnumerable = callBound("Object.prototype.propertyIsEnumerable");
      var originalGetSymbols = hasSymbols ? $Object.getOwnPropertySymbols : null;
      module.exports = function assign(target, source1) {
        if (target == null) {
          throw new TypeError("target must be an object");
        }
        var to = $Object(target);
        if (arguments.length === 1) {
          return to;
        }
        for (var s = 1; s < arguments.length; ++s) {
          var from = $Object(arguments[s]);
          var keys = objectKeys(from);
          var getSymbols = hasSymbols && ($Object.getOwnPropertySymbols || originalGetSymbols);
          if (getSymbols) {
            var syms = getSymbols(from);
            for (var j = 0; j < syms.length; ++j) {
              var key = syms[j];
              if ($propIsEnumerable(from, key)) {
                $push(keys, key);
              }
            }
          }
          for (var i = 0; i < keys.length; ++i) {
            var nextKey = keys[i];
            if ($propIsEnumerable(from, nextKey)) {
              var propValue = from[nextKey];
              to[nextKey] = propValue;
            }
          }
        }
        return to;
      };
    }
  });

  // node_modules/object.assign/polyfill.js
  var require_polyfill = __commonJS({
    "node_modules/object.assign/polyfill.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var implementation = require_implementation3();
      var lacksProperEnumerationOrder = function() {
        if (!Object.assign) {
          return false;
        }
        var str = "abcdefghijklmnopqrst";
        var letters = str.split("");
        var map = {};
        for (var i = 0; i < letters.length; ++i) {
          map[letters[i]] = letters[i];
        }
        var obj = Object.assign({}, map);
        var actual = "";
        for (var k in obj) {
          actual += k;
        }
        return str !== actual;
      };
      var assignHasPendingExceptions = function() {
        if (!Object.assign || !Object.preventExtensions) {
          return false;
        }
        var thrower = Object.preventExtensions({ 1: 2 });
        try {
          Object.assign(thrower, "xy");
        } catch (e) {
          return thrower[1] === "y";
        }
        return false;
      };
      module.exports = function getPolyfill() {
        if (!Object.assign) {
          return implementation;
        }
        if (lacksProperEnumerationOrder()) {
          return implementation;
        }
        if (assignHasPendingExceptions()) {
          return implementation;
        }
        return Object.assign;
      };
    }
  });

  // node_modules/object-is/implementation.js
  var require_implementation4 = __commonJS({
    "node_modules/object-is/implementation.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var numberIsNaN = function(value) {
        return value !== value;
      };
      module.exports = function is(a, b) {
        if (a === 0 && b === 0) {
          return 1 / a === 1 / b;
        }
        if (a === b) {
          return true;
        }
        if (numberIsNaN(a) && numberIsNaN(b)) {
          return true;
        }
        return false;
      };
    }
  });

  // node_modules/object-is/polyfill.js
  var require_polyfill2 = __commonJS({
    "node_modules/object-is/polyfill.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var implementation = require_implementation4();
      module.exports = function getPolyfill() {
        return typeof Object.is === "function" ? Object.is : implementation;
      };
    }
  });

  // node_modules/call-bind/callBound.js
  var require_callBound = __commonJS({
    "node_modules/call-bind/callBound.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var GetIntrinsic = require_get_intrinsic();
      var callBind = require_call_bind();
      var $indexOf = callBind(GetIntrinsic("String.prototype.indexOf"));
      module.exports = function callBoundIntrinsic(name, allowMissing) {
        var intrinsic = GetIntrinsic(name, !!allowMissing);
        if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
          return callBind(intrinsic);
        }
        return intrinsic;
      };
    }
  });

  // node_modules/define-properties/index.js
  var require_define_properties = __commonJS({
    "node_modules/define-properties/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var keys = require_object_keys();
      var hasSymbols = typeof Symbol === "function" && typeof /* @__PURE__ */ Symbol("foo") === "symbol";
      var toStr = Object.prototype.toString;
      var concat = Array.prototype.concat;
      var defineDataProperty = require_define_data_property();
      var isFunction = function(fn) {
        return typeof fn === "function" && toStr.call(fn) === "[object Function]";
      };
      var supportsDescriptors = require_has_property_descriptors()();
      var defineProperty = function(object, name, value, predicate) {
        if (name in object) {
          if (predicate === true) {
            if (object[name] === value) {
              return;
            }
          } else if (!isFunction(predicate) || !predicate()) {
            return;
          }
        }
        if (supportsDescriptors) {
          defineDataProperty(object, name, value, true);
        } else {
          defineDataProperty(object, name, value);
        }
      };
      var defineProperties = function(object, map) {
        var predicates = arguments.length > 2 ? arguments[2] : {};
        var props = keys(map);
        if (hasSymbols) {
          props = concat.call(props, Object.getOwnPropertySymbols(map));
        }
        for (var i = 0; i < props.length; i += 1) {
          defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
        }
      };
      defineProperties.supportsDescriptors = !!supportsDescriptors;
      module.exports = defineProperties;
    }
  });

  // node_modules/object-is/shim.js
  var require_shim = __commonJS({
    "node_modules/object-is/shim.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var getPolyfill = require_polyfill2();
      var define = require_define_properties();
      module.exports = function shimObjectIs() {
        var polyfill = getPolyfill();
        define(Object, { is: polyfill }, {
          is: function testObjectIs() {
            return Object.is !== polyfill;
          }
        });
        return polyfill;
      };
    }
  });

  // node_modules/object-is/index.js
  var require_object_is = __commonJS({
    "node_modules/object-is/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var define = require_define_properties();
      var callBind = require_call_bind();
      var implementation = require_implementation4();
      var getPolyfill = require_polyfill2();
      var shim = require_shim();
      var polyfill = callBind(getPolyfill(), Object);
      define(polyfill, {
        getPolyfill,
        implementation,
        shim
      });
      module.exports = polyfill;
    }
  });

  // node_modules/is-nan/implementation.js
  var require_implementation5 = __commonJS({
    "node_modules/is-nan/implementation.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = function isNaN2(value) {
        return value !== value;
      };
    }
  });

  // node_modules/is-nan/polyfill.js
  var require_polyfill3 = __commonJS({
    "node_modules/is-nan/polyfill.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var implementation = require_implementation5();
      module.exports = function getPolyfill() {
        if (Number.isNaN && Number.isNaN(NaN) && !Number.isNaN("a")) {
          return Number.isNaN;
        }
        return implementation;
      };
    }
  });

  // node_modules/is-nan/shim.js
  var require_shim2 = __commonJS({
    "node_modules/is-nan/shim.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var define = require_define_properties();
      var getPolyfill = require_polyfill3();
      module.exports = function shimNumberIsNaN() {
        var polyfill = getPolyfill();
        define(Number, { isNaN: polyfill }, {
          isNaN: function testIsNaN() {
            return Number.isNaN !== polyfill;
          }
        });
        return polyfill;
      };
    }
  });

  // node_modules/is-nan/index.js
  var require_is_nan = __commonJS({
    "node_modules/is-nan/index.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var callBind = require_call_bind();
      var define = require_define_properties();
      var implementation = require_implementation5();
      var getPolyfill = require_polyfill3();
      var shim = require_shim2();
      var polyfill = callBind(getPolyfill(), Number);
      define(polyfill, {
        getPolyfill,
        implementation,
        shim
      });
      module.exports = polyfill;
    }
  });

  // node_modules/assert/build/internal/util/comparisons.js
  var require_comparisons = __commonJS({
    "node_modules/assert/build/internal/util/comparisons.js"(exports, module) {
      "use strict";
      init_browser_shims();
      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
        return arr2;
      }
      function _iterableToArrayLimit(r, l) {
        var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (null != t) {
          var e, n, i, u, a = [], f = true, o = false;
          try {
            if (i = (t = t.call(r)).next, 0 === l) {
              if (Object(t) !== t) return;
              f = false;
            } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
          } catch (r2) {
            o = true, n = r2;
          } finally {
            try {
              if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
            } finally {
              if (o) throw n;
            }
          }
          return a;
        }
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
      }
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      var regexFlagsSupported = /a/g.flags !== void 0;
      var arrayFromSet = function arrayFromSet2(set) {
        var array = [];
        set.forEach(function(value) {
          return array.push(value);
        });
        return array;
      };
      var arrayFromMap = function arrayFromMap2(map) {
        var array = [];
        map.forEach(function(value, key) {
          return array.push([key, value]);
        });
        return array;
      };
      var objectIs = Object.is ? Object.is : require_object_is();
      var objectGetOwnPropertySymbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
        return [];
      };
      var numberIsNaN = Number.isNaN ? Number.isNaN : require_is_nan();
      function uncurryThis(f) {
        return f.call.bind(f);
      }
      var hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
      var propertyIsEnumerable = uncurryThis(Object.prototype.propertyIsEnumerable);
      var objectToString = uncurryThis(Object.prototype.toString);
      var _require$types = require_util().types;
      var isAnyArrayBuffer = _require$types.isAnyArrayBuffer;
      var isArrayBufferView = _require$types.isArrayBufferView;
      var isDate = _require$types.isDate;
      var isMap = _require$types.isMap;
      var isRegExp = _require$types.isRegExp;
      var isSet = _require$types.isSet;
      var isNativeError = _require$types.isNativeError;
      var isBoxedPrimitive = _require$types.isBoxedPrimitive;
      var isNumberObject = _require$types.isNumberObject;
      var isStringObject = _require$types.isStringObject;
      var isBooleanObject = _require$types.isBooleanObject;
      var isBigIntObject = _require$types.isBigIntObject;
      var isSymbolObject = _require$types.isSymbolObject;
      var isFloat32Array = _require$types.isFloat32Array;
      var isFloat64Array = _require$types.isFloat64Array;
      function isNonIndex(key) {
        if (key.length === 0 || key.length > 10) return true;
        for (var i = 0; i < key.length; i++) {
          var code = key.charCodeAt(i);
          if (code < 48 || code > 57) return true;
        }
        return key.length === 10 && key >= Math.pow(2, 32);
      }
      function getOwnNonIndexProperties(value) {
        return Object.keys(value).filter(isNonIndex).concat(objectGetOwnPropertySymbols(value).filter(Object.prototype.propertyIsEnumerable.bind(value)));
      }
      function compare(a, b) {
        if (a === b) {
          return 0;
        }
        var x = a.length;
        var y = b.length;
        for (var i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }
        if (x < y) {
          return -1;
        }
        if (y < x) {
          return 1;
        }
        return 0;
      }
      var ONLY_ENUMERABLE = void 0;
      var kStrict = true;
      var kLoose = false;
      var kNoIterator = 0;
      var kIsArray = 1;
      var kIsSet = 2;
      var kIsMap = 3;
      function areSimilarRegExps(a, b) {
        return regexFlagsSupported ? a.source === b.source && a.flags === b.flags : RegExp.prototype.toString.call(a) === RegExp.prototype.toString.call(b);
      }
      function areSimilarFloatArrays(a, b) {
        if (a.byteLength !== b.byteLength) {
          return false;
        }
        for (var offset = 0; offset < a.byteLength; offset++) {
          if (a[offset] !== b[offset]) {
            return false;
          }
        }
        return true;
      }
      function areSimilarTypedArrays(a, b) {
        if (a.byteLength !== b.byteLength) {
          return false;
        }
        return compare(new Uint8Array(a.buffer, a.byteOffset, a.byteLength), new Uint8Array(b.buffer, b.byteOffset, b.byteLength)) === 0;
      }
      function areEqualArrayBuffers(buf1, buf2) {
        return buf1.byteLength === buf2.byteLength && compare(new Uint8Array(buf1), new Uint8Array(buf2)) === 0;
      }
      function isEqualBoxedPrimitive(val1, val2) {
        if (isNumberObject(val1)) {
          return isNumberObject(val2) && objectIs(Number.prototype.valueOf.call(val1), Number.prototype.valueOf.call(val2));
        }
        if (isStringObject(val1)) {
          return isStringObject(val2) && String.prototype.valueOf.call(val1) === String.prototype.valueOf.call(val2);
        }
        if (isBooleanObject(val1)) {
          return isBooleanObject(val2) && Boolean.prototype.valueOf.call(val1) === Boolean.prototype.valueOf.call(val2);
        }
        if (isBigIntObject(val1)) {
          return isBigIntObject(val2) && BigInt.prototype.valueOf.call(val1) === BigInt.prototype.valueOf.call(val2);
        }
        return isSymbolObject(val2) && Symbol.prototype.valueOf.call(val1) === Symbol.prototype.valueOf.call(val2);
      }
      function innerDeepEqual(val1, val2, strict, memos) {
        if (val1 === val2) {
          if (val1 !== 0) return true;
          return strict ? objectIs(val1, val2) : true;
        }
        if (strict) {
          if (_typeof(val1) !== "object") {
            return typeof val1 === "number" && numberIsNaN(val1) && numberIsNaN(val2);
          }
          if (_typeof(val2) !== "object" || val1 === null || val2 === null) {
            return false;
          }
          if (Object.getPrototypeOf(val1) !== Object.getPrototypeOf(val2)) {
            return false;
          }
        } else {
          if (val1 === null || _typeof(val1) !== "object") {
            if (val2 === null || _typeof(val2) !== "object") {
              return val1 == val2;
            }
            return false;
          }
          if (val2 === null || _typeof(val2) !== "object") {
            return false;
          }
        }
        var val1Tag = objectToString(val1);
        var val2Tag = objectToString(val2);
        if (val1Tag !== val2Tag) {
          return false;
        }
        if (Array.isArray(val1)) {
          if (val1.length !== val2.length) {
            return false;
          }
          var keys1 = getOwnNonIndexProperties(val1, ONLY_ENUMERABLE);
          var keys2 = getOwnNonIndexProperties(val2, ONLY_ENUMERABLE);
          if (keys1.length !== keys2.length) {
            return false;
          }
          return keyCheck(val1, val2, strict, memos, kIsArray, keys1);
        }
        if (val1Tag === "[object Object]") {
          if (!isMap(val1) && isMap(val2) || !isSet(val1) && isSet(val2)) {
            return false;
          }
        }
        if (isDate(val1)) {
          if (!isDate(val2) || Date.prototype.getTime.call(val1) !== Date.prototype.getTime.call(val2)) {
            return false;
          }
        } else if (isRegExp(val1)) {
          if (!isRegExp(val2) || !areSimilarRegExps(val1, val2)) {
            return false;
          }
        } else if (isNativeError(val1) || val1 instanceof Error) {
          if (val1.message !== val2.message || val1.name !== val2.name) {
            return false;
          }
        } else if (isArrayBufferView(val1)) {
          if (!strict && (isFloat32Array(val1) || isFloat64Array(val1))) {
            if (!areSimilarFloatArrays(val1, val2)) {
              return false;
            }
          } else if (!areSimilarTypedArrays(val1, val2)) {
            return false;
          }
          var _keys = getOwnNonIndexProperties(val1, ONLY_ENUMERABLE);
          var _keys2 = getOwnNonIndexProperties(val2, ONLY_ENUMERABLE);
          if (_keys.length !== _keys2.length) {
            return false;
          }
          return keyCheck(val1, val2, strict, memos, kNoIterator, _keys);
        } else if (isSet(val1)) {
          if (!isSet(val2) || val1.size !== val2.size) {
            return false;
          }
          return keyCheck(val1, val2, strict, memos, kIsSet);
        } else if (isMap(val1)) {
          if (!isMap(val2) || val1.size !== val2.size) {
            return false;
          }
          return keyCheck(val1, val2, strict, memos, kIsMap);
        } else if (isAnyArrayBuffer(val1)) {
          if (!areEqualArrayBuffers(val1, val2)) {
            return false;
          }
        } else if (isBoxedPrimitive(val1) && !isEqualBoxedPrimitive(val1, val2)) {
          return false;
        }
        return keyCheck(val1, val2, strict, memos, kNoIterator);
      }
      function getEnumerables(val, keys) {
        return keys.filter(function(k) {
          return propertyIsEnumerable(val, k);
        });
      }
      function keyCheck(val1, val2, strict, memos, iterationType, aKeys) {
        if (arguments.length === 5) {
          aKeys = Object.keys(val1);
          var bKeys = Object.keys(val2);
          if (aKeys.length !== bKeys.length) {
            return false;
          }
        }
        var i = 0;
        for (; i < aKeys.length; i++) {
          if (!hasOwnProperty(val2, aKeys[i])) {
            return false;
          }
        }
        if (strict && arguments.length === 5) {
          var symbolKeysA = objectGetOwnPropertySymbols(val1);
          if (symbolKeysA.length !== 0) {
            var count = 0;
            for (i = 0; i < symbolKeysA.length; i++) {
              var key = symbolKeysA[i];
              if (propertyIsEnumerable(val1, key)) {
                if (!propertyIsEnumerable(val2, key)) {
                  return false;
                }
                aKeys.push(key);
                count++;
              } else if (propertyIsEnumerable(val2, key)) {
                return false;
              }
            }
            var symbolKeysB = objectGetOwnPropertySymbols(val2);
            if (symbolKeysA.length !== symbolKeysB.length && getEnumerables(val2, symbolKeysB).length !== count) {
              return false;
            }
          } else {
            var _symbolKeysB = objectGetOwnPropertySymbols(val2);
            if (_symbolKeysB.length !== 0 && getEnumerables(val2, _symbolKeysB).length !== 0) {
              return false;
            }
          }
        }
        if (aKeys.length === 0 && (iterationType === kNoIterator || iterationType === kIsArray && val1.length === 0 || val1.size === 0)) {
          return true;
        }
        if (memos === void 0) {
          memos = {
            val1: /* @__PURE__ */ new Map(),
            val2: /* @__PURE__ */ new Map(),
            position: 0
          };
        } else {
          var val2MemoA = memos.val1.get(val1);
          if (val2MemoA !== void 0) {
            var val2MemoB = memos.val2.get(val2);
            if (val2MemoB !== void 0) {
              return val2MemoA === val2MemoB;
            }
          }
          memos.position++;
        }
        memos.val1.set(val1, memos.position);
        memos.val2.set(val2, memos.position);
        var areEq = objEquiv(val1, val2, strict, aKeys, memos, iterationType);
        memos.val1.delete(val1);
        memos.val2.delete(val2);
        return areEq;
      }
      function setHasEqualElement(set, val1, strict, memo) {
        var setValues = arrayFromSet(set);
        for (var i = 0; i < setValues.length; i++) {
          var val2 = setValues[i];
          if (innerDeepEqual(val1, val2, strict, memo)) {
            set.delete(val2);
            return true;
          }
        }
        return false;
      }
      function findLooseMatchingPrimitives(prim) {
        switch (_typeof(prim)) {
          case "undefined":
            return null;
          case "object":
            return void 0;
          case "symbol":
            return false;
          case "string":
            prim = +prim;
          // Loose equal entries exist only if the string is possible to convert to
          // a regular number and not NaN.
          // Fall through
          case "number":
            if (numberIsNaN(prim)) {
              return false;
            }
        }
        return true;
      }
      function setMightHaveLoosePrim(a, b, prim) {
        var altValue = findLooseMatchingPrimitives(prim);
        if (altValue != null) return altValue;
        return b.has(altValue) && !a.has(altValue);
      }
      function mapMightHaveLoosePrim(a, b, prim, item, memo) {
        var altValue = findLooseMatchingPrimitives(prim);
        if (altValue != null) {
          return altValue;
        }
        var curB = b.get(altValue);
        if (curB === void 0 && !b.has(altValue) || !innerDeepEqual(item, curB, false, memo)) {
          return false;
        }
        return !a.has(altValue) && innerDeepEqual(item, curB, false, memo);
      }
      function setEquiv(a, b, strict, memo) {
        var set = null;
        var aValues = arrayFromSet(a);
        for (var i = 0; i < aValues.length; i++) {
          var val = aValues[i];
          if (_typeof(val) === "object" && val !== null) {
            if (set === null) {
              set = /* @__PURE__ */ new Set();
            }
            set.add(val);
          } else if (!b.has(val)) {
            if (strict) return false;
            if (!setMightHaveLoosePrim(a, b, val)) {
              return false;
            }
            if (set === null) {
              set = /* @__PURE__ */ new Set();
            }
            set.add(val);
          }
        }
        if (set !== null) {
          var bValues = arrayFromSet(b);
          for (var _i = 0; _i < bValues.length; _i++) {
            var _val = bValues[_i];
            if (_typeof(_val) === "object" && _val !== null) {
              if (!setHasEqualElement(set, _val, strict, memo)) return false;
            } else if (!strict && !a.has(_val) && !setHasEqualElement(set, _val, strict, memo)) {
              return false;
            }
          }
          return set.size === 0;
        }
        return true;
      }
      function mapHasEqualEntry(set, map, key1, item1, strict, memo) {
        var setValues = arrayFromSet(set);
        for (var i = 0; i < setValues.length; i++) {
          var key2 = setValues[i];
          if (innerDeepEqual(key1, key2, strict, memo) && innerDeepEqual(item1, map.get(key2), strict, memo)) {
            set.delete(key2);
            return true;
          }
        }
        return false;
      }
      function mapEquiv(a, b, strict, memo) {
        var set = null;
        var aEntries = arrayFromMap(a);
        for (var i = 0; i < aEntries.length; i++) {
          var _aEntries$i = _slicedToArray(aEntries[i], 2), key = _aEntries$i[0], item1 = _aEntries$i[1];
          if (_typeof(key) === "object" && key !== null) {
            if (set === null) {
              set = /* @__PURE__ */ new Set();
            }
            set.add(key);
          } else {
            var item2 = b.get(key);
            if (item2 === void 0 && !b.has(key) || !innerDeepEqual(item1, item2, strict, memo)) {
              if (strict) return false;
              if (!mapMightHaveLoosePrim(a, b, key, item1, memo)) return false;
              if (set === null) {
                set = /* @__PURE__ */ new Set();
              }
              set.add(key);
            }
          }
        }
        if (set !== null) {
          var bEntries = arrayFromMap(b);
          for (var _i2 = 0; _i2 < bEntries.length; _i2++) {
            var _bEntries$_i = _slicedToArray(bEntries[_i2], 2), _key = _bEntries$_i[0], item = _bEntries$_i[1];
            if (_typeof(_key) === "object" && _key !== null) {
              if (!mapHasEqualEntry(set, a, _key, item, strict, memo)) return false;
            } else if (!strict && (!a.has(_key) || !innerDeepEqual(a.get(_key), item, false, memo)) && !mapHasEqualEntry(set, a, _key, item, false, memo)) {
              return false;
            }
          }
          return set.size === 0;
        }
        return true;
      }
      function objEquiv(a, b, strict, keys, memos, iterationType) {
        var i = 0;
        if (iterationType === kIsSet) {
          if (!setEquiv(a, b, strict, memos)) {
            return false;
          }
        } else if (iterationType === kIsMap) {
          if (!mapEquiv(a, b, strict, memos)) {
            return false;
          }
        } else if (iterationType === kIsArray) {
          for (; i < a.length; i++) {
            if (hasOwnProperty(a, i)) {
              if (!hasOwnProperty(b, i) || !innerDeepEqual(a[i], b[i], strict, memos)) {
                return false;
              }
            } else if (hasOwnProperty(b, i)) {
              return false;
            } else {
              var keysA = Object.keys(a);
              for (; i < keysA.length; i++) {
                var key = keysA[i];
                if (!hasOwnProperty(b, key) || !innerDeepEqual(a[key], b[key], strict, memos)) {
                  return false;
                }
              }
              if (keysA.length !== Object.keys(b).length) {
                return false;
              }
              return true;
            }
          }
        }
        for (i = 0; i < keys.length; i++) {
          var _key2 = keys[i];
          if (!innerDeepEqual(a[_key2], b[_key2], strict, memos)) {
            return false;
          }
        }
        return true;
      }
      function isDeepEqual(val1, val2) {
        return innerDeepEqual(val1, val2, kLoose);
      }
      function isDeepStrictEqual(val1, val2) {
        return innerDeepEqual(val1, val2, kStrict);
      }
      module.exports = {
        isDeepEqual,
        isDeepStrictEqual
      };
    }
  });

  // node_modules/assert/build/assert.js
  var require_assert = __commonJS({
    "node_modules/assert/build/assert.js"(exports, module) {
      "use strict";
      init_browser_shims();
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, "string");
        return _typeof(key) === "symbol" ? key : String(key);
      }
      function _toPrimitive(input, hint) {
        if (_typeof(input) !== "object" || input === null) return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== void 0) {
          var res = prim.call(input, hint || "default");
          if (_typeof(res) !== "object") return res;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (hint === "string" ? String : Number)(input);
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      var _require = require_errors();
      var _require$codes = _require.codes;
      var ERR_AMBIGUOUS_ARGUMENT = _require$codes.ERR_AMBIGUOUS_ARGUMENT;
      var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
      var ERR_INVALID_ARG_VALUE = _require$codes.ERR_INVALID_ARG_VALUE;
      var ERR_INVALID_RETURN_VALUE = _require$codes.ERR_INVALID_RETURN_VALUE;
      var ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;
      var AssertionError = require_assertion_error();
      var _require2 = require_util();
      var inspect = _require2.inspect;
      var _require$types = require_util().types;
      var isPromise = _require$types.isPromise;
      var isRegExp = _require$types.isRegExp;
      var objectAssign = require_polyfill()();
      var objectIs = require_polyfill2()();
      var RegExpPrototypeTest = require_callBound()("RegExp.prototype.test");
      var isDeepEqual;
      var isDeepStrictEqual;
      function lazyLoadComparison() {
        var comparison = require_comparisons();
        isDeepEqual = comparison.isDeepEqual;
        isDeepStrictEqual = comparison.isDeepStrictEqual;
      }
      var warned = false;
      var assert = module.exports = ok;
      var NO_EXCEPTION_SENTINEL = {};
      function innerFail(obj) {
        if (obj.message instanceof Error) throw obj.message;
        throw new AssertionError(obj);
      }
      function fail(actual, expected, message, operator, stackStartFn) {
        var argsLen = arguments.length;
        var internalMessage;
        if (argsLen === 0) {
          internalMessage = "Failed";
        } else if (argsLen === 1) {
          message = actual;
          actual = void 0;
        } else {
          if (warned === false) {
            warned = true;
            var warn = process.emitWarning ? process.emitWarning : console.warn.bind(console);
            warn("assert.fail() with more than one argument is deprecated. Please use assert.strictEqual() instead or only pass a message.", "DeprecationWarning", "DEP0094");
          }
          if (argsLen === 2) operator = "!=";
        }
        if (message instanceof Error) throw message;
        var errArgs = {
          actual,
          expected,
          operator: operator === void 0 ? "fail" : operator,
          stackStartFn: stackStartFn || fail
        };
        if (message !== void 0) {
          errArgs.message = message;
        }
        var err = new AssertionError(errArgs);
        if (internalMessage) {
          err.message = internalMessage;
          err.generatedMessage = true;
        }
        throw err;
      }
      assert.fail = fail;
      assert.AssertionError = AssertionError;
      function innerOk(fn, argLen, value, message) {
        if (!value) {
          var generatedMessage = false;
          if (argLen === 0) {
            generatedMessage = true;
            message = "No value argument passed to `assert.ok()`";
          } else if (message instanceof Error) {
            throw message;
          }
          var err = new AssertionError({
            actual: value,
            expected: true,
            message,
            operator: "==",
            stackStartFn: fn
          });
          err.generatedMessage = generatedMessage;
          throw err;
        }
      }
      function ok() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        innerOk.apply(void 0, [ok, args.length].concat(args));
      }
      assert.ok = ok;
      assert.equal = function equal(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (actual != expected) {
          innerFail({
            actual,
            expected,
            message,
            operator: "==",
            stackStartFn: equal
          });
        }
      };
      assert.notEqual = function notEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (actual == expected) {
          innerFail({
            actual,
            expected,
            message,
            operator: "!=",
            stackStartFn: notEqual
          });
        }
      };
      assert.deepEqual = function deepEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (isDeepEqual === void 0) lazyLoadComparison();
        if (!isDeepEqual(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "deepEqual",
            stackStartFn: deepEqual
          });
        }
      };
      assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (isDeepEqual === void 0) lazyLoadComparison();
        if (isDeepEqual(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "notDeepEqual",
            stackStartFn: notDeepEqual
          });
        }
      };
      assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (isDeepEqual === void 0) lazyLoadComparison();
        if (!isDeepStrictEqual(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "deepStrictEqual",
            stackStartFn: deepStrictEqual
          });
        }
      };
      assert.notDeepStrictEqual = notDeepStrictEqual;
      function notDeepStrictEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (isDeepEqual === void 0) lazyLoadComparison();
        if (isDeepStrictEqual(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "notDeepStrictEqual",
            stackStartFn: notDeepStrictEqual
          });
        }
      }
      assert.strictEqual = function strictEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (!objectIs(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "strictEqual",
            stackStartFn: strictEqual
          });
        }
      };
      assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (objectIs(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "notStrictEqual",
            stackStartFn: notStrictEqual
          });
        }
      };
      var Comparison = /* @__PURE__ */ _createClass(function Comparison2(obj, keys, actual) {
        var _this = this;
        _classCallCheck(this, Comparison2);
        keys.forEach(function(key) {
          if (key in obj) {
            if (actual !== void 0 && typeof actual[key] === "string" && isRegExp(obj[key]) && RegExpPrototypeTest(obj[key], actual[key])) {
              _this[key] = actual[key];
            } else {
              _this[key] = obj[key];
            }
          }
        });
      });
      function compareExceptionKey(actual, expected, key, message, keys, fn) {
        if (!(key in actual) || !isDeepStrictEqual(actual[key], expected[key])) {
          if (!message) {
            var a = new Comparison(actual, keys);
            var b = new Comparison(expected, keys, actual);
            var err = new AssertionError({
              actual: a,
              expected: b,
              operator: "deepStrictEqual",
              stackStartFn: fn
            });
            err.actual = actual;
            err.expected = expected;
            err.operator = fn.name;
            throw err;
          }
          innerFail({
            actual,
            expected,
            message,
            operator: fn.name,
            stackStartFn: fn
          });
        }
      }
      function expectedException(actual, expected, msg, fn) {
        if (typeof expected !== "function") {
          if (isRegExp(expected)) return RegExpPrototypeTest(expected, actual);
          if (arguments.length === 2) {
            throw new ERR_INVALID_ARG_TYPE("expected", ["Function", "RegExp"], expected);
          }
          if (_typeof(actual) !== "object" || actual === null) {
            var err = new AssertionError({
              actual,
              expected,
              message: msg,
              operator: "deepStrictEqual",
              stackStartFn: fn
            });
            err.operator = fn.name;
            throw err;
          }
          var keys = Object.keys(expected);
          if (expected instanceof Error) {
            keys.push("name", "message");
          } else if (keys.length === 0) {
            throw new ERR_INVALID_ARG_VALUE("error", expected, "may not be an empty object");
          }
          if (isDeepEqual === void 0) lazyLoadComparison();
          keys.forEach(function(key) {
            if (typeof actual[key] === "string" && isRegExp(expected[key]) && RegExpPrototypeTest(expected[key], actual[key])) {
              return;
            }
            compareExceptionKey(actual, expected, key, msg, keys, fn);
          });
          return true;
        }
        if (expected.prototype !== void 0 && actual instanceof expected) {
          return true;
        }
        if (Error.isPrototypeOf(expected)) {
          return false;
        }
        return expected.call({}, actual) === true;
      }
      function getActual(fn) {
        if (typeof fn !== "function") {
          throw new ERR_INVALID_ARG_TYPE("fn", "Function", fn);
        }
        try {
          fn();
        } catch (e) {
          return e;
        }
        return NO_EXCEPTION_SENTINEL;
      }
      function checkIsPromise(obj) {
        return isPromise(obj) || obj !== null && _typeof(obj) === "object" && typeof obj.then === "function" && typeof obj.catch === "function";
      }
      function waitForActual(promiseFn) {
        return Promise.resolve().then(function() {
          var resultPromise;
          if (typeof promiseFn === "function") {
            resultPromise = promiseFn();
            if (!checkIsPromise(resultPromise)) {
              throw new ERR_INVALID_RETURN_VALUE("instance of Promise", "promiseFn", resultPromise);
            }
          } else if (checkIsPromise(promiseFn)) {
            resultPromise = promiseFn;
          } else {
            throw new ERR_INVALID_ARG_TYPE("promiseFn", ["Function", "Promise"], promiseFn);
          }
          return Promise.resolve().then(function() {
            return resultPromise;
          }).then(function() {
            return NO_EXCEPTION_SENTINEL;
          }).catch(function(e) {
            return e;
          });
        });
      }
      function expectsError(stackStartFn, actual, error, message) {
        if (typeof error === "string") {
          if (arguments.length === 4) {
            throw new ERR_INVALID_ARG_TYPE("error", ["Object", "Error", "Function", "RegExp"], error);
          }
          if (_typeof(actual) === "object" && actual !== null) {
            if (actual.message === error) {
              throw new ERR_AMBIGUOUS_ARGUMENT("error/message", 'The error message "'.concat(actual.message, '" is identical to the message.'));
            }
          } else if (actual === error) {
            throw new ERR_AMBIGUOUS_ARGUMENT("error/message", 'The error "'.concat(actual, '" is identical to the message.'));
          }
          message = error;
          error = void 0;
        } else if (error != null && _typeof(error) !== "object" && typeof error !== "function") {
          throw new ERR_INVALID_ARG_TYPE("error", ["Object", "Error", "Function", "RegExp"], error);
        }
        if (actual === NO_EXCEPTION_SENTINEL) {
          var details = "";
          if (error && error.name) {
            details += " (".concat(error.name, ")");
          }
          details += message ? ": ".concat(message) : ".";
          var fnType = stackStartFn.name === "rejects" ? "rejection" : "exception";
          innerFail({
            actual: void 0,
            expected: error,
            operator: stackStartFn.name,
            message: "Missing expected ".concat(fnType).concat(details),
            stackStartFn
          });
        }
        if (error && !expectedException(actual, error, message, stackStartFn)) {
          throw actual;
        }
      }
      function expectsNoError(stackStartFn, actual, error, message) {
        if (actual === NO_EXCEPTION_SENTINEL) return;
        if (typeof error === "string") {
          message = error;
          error = void 0;
        }
        if (!error || expectedException(actual, error)) {
          var details = message ? ": ".concat(message) : ".";
          var fnType = stackStartFn.name === "doesNotReject" ? "rejection" : "exception";
          innerFail({
            actual,
            expected: error,
            operator: stackStartFn.name,
            message: "Got unwanted ".concat(fnType).concat(details, "\n") + 'Actual message: "'.concat(actual && actual.message, '"'),
            stackStartFn
          });
        }
        throw actual;
      }
      assert.throws = function throws(promiseFn) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        expectsError.apply(void 0, [throws, getActual(promiseFn)].concat(args));
      };
      assert.rejects = function rejects(promiseFn) {
        for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }
        return waitForActual(promiseFn).then(function(result) {
          return expectsError.apply(void 0, [rejects, result].concat(args));
        });
      };
      assert.doesNotThrow = function doesNotThrow(fn) {
        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }
        expectsNoError.apply(void 0, [doesNotThrow, getActual(fn)].concat(args));
      };
      assert.doesNotReject = function doesNotReject(fn) {
        for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
          args[_key5 - 1] = arguments[_key5];
        }
        return waitForActual(fn).then(function(result) {
          return expectsNoError.apply(void 0, [doesNotReject, result].concat(args));
        });
      };
      assert.ifError = function ifError(err) {
        if (err !== null && err !== void 0) {
          var message = "ifError got unwanted exception: ";
          if (_typeof(err) === "object" && typeof err.message === "string") {
            if (err.message.length === 0 && err.constructor) {
              message += err.constructor.name;
            } else {
              message += err.message;
            }
          } else {
            message += inspect(err);
          }
          var newErr = new AssertionError({
            actual: err,
            expected: null,
            operator: "ifError",
            message,
            stackStartFn: ifError
          });
          var origStack = err.stack;
          if (typeof origStack === "string") {
            var tmp2 = origStack.split("\n");
            tmp2.shift();
            var tmp1 = newErr.stack.split("\n");
            for (var i = 0; i < tmp2.length; i++) {
              var pos = tmp1.indexOf(tmp2[i]);
              if (pos !== -1) {
                tmp1 = tmp1.slice(0, pos);
                break;
              }
            }
            newErr.stack = "".concat(tmp1.join("\n"), "\n").concat(tmp2.join("\n"));
          }
          throw newErr;
        }
      };
      function internalMatch(string, regexp, message, fn, fnName) {
        if (!isRegExp(regexp)) {
          throw new ERR_INVALID_ARG_TYPE("regexp", "RegExp", regexp);
        }
        var match = fnName === "match";
        if (typeof string !== "string" || RegExpPrototypeTest(regexp, string) !== match) {
          if (message instanceof Error) {
            throw message;
          }
          var generatedMessage = !message;
          message = message || (typeof string !== "string" ? 'The "string" argument must be of type string. Received type ' + "".concat(_typeof(string), " (").concat(inspect(string), ")") : (match ? "The input did not match the regular expression " : "The input was expected to not match the regular expression ") + "".concat(inspect(regexp), ". Input:\n\n").concat(inspect(string), "\n"));
          var err = new AssertionError({
            actual: string,
            expected: regexp,
            message,
            operator: fnName,
            stackStartFn: fn
          });
          err.generatedMessage = generatedMessage;
          throw err;
        }
      }
      assert.match = function match(string, regexp, message) {
        internalMatch(string, regexp, message, match, "match");
      };
      assert.doesNotMatch = function doesNotMatch(string, regexp, message) {
        internalMatch(string, regexp, message, doesNotMatch, "doesNotMatch");
      };
      function strict() {
        for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          args[_key6] = arguments[_key6];
        }
        innerOk.apply(void 0, [strict, args.length].concat(args));
      }
      assert.strict = objectAssign(strict, assert, {
        equal: assert.strictEqual,
        deepEqual: assert.deepStrictEqual,
        notEqual: assert.notStrictEqual,
        notDeepEqual: assert.notDeepStrictEqual
      });
      assert.strict.strict = assert.strict;
    }
  });

  // node_modules/pako/lib/zlib/zstream.js
  var require_zstream = __commonJS({
    "node_modules/pako/lib/zlib/zstream.js"(exports, module) {
      "use strict";
      init_browser_shims();
      function ZStream() {
        this.input = null;
        this.next_in = 0;
        this.avail_in = 0;
        this.total_in = 0;
        this.output = null;
        this.next_out = 0;
        this.avail_out = 0;
        this.total_out = 0;
        this.msg = "";
        this.state = null;
        this.data_type = 2;
        this.adler = 0;
      }
      module.exports = ZStream;
    }
  });

  // node_modules/pako/lib/utils/common.js
  var require_common = __commonJS({
    "node_modules/pako/lib/utils/common.js"(exports) {
      "use strict";
      init_browser_shims();
      var TYPED_OK = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Int32Array !== "undefined";
      function _has(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
      }
      exports.assign = function(obj) {
        var sources = Array.prototype.slice.call(arguments, 1);
        while (sources.length) {
          var source = sources.shift();
          if (!source) {
            continue;
          }
          if (typeof source !== "object") {
            throw new TypeError(source + "must be non-object");
          }
          for (var p in source) {
            if (_has(source, p)) {
              obj[p] = source[p];
            }
          }
        }
        return obj;
      };
      exports.shrinkBuf = function(buf, size) {
        if (buf.length === size) {
          return buf;
        }
        if (buf.subarray) {
          return buf.subarray(0, size);
        }
        buf.length = size;
        return buf;
      };
      var fnTyped = {
        arraySet: function(dest, src, src_offs, len, dest_offs) {
          if (src.subarray && dest.subarray) {
            dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
            return;
          }
          for (var i = 0; i < len; i++) {
            dest[dest_offs + i] = src[src_offs + i];
          }
        },
        // Join array of chunks to single array.
        flattenChunks: function(chunks) {
          var i, l, len, pos, chunk, result;
          len = 0;
          for (i = 0, l = chunks.length; i < l; i++) {
            len += chunks[i].length;
          }
          result = new Uint8Array(len);
          pos = 0;
          for (i = 0, l = chunks.length; i < l; i++) {
            chunk = chunks[i];
            result.set(chunk, pos);
            pos += chunk.length;
          }
          return result;
        }
      };
      var fnUntyped = {
        arraySet: function(dest, src, src_offs, len, dest_offs) {
          for (var i = 0; i < len; i++) {
            dest[dest_offs + i] = src[src_offs + i];
          }
        },
        // Join array of chunks to single array.
        flattenChunks: function(chunks) {
          return [].concat.apply([], chunks);
        }
      };
      exports.setTyped = function(on) {
        if (on) {
          exports.Buf8 = Uint8Array;
          exports.Buf16 = Uint16Array;
          exports.Buf32 = Int32Array;
          exports.assign(exports, fnTyped);
        } else {
          exports.Buf8 = Array;
          exports.Buf16 = Array;
          exports.Buf32 = Array;
          exports.assign(exports, fnUntyped);
        }
      };
      exports.setTyped(TYPED_OK);
    }
  });

  // node_modules/pako/lib/zlib/trees.js
  var require_trees = __commonJS({
    "node_modules/pako/lib/zlib/trees.js"(exports) {
      "use strict";
      init_browser_shims();
      var utils = require_common();
      var Z_FIXED = 4;
      var Z_BINARY = 0;
      var Z_TEXT = 1;
      var Z_UNKNOWN = 2;
      function zero(buf) {
        var len = buf.length;
        while (--len >= 0) {
          buf[len] = 0;
        }
      }
      var STORED_BLOCK = 0;
      var STATIC_TREES = 1;
      var DYN_TREES = 2;
      var MIN_MATCH = 3;
      var MAX_MATCH = 258;
      var LENGTH_CODES = 29;
      var LITERALS = 256;
      var L_CODES = LITERALS + 1 + LENGTH_CODES;
      var D_CODES = 30;
      var BL_CODES = 19;
      var HEAP_SIZE = 2 * L_CODES + 1;
      var MAX_BITS = 15;
      var Buf_size = 16;
      var MAX_BL_BITS = 7;
      var END_BLOCK = 256;
      var REP_3_6 = 16;
      var REPZ_3_10 = 17;
      var REPZ_11_138 = 18;
      var extra_lbits = (
        /* extra bits for each length code */
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
      );
      var extra_dbits = (
        /* extra bits for each distance code */
        [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
      );
      var extra_blbits = (
        /* extra bits for each bit length code */
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
      );
      var bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
      var DIST_CODE_LEN = 512;
      var static_ltree = new Array((L_CODES + 2) * 2);
      zero(static_ltree);
      var static_dtree = new Array(D_CODES * 2);
      zero(static_dtree);
      var _dist_code = new Array(DIST_CODE_LEN);
      zero(_dist_code);
      var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
      zero(_length_code);
      var base_length = new Array(LENGTH_CODES);
      zero(base_length);
      var base_dist = new Array(D_CODES);
      zero(base_dist);
      function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
        this.static_tree = static_tree;
        this.extra_bits = extra_bits;
        this.extra_base = extra_base;
        this.elems = elems;
        this.max_length = max_length;
        this.has_stree = static_tree && static_tree.length;
      }
      var static_l_desc;
      var static_d_desc;
      var static_bl_desc;
      function TreeDesc(dyn_tree, stat_desc) {
        this.dyn_tree = dyn_tree;
        this.max_code = 0;
        this.stat_desc = stat_desc;
      }
      function d_code(dist) {
        return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
      }
      function put_short(s, w) {
        s.pending_buf[s.pending++] = w & 255;
        s.pending_buf[s.pending++] = w >>> 8 & 255;
      }
      function send_bits(s, value, length) {
        if (s.bi_valid > Buf_size - length) {
          s.bi_buf |= value << s.bi_valid & 65535;
          put_short(s, s.bi_buf);
          s.bi_buf = value >> Buf_size - s.bi_valid;
          s.bi_valid += length - Buf_size;
        } else {
          s.bi_buf |= value << s.bi_valid & 65535;
          s.bi_valid += length;
        }
      }
      function send_code(s, c, tree) {
        send_bits(
          s,
          tree[c * 2],
          tree[c * 2 + 1]
          /*.Len*/
        );
      }
      function bi_reverse(code, len) {
        var res = 0;
        do {
          res |= code & 1;
          code >>>= 1;
          res <<= 1;
        } while (--len > 0);
        return res >>> 1;
      }
      function bi_flush(s) {
        if (s.bi_valid === 16) {
          put_short(s, s.bi_buf);
          s.bi_buf = 0;
          s.bi_valid = 0;
        } else if (s.bi_valid >= 8) {
          s.pending_buf[s.pending++] = s.bi_buf & 255;
          s.bi_buf >>= 8;
          s.bi_valid -= 8;
        }
      }
      function gen_bitlen(s, desc) {
        var tree = desc.dyn_tree;
        var max_code = desc.max_code;
        var stree = desc.stat_desc.static_tree;
        var has_stree = desc.stat_desc.has_stree;
        var extra = desc.stat_desc.extra_bits;
        var base = desc.stat_desc.extra_base;
        var max_length = desc.stat_desc.max_length;
        var h;
        var n, m;
        var bits;
        var xbits;
        var f;
        var overflow = 0;
        for (bits = 0; bits <= MAX_BITS; bits++) {
          s.bl_count[bits] = 0;
        }
        tree[s.heap[s.heap_max] * 2 + 1] = 0;
        for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
          n = s.heap[h];
          bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
          if (bits > max_length) {
            bits = max_length;
            overflow++;
          }
          tree[n * 2 + 1] = bits;
          if (n > max_code) {
            continue;
          }
          s.bl_count[bits]++;
          xbits = 0;
          if (n >= base) {
            xbits = extra[n - base];
          }
          f = tree[n * 2];
          s.opt_len += f * (bits + xbits);
          if (has_stree) {
            s.static_len += f * (stree[n * 2 + 1] + xbits);
          }
        }
        if (overflow === 0) {
          return;
        }
        do {
          bits = max_length - 1;
          while (s.bl_count[bits] === 0) {
            bits--;
          }
          s.bl_count[bits]--;
          s.bl_count[bits + 1] += 2;
          s.bl_count[max_length]--;
          overflow -= 2;
        } while (overflow > 0);
        for (bits = max_length; bits !== 0; bits--) {
          n = s.bl_count[bits];
          while (n !== 0) {
            m = s.heap[--h];
            if (m > max_code) {
              continue;
            }
            if (tree[m * 2 + 1] !== bits) {
              s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
              tree[m * 2 + 1] = bits;
            }
            n--;
          }
        }
      }
      function gen_codes(tree, max_code, bl_count) {
        var next_code = new Array(MAX_BITS + 1);
        var code = 0;
        var bits;
        var n;
        for (bits = 1; bits <= MAX_BITS; bits++) {
          next_code[bits] = code = code + bl_count[bits - 1] << 1;
        }
        for (n = 0; n <= max_code; n++) {
          var len = tree[n * 2 + 1];
          if (len === 0) {
            continue;
          }
          tree[n * 2] = bi_reverse(next_code[len]++, len);
        }
      }
      function tr_static_init() {
        var n;
        var bits;
        var length;
        var code;
        var dist;
        var bl_count = new Array(MAX_BITS + 1);
        length = 0;
        for (code = 0; code < LENGTH_CODES - 1; code++) {
          base_length[code] = length;
          for (n = 0; n < 1 << extra_lbits[code]; n++) {
            _length_code[length++] = code;
          }
        }
        _length_code[length - 1] = code;
        dist = 0;
        for (code = 0; code < 16; code++) {
          base_dist[code] = dist;
          for (n = 0; n < 1 << extra_dbits[code]; n++) {
            _dist_code[dist++] = code;
          }
        }
        dist >>= 7;
        for (; code < D_CODES; code++) {
          base_dist[code] = dist << 7;
          for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
            _dist_code[256 + dist++] = code;
          }
        }
        for (bits = 0; bits <= MAX_BITS; bits++) {
          bl_count[bits] = 0;
        }
        n = 0;
        while (n <= 143) {
          static_ltree[n * 2 + 1] = 8;
          n++;
          bl_count[8]++;
        }
        while (n <= 255) {
          static_ltree[n * 2 + 1] = 9;
          n++;
          bl_count[9]++;
        }
        while (n <= 279) {
          static_ltree[n * 2 + 1] = 7;
          n++;
          bl_count[7]++;
        }
        while (n <= 287) {
          static_ltree[n * 2 + 1] = 8;
          n++;
          bl_count[8]++;
        }
        gen_codes(static_ltree, L_CODES + 1, bl_count);
        for (n = 0; n < D_CODES; n++) {
          static_dtree[n * 2 + 1] = 5;
          static_dtree[n * 2] = bi_reverse(n, 5);
        }
        static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
        static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
        static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
      }
      function init_block(s) {
        var n;
        for (n = 0; n < L_CODES; n++) {
          s.dyn_ltree[n * 2] = 0;
        }
        for (n = 0; n < D_CODES; n++) {
          s.dyn_dtree[n * 2] = 0;
        }
        for (n = 0; n < BL_CODES; n++) {
          s.bl_tree[n * 2] = 0;
        }
        s.dyn_ltree[END_BLOCK * 2] = 1;
        s.opt_len = s.static_len = 0;
        s.last_lit = s.matches = 0;
      }
      function bi_windup(s) {
        if (s.bi_valid > 8) {
          put_short(s, s.bi_buf);
        } else if (s.bi_valid > 0) {
          s.pending_buf[s.pending++] = s.bi_buf;
        }
        s.bi_buf = 0;
        s.bi_valid = 0;
      }
      function copy_block(s, buf, len, header) {
        bi_windup(s);
        if (header) {
          put_short(s, len);
          put_short(s, ~len);
        }
        utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
        s.pending += len;
      }
      function smaller(tree, n, m, depth) {
        var _n2 = n * 2;
        var _m2 = m * 2;
        return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
      }
      function pqdownheap(s, tree, k) {
        var v = s.heap[k];
        var j = k << 1;
        while (j <= s.heap_len) {
          if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
            j++;
          }
          if (smaller(tree, v, s.heap[j], s.depth)) {
            break;
          }
          s.heap[k] = s.heap[j];
          k = j;
          j <<= 1;
        }
        s.heap[k] = v;
      }
      function compress_block(s, ltree, dtree) {
        var dist;
        var lc;
        var lx = 0;
        var code;
        var extra;
        if (s.last_lit !== 0) {
          do {
            dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
            lc = s.pending_buf[s.l_buf + lx];
            lx++;
            if (dist === 0) {
              send_code(s, lc, ltree);
            } else {
              code = _length_code[lc];
              send_code(s, code + LITERALS + 1, ltree);
              extra = extra_lbits[code];
              if (extra !== 0) {
                lc -= base_length[code];
                send_bits(s, lc, extra);
              }
              dist--;
              code = d_code(dist);
              send_code(s, code, dtree);
              extra = extra_dbits[code];
              if (extra !== 0) {
                dist -= base_dist[code];
                send_bits(s, dist, extra);
              }
            }
          } while (lx < s.last_lit);
        }
        send_code(s, END_BLOCK, ltree);
      }
      function build_tree(s, desc) {
        var tree = desc.dyn_tree;
        var stree = desc.stat_desc.static_tree;
        var has_stree = desc.stat_desc.has_stree;
        var elems = desc.stat_desc.elems;
        var n, m;
        var max_code = -1;
        var node;
        s.heap_len = 0;
        s.heap_max = HEAP_SIZE;
        for (n = 0; n < elems; n++) {
          if (tree[n * 2] !== 0) {
            s.heap[++s.heap_len] = max_code = n;
            s.depth[n] = 0;
          } else {
            tree[n * 2 + 1] = 0;
          }
        }
        while (s.heap_len < 2) {
          node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
          tree[node * 2] = 1;
          s.depth[node] = 0;
          s.opt_len--;
          if (has_stree) {
            s.static_len -= stree[node * 2 + 1];
          }
        }
        desc.max_code = max_code;
        for (n = s.heap_len >> 1; n >= 1; n--) {
          pqdownheap(s, tree, n);
        }
        node = elems;
        do {
          n = s.heap[
            1
            /*SMALLEST*/
          ];
          s.heap[
            1
            /*SMALLEST*/
          ] = s.heap[s.heap_len--];
          pqdownheap(
            s,
            tree,
            1
            /*SMALLEST*/
          );
          m = s.heap[
            1
            /*SMALLEST*/
          ];
          s.heap[--s.heap_max] = n;
          s.heap[--s.heap_max] = m;
          tree[node * 2] = tree[n * 2] + tree[m * 2];
          s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
          tree[n * 2 + 1] = tree[m * 2 + 1] = node;
          s.heap[
            1
            /*SMALLEST*/
          ] = node++;
          pqdownheap(
            s,
            tree,
            1
            /*SMALLEST*/
          );
        } while (s.heap_len >= 2);
        s.heap[--s.heap_max] = s.heap[
          1
          /*SMALLEST*/
        ];
        gen_bitlen(s, desc);
        gen_codes(tree, max_code, s.bl_count);
      }
      function scan_tree(s, tree, max_code) {
        var n;
        var prevlen = -1;
        var curlen;
        var nextlen = tree[0 * 2 + 1];
        var count = 0;
        var max_count = 7;
        var min_count = 4;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        }
        tree[(max_code + 1) * 2 + 1] = 65535;
        for (n = 0; n <= max_code; n++) {
          curlen = nextlen;
          nextlen = tree[(n + 1) * 2 + 1];
          if (++count < max_count && curlen === nextlen) {
            continue;
          } else if (count < min_count) {
            s.bl_tree[curlen * 2] += count;
          } else if (curlen !== 0) {
            if (curlen !== prevlen) {
              s.bl_tree[curlen * 2]++;
            }
            s.bl_tree[REP_3_6 * 2]++;
          } else if (count <= 10) {
            s.bl_tree[REPZ_3_10 * 2]++;
          } else {
            s.bl_tree[REPZ_11_138 * 2]++;
          }
          count = 0;
          prevlen = curlen;
          if (nextlen === 0) {
            max_count = 138;
            min_count = 3;
          } else if (curlen === nextlen) {
            max_count = 6;
            min_count = 3;
          } else {
            max_count = 7;
            min_count = 4;
          }
        }
      }
      function send_tree(s, tree, max_code) {
        var n;
        var prevlen = -1;
        var curlen;
        var nextlen = tree[0 * 2 + 1];
        var count = 0;
        var max_count = 7;
        var min_count = 4;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        }
        for (n = 0; n <= max_code; n++) {
          curlen = nextlen;
          nextlen = tree[(n + 1) * 2 + 1];
          if (++count < max_count && curlen === nextlen) {
            continue;
          } else if (count < min_count) {
            do {
              send_code(s, curlen, s.bl_tree);
            } while (--count !== 0);
          } else if (curlen !== 0) {
            if (curlen !== prevlen) {
              send_code(s, curlen, s.bl_tree);
              count--;
            }
            send_code(s, REP_3_6, s.bl_tree);
            send_bits(s, count - 3, 2);
          } else if (count <= 10) {
            send_code(s, REPZ_3_10, s.bl_tree);
            send_bits(s, count - 3, 3);
          } else {
            send_code(s, REPZ_11_138, s.bl_tree);
            send_bits(s, count - 11, 7);
          }
          count = 0;
          prevlen = curlen;
          if (nextlen === 0) {
            max_count = 138;
            min_count = 3;
          } else if (curlen === nextlen) {
            max_count = 6;
            min_count = 3;
          } else {
            max_count = 7;
            min_count = 4;
          }
        }
      }
      function build_bl_tree(s) {
        var max_blindex;
        scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
        scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
        build_tree(s, s.bl_desc);
        for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
          if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
            break;
          }
        }
        s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
        return max_blindex;
      }
      function send_all_trees(s, lcodes, dcodes, blcodes) {
        var rank;
        send_bits(s, lcodes - 257, 5);
        send_bits(s, dcodes - 1, 5);
        send_bits(s, blcodes - 4, 4);
        for (rank = 0; rank < blcodes; rank++) {
          send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3);
        }
        send_tree(s, s.dyn_ltree, lcodes - 1);
        send_tree(s, s.dyn_dtree, dcodes - 1);
      }
      function detect_data_type(s) {
        var black_mask = 4093624447;
        var n;
        for (n = 0; n <= 31; n++, black_mask >>>= 1) {
          if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
            return Z_BINARY;
          }
        }
        if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
          return Z_TEXT;
        }
        for (n = 32; n < LITERALS; n++) {
          if (s.dyn_ltree[n * 2] !== 0) {
            return Z_TEXT;
          }
        }
        return Z_BINARY;
      }
      var static_init_done = false;
      function _tr_init(s) {
        if (!static_init_done) {
          tr_static_init();
          static_init_done = true;
        }
        s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
        s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
        s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
        s.bi_buf = 0;
        s.bi_valid = 0;
        init_block(s);
      }
      function _tr_stored_block(s, buf, stored_len, last) {
        send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
        copy_block(s, buf, stored_len, true);
      }
      function _tr_align(s) {
        send_bits(s, STATIC_TREES << 1, 3);
        send_code(s, END_BLOCK, static_ltree);
        bi_flush(s);
      }
      function _tr_flush_block(s, buf, stored_len, last) {
        var opt_lenb, static_lenb;
        var max_blindex = 0;
        if (s.level > 0) {
          if (s.strm.data_type === Z_UNKNOWN) {
            s.strm.data_type = detect_data_type(s);
          }
          build_tree(s, s.l_desc);
          build_tree(s, s.d_desc);
          max_blindex = build_bl_tree(s);
          opt_lenb = s.opt_len + 3 + 7 >>> 3;
          static_lenb = s.static_len + 3 + 7 >>> 3;
          if (static_lenb <= opt_lenb) {
            opt_lenb = static_lenb;
          }
        } else {
          opt_lenb = static_lenb = stored_len + 5;
        }
        if (stored_len + 4 <= opt_lenb && buf !== -1) {
          _tr_stored_block(s, buf, stored_len, last);
        } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
          send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
          compress_block(s, static_ltree, static_dtree);
        } else {
          send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
          send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
          compress_block(s, s.dyn_ltree, s.dyn_dtree);
        }
        init_block(s);
        if (last) {
          bi_windup(s);
        }
      }
      function _tr_tally(s, dist, lc) {
        s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 255;
        s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 255;
        s.pending_buf[s.l_buf + s.last_lit] = lc & 255;
        s.last_lit++;
        if (dist === 0) {
          s.dyn_ltree[lc * 2]++;
        } else {
          s.matches++;
          dist--;
          s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
          s.dyn_dtree[d_code(dist) * 2]++;
        }
        return s.last_lit === s.lit_bufsize - 1;
      }
      exports._tr_init = _tr_init;
      exports._tr_stored_block = _tr_stored_block;
      exports._tr_flush_block = _tr_flush_block;
      exports._tr_tally = _tr_tally;
      exports._tr_align = _tr_align;
    }
  });

  // node_modules/pako/lib/zlib/adler32.js
  var require_adler32 = __commonJS({
    "node_modules/pako/lib/zlib/adler32.js"(exports, module) {
      "use strict";
      init_browser_shims();
      function adler32(adler, buf, len, pos) {
        var s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
        while (len !== 0) {
          n = len > 2e3 ? 2e3 : len;
          len -= n;
          do {
            s1 = s1 + buf[pos++] | 0;
            s2 = s2 + s1 | 0;
          } while (--n);
          s1 %= 65521;
          s2 %= 65521;
        }
        return s1 | s2 << 16 | 0;
      }
      module.exports = adler32;
    }
  });

  // node_modules/pako/lib/zlib/crc32.js
  var require_crc32 = __commonJS({
    "node_modules/pako/lib/zlib/crc32.js"(exports, module) {
      "use strict";
      init_browser_shims();
      function makeTable() {
        var c, table = [];
        for (var n = 0; n < 256; n++) {
          c = n;
          for (var k = 0; k < 8; k++) {
            c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
          }
          table[n] = c;
        }
        return table;
      }
      var crcTable = makeTable();
      function crc32(crc, buf, len, pos) {
        var t = crcTable, end = pos + len;
        crc ^= -1;
        for (var i = pos; i < end; i++) {
          crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
        }
        return crc ^ -1;
      }
      module.exports = crc32;
    }
  });

  // node_modules/pako/lib/zlib/messages.js
  var require_messages = __commonJS({
    "node_modules/pako/lib/zlib/messages.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = {
        2: "need dictionary",
        /* Z_NEED_DICT       2  */
        1: "stream end",
        /* Z_STREAM_END      1  */
        0: "",
        /* Z_OK              0  */
        "-1": "file error",
        /* Z_ERRNO         (-1) */
        "-2": "stream error",
        /* Z_STREAM_ERROR  (-2) */
        "-3": "data error",
        /* Z_DATA_ERROR    (-3) */
        "-4": "insufficient memory",
        /* Z_MEM_ERROR     (-4) */
        "-5": "buffer error",
        /* Z_BUF_ERROR     (-5) */
        "-6": "incompatible version"
        /* Z_VERSION_ERROR (-6) */
      };
    }
  });

  // node_modules/pako/lib/zlib/deflate.js
  var require_deflate = __commonJS({
    "node_modules/pako/lib/zlib/deflate.js"(exports) {
      "use strict";
      init_browser_shims();
      var utils = require_common();
      var trees = require_trees();
      var adler32 = require_adler32();
      var crc32 = require_crc32();
      var msg = require_messages();
      var Z_NO_FLUSH = 0;
      var Z_PARTIAL_FLUSH = 1;
      var Z_FULL_FLUSH = 3;
      var Z_FINISH = 4;
      var Z_BLOCK = 5;
      var Z_OK = 0;
      var Z_STREAM_END = 1;
      var Z_STREAM_ERROR = -2;
      var Z_DATA_ERROR = -3;
      var Z_BUF_ERROR = -5;
      var Z_DEFAULT_COMPRESSION = -1;
      var Z_FILTERED = 1;
      var Z_HUFFMAN_ONLY = 2;
      var Z_RLE = 3;
      var Z_FIXED = 4;
      var Z_DEFAULT_STRATEGY = 0;
      var Z_UNKNOWN = 2;
      var Z_DEFLATED = 8;
      var MAX_MEM_LEVEL = 9;
      var MAX_WBITS = 15;
      var DEF_MEM_LEVEL = 8;
      var LENGTH_CODES = 29;
      var LITERALS = 256;
      var L_CODES = LITERALS + 1 + LENGTH_CODES;
      var D_CODES = 30;
      var BL_CODES = 19;
      var HEAP_SIZE = 2 * L_CODES + 1;
      var MAX_BITS = 15;
      var MIN_MATCH = 3;
      var MAX_MATCH = 258;
      var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
      var PRESET_DICT = 32;
      var INIT_STATE = 42;
      var EXTRA_STATE = 69;
      var NAME_STATE = 73;
      var COMMENT_STATE = 91;
      var HCRC_STATE = 103;
      var BUSY_STATE = 113;
      var FINISH_STATE = 666;
      var BS_NEED_MORE = 1;
      var BS_BLOCK_DONE = 2;
      var BS_FINISH_STARTED = 3;
      var BS_FINISH_DONE = 4;
      var OS_CODE = 3;
      function err(strm, errorCode) {
        strm.msg = msg[errorCode];
        return errorCode;
      }
      function rank(f) {
        return (f << 1) - (f > 4 ? 9 : 0);
      }
      function zero(buf) {
        var len = buf.length;
        while (--len >= 0) {
          buf[len] = 0;
        }
      }
      function flush_pending(strm) {
        var s = strm.state;
        var len = s.pending;
        if (len > strm.avail_out) {
          len = strm.avail_out;
        }
        if (len === 0) {
          return;
        }
        utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
        strm.next_out += len;
        s.pending_out += len;
        strm.total_out += len;
        strm.avail_out -= len;
        s.pending -= len;
        if (s.pending === 0) {
          s.pending_out = 0;
        }
      }
      function flush_block_only(s, last) {
        trees._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
        s.block_start = s.strstart;
        flush_pending(s.strm);
      }
      function put_byte(s, b) {
        s.pending_buf[s.pending++] = b;
      }
      function putShortMSB(s, b) {
        s.pending_buf[s.pending++] = b >>> 8 & 255;
        s.pending_buf[s.pending++] = b & 255;
      }
      function read_buf(strm, buf, start, size) {
        var len = strm.avail_in;
        if (len > size) {
          len = size;
        }
        if (len === 0) {
          return 0;
        }
        strm.avail_in -= len;
        utils.arraySet(buf, strm.input, strm.next_in, len, start);
        if (strm.state.wrap === 1) {
          strm.adler = adler32(strm.adler, buf, len, start);
        } else if (strm.state.wrap === 2) {
          strm.adler = crc32(strm.adler, buf, len, start);
        }
        strm.next_in += len;
        strm.total_in += len;
        return len;
      }
      function longest_match(s, cur_match) {
        var chain_length = s.max_chain_length;
        var scan = s.strstart;
        var match;
        var len;
        var best_len = s.prev_length;
        var nice_match = s.nice_match;
        var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
        var _win = s.window;
        var wmask = s.w_mask;
        var prev = s.prev;
        var strend = s.strstart + MAX_MATCH;
        var scan_end1 = _win[scan + best_len - 1];
        var scan_end = _win[scan + best_len];
        if (s.prev_length >= s.good_match) {
          chain_length >>= 2;
        }
        if (nice_match > s.lookahead) {
          nice_match = s.lookahead;
        }
        do {
          match = cur_match;
          if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
            continue;
          }
          scan += 2;
          match++;
          do {
          } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
          len = MAX_MATCH - (strend - scan);
          scan = strend - MAX_MATCH;
          if (len > best_len) {
            s.match_start = cur_match;
            best_len = len;
            if (len >= nice_match) {
              break;
            }
            scan_end1 = _win[scan + best_len - 1];
            scan_end = _win[scan + best_len];
          }
        } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
        if (best_len <= s.lookahead) {
          return best_len;
        }
        return s.lookahead;
      }
      function fill_window(s) {
        var _w_size = s.w_size;
        var p, n, m, more, str;
        do {
          more = s.window_size - s.lookahead - s.strstart;
          if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
            utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
            s.match_start -= _w_size;
            s.strstart -= _w_size;
            s.block_start -= _w_size;
            n = s.hash_size;
            p = n;
            do {
              m = s.head[--p];
              s.head[p] = m >= _w_size ? m - _w_size : 0;
            } while (--n);
            n = _w_size;
            p = n;
            do {
              m = s.prev[--p];
              s.prev[p] = m >= _w_size ? m - _w_size : 0;
            } while (--n);
            more += _w_size;
          }
          if (s.strm.avail_in === 0) {
            break;
          }
          n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
          s.lookahead += n;
          if (s.lookahead + s.insert >= MIN_MATCH) {
            str = s.strstart - s.insert;
            s.ins_h = s.window[str];
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
            while (s.insert) {
              s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
              s.prev[str & s.w_mask] = s.head[s.ins_h];
              s.head[s.ins_h] = str;
              str++;
              s.insert--;
              if (s.lookahead + s.insert < MIN_MATCH) {
                break;
              }
            }
          }
        } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
      }
      function deflate_stored(s, flush) {
        var max_block_size = 65535;
        if (max_block_size > s.pending_buf_size - 5) {
          max_block_size = s.pending_buf_size - 5;
        }
        for (; ; ) {
          if (s.lookahead <= 1) {
            fill_window(s);
            if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }
            if (s.lookahead === 0) {
              break;
            }
          }
          s.strstart += s.lookahead;
          s.lookahead = 0;
          var max_start = s.block_start + max_block_size;
          if (s.strstart === 0 || s.strstart >= max_start) {
            s.lookahead = s.strstart - max_start;
            s.strstart = max_start;
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          }
          if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          }
        }
        s.insert = 0;
        if (flush === Z_FINISH) {
          flush_block_only(s, true);
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED;
          }
          return BS_FINISH_DONE;
        }
        if (s.strstart > s.block_start) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
        return BS_NEED_MORE;
      }
      function deflate_fast(s, flush) {
        var hash_head;
        var bflush;
        for (; ; ) {
          if (s.lookahead < MIN_LOOKAHEAD) {
            fill_window(s);
            if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }
            if (s.lookahead === 0) {
              break;
            }
          }
          hash_head = 0;
          if (s.lookahead >= MIN_MATCH) {
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          }
          if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
            s.match_length = longest_match(s, hash_head);
          }
          if (s.match_length >= MIN_MATCH) {
            bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
            s.lookahead -= s.match_length;
            if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
              s.match_length--;
              do {
                s.strstart++;
                s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                s.head[s.ins_h] = s.strstart;
              } while (--s.match_length !== 0);
              s.strstart++;
            } else {
              s.strstart += s.match_length;
              s.match_length = 0;
              s.ins_h = s.window[s.strstart];
              s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
            }
          } else {
            bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
            s.lookahead--;
            s.strstart++;
          }
          if (bflush) {
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          }
        }
        s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
        if (flush === Z_FINISH) {
          flush_block_only(s, true);
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED;
          }
          return BS_FINISH_DONE;
        }
        if (s.last_lit) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
        return BS_BLOCK_DONE;
      }
      function deflate_slow(s, flush) {
        var hash_head;
        var bflush;
        var max_insert;
        for (; ; ) {
          if (s.lookahead < MIN_LOOKAHEAD) {
            fill_window(s);
            if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }
            if (s.lookahead === 0) {
              break;
            }
          }
          hash_head = 0;
          if (s.lookahead >= MIN_MATCH) {
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          }
          s.prev_length = s.match_length;
          s.prev_match = s.match_start;
          s.match_length = MIN_MATCH - 1;
          if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
            s.match_length = longest_match(s, hash_head);
            if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
              s.match_length = MIN_MATCH - 1;
            }
          }
          if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
            max_insert = s.strstart + s.lookahead - MIN_MATCH;
            bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
            s.lookahead -= s.prev_length - 1;
            s.prev_length -= 2;
            do {
              if (++s.strstart <= max_insert) {
                s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                s.head[s.ins_h] = s.strstart;
              }
            } while (--s.prev_length !== 0);
            s.match_available = 0;
            s.match_length = MIN_MATCH - 1;
            s.strstart++;
            if (bflush) {
              flush_block_only(s, false);
              if (s.strm.avail_out === 0) {
                return BS_NEED_MORE;
              }
            }
          } else if (s.match_available) {
            bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
            if (bflush) {
              flush_block_only(s, false);
            }
            s.strstart++;
            s.lookahead--;
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          } else {
            s.match_available = 1;
            s.strstart++;
            s.lookahead--;
          }
        }
        if (s.match_available) {
          bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
          s.match_available = 0;
        }
        s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
        if (flush === Z_FINISH) {
          flush_block_only(s, true);
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED;
          }
          return BS_FINISH_DONE;
        }
        if (s.last_lit) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
        return BS_BLOCK_DONE;
      }
      function deflate_rle(s, flush) {
        var bflush;
        var prev;
        var scan, strend;
        var _win = s.window;
        for (; ; ) {
          if (s.lookahead <= MAX_MATCH) {
            fill_window(s);
            if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }
            if (s.lookahead === 0) {
              break;
            }
          }
          s.match_length = 0;
          if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
            scan = s.strstart - 1;
            prev = _win[scan];
            if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
              strend = s.strstart + MAX_MATCH;
              do {
              } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
              s.match_length = MAX_MATCH - (strend - scan);
              if (s.match_length > s.lookahead) {
                s.match_length = s.lookahead;
              }
            }
          }
          if (s.match_length >= MIN_MATCH) {
            bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);
            s.lookahead -= s.match_length;
            s.strstart += s.match_length;
            s.match_length = 0;
          } else {
            bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
            s.lookahead--;
            s.strstart++;
          }
          if (bflush) {
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          }
        }
        s.insert = 0;
        if (flush === Z_FINISH) {
          flush_block_only(s, true);
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED;
          }
          return BS_FINISH_DONE;
        }
        if (s.last_lit) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
        return BS_BLOCK_DONE;
      }
      function deflate_huff(s, flush) {
        var bflush;
        for (; ; ) {
          if (s.lookahead === 0) {
            fill_window(s);
            if (s.lookahead === 0) {
              if (flush === Z_NO_FLUSH) {
                return BS_NEED_MORE;
              }
              break;
            }
          }
          s.match_length = 0;
          bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
          if (bflush) {
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          }
        }
        s.insert = 0;
        if (flush === Z_FINISH) {
          flush_block_only(s, true);
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED;
          }
          return BS_FINISH_DONE;
        }
        if (s.last_lit) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
        return BS_BLOCK_DONE;
      }
      function Config(good_length, max_lazy, nice_length, max_chain, func) {
        this.good_length = good_length;
        this.max_lazy = max_lazy;
        this.nice_length = nice_length;
        this.max_chain = max_chain;
        this.func = func;
      }
      var configuration_table;
      configuration_table = [
        /*      good lazy nice chain */
        new Config(0, 0, 0, 0, deflate_stored),
        /* 0 store only */
        new Config(4, 4, 8, 4, deflate_fast),
        /* 1 max speed, no lazy matches */
        new Config(4, 5, 16, 8, deflate_fast),
        /* 2 */
        new Config(4, 6, 32, 32, deflate_fast),
        /* 3 */
        new Config(4, 4, 16, 16, deflate_slow),
        /* 4 lazy matches */
        new Config(8, 16, 32, 32, deflate_slow),
        /* 5 */
        new Config(8, 16, 128, 128, deflate_slow),
        /* 6 */
        new Config(8, 32, 128, 256, deflate_slow),
        /* 7 */
        new Config(32, 128, 258, 1024, deflate_slow),
        /* 8 */
        new Config(32, 258, 258, 4096, deflate_slow)
        /* 9 max compression */
      ];
      function lm_init(s) {
        s.window_size = 2 * s.w_size;
        zero(s.head);
        s.max_lazy_match = configuration_table[s.level].max_lazy;
        s.good_match = configuration_table[s.level].good_length;
        s.nice_match = configuration_table[s.level].nice_length;
        s.max_chain_length = configuration_table[s.level].max_chain;
        s.strstart = 0;
        s.block_start = 0;
        s.lookahead = 0;
        s.insert = 0;
        s.match_length = s.prev_length = MIN_MATCH - 1;
        s.match_available = 0;
        s.ins_h = 0;
      }
      function DeflateState() {
        this.strm = null;
        this.status = 0;
        this.pending_buf = null;
        this.pending_buf_size = 0;
        this.pending_out = 0;
        this.pending = 0;
        this.wrap = 0;
        this.gzhead = null;
        this.gzindex = 0;
        this.method = Z_DEFLATED;
        this.last_flush = -1;
        this.w_size = 0;
        this.w_bits = 0;
        this.w_mask = 0;
        this.window = null;
        this.window_size = 0;
        this.prev = null;
        this.head = null;
        this.ins_h = 0;
        this.hash_size = 0;
        this.hash_bits = 0;
        this.hash_mask = 0;
        this.hash_shift = 0;
        this.block_start = 0;
        this.match_length = 0;
        this.prev_match = 0;
        this.match_available = 0;
        this.strstart = 0;
        this.match_start = 0;
        this.lookahead = 0;
        this.prev_length = 0;
        this.max_chain_length = 0;
        this.max_lazy_match = 0;
        this.level = 0;
        this.strategy = 0;
        this.good_match = 0;
        this.nice_match = 0;
        this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2);
        this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2);
        this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2);
        zero(this.dyn_ltree);
        zero(this.dyn_dtree);
        zero(this.bl_tree);
        this.l_desc = null;
        this.d_desc = null;
        this.bl_desc = null;
        this.bl_count = new utils.Buf16(MAX_BITS + 1);
        this.heap = new utils.Buf16(2 * L_CODES + 1);
        zero(this.heap);
        this.heap_len = 0;
        this.heap_max = 0;
        this.depth = new utils.Buf16(2 * L_CODES + 1);
        zero(this.depth);
        this.l_buf = 0;
        this.lit_bufsize = 0;
        this.last_lit = 0;
        this.d_buf = 0;
        this.opt_len = 0;
        this.static_len = 0;
        this.matches = 0;
        this.insert = 0;
        this.bi_buf = 0;
        this.bi_valid = 0;
      }
      function deflateResetKeep(strm) {
        var s;
        if (!strm || !strm.state) {
          return err(strm, Z_STREAM_ERROR);
        }
        strm.total_in = strm.total_out = 0;
        strm.data_type = Z_UNKNOWN;
        s = strm.state;
        s.pending = 0;
        s.pending_out = 0;
        if (s.wrap < 0) {
          s.wrap = -s.wrap;
        }
        s.status = s.wrap ? INIT_STATE : BUSY_STATE;
        strm.adler = s.wrap === 2 ? 0 : 1;
        s.last_flush = Z_NO_FLUSH;
        trees._tr_init(s);
        return Z_OK;
      }
      function deflateReset(strm) {
        var ret = deflateResetKeep(strm);
        if (ret === Z_OK) {
          lm_init(strm.state);
        }
        return ret;
      }
      function deflateSetHeader(strm, head) {
        if (!strm || !strm.state) {
          return Z_STREAM_ERROR;
        }
        if (strm.state.wrap !== 2) {
          return Z_STREAM_ERROR;
        }
        strm.state.gzhead = head;
        return Z_OK;
      }
      function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
        if (!strm) {
          return Z_STREAM_ERROR;
        }
        var wrap = 1;
        if (level === Z_DEFAULT_COMPRESSION) {
          level = 6;
        }
        if (windowBits < 0) {
          wrap = 0;
          windowBits = -windowBits;
        } else if (windowBits > 15) {
          wrap = 2;
          windowBits -= 16;
        }
        if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED) {
          return err(strm, Z_STREAM_ERROR);
        }
        if (windowBits === 8) {
          windowBits = 9;
        }
        var s = new DeflateState();
        strm.state = s;
        s.strm = strm;
        s.wrap = wrap;
        s.gzhead = null;
        s.w_bits = windowBits;
        s.w_size = 1 << s.w_bits;
        s.w_mask = s.w_size - 1;
        s.hash_bits = memLevel + 7;
        s.hash_size = 1 << s.hash_bits;
        s.hash_mask = s.hash_size - 1;
        s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
        s.window = new utils.Buf8(s.w_size * 2);
        s.head = new utils.Buf16(s.hash_size);
        s.prev = new utils.Buf16(s.w_size);
        s.lit_bufsize = 1 << memLevel + 6;
        s.pending_buf_size = s.lit_bufsize * 4;
        s.pending_buf = new utils.Buf8(s.pending_buf_size);
        s.d_buf = 1 * s.lit_bufsize;
        s.l_buf = (1 + 2) * s.lit_bufsize;
        s.level = level;
        s.strategy = strategy;
        s.method = method;
        return deflateReset(strm);
      }
      function deflateInit(strm, level) {
        return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
      }
      function deflate(strm, flush) {
        var old_flush, s;
        var beg, val;
        if (!strm || !strm.state || flush > Z_BLOCK || flush < 0) {
          return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
        }
        s = strm.state;
        if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH) {
          return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
        }
        s.strm = strm;
        old_flush = s.last_flush;
        s.last_flush = flush;
        if (s.status === INIT_STATE) {
          if (s.wrap === 2) {
            strm.adler = 0;
            put_byte(s, 31);
            put_byte(s, 139);
            put_byte(s, 8);
            if (!s.gzhead) {
              put_byte(s, 0);
              put_byte(s, 0);
              put_byte(s, 0);
              put_byte(s, 0);
              put_byte(s, 0);
              put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
              put_byte(s, OS_CODE);
              s.status = BUSY_STATE;
            } else {
              put_byte(
                s,
                (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16)
              );
              put_byte(s, s.gzhead.time & 255);
              put_byte(s, s.gzhead.time >> 8 & 255);
              put_byte(s, s.gzhead.time >> 16 & 255);
              put_byte(s, s.gzhead.time >> 24 & 255);
              put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
              put_byte(s, s.gzhead.os & 255);
              if (s.gzhead.extra && s.gzhead.extra.length) {
                put_byte(s, s.gzhead.extra.length & 255);
                put_byte(s, s.gzhead.extra.length >> 8 & 255);
              }
              if (s.gzhead.hcrc) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
              }
              s.gzindex = 0;
              s.status = EXTRA_STATE;
            }
          } else {
            var header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
            var level_flags = -1;
            if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
              level_flags = 0;
            } else if (s.level < 6) {
              level_flags = 1;
            } else if (s.level === 6) {
              level_flags = 2;
            } else {
              level_flags = 3;
            }
            header |= level_flags << 6;
            if (s.strstart !== 0) {
              header |= PRESET_DICT;
            }
            header += 31 - header % 31;
            s.status = BUSY_STATE;
            putShortMSB(s, header);
            if (s.strstart !== 0) {
              putShortMSB(s, strm.adler >>> 16);
              putShortMSB(s, strm.adler & 65535);
            }
            strm.adler = 1;
          }
        }
        if (s.status === EXTRA_STATE) {
          if (s.gzhead.extra) {
            beg = s.pending;
            while (s.gzindex < (s.gzhead.extra.length & 65535)) {
              if (s.pending === s.pending_buf_size) {
                if (s.gzhead.hcrc && s.pending > beg) {
                  strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
                }
                flush_pending(strm);
                beg = s.pending;
                if (s.pending === s.pending_buf_size) {
                  break;
                }
              }
              put_byte(s, s.gzhead.extra[s.gzindex] & 255);
              s.gzindex++;
            }
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            if (s.gzindex === s.gzhead.extra.length) {
              s.gzindex = 0;
              s.status = NAME_STATE;
            }
          } else {
            s.status = NAME_STATE;
          }
        }
        if (s.status === NAME_STATE) {
          if (s.gzhead.name) {
            beg = s.pending;
            do {
              if (s.pending === s.pending_buf_size) {
                if (s.gzhead.hcrc && s.pending > beg) {
                  strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
                }
                flush_pending(strm);
                beg = s.pending;
                if (s.pending === s.pending_buf_size) {
                  val = 1;
                  break;
                }
              }
              if (s.gzindex < s.gzhead.name.length) {
                val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
              } else {
                val = 0;
              }
              put_byte(s, val);
            } while (val !== 0);
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            if (val === 0) {
              s.gzindex = 0;
              s.status = COMMENT_STATE;
            }
          } else {
            s.status = COMMENT_STATE;
          }
        }
        if (s.status === COMMENT_STATE) {
          if (s.gzhead.comment) {
            beg = s.pending;
            do {
              if (s.pending === s.pending_buf_size) {
                if (s.gzhead.hcrc && s.pending > beg) {
                  strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
                }
                flush_pending(strm);
                beg = s.pending;
                if (s.pending === s.pending_buf_size) {
                  val = 1;
                  break;
                }
              }
              if (s.gzindex < s.gzhead.comment.length) {
                val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
              } else {
                val = 0;
              }
              put_byte(s, val);
            } while (val !== 0);
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            if (val === 0) {
              s.status = HCRC_STATE;
            }
          } else {
            s.status = HCRC_STATE;
          }
        }
        if (s.status === HCRC_STATE) {
          if (s.gzhead.hcrc) {
            if (s.pending + 2 > s.pending_buf_size) {
              flush_pending(strm);
            }
            if (s.pending + 2 <= s.pending_buf_size) {
              put_byte(s, strm.adler & 255);
              put_byte(s, strm.adler >> 8 & 255);
              strm.adler = 0;
              s.status = BUSY_STATE;
            }
          } else {
            s.status = BUSY_STATE;
          }
        }
        if (s.pending !== 0) {
          flush_pending(strm);
          if (strm.avail_out === 0) {
            s.last_flush = -1;
            return Z_OK;
          }
        } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) {
          return err(strm, Z_BUF_ERROR);
        }
        if (s.status === FINISH_STATE && strm.avail_in !== 0) {
          return err(strm, Z_BUF_ERROR);
        }
        if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
          var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
          if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
            s.status = FINISH_STATE;
          }
          if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
            if (strm.avail_out === 0) {
              s.last_flush = -1;
            }
            return Z_OK;
          }
          if (bstate === BS_BLOCK_DONE) {
            if (flush === Z_PARTIAL_FLUSH) {
              trees._tr_align(s);
            } else if (flush !== Z_BLOCK) {
              trees._tr_stored_block(s, 0, 0, false);
              if (flush === Z_FULL_FLUSH) {
                zero(s.head);
                if (s.lookahead === 0) {
                  s.strstart = 0;
                  s.block_start = 0;
                  s.insert = 0;
                }
              }
            }
            flush_pending(strm);
            if (strm.avail_out === 0) {
              s.last_flush = -1;
              return Z_OK;
            }
          }
        }
        if (flush !== Z_FINISH) {
          return Z_OK;
        }
        if (s.wrap <= 0) {
          return Z_STREAM_END;
        }
        if (s.wrap === 2) {
          put_byte(s, strm.adler & 255);
          put_byte(s, strm.adler >> 8 & 255);
          put_byte(s, strm.adler >> 16 & 255);
          put_byte(s, strm.adler >> 24 & 255);
          put_byte(s, strm.total_in & 255);
          put_byte(s, strm.total_in >> 8 & 255);
          put_byte(s, strm.total_in >> 16 & 255);
          put_byte(s, strm.total_in >> 24 & 255);
        } else {
          putShortMSB(s, strm.adler >>> 16);
          putShortMSB(s, strm.adler & 65535);
        }
        flush_pending(strm);
        if (s.wrap > 0) {
          s.wrap = -s.wrap;
        }
        return s.pending !== 0 ? Z_OK : Z_STREAM_END;
      }
      function deflateEnd(strm) {
        var status;
        if (!strm || !strm.state) {
          return Z_STREAM_ERROR;
        }
        status = strm.state.status;
        if (status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE) {
          return err(strm, Z_STREAM_ERROR);
        }
        strm.state = null;
        return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
      }
      function deflateSetDictionary(strm, dictionary) {
        var dictLength = dictionary.length;
        var s;
        var str, n;
        var wrap;
        var avail;
        var next;
        var input;
        var tmpDict;
        if (!strm || !strm.state) {
          return Z_STREAM_ERROR;
        }
        s = strm.state;
        wrap = s.wrap;
        if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
          return Z_STREAM_ERROR;
        }
        if (wrap === 1) {
          strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
        }
        s.wrap = 0;
        if (dictLength >= s.w_size) {
          if (wrap === 0) {
            zero(s.head);
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
          tmpDict = new utils.Buf8(s.w_size);
          utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
          dictionary = tmpDict;
          dictLength = s.w_size;
        }
        avail = strm.avail_in;
        next = strm.next_in;
        input = strm.input;
        strm.avail_in = dictLength;
        strm.next_in = 0;
        strm.input = dictionary;
        fill_window(s);
        while (s.lookahead >= MIN_MATCH) {
          str = s.strstart;
          n = s.lookahead - (MIN_MATCH - 1);
          do {
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
            s.prev[str & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = str;
            str++;
          } while (--n);
          s.strstart = str;
          s.lookahead = MIN_MATCH - 1;
          fill_window(s);
        }
        s.strstart += s.lookahead;
        s.block_start = s.strstart;
        s.insert = s.lookahead;
        s.lookahead = 0;
        s.match_length = s.prev_length = MIN_MATCH - 1;
        s.match_available = 0;
        strm.next_in = next;
        strm.input = input;
        strm.avail_in = avail;
        s.wrap = wrap;
        return Z_OK;
      }
      exports.deflateInit = deflateInit;
      exports.deflateInit2 = deflateInit2;
      exports.deflateReset = deflateReset;
      exports.deflateResetKeep = deflateResetKeep;
      exports.deflateSetHeader = deflateSetHeader;
      exports.deflate = deflate;
      exports.deflateEnd = deflateEnd;
      exports.deflateSetDictionary = deflateSetDictionary;
      exports.deflateInfo = "pako deflate (from Nodeca project)";
    }
  });

  // node_modules/pako/lib/zlib/inffast.js
  var require_inffast = __commonJS({
    "node_modules/pako/lib/zlib/inffast.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var BAD = 30;
      var TYPE = 12;
      module.exports = function inflate_fast(strm, start) {
        var state;
        var _in;
        var last;
        var _out;
        var beg;
        var end;
        var dmax;
        var wsize;
        var whave;
        var wnext;
        var s_window;
        var hold;
        var bits;
        var lcode;
        var dcode;
        var lmask;
        var dmask;
        var here;
        var op;
        var len;
        var dist;
        var from;
        var from_source;
        var input, output;
        state = strm.state;
        _in = strm.next_in;
        input = strm.input;
        last = _in + (strm.avail_in - 5);
        _out = strm.next_out;
        output = strm.output;
        beg = _out - (start - strm.avail_out);
        end = _out + (strm.avail_out - 257);
        dmax = state.dmax;
        wsize = state.wsize;
        whave = state.whave;
        wnext = state.wnext;
        s_window = state.window;
        hold = state.hold;
        bits = state.bits;
        lcode = state.lencode;
        dcode = state.distcode;
        lmask = (1 << state.lenbits) - 1;
        dmask = (1 << state.distbits) - 1;
        top:
          do {
            if (bits < 15) {
              hold += input[_in++] << bits;
              bits += 8;
              hold += input[_in++] << bits;
              bits += 8;
            }
            here = lcode[hold & lmask];
            dolen:
              for (; ; ) {
                op = here >>> 24;
                hold >>>= op;
                bits -= op;
                op = here >>> 16 & 255;
                if (op === 0) {
                  output[_out++] = here & 65535;
                } else if (op & 16) {
                  len = here & 65535;
                  op &= 15;
                  if (op) {
                    if (bits < op) {
                      hold += input[_in++] << bits;
                      bits += 8;
                    }
                    len += hold & (1 << op) - 1;
                    hold >>>= op;
                    bits -= op;
                  }
                  if (bits < 15) {
                    hold += input[_in++] << bits;
                    bits += 8;
                    hold += input[_in++] << bits;
                    bits += 8;
                  }
                  here = dcode[hold & dmask];
                  dodist:
                    for (; ; ) {
                      op = here >>> 24;
                      hold >>>= op;
                      bits -= op;
                      op = here >>> 16 & 255;
                      if (op & 16) {
                        dist = here & 65535;
                        op &= 15;
                        if (bits < op) {
                          hold += input[_in++] << bits;
                          bits += 8;
                          if (bits < op) {
                            hold += input[_in++] << bits;
                            bits += 8;
                          }
                        }
                        dist += hold & (1 << op) - 1;
                        if (dist > dmax) {
                          strm.msg = "invalid distance too far back";
                          state.mode = BAD;
                          break top;
                        }
                        hold >>>= op;
                        bits -= op;
                        op = _out - beg;
                        if (dist > op) {
                          op = dist - op;
                          if (op > whave) {
                            if (state.sane) {
                              strm.msg = "invalid distance too far back";
                              state.mode = BAD;
                              break top;
                            }
                          }
                          from = 0;
                          from_source = s_window;
                          if (wnext === 0) {
                            from += wsize - op;
                            if (op < len) {
                              len -= op;
                              do {
                                output[_out++] = s_window[from++];
                              } while (--op);
                              from = _out - dist;
                              from_source = output;
                            }
                          } else if (wnext < op) {
                            from += wsize + wnext - op;
                            op -= wnext;
                            if (op < len) {
                              len -= op;
                              do {
                                output[_out++] = s_window[from++];
                              } while (--op);
                              from = 0;
                              if (wnext < len) {
                                op = wnext;
                                len -= op;
                                do {
                                  output[_out++] = s_window[from++];
                                } while (--op);
                                from = _out - dist;
                                from_source = output;
                              }
                            }
                          } else {
                            from += wnext - op;
                            if (op < len) {
                              len -= op;
                              do {
                                output[_out++] = s_window[from++];
                              } while (--op);
                              from = _out - dist;
                              from_source = output;
                            }
                          }
                          while (len > 2) {
                            output[_out++] = from_source[from++];
                            output[_out++] = from_source[from++];
                            output[_out++] = from_source[from++];
                            len -= 3;
                          }
                          if (len) {
                            output[_out++] = from_source[from++];
                            if (len > 1) {
                              output[_out++] = from_source[from++];
                            }
                          }
                        } else {
                          from = _out - dist;
                          do {
                            output[_out++] = output[from++];
                            output[_out++] = output[from++];
                            output[_out++] = output[from++];
                            len -= 3;
                          } while (len > 2);
                          if (len) {
                            output[_out++] = output[from++];
                            if (len > 1) {
                              output[_out++] = output[from++];
                            }
                          }
                        }
                      } else if ((op & 64) === 0) {
                        here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                        continue dodist;
                      } else {
                        strm.msg = "invalid distance code";
                        state.mode = BAD;
                        break top;
                      }
                      break;
                    }
                } else if ((op & 64) === 0) {
                  here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
                  continue dolen;
                } else if (op & 32) {
                  state.mode = TYPE;
                  break top;
                } else {
                  strm.msg = "invalid literal/length code";
                  state.mode = BAD;
                  break top;
                }
                break;
              }
          } while (_in < last && _out < end);
        len = bits >> 3;
        _in -= len;
        bits -= len << 3;
        hold &= (1 << bits) - 1;
        strm.next_in = _in;
        strm.next_out = _out;
        strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
        strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
        state.hold = hold;
        state.bits = bits;
        return;
      };
    }
  });

  // node_modules/pako/lib/zlib/inftrees.js
  var require_inftrees = __commonJS({
    "node_modules/pako/lib/zlib/inftrees.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var utils = require_common();
      var MAXBITS = 15;
      var ENOUGH_LENS = 852;
      var ENOUGH_DISTS = 592;
      var CODES = 0;
      var LENS = 1;
      var DISTS = 2;
      var lbase = [
        /* Length codes 257..285 base */
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        13,
        15,
        17,
        19,
        23,
        27,
        31,
        35,
        43,
        51,
        59,
        67,
        83,
        99,
        115,
        131,
        163,
        195,
        227,
        258,
        0,
        0
      ];
      var lext = [
        /* Length codes 257..285 extra */
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        17,
        17,
        17,
        17,
        18,
        18,
        18,
        18,
        19,
        19,
        19,
        19,
        20,
        20,
        20,
        20,
        21,
        21,
        21,
        21,
        16,
        72,
        78
      ];
      var dbase = [
        /* Distance codes 0..29 base */
        1,
        2,
        3,
        4,
        5,
        7,
        9,
        13,
        17,
        25,
        33,
        49,
        65,
        97,
        129,
        193,
        257,
        385,
        513,
        769,
        1025,
        1537,
        2049,
        3073,
        4097,
        6145,
        8193,
        12289,
        16385,
        24577,
        0,
        0
      ];
      var dext = [
        /* Distance codes 0..29 extra */
        16,
        16,
        16,
        16,
        17,
        17,
        18,
        18,
        19,
        19,
        20,
        20,
        21,
        21,
        22,
        22,
        23,
        23,
        24,
        24,
        25,
        25,
        26,
        26,
        27,
        27,
        28,
        28,
        29,
        29,
        64,
        64
      ];
      module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
        var bits = opts.bits;
        var len = 0;
        var sym = 0;
        var min = 0, max = 0;
        var root = 0;
        var curr = 0;
        var drop = 0;
        var left = 0;
        var used = 0;
        var huff = 0;
        var incr;
        var fill;
        var low;
        var mask;
        var next;
        var base = null;
        var base_index = 0;
        var end;
        var count = new utils.Buf16(MAXBITS + 1);
        var offs = new utils.Buf16(MAXBITS + 1);
        var extra = null;
        var extra_index = 0;
        var here_bits, here_op, here_val;
        for (len = 0; len <= MAXBITS; len++) {
          count[len] = 0;
        }
        for (sym = 0; sym < codes; sym++) {
          count[lens[lens_index + sym]]++;
        }
        root = bits;
        for (max = MAXBITS; max >= 1; max--) {
          if (count[max] !== 0) {
            break;
          }
        }
        if (root > max) {
          root = max;
        }
        if (max === 0) {
          table[table_index++] = 1 << 24 | 64 << 16 | 0;
          table[table_index++] = 1 << 24 | 64 << 16 | 0;
          opts.bits = 1;
          return 0;
        }
        for (min = 1; min < max; min++) {
          if (count[min] !== 0) {
            break;
          }
        }
        if (root < min) {
          root = min;
        }
        left = 1;
        for (len = 1; len <= MAXBITS; len++) {
          left <<= 1;
          left -= count[len];
          if (left < 0) {
            return -1;
          }
        }
        if (left > 0 && (type === CODES || max !== 1)) {
          return -1;
        }
        offs[1] = 0;
        for (len = 1; len < MAXBITS; len++) {
          offs[len + 1] = offs[len] + count[len];
        }
        for (sym = 0; sym < codes; sym++) {
          if (lens[lens_index + sym] !== 0) {
            work[offs[lens[lens_index + sym]]++] = sym;
          }
        }
        if (type === CODES) {
          base = extra = work;
          end = 19;
        } else if (type === LENS) {
          base = lbase;
          base_index -= 257;
          extra = lext;
          extra_index -= 257;
          end = 256;
        } else {
          base = dbase;
          extra = dext;
          end = -1;
        }
        huff = 0;
        sym = 0;
        len = min;
        next = table_index;
        curr = root;
        drop = 0;
        low = -1;
        used = 1 << root;
        mask = used - 1;
        if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
          return 1;
        }
        for (; ; ) {
          here_bits = len - drop;
          if (work[sym] < end) {
            here_op = 0;
            here_val = work[sym];
          } else if (work[sym] > end) {
            here_op = extra[extra_index + work[sym]];
            here_val = base[base_index + work[sym]];
          } else {
            here_op = 32 + 64;
            here_val = 0;
          }
          incr = 1 << len - drop;
          fill = 1 << curr;
          min = fill;
          do {
            fill -= incr;
            table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
          } while (fill !== 0);
          incr = 1 << len - 1;
          while (huff & incr) {
            incr >>= 1;
          }
          if (incr !== 0) {
            huff &= incr - 1;
            huff += incr;
          } else {
            huff = 0;
          }
          sym++;
          if (--count[len] === 0) {
            if (len === max) {
              break;
            }
            len = lens[lens_index + work[sym]];
          }
          if (len > root && (huff & mask) !== low) {
            if (drop === 0) {
              drop = root;
            }
            next += min;
            curr = len - drop;
            left = 1 << curr;
            while (curr + drop < max) {
              left -= count[curr + drop];
              if (left <= 0) {
                break;
              }
              curr++;
              left <<= 1;
            }
            used += 1 << curr;
            if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
              return 1;
            }
            low = huff & mask;
            table[low] = root << 24 | curr << 16 | next - table_index | 0;
          }
        }
        if (huff !== 0) {
          table[next + huff] = len - drop << 24 | 64 << 16 | 0;
        }
        opts.bits = root;
        return 0;
      };
    }
  });

  // node_modules/pako/lib/zlib/inflate.js
  var require_inflate = __commonJS({
    "node_modules/pako/lib/zlib/inflate.js"(exports) {
      "use strict";
      init_browser_shims();
      var utils = require_common();
      var adler32 = require_adler32();
      var crc32 = require_crc32();
      var inflate_fast = require_inffast();
      var inflate_table = require_inftrees();
      var CODES = 0;
      var LENS = 1;
      var DISTS = 2;
      var Z_FINISH = 4;
      var Z_BLOCK = 5;
      var Z_TREES = 6;
      var Z_OK = 0;
      var Z_STREAM_END = 1;
      var Z_NEED_DICT = 2;
      var Z_STREAM_ERROR = -2;
      var Z_DATA_ERROR = -3;
      var Z_MEM_ERROR = -4;
      var Z_BUF_ERROR = -5;
      var Z_DEFLATED = 8;
      var HEAD = 1;
      var FLAGS = 2;
      var TIME = 3;
      var OS = 4;
      var EXLEN = 5;
      var EXTRA = 6;
      var NAME = 7;
      var COMMENT = 8;
      var HCRC = 9;
      var DICTID = 10;
      var DICT = 11;
      var TYPE = 12;
      var TYPEDO = 13;
      var STORED = 14;
      var COPY_ = 15;
      var COPY = 16;
      var TABLE = 17;
      var LENLENS = 18;
      var CODELENS = 19;
      var LEN_ = 20;
      var LEN = 21;
      var LENEXT = 22;
      var DIST = 23;
      var DISTEXT = 24;
      var MATCH = 25;
      var LIT = 26;
      var CHECK = 27;
      var LENGTH = 28;
      var DONE = 29;
      var BAD = 30;
      var MEM = 31;
      var SYNC = 32;
      var ENOUGH_LENS = 852;
      var ENOUGH_DISTS = 592;
      var MAX_WBITS = 15;
      var DEF_WBITS = MAX_WBITS;
      function zswap32(q) {
        return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
      }
      function InflateState() {
        this.mode = 0;
        this.last = false;
        this.wrap = 0;
        this.havedict = false;
        this.flags = 0;
        this.dmax = 0;
        this.check = 0;
        this.total = 0;
        this.head = null;
        this.wbits = 0;
        this.wsize = 0;
        this.whave = 0;
        this.wnext = 0;
        this.window = null;
        this.hold = 0;
        this.bits = 0;
        this.length = 0;
        this.offset = 0;
        this.extra = 0;
        this.lencode = null;
        this.distcode = null;
        this.lenbits = 0;
        this.distbits = 0;
        this.ncode = 0;
        this.nlen = 0;
        this.ndist = 0;
        this.have = 0;
        this.next = null;
        this.lens = new utils.Buf16(320);
        this.work = new utils.Buf16(288);
        this.lendyn = null;
        this.distdyn = null;
        this.sane = 0;
        this.back = 0;
        this.was = 0;
      }
      function inflateResetKeep(strm) {
        var state;
        if (!strm || !strm.state) {
          return Z_STREAM_ERROR;
        }
        state = strm.state;
        strm.total_in = strm.total_out = state.total = 0;
        strm.msg = "";
        if (state.wrap) {
          strm.adler = state.wrap & 1;
        }
        state.mode = HEAD;
        state.last = 0;
        state.havedict = 0;
        state.dmax = 32768;
        state.head = null;
        state.hold = 0;
        state.bits = 0;
        state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
        state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);
        state.sane = 1;
        state.back = -1;
        return Z_OK;
      }
      function inflateReset(strm) {
        var state;
        if (!strm || !strm.state) {
          return Z_STREAM_ERROR;
        }
        state = strm.state;
        state.wsize = 0;
        state.whave = 0;
        state.wnext = 0;
        return inflateResetKeep(strm);
      }
      function inflateReset2(strm, windowBits) {
        var wrap;
        var state;
        if (!strm || !strm.state) {
          return Z_STREAM_ERROR;
        }
        state = strm.state;
        if (windowBits < 0) {
          wrap = 0;
          windowBits = -windowBits;
        } else {
          wrap = (windowBits >> 4) + 1;
          if (windowBits < 48) {
            windowBits &= 15;
          }
        }
        if (windowBits && (windowBits < 8 || windowBits > 15)) {
          return Z_STREAM_ERROR;
        }
        if (state.window !== null && state.wbits !== windowBits) {
          state.window = null;
        }
        state.wrap = wrap;
        state.wbits = windowBits;
        return inflateReset(strm);
      }
      function inflateInit2(strm, windowBits) {
        var ret;
        var state;
        if (!strm) {
          return Z_STREAM_ERROR;
        }
        state = new InflateState();
        strm.state = state;
        state.window = null;
        ret = inflateReset2(strm, windowBits);
        if (ret !== Z_OK) {
          strm.state = null;
        }
        return ret;
      }
      function inflateInit(strm) {
        return inflateInit2(strm, DEF_WBITS);
      }
      var virgin = true;
      var lenfix;
      var distfix;
      function fixedtables(state) {
        if (virgin) {
          var sym;
          lenfix = new utils.Buf32(512);
          distfix = new utils.Buf32(32);
          sym = 0;
          while (sym < 144) {
            state.lens[sym++] = 8;
          }
          while (sym < 256) {
            state.lens[sym++] = 9;
          }
          while (sym < 280) {
            state.lens[sym++] = 7;
          }
          while (sym < 288) {
            state.lens[sym++] = 8;
          }
          inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
          sym = 0;
          while (sym < 32) {
            state.lens[sym++] = 5;
          }
          inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
          virgin = false;
        }
        state.lencode = lenfix;
        state.lenbits = 9;
        state.distcode = distfix;
        state.distbits = 5;
      }
      function updatewindow(strm, src, end, copy) {
        var dist;
        var state = strm.state;
        if (state.window === null) {
          state.wsize = 1 << state.wbits;
          state.wnext = 0;
          state.whave = 0;
          state.window = new utils.Buf8(state.wsize);
        }
        if (copy >= state.wsize) {
          utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
          state.wnext = 0;
          state.whave = state.wsize;
        } else {
          dist = state.wsize - state.wnext;
          if (dist > copy) {
            dist = copy;
          }
          utils.arraySet(state.window, src, end - copy, dist, state.wnext);
          copy -= dist;
          if (copy) {
            utils.arraySet(state.window, src, end - copy, copy, 0);
            state.wnext = copy;
            state.whave = state.wsize;
          } else {
            state.wnext += dist;
            if (state.wnext === state.wsize) {
              state.wnext = 0;
            }
            if (state.whave < state.wsize) {
              state.whave += dist;
            }
          }
        }
        return 0;
      }
      function inflate(strm, flush) {
        var state;
        var input, output;
        var next;
        var put;
        var have, left;
        var hold;
        var bits;
        var _in, _out;
        var copy;
        var from;
        var from_source;
        var here = 0;
        var here_bits, here_op, here_val;
        var last_bits, last_op, last_val;
        var len;
        var ret;
        var hbuf = new utils.Buf8(4);
        var opts;
        var n;
        var order = (
          /* permutation of code lengths */
          [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
        );
        if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) {
          return Z_STREAM_ERROR;
        }
        state = strm.state;
        if (state.mode === TYPE) {
          state.mode = TYPEDO;
        }
        put = strm.next_out;
        output = strm.output;
        left = strm.avail_out;
        next = strm.next_in;
        input = strm.input;
        have = strm.avail_in;
        hold = state.hold;
        bits = state.bits;
        _in = have;
        _out = left;
        ret = Z_OK;
        inf_leave:
          for (; ; ) {
            switch (state.mode) {
              case HEAD:
                if (state.wrap === 0) {
                  state.mode = TYPEDO;
                  break;
                }
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (state.wrap & 2 && hold === 35615) {
                  state.check = 0;
                  hbuf[0] = hold & 255;
                  hbuf[1] = hold >>> 8 & 255;
                  state.check = crc32(state.check, hbuf, 2, 0);
                  hold = 0;
                  bits = 0;
                  state.mode = FLAGS;
                  break;
                }
                state.flags = 0;
                if (state.head) {
                  state.head.done = false;
                }
                if (!(state.wrap & 1) || /* check if zlib header allowed */
                (((hold & 255) << 8) + (hold >> 8)) % 31) {
                  strm.msg = "incorrect header check";
                  state.mode = BAD;
                  break;
                }
                if ((hold & 15) !== Z_DEFLATED) {
                  strm.msg = "unknown compression method";
                  state.mode = BAD;
                  break;
                }
                hold >>>= 4;
                bits -= 4;
                len = (hold & 15) + 8;
                if (state.wbits === 0) {
                  state.wbits = len;
                } else if (len > state.wbits) {
                  strm.msg = "invalid window size";
                  state.mode = BAD;
                  break;
                }
                state.dmax = 1 << len;
                strm.adler = state.check = 1;
                state.mode = hold & 512 ? DICTID : TYPE;
                hold = 0;
                bits = 0;
                break;
              case FLAGS:
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.flags = hold;
                if ((state.flags & 255) !== Z_DEFLATED) {
                  strm.msg = "unknown compression method";
                  state.mode = BAD;
                  break;
                }
                if (state.flags & 57344) {
                  strm.msg = "unknown header flags set";
                  state.mode = BAD;
                  break;
                }
                if (state.head) {
                  state.head.text = hold >> 8 & 1;
                }
                if (state.flags & 512) {
                  hbuf[0] = hold & 255;
                  hbuf[1] = hold >>> 8 & 255;
                  state.check = crc32(state.check, hbuf, 2, 0);
                }
                hold = 0;
                bits = 0;
                state.mode = TIME;
              /* falls through */
              case TIME:
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (state.head) {
                  state.head.time = hold;
                }
                if (state.flags & 512) {
                  hbuf[0] = hold & 255;
                  hbuf[1] = hold >>> 8 & 255;
                  hbuf[2] = hold >>> 16 & 255;
                  hbuf[3] = hold >>> 24 & 255;
                  state.check = crc32(state.check, hbuf, 4, 0);
                }
                hold = 0;
                bits = 0;
                state.mode = OS;
              /* falls through */
              case OS:
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (state.head) {
                  state.head.xflags = hold & 255;
                  state.head.os = hold >> 8;
                }
                if (state.flags & 512) {
                  hbuf[0] = hold & 255;
                  hbuf[1] = hold >>> 8 & 255;
                  state.check = crc32(state.check, hbuf, 2, 0);
                }
                hold = 0;
                bits = 0;
                state.mode = EXLEN;
              /* falls through */
              case EXLEN:
                if (state.flags & 1024) {
                  while (bits < 16) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  state.length = hold;
                  if (state.head) {
                    state.head.extra_len = hold;
                  }
                  if (state.flags & 512) {
                    hbuf[0] = hold & 255;
                    hbuf[1] = hold >>> 8 & 255;
                    state.check = crc32(state.check, hbuf, 2, 0);
                  }
                  hold = 0;
                  bits = 0;
                } else if (state.head) {
                  state.head.extra = null;
                }
                state.mode = EXTRA;
              /* falls through */
              case EXTRA:
                if (state.flags & 1024) {
                  copy = state.length;
                  if (copy > have) {
                    copy = have;
                  }
                  if (copy) {
                    if (state.head) {
                      len = state.head.extra_len - state.length;
                      if (!state.head.extra) {
                        state.head.extra = new Array(state.head.extra_len);
                      }
                      utils.arraySet(
                        state.head.extra,
                        input,
                        next,
                        // extra field is limited to 65536 bytes
                        // - no need for additional size check
                        copy,
                        /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                        len
                      );
                    }
                    if (state.flags & 512) {
                      state.check = crc32(state.check, input, copy, next);
                    }
                    have -= copy;
                    next += copy;
                    state.length -= copy;
                  }
                  if (state.length) {
                    break inf_leave;
                  }
                }
                state.length = 0;
                state.mode = NAME;
              /* falls through */
              case NAME:
                if (state.flags & 2048) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  copy = 0;
                  do {
                    len = input[next + copy++];
                    if (state.head && len && state.length < 65536) {
                      state.head.name += String.fromCharCode(len);
                    }
                  } while (len && copy < have);
                  if (state.flags & 512) {
                    state.check = crc32(state.check, input, copy, next);
                  }
                  have -= copy;
                  next += copy;
                  if (len) {
                    break inf_leave;
                  }
                } else if (state.head) {
                  state.head.name = null;
                }
                state.length = 0;
                state.mode = COMMENT;
              /* falls through */
              case COMMENT:
                if (state.flags & 4096) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  copy = 0;
                  do {
                    len = input[next + copy++];
                    if (state.head && len && state.length < 65536) {
                      state.head.comment += String.fromCharCode(len);
                    }
                  } while (len && copy < have);
                  if (state.flags & 512) {
                    state.check = crc32(state.check, input, copy, next);
                  }
                  have -= copy;
                  next += copy;
                  if (len) {
                    break inf_leave;
                  }
                } else if (state.head) {
                  state.head.comment = null;
                }
                state.mode = HCRC;
              /* falls through */
              case HCRC:
                if (state.flags & 512) {
                  while (bits < 16) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  if (hold !== (state.check & 65535)) {
                    strm.msg = "header crc mismatch";
                    state.mode = BAD;
                    break;
                  }
                  hold = 0;
                  bits = 0;
                }
                if (state.head) {
                  state.head.hcrc = state.flags >> 9 & 1;
                  state.head.done = true;
                }
                strm.adler = state.check = 0;
                state.mode = TYPE;
                break;
              case DICTID:
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                strm.adler = state.check = zswap32(hold);
                hold = 0;
                bits = 0;
                state.mode = DICT;
              /* falls through */
              case DICT:
                if (state.havedict === 0) {
                  strm.next_out = put;
                  strm.avail_out = left;
                  strm.next_in = next;
                  strm.avail_in = have;
                  state.hold = hold;
                  state.bits = bits;
                  return Z_NEED_DICT;
                }
                strm.adler = state.check = 1;
                state.mode = TYPE;
              /* falls through */
              case TYPE:
                if (flush === Z_BLOCK || flush === Z_TREES) {
                  break inf_leave;
                }
              /* falls through */
              case TYPEDO:
                if (state.last) {
                  hold >>>= bits & 7;
                  bits -= bits & 7;
                  state.mode = CHECK;
                  break;
                }
                while (bits < 3) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.last = hold & 1;
                hold >>>= 1;
                bits -= 1;
                switch (hold & 3) {
                  case 0:
                    state.mode = STORED;
                    break;
                  case 1:
                    fixedtables(state);
                    state.mode = LEN_;
                    if (flush === Z_TREES) {
                      hold >>>= 2;
                      bits -= 2;
                      break inf_leave;
                    }
                    break;
                  case 2:
                    state.mode = TABLE;
                    break;
                  case 3:
                    strm.msg = "invalid block type";
                    state.mode = BAD;
                }
                hold >>>= 2;
                bits -= 2;
                break;
              case STORED:
                hold >>>= bits & 7;
                bits -= bits & 7;
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
                  strm.msg = "invalid stored block lengths";
                  state.mode = BAD;
                  break;
                }
                state.length = hold & 65535;
                hold = 0;
                bits = 0;
                state.mode = COPY_;
                if (flush === Z_TREES) {
                  break inf_leave;
                }
              /* falls through */
              case COPY_:
                state.mode = COPY;
              /* falls through */
              case COPY:
                copy = state.length;
                if (copy) {
                  if (copy > have) {
                    copy = have;
                  }
                  if (copy > left) {
                    copy = left;
                  }
                  if (copy === 0) {
                    break inf_leave;
                  }
                  utils.arraySet(output, input, next, copy, put);
                  have -= copy;
                  next += copy;
                  left -= copy;
                  put += copy;
                  state.length -= copy;
                  break;
                }
                state.mode = TYPE;
                break;
              case TABLE:
                while (bits < 14) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.nlen = (hold & 31) + 257;
                hold >>>= 5;
                bits -= 5;
                state.ndist = (hold & 31) + 1;
                hold >>>= 5;
                bits -= 5;
                state.ncode = (hold & 15) + 4;
                hold >>>= 4;
                bits -= 4;
                if (state.nlen > 286 || state.ndist > 30) {
                  strm.msg = "too many length or distance symbols";
                  state.mode = BAD;
                  break;
                }
                state.have = 0;
                state.mode = LENLENS;
              /* falls through */
              case LENLENS:
                while (state.have < state.ncode) {
                  while (bits < 3) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  state.lens[order[state.have++]] = hold & 7;
                  hold >>>= 3;
                  bits -= 3;
                }
                while (state.have < 19) {
                  state.lens[order[state.have++]] = 0;
                }
                state.lencode = state.lendyn;
                state.lenbits = 7;
                opts = { bits: state.lenbits };
                ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
                state.lenbits = opts.bits;
                if (ret) {
                  strm.msg = "invalid code lengths set";
                  state.mode = BAD;
                  break;
                }
                state.have = 0;
                state.mode = CODELENS;
              /* falls through */
              case CODELENS:
                while (state.have < state.nlen + state.ndist) {
                  for (; ; ) {
                    here = state.lencode[hold & (1 << state.lenbits) - 1];
                    here_bits = here >>> 24;
                    here_op = here >>> 16 & 255;
                    here_val = here & 65535;
                    if (here_bits <= bits) {
                      break;
                    }
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  if (here_val < 16) {
                    hold >>>= here_bits;
                    bits -= here_bits;
                    state.lens[state.have++] = here_val;
                  } else {
                    if (here_val === 16) {
                      n = here_bits + 2;
                      while (bits < n) {
                        if (have === 0) {
                          break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                      }
                      hold >>>= here_bits;
                      bits -= here_bits;
                      if (state.have === 0) {
                        strm.msg = "invalid bit length repeat";
                        state.mode = BAD;
                        break;
                      }
                      len = state.lens[state.have - 1];
                      copy = 3 + (hold & 3);
                      hold >>>= 2;
                      bits -= 2;
                    } else if (here_val === 17) {
                      n = here_bits + 3;
                      while (bits < n) {
                        if (have === 0) {
                          break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                      }
                      hold >>>= here_bits;
                      bits -= here_bits;
                      len = 0;
                      copy = 3 + (hold & 7);
                      hold >>>= 3;
                      bits -= 3;
                    } else {
                      n = here_bits + 7;
                      while (bits < n) {
                        if (have === 0) {
                          break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                      }
                      hold >>>= here_bits;
                      bits -= here_bits;
                      len = 0;
                      copy = 11 + (hold & 127);
                      hold >>>= 7;
                      bits -= 7;
                    }
                    if (state.have + copy > state.nlen + state.ndist) {
                      strm.msg = "invalid bit length repeat";
                      state.mode = BAD;
                      break;
                    }
                    while (copy--) {
                      state.lens[state.have++] = len;
                    }
                  }
                }
                if (state.mode === BAD) {
                  break;
                }
                if (state.lens[256] === 0) {
                  strm.msg = "invalid code -- missing end-of-block";
                  state.mode = BAD;
                  break;
                }
                state.lenbits = 9;
                opts = { bits: state.lenbits };
                ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
                state.lenbits = opts.bits;
                if (ret) {
                  strm.msg = "invalid literal/lengths set";
                  state.mode = BAD;
                  break;
                }
                state.distbits = 6;
                state.distcode = state.distdyn;
                opts = { bits: state.distbits };
                ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
                state.distbits = opts.bits;
                if (ret) {
                  strm.msg = "invalid distances set";
                  state.mode = BAD;
                  break;
                }
                state.mode = LEN_;
                if (flush === Z_TREES) {
                  break inf_leave;
                }
              /* falls through */
              case LEN_:
                state.mode = LEN;
              /* falls through */
              case LEN:
                if (have >= 6 && left >= 258) {
                  strm.next_out = put;
                  strm.avail_out = left;
                  strm.next_in = next;
                  strm.avail_in = have;
                  state.hold = hold;
                  state.bits = bits;
                  inflate_fast(strm, _out);
                  put = strm.next_out;
                  output = strm.output;
                  left = strm.avail_out;
                  next = strm.next_in;
                  input = strm.input;
                  have = strm.avail_in;
                  hold = state.hold;
                  bits = state.bits;
                  if (state.mode === TYPE) {
                    state.back = -1;
                  }
                  break;
                }
                state.back = 0;
                for (; ; ) {
                  here = state.lencode[hold & (1 << state.lenbits) - 1];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (here_op && (here_op & 240) === 0) {
                  last_bits = here_bits;
                  last_op = here_op;
                  last_val = here_val;
                  for (; ; ) {
                    here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                    here_bits = here >>> 24;
                    here_op = here >>> 16 & 255;
                    here_val = here & 65535;
                    if (last_bits + here_bits <= bits) {
                      break;
                    }
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= last_bits;
                  bits -= last_bits;
                  state.back += last_bits;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                state.back += here_bits;
                state.length = here_val;
                if (here_op === 0) {
                  state.mode = LIT;
                  break;
                }
                if (here_op & 32) {
                  state.back = -1;
                  state.mode = TYPE;
                  break;
                }
                if (here_op & 64) {
                  strm.msg = "invalid literal/length code";
                  state.mode = BAD;
                  break;
                }
                state.extra = here_op & 15;
                state.mode = LENEXT;
              /* falls through */
              case LENEXT:
                if (state.extra) {
                  n = state.extra;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  state.length += hold & (1 << state.extra) - 1;
                  hold >>>= state.extra;
                  bits -= state.extra;
                  state.back += state.extra;
                }
                state.was = state.length;
                state.mode = DIST;
              /* falls through */
              case DIST:
                for (; ; ) {
                  here = state.distcode[hold & (1 << state.distbits) - 1];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if ((here_op & 240) === 0) {
                  last_bits = here_bits;
                  last_op = here_op;
                  last_val = here_val;
                  for (; ; ) {
                    here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                    here_bits = here >>> 24;
                    here_op = here >>> 16 & 255;
                    here_val = here & 65535;
                    if (last_bits + here_bits <= bits) {
                      break;
                    }
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= last_bits;
                  bits -= last_bits;
                  state.back += last_bits;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                state.back += here_bits;
                if (here_op & 64) {
                  strm.msg = "invalid distance code";
                  state.mode = BAD;
                  break;
                }
                state.offset = here_val;
                state.extra = here_op & 15;
                state.mode = DISTEXT;
              /* falls through */
              case DISTEXT:
                if (state.extra) {
                  n = state.extra;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  state.offset += hold & (1 << state.extra) - 1;
                  hold >>>= state.extra;
                  bits -= state.extra;
                  state.back += state.extra;
                }
                if (state.offset > state.dmax) {
                  strm.msg = "invalid distance too far back";
                  state.mode = BAD;
                  break;
                }
                state.mode = MATCH;
              /* falls through */
              case MATCH:
                if (left === 0) {
                  break inf_leave;
                }
                copy = _out - left;
                if (state.offset > copy) {
                  copy = state.offset - copy;
                  if (copy > state.whave) {
                    if (state.sane) {
                      strm.msg = "invalid distance too far back";
                      state.mode = BAD;
                      break;
                    }
                  }
                  if (copy > state.wnext) {
                    copy -= state.wnext;
                    from = state.wsize - copy;
                  } else {
                    from = state.wnext - copy;
                  }
                  if (copy > state.length) {
                    copy = state.length;
                  }
                  from_source = state.window;
                } else {
                  from_source = output;
                  from = put - state.offset;
                  copy = state.length;
                }
                if (copy > left) {
                  copy = left;
                }
                left -= copy;
                state.length -= copy;
                do {
                  output[put++] = from_source[from++];
                } while (--copy);
                if (state.length === 0) {
                  state.mode = LEN;
                }
                break;
              case LIT:
                if (left === 0) {
                  break inf_leave;
                }
                output[put++] = state.length;
                left--;
                state.mode = LEN;
                break;
              case CHECK:
                if (state.wrap) {
                  while (bits < 32) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold |= input[next++] << bits;
                    bits += 8;
                  }
                  _out -= left;
                  strm.total_out += _out;
                  state.total += _out;
                  if (_out) {
                    strm.adler = state.check = /*UPDATE(state.check, put - _out, _out);*/
                    state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
                  }
                  _out = left;
                  if ((state.flags ? hold : zswap32(hold)) !== state.check) {
                    strm.msg = "incorrect data check";
                    state.mode = BAD;
                    break;
                  }
                  hold = 0;
                  bits = 0;
                }
                state.mode = LENGTH;
              /* falls through */
              case LENGTH:
                if (state.wrap && state.flags) {
                  while (bits < 32) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  if (hold !== (state.total & 4294967295)) {
                    strm.msg = "incorrect length check";
                    state.mode = BAD;
                    break;
                  }
                  hold = 0;
                  bits = 0;
                }
                state.mode = DONE;
              /* falls through */
              case DONE:
                ret = Z_STREAM_END;
                break inf_leave;
              case BAD:
                ret = Z_DATA_ERROR;
                break inf_leave;
              case MEM:
                return Z_MEM_ERROR;
              case SYNC:
              /* falls through */
              default:
                return Z_STREAM_ERROR;
            }
          }
        strm.next_out = put;
        strm.avail_out = left;
        strm.next_in = next;
        strm.avail_in = have;
        state.hold = hold;
        state.bits = bits;
        if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) {
          if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
            state.mode = MEM;
            return Z_MEM_ERROR;
          }
        }
        _in -= strm.avail_in;
        _out -= strm.avail_out;
        strm.total_in += _in;
        strm.total_out += _out;
        state.total += _out;
        if (state.wrap && _out) {
          strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
          state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
        }
        strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
        if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) {
          ret = Z_BUF_ERROR;
        }
        return ret;
      }
      function inflateEnd(strm) {
        if (!strm || !strm.state) {
          return Z_STREAM_ERROR;
        }
        var state = strm.state;
        if (state.window) {
          state.window = null;
        }
        strm.state = null;
        return Z_OK;
      }
      function inflateGetHeader(strm, head) {
        var state;
        if (!strm || !strm.state) {
          return Z_STREAM_ERROR;
        }
        state = strm.state;
        if ((state.wrap & 2) === 0) {
          return Z_STREAM_ERROR;
        }
        state.head = head;
        head.done = false;
        return Z_OK;
      }
      function inflateSetDictionary(strm, dictionary) {
        var dictLength = dictionary.length;
        var state;
        var dictid;
        var ret;
        if (!strm || !strm.state) {
          return Z_STREAM_ERROR;
        }
        state = strm.state;
        if (state.wrap !== 0 && state.mode !== DICT) {
          return Z_STREAM_ERROR;
        }
        if (state.mode === DICT) {
          dictid = 1;
          dictid = adler32(dictid, dictionary, dictLength, 0);
          if (dictid !== state.check) {
            return Z_DATA_ERROR;
          }
        }
        ret = updatewindow(strm, dictionary, dictLength, dictLength);
        if (ret) {
          state.mode = MEM;
          return Z_MEM_ERROR;
        }
        state.havedict = 1;
        return Z_OK;
      }
      exports.inflateReset = inflateReset;
      exports.inflateReset2 = inflateReset2;
      exports.inflateResetKeep = inflateResetKeep;
      exports.inflateInit = inflateInit;
      exports.inflateInit2 = inflateInit2;
      exports.inflate = inflate;
      exports.inflateEnd = inflateEnd;
      exports.inflateGetHeader = inflateGetHeader;
      exports.inflateSetDictionary = inflateSetDictionary;
      exports.inflateInfo = "pako inflate (from Nodeca project)";
    }
  });

  // node_modules/pako/lib/zlib/constants.js
  var require_constants = __commonJS({
    "node_modules/pako/lib/zlib/constants.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = {
        /* Allowed flush values; see deflate() and inflate() below for details */
        Z_NO_FLUSH: 0,
        Z_PARTIAL_FLUSH: 1,
        Z_SYNC_FLUSH: 2,
        Z_FULL_FLUSH: 3,
        Z_FINISH: 4,
        Z_BLOCK: 5,
        Z_TREES: 6,
        /* Return codes for the compression/decompression functions. Negative values
        * are errors, positive values are used for special but normal events.
        */
        Z_OK: 0,
        Z_STREAM_END: 1,
        Z_NEED_DICT: 2,
        Z_ERRNO: -1,
        Z_STREAM_ERROR: -2,
        Z_DATA_ERROR: -3,
        //Z_MEM_ERROR:     -4,
        Z_BUF_ERROR: -5,
        //Z_VERSION_ERROR: -6,
        /* compression levels */
        Z_NO_COMPRESSION: 0,
        Z_BEST_SPEED: 1,
        Z_BEST_COMPRESSION: 9,
        Z_DEFAULT_COMPRESSION: -1,
        Z_FILTERED: 1,
        Z_HUFFMAN_ONLY: 2,
        Z_RLE: 3,
        Z_FIXED: 4,
        Z_DEFAULT_STRATEGY: 0,
        /* Possible values of the data_type field (though see inflate()) */
        Z_BINARY: 0,
        Z_TEXT: 1,
        //Z_ASCII:                1, // = Z_TEXT (deprecated)
        Z_UNKNOWN: 2,
        /* The deflate compression method */
        Z_DEFLATED: 8
        //Z_NULL:                 null // Use -1 or null inline, depending on var type
      };
    }
  });

  // node_modules/browserify-zlib/lib/binding.js
  var require_binding = __commonJS({
    "node_modules/browserify-zlib/lib/binding.js"(exports) {
      "use strict";
      init_browser_shims();
      var assert = require_assert();
      var Zstream = require_zstream();
      var zlib_deflate = require_deflate();
      var zlib_inflate = require_inflate();
      var constants = require_constants();
      for (key in constants) {
        exports[key] = constants[key];
      }
      var key;
      exports.NONE = 0;
      exports.DEFLATE = 1;
      exports.INFLATE = 2;
      exports.GZIP = 3;
      exports.GUNZIP = 4;
      exports.DEFLATERAW = 5;
      exports.INFLATERAW = 6;
      exports.UNZIP = 7;
      var GZIP_HEADER_ID1 = 31;
      var GZIP_HEADER_ID2 = 139;
      function Zlib(mode) {
        if (typeof mode !== "number" || mode < exports.DEFLATE || mode > exports.UNZIP) {
          throw new TypeError("Bad argument");
        }
        this.dictionary = null;
        this.err = 0;
        this.flush = 0;
        this.init_done = false;
        this.level = 0;
        this.memLevel = 0;
        this.mode = mode;
        this.strategy = 0;
        this.windowBits = 0;
        this.write_in_progress = false;
        this.pending_close = false;
        this.gzip_id_bytes_read = 0;
      }
      Zlib.prototype.close = function() {
        if (this.write_in_progress) {
          this.pending_close = true;
          return;
        }
        this.pending_close = false;
        assert(this.init_done, "close before init");
        assert(this.mode <= exports.UNZIP);
        if (this.mode === exports.DEFLATE || this.mode === exports.GZIP || this.mode === exports.DEFLATERAW) {
          zlib_deflate.deflateEnd(this.strm);
        } else if (this.mode === exports.INFLATE || this.mode === exports.GUNZIP || this.mode === exports.INFLATERAW || this.mode === exports.UNZIP) {
          zlib_inflate.inflateEnd(this.strm);
        }
        this.mode = exports.NONE;
        this.dictionary = null;
      };
      Zlib.prototype.write = function(flush, input, in_off, in_len, out, out_off, out_len) {
        return this._write(true, flush, input, in_off, in_len, out, out_off, out_len);
      };
      Zlib.prototype.writeSync = function(flush, input, in_off, in_len, out, out_off, out_len) {
        return this._write(false, flush, input, in_off, in_len, out, out_off, out_len);
      };
      Zlib.prototype._write = function(async, flush, input, in_off, in_len, out, out_off, out_len) {
        assert.equal(arguments.length, 8);
        assert(this.init_done, "write before init");
        assert(this.mode !== exports.NONE, "already finalized");
        assert.equal(false, this.write_in_progress, "write already in progress");
        assert.equal(false, this.pending_close, "close is pending");
        this.write_in_progress = true;
        assert.equal(false, flush === void 0, "must provide flush value");
        this.write_in_progress = true;
        if (flush !== exports.Z_NO_FLUSH && flush !== exports.Z_PARTIAL_FLUSH && flush !== exports.Z_SYNC_FLUSH && flush !== exports.Z_FULL_FLUSH && flush !== exports.Z_FINISH && flush !== exports.Z_BLOCK) {
          throw new Error("Invalid flush value");
        }
        if (input == null) {
          input = import_buffer.Buffer.alloc(0);
          in_len = 0;
          in_off = 0;
        }
        this.strm.avail_in = in_len;
        this.strm.input = input;
        this.strm.next_in = in_off;
        this.strm.avail_out = out_len;
        this.strm.output = out;
        this.strm.next_out = out_off;
        this.flush = flush;
        if (!async) {
          this._process();
          if (this._checkError()) {
            return this._afterSync();
          }
          return;
        }
        var self2 = this;
        process.nextTick(function() {
          self2._process();
          self2._after();
        });
        return this;
      };
      Zlib.prototype._afterSync = function() {
        var avail_out = this.strm.avail_out;
        var avail_in = this.strm.avail_in;
        this.write_in_progress = false;
        return [avail_in, avail_out];
      };
      Zlib.prototype._process = function() {
        var next_expected_header_byte = null;
        switch (this.mode) {
          case exports.DEFLATE:
          case exports.GZIP:
          case exports.DEFLATERAW:
            this.err = zlib_deflate.deflate(this.strm, this.flush);
            break;
          case exports.UNZIP:
            if (this.strm.avail_in > 0) {
              next_expected_header_byte = this.strm.next_in;
            }
            switch (this.gzip_id_bytes_read) {
              case 0:
                if (next_expected_header_byte === null) {
                  break;
                }
                if (this.strm.input[next_expected_header_byte] === GZIP_HEADER_ID1) {
                  this.gzip_id_bytes_read = 1;
                  next_expected_header_byte++;
                  if (this.strm.avail_in === 1) {
                    break;
                  }
                } else {
                  this.mode = exports.INFLATE;
                  break;
                }
              // fallthrough
              case 1:
                if (next_expected_header_byte === null) {
                  break;
                }
                if (this.strm.input[next_expected_header_byte] === GZIP_HEADER_ID2) {
                  this.gzip_id_bytes_read = 2;
                  this.mode = exports.GUNZIP;
                } else {
                  this.mode = exports.INFLATE;
                }
                break;
              default:
                throw new Error("invalid number of gzip magic number bytes read");
            }
          // fallthrough
          case exports.INFLATE:
          case exports.GUNZIP:
          case exports.INFLATERAW:
            this.err = zlib_inflate.inflate(
              this.strm,
              this.flush
              // If data was encoded with dictionary
            );
            if (this.err === exports.Z_NEED_DICT && this.dictionary) {
              this.err = zlib_inflate.inflateSetDictionary(this.strm, this.dictionary);
              if (this.err === exports.Z_OK) {
                this.err = zlib_inflate.inflate(this.strm, this.flush);
              } else if (this.err === exports.Z_DATA_ERROR) {
                this.err = exports.Z_NEED_DICT;
              }
            }
            while (this.strm.avail_in > 0 && this.mode === exports.GUNZIP && this.err === exports.Z_STREAM_END && this.strm.next_in[0] !== 0) {
              this.reset();
              this.err = zlib_inflate.inflate(this.strm, this.flush);
            }
            break;
          default:
            throw new Error("Unknown mode " + this.mode);
        }
      };
      Zlib.prototype._checkError = function() {
        switch (this.err) {
          case exports.Z_OK:
          case exports.Z_BUF_ERROR:
            if (this.strm.avail_out !== 0 && this.flush === exports.Z_FINISH) {
              this._error("unexpected end of file");
              return false;
            }
            break;
          case exports.Z_STREAM_END:
            break;
          case exports.Z_NEED_DICT:
            if (this.dictionary == null) {
              this._error("Missing dictionary");
            } else {
              this._error("Bad dictionary");
            }
            return false;
          default:
            this._error("Zlib error");
            return false;
        }
        return true;
      };
      Zlib.prototype._after = function() {
        if (!this._checkError()) {
          return;
        }
        var avail_out = this.strm.avail_out;
        var avail_in = this.strm.avail_in;
        this.write_in_progress = false;
        this.callback(avail_in, avail_out);
        if (this.pending_close) {
          this.close();
        }
      };
      Zlib.prototype._error = function(message) {
        if (this.strm.msg) {
          message = this.strm.msg;
        }
        this.onerror(
          message,
          this.err
          // no hope of rescue.
        );
        this.write_in_progress = false;
        if (this.pending_close) {
          this.close();
        }
      };
      Zlib.prototype.init = function(windowBits, level, memLevel, strategy, dictionary) {
        assert(arguments.length === 4 || arguments.length === 5, "init(windowBits, level, memLevel, strategy, [dictionary])");
        assert(windowBits >= 8 && windowBits <= 15, "invalid windowBits");
        assert(level >= -1 && level <= 9, "invalid compression level");
        assert(memLevel >= 1 && memLevel <= 9, "invalid memlevel");
        assert(strategy === exports.Z_FILTERED || strategy === exports.Z_HUFFMAN_ONLY || strategy === exports.Z_RLE || strategy === exports.Z_FIXED || strategy === exports.Z_DEFAULT_STRATEGY, "invalid strategy");
        this._init(level, windowBits, memLevel, strategy, dictionary);
        this._setDictionary();
      };
      Zlib.prototype.params = function() {
        throw new Error("deflateParams Not supported");
      };
      Zlib.prototype.reset = function() {
        this._reset();
        this._setDictionary();
      };
      Zlib.prototype._init = function(level, windowBits, memLevel, strategy, dictionary) {
        this.level = level;
        this.windowBits = windowBits;
        this.memLevel = memLevel;
        this.strategy = strategy;
        this.flush = exports.Z_NO_FLUSH;
        this.err = exports.Z_OK;
        if (this.mode === exports.GZIP || this.mode === exports.GUNZIP) {
          this.windowBits += 16;
        }
        if (this.mode === exports.UNZIP) {
          this.windowBits += 32;
        }
        if (this.mode === exports.DEFLATERAW || this.mode === exports.INFLATERAW) {
          this.windowBits = -1 * this.windowBits;
        }
        this.strm = new Zstream();
        switch (this.mode) {
          case exports.DEFLATE:
          case exports.GZIP:
          case exports.DEFLATERAW:
            this.err = zlib_deflate.deflateInit2(this.strm, this.level, exports.Z_DEFLATED, this.windowBits, this.memLevel, this.strategy);
            break;
          case exports.INFLATE:
          case exports.GUNZIP:
          case exports.INFLATERAW:
          case exports.UNZIP:
            this.err = zlib_inflate.inflateInit2(this.strm, this.windowBits);
            break;
          default:
            throw new Error("Unknown mode " + this.mode);
        }
        if (this.err !== exports.Z_OK) {
          this._error("Init error");
        }
        this.dictionary = dictionary;
        this.write_in_progress = false;
        this.init_done = true;
      };
      Zlib.prototype._setDictionary = function() {
        if (this.dictionary == null) {
          return;
        }
        this.err = exports.Z_OK;
        switch (this.mode) {
          case exports.DEFLATE:
          case exports.DEFLATERAW:
            this.err = zlib_deflate.deflateSetDictionary(this.strm, this.dictionary);
            break;
          default:
            break;
        }
        if (this.err !== exports.Z_OK) {
          this._error("Failed to set dictionary");
        }
      };
      Zlib.prototype._reset = function() {
        this.err = exports.Z_OK;
        switch (this.mode) {
          case exports.DEFLATE:
          case exports.DEFLATERAW:
          case exports.GZIP:
            this.err = zlib_deflate.deflateReset(this.strm);
            break;
          case exports.INFLATE:
          case exports.INFLATERAW:
          case exports.GUNZIP:
            this.err = zlib_inflate.inflateReset(this.strm);
            break;
          default:
            break;
        }
        if (this.err !== exports.Z_OK) {
          this._error("Failed to reset stream");
        }
      };
      exports.Zlib = Zlib;
    }
  });

  // node_modules/browserify-zlib/lib/index.js
  var require_lib = __commonJS({
    "node_modules/browserify-zlib/lib/index.js"(exports) {
      "use strict";
      init_browser_shims();
      var Buffer2 = require_buffer().Buffer;
      var Transform = require_stream_browserify().Transform;
      var binding = require_binding();
      var util = require_util();
      var assert = require_assert().ok;
      var kMaxLength = require_buffer().kMaxLength;
      var kRangeErrorMessage = "Cannot create final Buffer. It would be larger than 0x" + kMaxLength.toString(16) + " bytes";
      binding.Z_MIN_WINDOWBITS = 8;
      binding.Z_MAX_WINDOWBITS = 15;
      binding.Z_DEFAULT_WINDOWBITS = 15;
      binding.Z_MIN_CHUNK = 64;
      binding.Z_MAX_CHUNK = Infinity;
      binding.Z_DEFAULT_CHUNK = 16 * 1024;
      binding.Z_MIN_MEMLEVEL = 1;
      binding.Z_MAX_MEMLEVEL = 9;
      binding.Z_DEFAULT_MEMLEVEL = 8;
      binding.Z_MIN_LEVEL = -1;
      binding.Z_MAX_LEVEL = 9;
      binding.Z_DEFAULT_LEVEL = binding.Z_DEFAULT_COMPRESSION;
      var bkeys = Object.keys(binding);
      for (bk = 0; bk < bkeys.length; bk++) {
        bkey = bkeys[bk];
        if (bkey.match(/^Z/)) {
          Object.defineProperty(exports, bkey, {
            enumerable: true,
            value: binding[bkey],
            writable: false
          });
        }
      }
      var bkey;
      var bk;
      var codes = {
        Z_OK: binding.Z_OK,
        Z_STREAM_END: binding.Z_STREAM_END,
        Z_NEED_DICT: binding.Z_NEED_DICT,
        Z_ERRNO: binding.Z_ERRNO,
        Z_STREAM_ERROR: binding.Z_STREAM_ERROR,
        Z_DATA_ERROR: binding.Z_DATA_ERROR,
        Z_MEM_ERROR: binding.Z_MEM_ERROR,
        Z_BUF_ERROR: binding.Z_BUF_ERROR,
        Z_VERSION_ERROR: binding.Z_VERSION_ERROR
      };
      var ckeys = Object.keys(codes);
      for (ck = 0; ck < ckeys.length; ck++) {
        ckey = ckeys[ck];
        codes[codes[ckey]] = ckey;
      }
      var ckey;
      var ck;
      Object.defineProperty(exports, "codes", {
        enumerable: true,
        value: Object.freeze(codes),
        writable: false
      });
      exports.Deflate = Deflate;
      exports.Inflate = Inflate;
      exports.Gzip = Gzip;
      exports.Gunzip = Gunzip;
      exports.DeflateRaw = DeflateRaw;
      exports.InflateRaw = InflateRaw;
      exports.Unzip = Unzip;
      exports.createDeflate = function(o) {
        return new Deflate(o);
      };
      exports.createInflate = function(o) {
        return new Inflate(o);
      };
      exports.createDeflateRaw = function(o) {
        return new DeflateRaw(o);
      };
      exports.createInflateRaw = function(o) {
        return new InflateRaw(o);
      };
      exports.createGzip = function(o) {
        return new Gzip(o);
      };
      exports.createGunzip = function(o) {
        return new Gunzip(o);
      };
      exports.createUnzip = function(o) {
        return new Unzip(o);
      };
      exports.deflate = function(buffer, opts, callback) {
        if (typeof opts === "function") {
          callback = opts;
          opts = {};
        }
        return zlibBuffer(new Deflate(opts), buffer, callback);
      };
      exports.deflateSync = function(buffer, opts) {
        return zlibBufferSync(new Deflate(opts), buffer);
      };
      exports.gzip = function(buffer, opts, callback) {
        if (typeof opts === "function") {
          callback = opts;
          opts = {};
        }
        return zlibBuffer(new Gzip(opts), buffer, callback);
      };
      exports.gzipSync = function(buffer, opts) {
        return zlibBufferSync(new Gzip(opts), buffer);
      };
      exports.deflateRaw = function(buffer, opts, callback) {
        if (typeof opts === "function") {
          callback = opts;
          opts = {};
        }
        return zlibBuffer(new DeflateRaw(opts), buffer, callback);
      };
      exports.deflateRawSync = function(buffer, opts) {
        return zlibBufferSync(new DeflateRaw(opts), buffer);
      };
      exports.unzip = function(buffer, opts, callback) {
        if (typeof opts === "function") {
          callback = opts;
          opts = {};
        }
        return zlibBuffer(new Unzip(opts), buffer, callback);
      };
      exports.unzipSync = function(buffer, opts) {
        return zlibBufferSync(new Unzip(opts), buffer);
      };
      exports.inflate = function(buffer, opts, callback) {
        if (typeof opts === "function") {
          callback = opts;
          opts = {};
        }
        return zlibBuffer(new Inflate(opts), buffer, callback);
      };
      exports.inflateSync = function(buffer, opts) {
        return zlibBufferSync(new Inflate(opts), buffer);
      };
      exports.gunzip = function(buffer, opts, callback) {
        if (typeof opts === "function") {
          callback = opts;
          opts = {};
        }
        return zlibBuffer(new Gunzip(opts), buffer, callback);
      };
      exports.gunzipSync = function(buffer, opts) {
        return zlibBufferSync(new Gunzip(opts), buffer);
      };
      exports.inflateRaw = function(buffer, opts, callback) {
        if (typeof opts === "function") {
          callback = opts;
          opts = {};
        }
        return zlibBuffer(new InflateRaw(opts), buffer, callback);
      };
      exports.inflateRawSync = function(buffer, opts) {
        return zlibBufferSync(new InflateRaw(opts), buffer);
      };
      function zlibBuffer(engine, buffer, callback) {
        var buffers = [];
        var nread = 0;
        engine.on("error", onError);
        engine.on("end", onEnd);
        engine.end(buffer);
        flow();
        function flow() {
          var chunk;
          while (null !== (chunk = engine.read())) {
            buffers.push(chunk);
            nread += chunk.length;
          }
          engine.once("readable", flow);
        }
        function onError(err) {
          engine.removeListener("end", onEnd);
          engine.removeListener("readable", flow);
          callback(err);
        }
        function onEnd() {
          var buf;
          var err = null;
          if (nread >= kMaxLength) {
            err = new RangeError(kRangeErrorMessage);
          } else {
            buf = Buffer2.concat(buffers, nread);
          }
          buffers = [];
          engine.close();
          callback(err, buf);
        }
      }
      function zlibBufferSync(engine, buffer) {
        if (typeof buffer === "string") buffer = Buffer2.from(buffer);
        if (!Buffer2.isBuffer(buffer)) throw new TypeError("Not a string or buffer");
        var flushFlag = engine._finishFlushFlag;
        return engine._processChunk(buffer, flushFlag);
      }
      function Deflate(opts) {
        if (!(this instanceof Deflate)) return new Deflate(opts);
        Zlib.call(this, opts, binding.DEFLATE);
      }
      function Inflate(opts) {
        if (!(this instanceof Inflate)) return new Inflate(opts);
        Zlib.call(this, opts, binding.INFLATE);
      }
      function Gzip(opts) {
        if (!(this instanceof Gzip)) return new Gzip(opts);
        Zlib.call(this, opts, binding.GZIP);
      }
      function Gunzip(opts) {
        if (!(this instanceof Gunzip)) return new Gunzip(opts);
        Zlib.call(this, opts, binding.GUNZIP);
      }
      function DeflateRaw(opts) {
        if (!(this instanceof DeflateRaw)) return new DeflateRaw(opts);
        Zlib.call(this, opts, binding.DEFLATERAW);
      }
      function InflateRaw(opts) {
        if (!(this instanceof InflateRaw)) return new InflateRaw(opts);
        Zlib.call(this, opts, binding.INFLATERAW);
      }
      function Unzip(opts) {
        if (!(this instanceof Unzip)) return new Unzip(opts);
        Zlib.call(this, opts, binding.UNZIP);
      }
      function isValidFlushFlag(flag) {
        return flag === binding.Z_NO_FLUSH || flag === binding.Z_PARTIAL_FLUSH || flag === binding.Z_SYNC_FLUSH || flag === binding.Z_FULL_FLUSH || flag === binding.Z_FINISH || flag === binding.Z_BLOCK;
      }
      function Zlib(opts, mode) {
        var _this = this;
        this._opts = opts = opts || {};
        this._chunkSize = opts.chunkSize || exports.Z_DEFAULT_CHUNK;
        Transform.call(this, opts);
        if (opts.flush && !isValidFlushFlag(opts.flush)) {
          throw new Error("Invalid flush flag: " + opts.flush);
        }
        if (opts.finishFlush && !isValidFlushFlag(opts.finishFlush)) {
          throw new Error("Invalid flush flag: " + opts.finishFlush);
        }
        this._flushFlag = opts.flush || binding.Z_NO_FLUSH;
        this._finishFlushFlag = typeof opts.finishFlush !== "undefined" ? opts.finishFlush : binding.Z_FINISH;
        if (opts.chunkSize) {
          if (opts.chunkSize < exports.Z_MIN_CHUNK || opts.chunkSize > exports.Z_MAX_CHUNK) {
            throw new Error("Invalid chunk size: " + opts.chunkSize);
          }
        }
        if (opts.windowBits) {
          if (opts.windowBits < exports.Z_MIN_WINDOWBITS || opts.windowBits > exports.Z_MAX_WINDOWBITS) {
            throw new Error("Invalid windowBits: " + opts.windowBits);
          }
        }
        if (opts.level) {
          if (opts.level < exports.Z_MIN_LEVEL || opts.level > exports.Z_MAX_LEVEL) {
            throw new Error("Invalid compression level: " + opts.level);
          }
        }
        if (opts.memLevel) {
          if (opts.memLevel < exports.Z_MIN_MEMLEVEL || opts.memLevel > exports.Z_MAX_MEMLEVEL) {
            throw new Error("Invalid memLevel: " + opts.memLevel);
          }
        }
        if (opts.strategy) {
          if (opts.strategy != exports.Z_FILTERED && opts.strategy != exports.Z_HUFFMAN_ONLY && opts.strategy != exports.Z_RLE && opts.strategy != exports.Z_FIXED && opts.strategy != exports.Z_DEFAULT_STRATEGY) {
            throw new Error("Invalid strategy: " + opts.strategy);
          }
        }
        if (opts.dictionary) {
          if (!Buffer2.isBuffer(opts.dictionary)) {
            throw new Error("Invalid dictionary: it should be a Buffer instance");
          }
        }
        this._handle = new binding.Zlib(mode);
        var self2 = this;
        this._hadError = false;
        this._handle.onerror = function(message, errno) {
          _close(self2);
          self2._hadError = true;
          var error = new Error(message);
          error.errno = errno;
          error.code = exports.codes[errno];
          self2.emit("error", error);
        };
        var level = exports.Z_DEFAULT_COMPRESSION;
        if (typeof opts.level === "number") level = opts.level;
        var strategy = exports.Z_DEFAULT_STRATEGY;
        if (typeof opts.strategy === "number") strategy = opts.strategy;
        this._handle.init(opts.windowBits || exports.Z_DEFAULT_WINDOWBITS, level, opts.memLevel || exports.Z_DEFAULT_MEMLEVEL, strategy, opts.dictionary);
        this._buffer = Buffer2.allocUnsafe(this._chunkSize);
        this._offset = 0;
        this._level = level;
        this._strategy = strategy;
        this.once("end", this.close);
        Object.defineProperty(this, "_closed", {
          get: function() {
            return !_this._handle;
          },
          configurable: true,
          enumerable: true
        });
      }
      util.inherits(Zlib, Transform);
      Zlib.prototype.params = function(level, strategy, callback) {
        if (level < exports.Z_MIN_LEVEL || level > exports.Z_MAX_LEVEL) {
          throw new RangeError("Invalid compression level: " + level);
        }
        if (strategy != exports.Z_FILTERED && strategy != exports.Z_HUFFMAN_ONLY && strategy != exports.Z_RLE && strategy != exports.Z_FIXED && strategy != exports.Z_DEFAULT_STRATEGY) {
          throw new TypeError("Invalid strategy: " + strategy);
        }
        if (this._level !== level || this._strategy !== strategy) {
          var self2 = this;
          this.flush(binding.Z_SYNC_FLUSH, function() {
            assert(self2._handle, "zlib binding closed");
            self2._handle.params(level, strategy);
            if (!self2._hadError) {
              self2._level = level;
              self2._strategy = strategy;
              if (callback) callback();
            }
          });
        } else {
          process.nextTick(callback);
        }
      };
      Zlib.prototype.reset = function() {
        assert(this._handle, "zlib binding closed");
        return this._handle.reset();
      };
      Zlib.prototype._flush = function(callback) {
        this._transform(Buffer2.alloc(0), "", callback);
      };
      Zlib.prototype.flush = function(kind, callback) {
        var _this2 = this;
        var ws = this._writableState;
        if (typeof kind === "function" || kind === void 0 && !callback) {
          callback = kind;
          kind = binding.Z_FULL_FLUSH;
        }
        if (ws.ended) {
          if (callback) process.nextTick(callback);
        } else if (ws.ending) {
          if (callback) this.once("end", callback);
        } else if (ws.needDrain) {
          if (callback) {
            this.once("drain", function() {
              return _this2.flush(kind, callback);
            });
          }
        } else {
          this._flushFlag = kind;
          this.write(Buffer2.alloc(0), "", callback);
        }
      };
      Zlib.prototype.close = function(callback) {
        _close(this, callback);
        process.nextTick(emitCloseNT, this);
      };
      function _close(engine, callback) {
        if (callback) process.nextTick(callback);
        if (!engine._handle) return;
        engine._handle.close();
        engine._handle = null;
      }
      function emitCloseNT(self2) {
        self2.emit("close");
      }
      Zlib.prototype._transform = function(chunk, encoding, cb) {
        var flushFlag;
        var ws = this._writableState;
        var ending = ws.ending || ws.ended;
        var last = ending && (!chunk || ws.length === chunk.length);
        if (chunk !== null && !Buffer2.isBuffer(chunk)) return cb(new Error("invalid input"));
        if (!this._handle) return cb(new Error("zlib binding closed"));
        if (last) flushFlag = this._finishFlushFlag;
        else {
          flushFlag = this._flushFlag;
          if (chunk.length >= ws.length) {
            this._flushFlag = this._opts.flush || binding.Z_NO_FLUSH;
          }
        }
        this._processChunk(chunk, flushFlag, cb);
      };
      Zlib.prototype._processChunk = function(chunk, flushFlag, cb) {
        var availInBefore = chunk && chunk.length;
        var availOutBefore = this._chunkSize - this._offset;
        var inOff = 0;
        var self2 = this;
        var async = typeof cb === "function";
        if (!async) {
          var buffers = [];
          var nread = 0;
          var error;
          this.on("error", function(er) {
            error = er;
          });
          assert(this._handle, "zlib binding closed");
          do {
            var res = this._handle.writeSync(
              flushFlag,
              chunk,
              // in
              inOff,
              // in_off
              availInBefore,
              // in_len
              this._buffer,
              // out
              this._offset,
              //out_off
              availOutBefore
            );
          } while (!this._hadError && callback(res[0], res[1]));
          if (this._hadError) {
            throw error;
          }
          if (nread >= kMaxLength) {
            _close(this);
            throw new RangeError(kRangeErrorMessage);
          }
          var buf = Buffer2.concat(buffers, nread);
          _close(this);
          return buf;
        }
        assert(this._handle, "zlib binding closed");
        var req = this._handle.write(
          flushFlag,
          chunk,
          // in
          inOff,
          // in_off
          availInBefore,
          // in_len
          this._buffer,
          // out
          this._offset,
          //out_off
          availOutBefore
        );
        req.buffer = chunk;
        req.callback = callback;
        function callback(availInAfter, availOutAfter) {
          if (this) {
            this.buffer = null;
            this.callback = null;
          }
          if (self2._hadError) return;
          var have = availOutBefore - availOutAfter;
          assert(have >= 0, "have should not go down");
          if (have > 0) {
            var out = self2._buffer.slice(self2._offset, self2._offset + have);
            self2._offset += have;
            if (async) {
              self2.push(out);
            } else {
              buffers.push(out);
              nread += out.length;
            }
          }
          if (availOutAfter === 0 || self2._offset >= self2._chunkSize) {
            availOutBefore = self2._chunkSize;
            self2._offset = 0;
            self2._buffer = Buffer2.allocUnsafe(self2._chunkSize);
          }
          if (availOutAfter === 0) {
            inOff += availInBefore - availInAfter;
            availInBefore = availInAfter;
            if (!async) return true;
            var newReq = self2._handle.write(flushFlag, chunk, inOff, availInBefore, self2._buffer, self2._offset, self2._chunkSize);
            newReq.callback = callback;
            newReq.buffer = chunk;
            return;
          }
          if (!async) return false;
          cb();
        }
      };
      util.inherits(Deflate, Zlib);
      util.inherits(Inflate, Zlib);
      util.inherits(Gzip, Zlib);
      util.inherits(Gunzip, Zlib);
      util.inherits(DeflateRaw, Zlib);
      util.inherits(InflateRaw, Zlib);
      util.inherits(Unzip, Zlib);
    }
  });

  // node_modules/pngjs/lib/chunkstream.js
  var require_chunkstream = __commonJS({
    "node_modules/pngjs/lib/chunkstream.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var util = require_util();
      var Stream = require_stream_browserify();
      var ChunkStream = module.exports = function() {
        Stream.call(this);
        this._buffers = [];
        this._buffered = 0;
        this._reads = [];
        this._paused = false;
        this._encoding = "utf8";
        this.writable = true;
      };
      util.inherits(ChunkStream, Stream);
      ChunkStream.prototype.read = function(length, callback) {
        this._reads.push({
          length: Math.abs(length),
          // if length < 0 then at most this length
          allowLess: length < 0,
          func: callback
        });
        process.nextTick(
          function() {
            this._process();
            if (this._paused && this._reads && this._reads.length > 0) {
              this._paused = false;
              this.emit("drain");
            }
          }.bind(this)
        );
      };
      ChunkStream.prototype.write = function(data, encoding) {
        if (!this.writable) {
          this.emit("error", new Error("Stream not writable"));
          return false;
        }
        let dataBuffer;
        if (import_buffer.Buffer.isBuffer(data)) {
          dataBuffer = data;
        } else {
          dataBuffer = import_buffer.Buffer.from(data, encoding || this._encoding);
        }
        this._buffers.push(dataBuffer);
        this._buffered += dataBuffer.length;
        this._process();
        if (this._reads && this._reads.length === 0) {
          this._paused = true;
        }
        return this.writable && !this._paused;
      };
      ChunkStream.prototype.end = function(data, encoding) {
        if (data) {
          this.write(data, encoding);
        }
        this.writable = false;
        if (!this._buffers) {
          return;
        }
        if (this._buffers.length === 0) {
          this._end();
        } else {
          this._buffers.push(null);
          this._process();
        }
      };
      ChunkStream.prototype.destroySoon = ChunkStream.prototype.end;
      ChunkStream.prototype._end = function() {
        if (this._reads.length > 0) {
          this.emit("error", new Error("Unexpected end of input"));
        }
        this.destroy();
      };
      ChunkStream.prototype.destroy = function() {
        if (!this._buffers) {
          return;
        }
        this.writable = false;
        this._reads = null;
        this._buffers = null;
        this.emit("close");
      };
      ChunkStream.prototype._processReadAllowingLess = function(read) {
        this._reads.shift();
        let smallerBuf = this._buffers[0];
        if (smallerBuf.length > read.length) {
          this._buffered -= read.length;
          this._buffers[0] = smallerBuf.slice(read.length);
          read.func.call(this, smallerBuf.slice(0, read.length));
        } else {
          this._buffered -= smallerBuf.length;
          this._buffers.shift();
          read.func.call(this, smallerBuf);
        }
      };
      ChunkStream.prototype._processRead = function(read) {
        this._reads.shift();
        let pos = 0;
        let count = 0;
        let data = import_buffer.Buffer.alloc(read.length);
        while (pos < read.length) {
          let buf = this._buffers[count++];
          let len = Math.min(buf.length, read.length - pos);
          buf.copy(data, pos, 0, len);
          pos += len;
          if (len !== buf.length) {
            this._buffers[--count] = buf.slice(len);
          }
        }
        if (count > 0) {
          this._buffers.splice(0, count);
        }
        this._buffered -= read.length;
        read.func.call(this, data);
      };
      ChunkStream.prototype._process = function() {
        try {
          while (this._buffered > 0 && this._reads && this._reads.length > 0) {
            let read = this._reads[0];
            if (read.allowLess) {
              this._processReadAllowingLess(read);
            } else if (this._buffered >= read.length) {
              this._processRead(read);
            } else {
              break;
            }
          }
          if (this._buffers && !this.writable) {
            this._end();
          }
        } catch (ex) {
          this.emit("error", ex);
        }
      };
    }
  });

  // node_modules/pngjs/lib/interlace.js
  var require_interlace = __commonJS({
    "node_modules/pngjs/lib/interlace.js"(exports) {
      "use strict";
      init_browser_shims();
      var imagePasses = [
        {
          // pass 1 - 1px
          x: [0],
          y: [0]
        },
        {
          // pass 2 - 1px
          x: [4],
          y: [0]
        },
        {
          // pass 3 - 2px
          x: [0, 4],
          y: [4]
        },
        {
          // pass 4 - 4px
          x: [2, 6],
          y: [0, 4]
        },
        {
          // pass 5 - 8px
          x: [0, 2, 4, 6],
          y: [2, 6]
        },
        {
          // pass 6 - 16px
          x: [1, 3, 5, 7],
          y: [0, 2, 4, 6]
        },
        {
          // pass 7 - 32px
          x: [0, 1, 2, 3, 4, 5, 6, 7],
          y: [1, 3, 5, 7]
        }
      ];
      exports.getImagePasses = function(width, height) {
        let images = [];
        let xLeftOver = width % 8;
        let yLeftOver = height % 8;
        let xRepeats = (width - xLeftOver) / 8;
        let yRepeats = (height - yLeftOver) / 8;
        for (let i = 0; i < imagePasses.length; i++) {
          let pass = imagePasses[i];
          let passWidth = xRepeats * pass.x.length;
          let passHeight = yRepeats * pass.y.length;
          for (let j = 0; j < pass.x.length; j++) {
            if (pass.x[j] < xLeftOver) {
              passWidth++;
            } else {
              break;
            }
          }
          for (let j = 0; j < pass.y.length; j++) {
            if (pass.y[j] < yLeftOver) {
              passHeight++;
            } else {
              break;
            }
          }
          if (passWidth > 0 && passHeight > 0) {
            images.push({ width: passWidth, height: passHeight, index: i });
          }
        }
        return images;
      };
      exports.getInterlaceIterator = function(width) {
        return function(x, y, pass) {
          let outerXLeftOver = x % imagePasses[pass].x.length;
          let outerX = (x - outerXLeftOver) / imagePasses[pass].x.length * 8 + imagePasses[pass].x[outerXLeftOver];
          let outerYLeftOver = y % imagePasses[pass].y.length;
          let outerY = (y - outerYLeftOver) / imagePasses[pass].y.length * 8 + imagePasses[pass].y[outerYLeftOver];
          return outerX * 4 + outerY * width * 4;
        };
      };
    }
  });

  // node_modules/pngjs/lib/paeth-predictor.js
  var require_paeth_predictor = __commonJS({
    "node_modules/pngjs/lib/paeth-predictor.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = function paethPredictor(left, above, upLeft) {
        let paeth = left + above - upLeft;
        let pLeft = Math.abs(paeth - left);
        let pAbove = Math.abs(paeth - above);
        let pUpLeft = Math.abs(paeth - upLeft);
        if (pLeft <= pAbove && pLeft <= pUpLeft) {
          return left;
        }
        if (pAbove <= pUpLeft) {
          return above;
        }
        return upLeft;
      };
    }
  });

  // node_modules/pngjs/lib/filter-parse.js
  var require_filter_parse = __commonJS({
    "node_modules/pngjs/lib/filter-parse.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var interlaceUtils = require_interlace();
      var paethPredictor = require_paeth_predictor();
      function getByteWidth(width, bpp, depth) {
        let byteWidth = width * bpp;
        if (depth !== 8) {
          byteWidth = Math.ceil(byteWidth / (8 / depth));
        }
        return byteWidth;
      }
      var Filter = module.exports = function(bitmapInfo, dependencies) {
        let width = bitmapInfo.width;
        let height = bitmapInfo.height;
        let interlace = bitmapInfo.interlace;
        let bpp = bitmapInfo.bpp;
        let depth = bitmapInfo.depth;
        this.read = dependencies.read;
        this.write = dependencies.write;
        this.complete = dependencies.complete;
        this._imageIndex = 0;
        this._images = [];
        if (interlace) {
          let passes = interlaceUtils.getImagePasses(width, height);
          for (let i = 0; i < passes.length; i++) {
            this._images.push({
              byteWidth: getByteWidth(passes[i].width, bpp, depth),
              height: passes[i].height,
              lineIndex: 0
            });
          }
        } else {
          this._images.push({
            byteWidth: getByteWidth(width, bpp, depth),
            height,
            lineIndex: 0
          });
        }
        if (depth === 8) {
          this._xComparison = bpp;
        } else if (depth === 16) {
          this._xComparison = bpp * 2;
        } else {
          this._xComparison = 1;
        }
      };
      Filter.prototype.start = function() {
        this.read(
          this._images[this._imageIndex].byteWidth + 1,
          this._reverseFilterLine.bind(this)
        );
      };
      Filter.prototype._unFilterType1 = function(rawData, unfilteredLine, byteWidth) {
        let xComparison = this._xComparison;
        let xBiggerThan = xComparison - 1;
        for (let x = 0; x < byteWidth; x++) {
          let rawByte = rawData[1 + x];
          let f1Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
          unfilteredLine[x] = rawByte + f1Left;
        }
      };
      Filter.prototype._unFilterType2 = function(rawData, unfilteredLine, byteWidth) {
        let lastLine = this._lastLine;
        for (let x = 0; x < byteWidth; x++) {
          let rawByte = rawData[1 + x];
          let f2Up = lastLine ? lastLine[x] : 0;
          unfilteredLine[x] = rawByte + f2Up;
        }
      };
      Filter.prototype._unFilterType3 = function(rawData, unfilteredLine, byteWidth) {
        let xComparison = this._xComparison;
        let xBiggerThan = xComparison - 1;
        let lastLine = this._lastLine;
        for (let x = 0; x < byteWidth; x++) {
          let rawByte = rawData[1 + x];
          let f3Up = lastLine ? lastLine[x] : 0;
          let f3Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
          let f3Add = Math.floor((f3Left + f3Up) / 2);
          unfilteredLine[x] = rawByte + f3Add;
        }
      };
      Filter.prototype._unFilterType4 = function(rawData, unfilteredLine, byteWidth) {
        let xComparison = this._xComparison;
        let xBiggerThan = xComparison - 1;
        let lastLine = this._lastLine;
        for (let x = 0; x < byteWidth; x++) {
          let rawByte = rawData[1 + x];
          let f4Up = lastLine ? lastLine[x] : 0;
          let f4Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
          let f4UpLeft = x > xBiggerThan && lastLine ? lastLine[x - xComparison] : 0;
          let f4Add = paethPredictor(f4Left, f4Up, f4UpLeft);
          unfilteredLine[x] = rawByte + f4Add;
        }
      };
      Filter.prototype._reverseFilterLine = function(rawData) {
        let filter = rawData[0];
        let unfilteredLine;
        let currentImage = this._images[this._imageIndex];
        let byteWidth = currentImage.byteWidth;
        if (filter === 0) {
          unfilteredLine = rawData.slice(1, byteWidth + 1);
        } else {
          unfilteredLine = import_buffer.Buffer.alloc(byteWidth);
          switch (filter) {
            case 1:
              this._unFilterType1(rawData, unfilteredLine, byteWidth);
              break;
            case 2:
              this._unFilterType2(rawData, unfilteredLine, byteWidth);
              break;
            case 3:
              this._unFilterType3(rawData, unfilteredLine, byteWidth);
              break;
            case 4:
              this._unFilterType4(rawData, unfilteredLine, byteWidth);
              break;
            default:
              throw new Error("Unrecognised filter type - " + filter);
          }
        }
        this.write(unfilteredLine);
        currentImage.lineIndex++;
        if (currentImage.lineIndex >= currentImage.height) {
          this._lastLine = null;
          this._imageIndex++;
          currentImage = this._images[this._imageIndex];
        } else {
          this._lastLine = unfilteredLine;
        }
        if (currentImage) {
          this.read(currentImage.byteWidth + 1, this._reverseFilterLine.bind(this));
        } else {
          this._lastLine = null;
          this.complete();
        }
      };
    }
  });

  // node_modules/pngjs/lib/filter-parse-async.js
  var require_filter_parse_async = __commonJS({
    "node_modules/pngjs/lib/filter-parse-async.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var util = require_util();
      var ChunkStream = require_chunkstream();
      var Filter = require_filter_parse();
      var FilterAsync = module.exports = function(bitmapInfo) {
        ChunkStream.call(this);
        let buffers = [];
        let that = this;
        this._filter = new Filter(bitmapInfo, {
          read: this.read.bind(this),
          write: function(buffer) {
            buffers.push(buffer);
          },
          complete: function() {
            that.emit("complete", import_buffer.Buffer.concat(buffers));
          }
        });
        this._filter.start();
      };
      util.inherits(FilterAsync, ChunkStream);
    }
  });

  // node_modules/pngjs/lib/constants.js
  var require_constants2 = __commonJS({
    "node_modules/pngjs/lib/constants.js"(exports, module) {
      "use strict";
      init_browser_shims();
      module.exports = {
        PNG_SIGNATURE: [137, 80, 78, 71, 13, 10, 26, 10],
        TYPE_IHDR: 1229472850,
        TYPE_IEND: 1229278788,
        TYPE_IDAT: 1229209940,
        TYPE_PLTE: 1347179589,
        TYPE_tRNS: 1951551059,
        // eslint-disable-line camelcase
        TYPE_gAMA: 1732332865,
        // eslint-disable-line camelcase
        // color-type bits
        COLORTYPE_GRAYSCALE: 0,
        COLORTYPE_PALETTE: 1,
        COLORTYPE_COLOR: 2,
        COLORTYPE_ALPHA: 4,
        // e.g. grayscale and alpha
        // color-type combinations
        COLORTYPE_PALETTE_COLOR: 3,
        COLORTYPE_COLOR_ALPHA: 6,
        COLORTYPE_TO_BPP_MAP: {
          0: 1,
          2: 3,
          3: 1,
          4: 2,
          6: 4
        },
        GAMMA_DIVISION: 1e5
      };
    }
  });

  // node_modules/pngjs/lib/crc.js
  var require_crc = __commonJS({
    "node_modules/pngjs/lib/crc.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var crcTable = [];
      (function() {
        for (let i = 0; i < 256; i++) {
          let currentCrc = i;
          for (let j = 0; j < 8; j++) {
            if (currentCrc & 1) {
              currentCrc = 3988292384 ^ currentCrc >>> 1;
            } else {
              currentCrc = currentCrc >>> 1;
            }
          }
          crcTable[i] = currentCrc;
        }
      })();
      var CrcCalculator = module.exports = function() {
        this._crc = -1;
      };
      CrcCalculator.prototype.write = function(data) {
        for (let i = 0; i < data.length; i++) {
          this._crc = crcTable[(this._crc ^ data[i]) & 255] ^ this._crc >>> 8;
        }
        return true;
      };
      CrcCalculator.prototype.crc32 = function() {
        return this._crc ^ -1;
      };
      CrcCalculator.crc32 = function(buf) {
        let crc = -1;
        for (let i = 0; i < buf.length; i++) {
          crc = crcTable[(crc ^ buf[i]) & 255] ^ crc >>> 8;
        }
        return crc ^ -1;
      };
    }
  });

  // node_modules/pngjs/lib/parser.js
  var require_parser = __commonJS({
    "node_modules/pngjs/lib/parser.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var constants = require_constants2();
      var CrcCalculator = require_crc();
      var Parser = module.exports = function(options, dependencies) {
        this._options = options;
        options.checkCRC = options.checkCRC !== false;
        this._hasIHDR = false;
        this._hasIEND = false;
        this._emittedHeadersFinished = false;
        this._palette = [];
        this._colorType = 0;
        this._chunks = {};
        this._chunks[constants.TYPE_IHDR] = this._handleIHDR.bind(this);
        this._chunks[constants.TYPE_IEND] = this._handleIEND.bind(this);
        this._chunks[constants.TYPE_IDAT] = this._handleIDAT.bind(this);
        this._chunks[constants.TYPE_PLTE] = this._handlePLTE.bind(this);
        this._chunks[constants.TYPE_tRNS] = this._handleTRNS.bind(this);
        this._chunks[constants.TYPE_gAMA] = this._handleGAMA.bind(this);
        this.read = dependencies.read;
        this.error = dependencies.error;
        this.metadata = dependencies.metadata;
        this.gamma = dependencies.gamma;
        this.transColor = dependencies.transColor;
        this.palette = dependencies.palette;
        this.parsed = dependencies.parsed;
        this.inflateData = dependencies.inflateData;
        this.finished = dependencies.finished;
        this.simpleTransparency = dependencies.simpleTransparency;
        this.headersFinished = dependencies.headersFinished || function() {
        };
      };
      Parser.prototype.start = function() {
        this.read(constants.PNG_SIGNATURE.length, this._parseSignature.bind(this));
      };
      Parser.prototype._parseSignature = function(data) {
        let signature = constants.PNG_SIGNATURE;
        for (let i = 0; i < signature.length; i++) {
          if (data[i] !== signature[i]) {
            this.error(new Error("Invalid file signature"));
            return;
          }
        }
        this.read(8, this._parseChunkBegin.bind(this));
      };
      Parser.prototype._parseChunkBegin = function(data) {
        let length = data.readUInt32BE(0);
        let type = data.readUInt32BE(4);
        let name = "";
        for (let i = 4; i < 8; i++) {
          name += String.fromCharCode(data[i]);
        }
        let ancillary = Boolean(data[4] & 32);
        if (!this._hasIHDR && type !== constants.TYPE_IHDR) {
          this.error(new Error("Expected IHDR on beggining"));
          return;
        }
        this._crc = new CrcCalculator();
        this._crc.write(import_buffer.Buffer.from(name));
        if (this._chunks[type]) {
          return this._chunks[type](length);
        }
        if (!ancillary) {
          this.error(new Error("Unsupported critical chunk type " + name));
          return;
        }
        this.read(length + 4, this._skipChunk.bind(this));
      };
      Parser.prototype._skipChunk = function() {
        this.read(8, this._parseChunkBegin.bind(this));
      };
      Parser.prototype._handleChunkEnd = function() {
        this.read(4, this._parseChunkEnd.bind(this));
      };
      Parser.prototype._parseChunkEnd = function(data) {
        let fileCrc = data.readInt32BE(0);
        let calcCrc = this._crc.crc32();
        if (this._options.checkCRC && calcCrc !== fileCrc) {
          this.error(new Error("Crc error - " + fileCrc + " - " + calcCrc));
          return;
        }
        if (!this._hasIEND) {
          this.read(8, this._parseChunkBegin.bind(this));
        }
      };
      Parser.prototype._handleIHDR = function(length) {
        this.read(length, this._parseIHDR.bind(this));
      };
      Parser.prototype._parseIHDR = function(data) {
        this._crc.write(data);
        let width = data.readUInt32BE(0);
        let height = data.readUInt32BE(4);
        let depth = data[8];
        let colorType = data[9];
        let compr = data[10];
        let filter = data[11];
        let interlace = data[12];
        if (depth !== 8 && depth !== 4 && depth !== 2 && depth !== 1 && depth !== 16) {
          this.error(new Error("Unsupported bit depth " + depth));
          return;
        }
        if (!(colorType in constants.COLORTYPE_TO_BPP_MAP)) {
          this.error(new Error("Unsupported color type"));
          return;
        }
        if (compr !== 0) {
          this.error(new Error("Unsupported compression method"));
          return;
        }
        if (filter !== 0) {
          this.error(new Error("Unsupported filter method"));
          return;
        }
        if (interlace !== 0 && interlace !== 1) {
          this.error(new Error("Unsupported interlace method"));
          return;
        }
        this._colorType = colorType;
        let bpp = constants.COLORTYPE_TO_BPP_MAP[this._colorType];
        this._hasIHDR = true;
        this.metadata({
          width,
          height,
          depth,
          interlace: Boolean(interlace),
          palette: Boolean(colorType & constants.COLORTYPE_PALETTE),
          color: Boolean(colorType & constants.COLORTYPE_COLOR),
          alpha: Boolean(colorType & constants.COLORTYPE_ALPHA),
          bpp,
          colorType
        });
        this._handleChunkEnd();
      };
      Parser.prototype._handlePLTE = function(length) {
        this.read(length, this._parsePLTE.bind(this));
      };
      Parser.prototype._parsePLTE = function(data) {
        this._crc.write(data);
        let entries = Math.floor(data.length / 3);
        for (let i = 0; i < entries; i++) {
          this._palette.push([data[i * 3], data[i * 3 + 1], data[i * 3 + 2], 255]);
        }
        this.palette(this._palette);
        this._handleChunkEnd();
      };
      Parser.prototype._handleTRNS = function(length) {
        this.simpleTransparency();
        this.read(length, this._parseTRNS.bind(this));
      };
      Parser.prototype._parseTRNS = function(data) {
        this._crc.write(data);
        if (this._colorType === constants.COLORTYPE_PALETTE_COLOR) {
          if (this._palette.length === 0) {
            this.error(new Error("Transparency chunk must be after palette"));
            return;
          }
          if (data.length > this._palette.length) {
            this.error(new Error("More transparent colors than palette size"));
            return;
          }
          for (let i = 0; i < data.length; i++) {
            this._palette[i][3] = data[i];
          }
          this.palette(this._palette);
        }
        if (this._colorType === constants.COLORTYPE_GRAYSCALE) {
          this.transColor([data.readUInt16BE(0)]);
        }
        if (this._colorType === constants.COLORTYPE_COLOR) {
          this.transColor([
            data.readUInt16BE(0),
            data.readUInt16BE(2),
            data.readUInt16BE(4)
          ]);
        }
        this._handleChunkEnd();
      };
      Parser.prototype._handleGAMA = function(length) {
        this.read(length, this._parseGAMA.bind(this));
      };
      Parser.prototype._parseGAMA = function(data) {
        this._crc.write(data);
        this.gamma(data.readUInt32BE(0) / constants.GAMMA_DIVISION);
        this._handleChunkEnd();
      };
      Parser.prototype._handleIDAT = function(length) {
        if (!this._emittedHeadersFinished) {
          this._emittedHeadersFinished = true;
          this.headersFinished();
        }
        this.read(-length, this._parseIDAT.bind(this, length));
      };
      Parser.prototype._parseIDAT = function(length, data) {
        this._crc.write(data);
        if (this._colorType === constants.COLORTYPE_PALETTE_COLOR && this._palette.length === 0) {
          throw new Error("Expected palette not found");
        }
        this.inflateData(data);
        let leftOverLength = length - data.length;
        if (leftOverLength > 0) {
          this._handleIDAT(leftOverLength);
        } else {
          this._handleChunkEnd();
        }
      };
      Parser.prototype._handleIEND = function(length) {
        this.read(length, this._parseIEND.bind(this));
      };
      Parser.prototype._parseIEND = function(data) {
        this._crc.write(data);
        this._hasIEND = true;
        this._handleChunkEnd();
        if (this.finished) {
          this.finished();
        }
      };
    }
  });

  // node_modules/pngjs/lib/bitmapper.js
  var require_bitmapper = __commonJS({
    "node_modules/pngjs/lib/bitmapper.js"(exports) {
      "use strict";
      init_browser_shims();
      var interlaceUtils = require_interlace();
      var pixelBppMapper = [
        // 0 - dummy entry
        function() {
        },
        // 1 - L
        // 0: 0, 1: 0, 2: 0, 3: 0xff
        function(pxData, data, pxPos, rawPos) {
          if (rawPos === data.length) {
            throw new Error("Ran out of data");
          }
          let pixel = data[rawPos];
          pxData[pxPos] = pixel;
          pxData[pxPos + 1] = pixel;
          pxData[pxPos + 2] = pixel;
          pxData[pxPos + 3] = 255;
        },
        // 2 - LA
        // 0: 0, 1: 0, 2: 0, 3: 1
        function(pxData, data, pxPos, rawPos) {
          if (rawPos + 1 >= data.length) {
            throw new Error("Ran out of data");
          }
          let pixel = data[rawPos];
          pxData[pxPos] = pixel;
          pxData[pxPos + 1] = pixel;
          pxData[pxPos + 2] = pixel;
          pxData[pxPos + 3] = data[rawPos + 1];
        },
        // 3 - RGB
        // 0: 0, 1: 1, 2: 2, 3: 0xff
        function(pxData, data, pxPos, rawPos) {
          if (rawPos + 2 >= data.length) {
            throw new Error("Ran out of data");
          }
          pxData[pxPos] = data[rawPos];
          pxData[pxPos + 1] = data[rawPos + 1];
          pxData[pxPos + 2] = data[rawPos + 2];
          pxData[pxPos + 3] = 255;
        },
        // 4 - RGBA
        // 0: 0, 1: 1, 2: 2, 3: 3
        function(pxData, data, pxPos, rawPos) {
          if (rawPos + 3 >= data.length) {
            throw new Error("Ran out of data");
          }
          pxData[pxPos] = data[rawPos];
          pxData[pxPos + 1] = data[rawPos + 1];
          pxData[pxPos + 2] = data[rawPos + 2];
          pxData[pxPos + 3] = data[rawPos + 3];
        }
      ];
      var pixelBppCustomMapper = [
        // 0 - dummy entry
        function() {
        },
        // 1 - L
        // 0: 0, 1: 0, 2: 0, 3: 0xff
        function(pxData, pixelData, pxPos, maxBit) {
          let pixel = pixelData[0];
          pxData[pxPos] = pixel;
          pxData[pxPos + 1] = pixel;
          pxData[pxPos + 2] = pixel;
          pxData[pxPos + 3] = maxBit;
        },
        // 2 - LA
        // 0: 0, 1: 0, 2: 0, 3: 1
        function(pxData, pixelData, pxPos) {
          let pixel = pixelData[0];
          pxData[pxPos] = pixel;
          pxData[pxPos + 1] = pixel;
          pxData[pxPos + 2] = pixel;
          pxData[pxPos + 3] = pixelData[1];
        },
        // 3 - RGB
        // 0: 0, 1: 1, 2: 2, 3: 0xff
        function(pxData, pixelData, pxPos, maxBit) {
          pxData[pxPos] = pixelData[0];
          pxData[pxPos + 1] = pixelData[1];
          pxData[pxPos + 2] = pixelData[2];
          pxData[pxPos + 3] = maxBit;
        },
        // 4 - RGBA
        // 0: 0, 1: 1, 2: 2, 3: 3
        function(pxData, pixelData, pxPos) {
          pxData[pxPos] = pixelData[0];
          pxData[pxPos + 1] = pixelData[1];
          pxData[pxPos + 2] = pixelData[2];
          pxData[pxPos + 3] = pixelData[3];
        }
      ];
      function bitRetriever(data, depth) {
        let leftOver = [];
        let i = 0;
        function split() {
          if (i === data.length) {
            throw new Error("Ran out of data");
          }
          let byte = data[i];
          i++;
          let byte8, byte7, byte6, byte5, byte4, byte3, byte2, byte1;
          switch (depth) {
            default:
              throw new Error("unrecognised depth");
            case 16:
              byte2 = data[i];
              i++;
              leftOver.push((byte << 8) + byte2);
              break;
            case 4:
              byte2 = byte & 15;
              byte1 = byte >> 4;
              leftOver.push(byte1, byte2);
              break;
            case 2:
              byte4 = byte & 3;
              byte3 = byte >> 2 & 3;
              byte2 = byte >> 4 & 3;
              byte1 = byte >> 6 & 3;
              leftOver.push(byte1, byte2, byte3, byte4);
              break;
            case 1:
              byte8 = byte & 1;
              byte7 = byte >> 1 & 1;
              byte6 = byte >> 2 & 1;
              byte5 = byte >> 3 & 1;
              byte4 = byte >> 4 & 1;
              byte3 = byte >> 5 & 1;
              byte2 = byte >> 6 & 1;
              byte1 = byte >> 7 & 1;
              leftOver.push(byte1, byte2, byte3, byte4, byte5, byte6, byte7, byte8);
              break;
          }
        }
        return {
          get: function(count) {
            while (leftOver.length < count) {
              split();
            }
            let returner = leftOver.slice(0, count);
            leftOver = leftOver.slice(count);
            return returner;
          },
          resetAfterLine: function() {
            leftOver.length = 0;
          },
          end: function() {
            if (i !== data.length) {
              throw new Error("extra data found");
            }
          }
        };
      }
      function mapImage8Bit(image, pxData, getPxPos, bpp, data, rawPos) {
        let imageWidth = image.width;
        let imageHeight = image.height;
        let imagePass = image.index;
        for (let y = 0; y < imageHeight; y++) {
          for (let x = 0; x < imageWidth; x++) {
            let pxPos = getPxPos(x, y, imagePass);
            pixelBppMapper[bpp](pxData, data, pxPos, rawPos);
            rawPos += bpp;
          }
        }
        return rawPos;
      }
      function mapImageCustomBit(image, pxData, getPxPos, bpp, bits, maxBit) {
        let imageWidth = image.width;
        let imageHeight = image.height;
        let imagePass = image.index;
        for (let y = 0; y < imageHeight; y++) {
          for (let x = 0; x < imageWidth; x++) {
            let pixelData = bits.get(bpp);
            let pxPos = getPxPos(x, y, imagePass);
            pixelBppCustomMapper[bpp](pxData, pixelData, pxPos, maxBit);
          }
          bits.resetAfterLine();
        }
      }
      exports.dataToBitMap = function(data, bitmapInfo) {
        let width = bitmapInfo.width;
        let height = bitmapInfo.height;
        let depth = bitmapInfo.depth;
        let bpp = bitmapInfo.bpp;
        let interlace = bitmapInfo.interlace;
        let bits;
        if (depth !== 8) {
          bits = bitRetriever(data, depth);
        }
        let pxData;
        if (depth <= 8) {
          pxData = import_buffer.Buffer.alloc(width * height * 4);
        } else {
          pxData = new Uint16Array(width * height * 4);
        }
        let maxBit = Math.pow(2, depth) - 1;
        let rawPos = 0;
        let images;
        let getPxPos;
        if (interlace) {
          images = interlaceUtils.getImagePasses(width, height);
          getPxPos = interlaceUtils.getInterlaceIterator(width, height);
        } else {
          let nonInterlacedPxPos = 0;
          getPxPos = function() {
            let returner = nonInterlacedPxPos;
            nonInterlacedPxPos += 4;
            return returner;
          };
          images = [{ width, height }];
        }
        for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
          if (depth === 8) {
            rawPos = mapImage8Bit(
              images[imageIndex],
              pxData,
              getPxPos,
              bpp,
              data,
              rawPos
            );
          } else {
            mapImageCustomBit(
              images[imageIndex],
              pxData,
              getPxPos,
              bpp,
              bits,
              maxBit
            );
          }
        }
        if (depth === 8) {
          if (rawPos !== data.length) {
            throw new Error("extra data found");
          }
        } else {
          bits.end();
        }
        return pxData;
      };
    }
  });

  // node_modules/pngjs/lib/format-normaliser.js
  var require_format_normaliser = __commonJS({
    "node_modules/pngjs/lib/format-normaliser.js"(exports, module) {
      "use strict";
      init_browser_shims();
      function dePalette(indata, outdata, width, height, palette) {
        let pxPos = 0;
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            let color = palette[indata[pxPos]];
            if (!color) {
              throw new Error("index " + indata[pxPos] + " not in palette");
            }
            for (let i = 0; i < 4; i++) {
              outdata[pxPos + i] = color[i];
            }
            pxPos += 4;
          }
        }
      }
      function replaceTransparentColor(indata, outdata, width, height, transColor) {
        let pxPos = 0;
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            let makeTrans = false;
            if (transColor.length === 1) {
              if (transColor[0] === indata[pxPos]) {
                makeTrans = true;
              }
            } else if (transColor[0] === indata[pxPos] && transColor[1] === indata[pxPos + 1] && transColor[2] === indata[pxPos + 2]) {
              makeTrans = true;
            }
            if (makeTrans) {
              for (let i = 0; i < 4; i++) {
                outdata[pxPos + i] = 0;
              }
            }
            pxPos += 4;
          }
        }
      }
      function scaleDepth(indata, outdata, width, height, depth) {
        let maxOutSample = 255;
        let maxInSample = Math.pow(2, depth) - 1;
        let pxPos = 0;
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            for (let i = 0; i < 4; i++) {
              outdata[pxPos + i] = Math.floor(
                indata[pxPos + i] * maxOutSample / maxInSample + 0.5
              );
            }
            pxPos += 4;
          }
        }
      }
      module.exports = function(indata, imageData, skipRescale = false) {
        let depth = imageData.depth;
        let width = imageData.width;
        let height = imageData.height;
        let colorType = imageData.colorType;
        let transColor = imageData.transColor;
        let palette = imageData.palette;
        let outdata = indata;
        if (colorType === 3) {
          dePalette(indata, outdata, width, height, palette);
        } else {
          if (transColor) {
            replaceTransparentColor(indata, outdata, width, height, transColor);
          }
          if (depth !== 8 && !skipRescale) {
            if (depth === 16) {
              outdata = import_buffer.Buffer.alloc(width * height * 4);
            }
            scaleDepth(indata, outdata, width, height, depth);
          }
        }
        return outdata;
      };
    }
  });

  // node_modules/pngjs/lib/parser-async.js
  var require_parser_async = __commonJS({
    "node_modules/pngjs/lib/parser-async.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var util = require_util();
      var zlib = require_lib();
      var ChunkStream = require_chunkstream();
      var FilterAsync = require_filter_parse_async();
      var Parser = require_parser();
      var bitmapper = require_bitmapper();
      var formatNormaliser = require_format_normaliser();
      var ParserAsync = module.exports = function(options) {
        ChunkStream.call(this);
        this._parser = new Parser(options, {
          read: this.read.bind(this),
          error: this._handleError.bind(this),
          metadata: this._handleMetaData.bind(this),
          gamma: this.emit.bind(this, "gamma"),
          palette: this._handlePalette.bind(this),
          transColor: this._handleTransColor.bind(this),
          finished: this._finished.bind(this),
          inflateData: this._inflateData.bind(this),
          simpleTransparency: this._simpleTransparency.bind(this),
          headersFinished: this._headersFinished.bind(this)
        });
        this._options = options;
        this.writable = true;
        this._parser.start();
      };
      util.inherits(ParserAsync, ChunkStream);
      ParserAsync.prototype._handleError = function(err) {
        this.emit("error", err);
        this.writable = false;
        this.destroy();
        if (this._inflate && this._inflate.destroy) {
          this._inflate.destroy();
        }
        if (this._filter) {
          this._filter.destroy();
          this._filter.on("error", function() {
          });
        }
        this.errord = true;
      };
      ParserAsync.prototype._inflateData = function(data) {
        if (!this._inflate) {
          if (this._bitmapInfo.interlace) {
            this._inflate = zlib.createInflate();
            this._inflate.on("error", this.emit.bind(this, "error"));
            this._filter.on("complete", this._complete.bind(this));
            this._inflate.pipe(this._filter);
          } else {
            let rowSize = (this._bitmapInfo.width * this._bitmapInfo.bpp * this._bitmapInfo.depth + 7 >> 3) + 1;
            let imageSize = rowSize * this._bitmapInfo.height;
            let chunkSize = Math.max(imageSize, zlib.Z_MIN_CHUNK);
            this._inflate = zlib.createInflate({ chunkSize });
            let leftToInflate = imageSize;
            let emitError = this.emit.bind(this, "error");
            this._inflate.on("error", function(err) {
              if (!leftToInflate) {
                return;
              }
              emitError(err);
            });
            this._filter.on("complete", this._complete.bind(this));
            let filterWrite = this._filter.write.bind(this._filter);
            this._inflate.on("data", function(chunk) {
              if (!leftToInflate) {
                return;
              }
              if (chunk.length > leftToInflate) {
                chunk = chunk.slice(0, leftToInflate);
              }
              leftToInflate -= chunk.length;
              filterWrite(chunk);
            });
            this._inflate.on("end", this._filter.end.bind(this._filter));
          }
        }
        this._inflate.write(data);
      };
      ParserAsync.prototype._handleMetaData = function(metaData) {
        this._metaData = metaData;
        this._bitmapInfo = Object.create(metaData);
        this._filter = new FilterAsync(this._bitmapInfo);
      };
      ParserAsync.prototype._handleTransColor = function(transColor) {
        this._bitmapInfo.transColor = transColor;
      };
      ParserAsync.prototype._handlePalette = function(palette) {
        this._bitmapInfo.palette = palette;
      };
      ParserAsync.prototype._simpleTransparency = function() {
        this._metaData.alpha = true;
      };
      ParserAsync.prototype._headersFinished = function() {
        this.emit("metadata", this._metaData);
      };
      ParserAsync.prototype._finished = function() {
        if (this.errord) {
          return;
        }
        if (!this._inflate) {
          this.emit("error", "No Inflate block");
        } else {
          this._inflate.end();
        }
      };
      ParserAsync.prototype._complete = function(filteredData) {
        if (this.errord) {
          return;
        }
        let normalisedBitmapData;
        try {
          let bitmapData = bitmapper.dataToBitMap(filteredData, this._bitmapInfo);
          normalisedBitmapData = formatNormaliser(
            bitmapData,
            this._bitmapInfo,
            this._options.skipRescale
          );
          bitmapData = null;
        } catch (ex) {
          this._handleError(ex);
          return;
        }
        this.emit("parsed", normalisedBitmapData);
      };
    }
  });

  // node_modules/pngjs/lib/bitpacker.js
  var require_bitpacker = __commonJS({
    "node_modules/pngjs/lib/bitpacker.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var constants = require_constants2();
      module.exports = function(dataIn, width, height, options) {
        let outHasAlpha = [constants.COLORTYPE_COLOR_ALPHA, constants.COLORTYPE_ALPHA].indexOf(
          options.colorType
        ) !== -1;
        if (options.colorType === options.inputColorType) {
          let bigEndian = (function() {
            let buffer = new ArrayBuffer(2);
            new DataView(buffer).setInt16(
              0,
              256,
              true
              /* littleEndian */
            );
            return new Int16Array(buffer)[0] !== 256;
          })();
          if (options.bitDepth === 8 || options.bitDepth === 16 && bigEndian) {
            return dataIn;
          }
        }
        let data = options.bitDepth !== 16 ? dataIn : new Uint16Array(dataIn.buffer);
        let maxValue = 255;
        let inBpp = constants.COLORTYPE_TO_BPP_MAP[options.inputColorType];
        if (inBpp === 4 && !options.inputHasAlpha) {
          inBpp = 3;
        }
        let outBpp = constants.COLORTYPE_TO_BPP_MAP[options.colorType];
        if (options.bitDepth === 16) {
          maxValue = 65535;
          outBpp *= 2;
        }
        let outData = import_buffer.Buffer.alloc(width * height * outBpp);
        let inIndex = 0;
        let outIndex = 0;
        let bgColor = options.bgColor || {};
        if (bgColor.red === void 0) {
          bgColor.red = maxValue;
        }
        if (bgColor.green === void 0) {
          bgColor.green = maxValue;
        }
        if (bgColor.blue === void 0) {
          bgColor.blue = maxValue;
        }
        function getRGBA() {
          let red;
          let green;
          let blue;
          let alpha = maxValue;
          switch (options.inputColorType) {
            case constants.COLORTYPE_COLOR_ALPHA:
              alpha = data[inIndex + 3];
              red = data[inIndex];
              green = data[inIndex + 1];
              blue = data[inIndex + 2];
              break;
            case constants.COLORTYPE_COLOR:
              red = data[inIndex];
              green = data[inIndex + 1];
              blue = data[inIndex + 2];
              break;
            case constants.COLORTYPE_ALPHA:
              alpha = data[inIndex + 1];
              red = data[inIndex];
              green = red;
              blue = red;
              break;
            case constants.COLORTYPE_GRAYSCALE:
              red = data[inIndex];
              green = red;
              blue = red;
              break;
            default:
              throw new Error(
                "input color type:" + options.inputColorType + " is not supported at present"
              );
          }
          if (options.inputHasAlpha) {
            if (!outHasAlpha) {
              alpha /= maxValue;
              red = Math.min(
                Math.max(Math.round((1 - alpha) * bgColor.red + alpha * red), 0),
                maxValue
              );
              green = Math.min(
                Math.max(Math.round((1 - alpha) * bgColor.green + alpha * green), 0),
                maxValue
              );
              blue = Math.min(
                Math.max(Math.round((1 - alpha) * bgColor.blue + alpha * blue), 0),
                maxValue
              );
            }
          }
          return { red, green, blue, alpha };
        }
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            let rgba = getRGBA(data, inIndex);
            switch (options.colorType) {
              case constants.COLORTYPE_COLOR_ALPHA:
              case constants.COLORTYPE_COLOR:
                if (options.bitDepth === 8) {
                  outData[outIndex] = rgba.red;
                  outData[outIndex + 1] = rgba.green;
                  outData[outIndex + 2] = rgba.blue;
                  if (outHasAlpha) {
                    outData[outIndex + 3] = rgba.alpha;
                  }
                } else {
                  outData.writeUInt16BE(rgba.red, outIndex);
                  outData.writeUInt16BE(rgba.green, outIndex + 2);
                  outData.writeUInt16BE(rgba.blue, outIndex + 4);
                  if (outHasAlpha) {
                    outData.writeUInt16BE(rgba.alpha, outIndex + 6);
                  }
                }
                break;
              case constants.COLORTYPE_ALPHA:
              case constants.COLORTYPE_GRAYSCALE: {
                let grayscale = (rgba.red + rgba.green + rgba.blue) / 3;
                if (options.bitDepth === 8) {
                  outData[outIndex] = grayscale;
                  if (outHasAlpha) {
                    outData[outIndex + 1] = rgba.alpha;
                  }
                } else {
                  outData.writeUInt16BE(grayscale, outIndex);
                  if (outHasAlpha) {
                    outData.writeUInt16BE(rgba.alpha, outIndex + 2);
                  }
                }
                break;
              }
              default:
                throw new Error("unrecognised color Type " + options.colorType);
            }
            inIndex += inBpp;
            outIndex += outBpp;
          }
        }
        return outData;
      };
    }
  });

  // node_modules/pngjs/lib/filter-pack.js
  var require_filter_pack = __commonJS({
    "node_modules/pngjs/lib/filter-pack.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var paethPredictor = require_paeth_predictor();
      function filterNone(pxData, pxPos, byteWidth, rawData, rawPos) {
        for (let x = 0; x < byteWidth; x++) {
          rawData[rawPos + x] = pxData[pxPos + x];
        }
      }
      function filterSumNone(pxData, pxPos, byteWidth) {
        let sum = 0;
        let length = pxPos + byteWidth;
        for (let i = pxPos; i < length; i++) {
          sum += Math.abs(pxData[i]);
        }
        return sum;
      }
      function filterSub(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
        for (let x = 0; x < byteWidth; x++) {
          let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
          let val = pxData[pxPos + x] - left;
          rawData[rawPos + x] = val;
        }
      }
      function filterSumSub(pxData, pxPos, byteWidth, bpp) {
        let sum = 0;
        for (let x = 0; x < byteWidth; x++) {
          let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
          let val = pxData[pxPos + x] - left;
          sum += Math.abs(val);
        }
        return sum;
      }
      function filterUp(pxData, pxPos, byteWidth, rawData, rawPos) {
        for (let x = 0; x < byteWidth; x++) {
          let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
          let val = pxData[pxPos + x] - up;
          rawData[rawPos + x] = val;
        }
      }
      function filterSumUp(pxData, pxPos, byteWidth) {
        let sum = 0;
        let length = pxPos + byteWidth;
        for (let x = pxPos; x < length; x++) {
          let up = pxPos > 0 ? pxData[x - byteWidth] : 0;
          let val = pxData[x] - up;
          sum += Math.abs(val);
        }
        return sum;
      }
      function filterAvg(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
        for (let x = 0; x < byteWidth; x++) {
          let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
          let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
          let val = pxData[pxPos + x] - (left + up >> 1);
          rawData[rawPos + x] = val;
        }
      }
      function filterSumAvg(pxData, pxPos, byteWidth, bpp) {
        let sum = 0;
        for (let x = 0; x < byteWidth; x++) {
          let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
          let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
          let val = pxData[pxPos + x] - (left + up >> 1);
          sum += Math.abs(val);
        }
        return sum;
      }
      function filterPaeth(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
        for (let x = 0; x < byteWidth; x++) {
          let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
          let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
          let upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
          let val = pxData[pxPos + x] - paethPredictor(left, up, upleft);
          rawData[rawPos + x] = val;
        }
      }
      function filterSumPaeth(pxData, pxPos, byteWidth, bpp) {
        let sum = 0;
        for (let x = 0; x < byteWidth; x++) {
          let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
          let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
          let upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
          let val = pxData[pxPos + x] - paethPredictor(left, up, upleft);
          sum += Math.abs(val);
        }
        return sum;
      }
      var filters = {
        0: filterNone,
        1: filterSub,
        2: filterUp,
        3: filterAvg,
        4: filterPaeth
      };
      var filterSums = {
        0: filterSumNone,
        1: filterSumSub,
        2: filterSumUp,
        3: filterSumAvg,
        4: filterSumPaeth
      };
      module.exports = function(pxData, width, height, options, bpp) {
        let filterTypes;
        if (!("filterType" in options) || options.filterType === -1) {
          filterTypes = [0, 1, 2, 3, 4];
        } else if (typeof options.filterType === "number") {
          filterTypes = [options.filterType];
        } else {
          throw new Error("unrecognised filter types");
        }
        if (options.bitDepth === 16) {
          bpp *= 2;
        }
        let byteWidth = width * bpp;
        let rawPos = 0;
        let pxPos = 0;
        let rawData = import_buffer.Buffer.alloc((byteWidth + 1) * height);
        let sel = filterTypes[0];
        for (let y = 0; y < height; y++) {
          if (filterTypes.length > 1) {
            let min = Infinity;
            for (let i = 0; i < filterTypes.length; i++) {
              let sum = filterSums[filterTypes[i]](pxData, pxPos, byteWidth, bpp);
              if (sum < min) {
                sel = filterTypes[i];
                min = sum;
              }
            }
          }
          rawData[rawPos] = sel;
          rawPos++;
          filters[sel](pxData, pxPos, byteWidth, rawData, rawPos, bpp);
          rawPos += byteWidth;
          pxPos += byteWidth;
        }
        return rawData;
      };
    }
  });

  // node_modules/pngjs/lib/packer.js
  var require_packer = __commonJS({
    "node_modules/pngjs/lib/packer.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var constants = require_constants2();
      var CrcStream = require_crc();
      var bitPacker = require_bitpacker();
      var filter = require_filter_pack();
      var zlib = require_lib();
      var Packer = module.exports = function(options) {
        this._options = options;
        options.deflateChunkSize = options.deflateChunkSize || 32 * 1024;
        options.deflateLevel = options.deflateLevel != null ? options.deflateLevel : 9;
        options.deflateStrategy = options.deflateStrategy != null ? options.deflateStrategy : 3;
        options.inputHasAlpha = options.inputHasAlpha != null ? options.inputHasAlpha : true;
        options.deflateFactory = options.deflateFactory || zlib.createDeflate;
        options.bitDepth = options.bitDepth || 8;
        options.colorType = typeof options.colorType === "number" ? options.colorType : constants.COLORTYPE_COLOR_ALPHA;
        options.inputColorType = typeof options.inputColorType === "number" ? options.inputColorType : constants.COLORTYPE_COLOR_ALPHA;
        if ([
          constants.COLORTYPE_GRAYSCALE,
          constants.COLORTYPE_COLOR,
          constants.COLORTYPE_COLOR_ALPHA,
          constants.COLORTYPE_ALPHA
        ].indexOf(options.colorType) === -1) {
          throw new Error(
            "option color type:" + options.colorType + " is not supported at present"
          );
        }
        if ([
          constants.COLORTYPE_GRAYSCALE,
          constants.COLORTYPE_COLOR,
          constants.COLORTYPE_COLOR_ALPHA,
          constants.COLORTYPE_ALPHA
        ].indexOf(options.inputColorType) === -1) {
          throw new Error(
            "option input color type:" + options.inputColorType + " is not supported at present"
          );
        }
        if (options.bitDepth !== 8 && options.bitDepth !== 16) {
          throw new Error(
            "option bit depth:" + options.bitDepth + " is not supported at present"
          );
        }
      };
      Packer.prototype.getDeflateOptions = function() {
        return {
          chunkSize: this._options.deflateChunkSize,
          level: this._options.deflateLevel,
          strategy: this._options.deflateStrategy
        };
      };
      Packer.prototype.createDeflate = function() {
        return this._options.deflateFactory(this.getDeflateOptions());
      };
      Packer.prototype.filterData = function(data, width, height) {
        let packedData = bitPacker(data, width, height, this._options);
        let bpp = constants.COLORTYPE_TO_BPP_MAP[this._options.colorType];
        let filteredData = filter(packedData, width, height, this._options, bpp);
        return filteredData;
      };
      Packer.prototype._packChunk = function(type, data) {
        let len = data ? data.length : 0;
        let buf = import_buffer.Buffer.alloc(len + 12);
        buf.writeUInt32BE(len, 0);
        buf.writeUInt32BE(type, 4);
        if (data) {
          data.copy(buf, 8);
        }
        buf.writeInt32BE(
          CrcStream.crc32(buf.slice(4, buf.length - 4)),
          buf.length - 4
        );
        return buf;
      };
      Packer.prototype.packGAMA = function(gamma) {
        let buf = import_buffer.Buffer.alloc(4);
        buf.writeUInt32BE(Math.floor(gamma * constants.GAMMA_DIVISION), 0);
        return this._packChunk(constants.TYPE_gAMA, buf);
      };
      Packer.prototype.packIHDR = function(width, height) {
        let buf = import_buffer.Buffer.alloc(13);
        buf.writeUInt32BE(width, 0);
        buf.writeUInt32BE(height, 4);
        buf[8] = this._options.bitDepth;
        buf[9] = this._options.colorType;
        buf[10] = 0;
        buf[11] = 0;
        buf[12] = 0;
        return this._packChunk(constants.TYPE_IHDR, buf);
      };
      Packer.prototype.packIDAT = function(data) {
        return this._packChunk(constants.TYPE_IDAT, data);
      };
      Packer.prototype.packIEND = function() {
        return this._packChunk(constants.TYPE_IEND, null);
      };
    }
  });

  // node_modules/pngjs/lib/packer-async.js
  var require_packer_async = __commonJS({
    "node_modules/pngjs/lib/packer-async.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var util = require_util();
      var Stream = require_stream_browserify();
      var constants = require_constants2();
      var Packer = require_packer();
      var PackerAsync = module.exports = function(opt) {
        Stream.call(this);
        let options = opt || {};
        this._packer = new Packer(options);
        this._deflate = this._packer.createDeflate();
        this.readable = true;
      };
      util.inherits(PackerAsync, Stream);
      PackerAsync.prototype.pack = function(data, width, height, gamma) {
        this.emit("data", import_buffer.Buffer.from(constants.PNG_SIGNATURE));
        this.emit("data", this._packer.packIHDR(width, height));
        if (gamma) {
          this.emit("data", this._packer.packGAMA(gamma));
        }
        let filteredData = this._packer.filterData(data, width, height);
        this._deflate.on("error", this.emit.bind(this, "error"));
        this._deflate.on(
          "data",
          function(compressedData) {
            this.emit("data", this._packer.packIDAT(compressedData));
          }.bind(this)
        );
        this._deflate.on(
          "end",
          function() {
            this.emit("data", this._packer.packIEND());
            this.emit("end");
          }.bind(this)
        );
        this._deflate.end(filteredData);
      };
    }
  });

  // node_modules/pngjs/lib/sync-inflate.js
  var require_sync_inflate = __commonJS({
    "node_modules/pngjs/lib/sync-inflate.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var assert = require_assert().ok;
      var zlib = require_lib();
      var util = require_util();
      var kMaxLength = require_buffer().kMaxLength;
      function Inflate(opts) {
        if (!(this instanceof Inflate)) {
          return new Inflate(opts);
        }
        if (opts && opts.chunkSize < zlib.Z_MIN_CHUNK) {
          opts.chunkSize = zlib.Z_MIN_CHUNK;
        }
        zlib.Inflate.call(this, opts);
        this._offset = this._offset === void 0 ? this._outOffset : this._offset;
        this._buffer = this._buffer || this._outBuffer;
        if (opts && opts.maxLength != null) {
          this._maxLength = opts.maxLength;
        }
      }
      function createInflate(opts) {
        return new Inflate(opts);
      }
      function _close(engine, callback) {
        if (callback) {
          process.nextTick(callback);
        }
        if (!engine._handle) {
          return;
        }
        engine._handle.close();
        engine._handle = null;
      }
      Inflate.prototype._processChunk = function(chunk, flushFlag, asyncCb) {
        if (typeof asyncCb === "function") {
          return zlib.Inflate._processChunk.call(this, chunk, flushFlag, asyncCb);
        }
        let self2 = this;
        let availInBefore = chunk && chunk.length;
        let availOutBefore = this._chunkSize - this._offset;
        let leftToInflate = this._maxLength;
        let inOff = 0;
        let buffers = [];
        let nread = 0;
        let error;
        this.on("error", function(err) {
          error = err;
        });
        function handleChunk(availInAfter, availOutAfter) {
          if (self2._hadError) {
            return;
          }
          let have = availOutBefore - availOutAfter;
          assert(have >= 0, "have should not go down");
          if (have > 0) {
            let out = self2._buffer.slice(self2._offset, self2._offset + have);
            self2._offset += have;
            if (out.length > leftToInflate) {
              out = out.slice(0, leftToInflate);
            }
            buffers.push(out);
            nread += out.length;
            leftToInflate -= out.length;
            if (leftToInflate === 0) {
              return false;
            }
          }
          if (availOutAfter === 0 || self2._offset >= self2._chunkSize) {
            availOutBefore = self2._chunkSize;
            self2._offset = 0;
            self2._buffer = import_buffer.Buffer.allocUnsafe(self2._chunkSize);
          }
          if (availOutAfter === 0) {
            inOff += availInBefore - availInAfter;
            availInBefore = availInAfter;
            return true;
          }
          return false;
        }
        assert(this._handle, "zlib binding closed");
        let res;
        do {
          res = this._handle.writeSync(
            flushFlag,
            chunk,
            // in
            inOff,
            // in_off
            availInBefore,
            // in_len
            this._buffer,
            // out
            this._offset,
            //out_off
            availOutBefore
          );
          res = res || this._writeState;
        } while (!this._hadError && handleChunk(res[0], res[1]));
        if (this._hadError) {
          throw error;
        }
        if (nread >= kMaxLength) {
          _close(this);
          throw new RangeError(
            "Cannot create final Buffer. It would be larger than 0x" + kMaxLength.toString(16) + " bytes"
          );
        }
        let buf = import_buffer.Buffer.concat(buffers, nread);
        _close(this);
        return buf;
      };
      util.inherits(Inflate, zlib.Inflate);
      function zlibBufferSync(engine, buffer) {
        if (typeof buffer === "string") {
          buffer = import_buffer.Buffer.from(buffer);
        }
        if (!(buffer instanceof import_buffer.Buffer)) {
          throw new TypeError("Not a string or buffer");
        }
        let flushFlag = engine._finishFlushFlag;
        if (flushFlag == null) {
          flushFlag = zlib.Z_FINISH;
        }
        return engine._processChunk(buffer, flushFlag);
      }
      function inflateSync(buffer, opts) {
        return zlibBufferSync(new Inflate(opts), buffer);
      }
      module.exports = exports = inflateSync;
      exports.Inflate = Inflate;
      exports.createInflate = createInflate;
      exports.inflateSync = inflateSync;
    }
  });

  // node_modules/pngjs/lib/sync-reader.js
  var require_sync_reader = __commonJS({
    "node_modules/pngjs/lib/sync-reader.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var SyncReader = module.exports = function(buffer) {
        this._buffer = buffer;
        this._reads = [];
      };
      SyncReader.prototype.read = function(length, callback) {
        this._reads.push({
          length: Math.abs(length),
          // if length < 0 then at most this length
          allowLess: length < 0,
          func: callback
        });
      };
      SyncReader.prototype.process = function() {
        while (this._reads.length > 0 && this._buffer.length) {
          let read = this._reads[0];
          if (this._buffer.length && (this._buffer.length >= read.length || read.allowLess)) {
            this._reads.shift();
            let buf = this._buffer;
            this._buffer = buf.slice(read.length);
            read.func.call(this, buf.slice(0, read.length));
          } else {
            break;
          }
        }
        if (this._reads.length > 0) {
          throw new Error("There are some read requests waitng on finished stream");
        }
        if (this._buffer.length > 0) {
          throw new Error("unrecognised content at end of stream");
        }
      };
    }
  });

  // node_modules/pngjs/lib/filter-parse-sync.js
  var require_filter_parse_sync = __commonJS({
    "node_modules/pngjs/lib/filter-parse-sync.js"(exports) {
      "use strict";
      init_browser_shims();
      var SyncReader = require_sync_reader();
      var Filter = require_filter_parse();
      exports.process = function(inBuffer, bitmapInfo) {
        let outBuffers = [];
        let reader = new SyncReader(inBuffer);
        let filter = new Filter(bitmapInfo, {
          read: reader.read.bind(reader),
          write: function(bufferPart) {
            outBuffers.push(bufferPart);
          },
          complete: function() {
          }
        });
        filter.start();
        reader.process();
        return import_buffer.Buffer.concat(outBuffers);
      };
    }
  });

  // node_modules/pngjs/lib/parser-sync.js
  var require_parser_sync = __commonJS({
    "node_modules/pngjs/lib/parser-sync.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var hasSyncZlib = true;
      var zlib = require_lib();
      var inflateSync = require_sync_inflate();
      if (!zlib.deflateSync) {
        hasSyncZlib = false;
      }
      var SyncReader = require_sync_reader();
      var FilterSync = require_filter_parse_sync();
      var Parser = require_parser();
      var bitmapper = require_bitmapper();
      var formatNormaliser = require_format_normaliser();
      module.exports = function(buffer, options) {
        if (!hasSyncZlib) {
          throw new Error(
            "To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0"
          );
        }
        let err;
        function handleError(_err_) {
          err = _err_;
        }
        let metaData;
        function handleMetaData(_metaData_) {
          metaData = _metaData_;
        }
        function handleTransColor(transColor) {
          metaData.transColor = transColor;
        }
        function handlePalette(palette) {
          metaData.palette = palette;
        }
        function handleSimpleTransparency() {
          metaData.alpha = true;
        }
        let gamma;
        function handleGamma(_gamma_) {
          gamma = _gamma_;
        }
        let inflateDataList = [];
        function handleInflateData(inflatedData2) {
          inflateDataList.push(inflatedData2);
        }
        let reader = new SyncReader(buffer);
        let parser = new Parser(options, {
          read: reader.read.bind(reader),
          error: handleError,
          metadata: handleMetaData,
          gamma: handleGamma,
          palette: handlePalette,
          transColor: handleTransColor,
          inflateData: handleInflateData,
          simpleTransparency: handleSimpleTransparency
        });
        parser.start();
        reader.process();
        if (err) {
          throw err;
        }
        let inflateData = import_buffer.Buffer.concat(inflateDataList);
        inflateDataList.length = 0;
        let inflatedData;
        if (metaData.interlace) {
          inflatedData = zlib.inflateSync(inflateData);
        } else {
          let rowSize = (metaData.width * metaData.bpp * metaData.depth + 7 >> 3) + 1;
          let imageSize = rowSize * metaData.height;
          inflatedData = inflateSync(inflateData, {
            chunkSize: imageSize,
            maxLength: imageSize
          });
        }
        inflateData = null;
        if (!inflatedData || !inflatedData.length) {
          throw new Error("bad png - invalid inflate data response");
        }
        let unfilteredData = FilterSync.process(inflatedData, metaData);
        inflateData = null;
        let bitmapData = bitmapper.dataToBitMap(unfilteredData, metaData);
        unfilteredData = null;
        let normalisedBitmapData = formatNormaliser(
          bitmapData,
          metaData,
          options.skipRescale
        );
        metaData.data = normalisedBitmapData;
        metaData.gamma = gamma || 0;
        return metaData;
      };
    }
  });

  // node_modules/pngjs/lib/packer-sync.js
  var require_packer_sync = __commonJS({
    "node_modules/pngjs/lib/packer-sync.js"(exports, module) {
      "use strict";
      init_browser_shims();
      var hasSyncZlib = true;
      var zlib = require_lib();
      if (!zlib.deflateSync) {
        hasSyncZlib = false;
      }
      var constants = require_constants2();
      var Packer = require_packer();
      module.exports = function(metaData, opt) {
        if (!hasSyncZlib) {
          throw new Error(
            "To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0"
          );
        }
        let options = opt || {};
        let packer = new Packer(options);
        let chunks = [];
        chunks.push(import_buffer.Buffer.from(constants.PNG_SIGNATURE));
        chunks.push(packer.packIHDR(metaData.width, metaData.height));
        if (metaData.gamma) {
          chunks.push(packer.packGAMA(metaData.gamma));
        }
        let filteredData = packer.filterData(
          metaData.data,
          metaData.width,
          metaData.height
        );
        let compressedData = zlib.deflateSync(
          filteredData,
          packer.getDeflateOptions()
        );
        filteredData = null;
        if (!compressedData || !compressedData.length) {
          throw new Error("bad png - invalid compressed data response");
        }
        chunks.push(packer.packIDAT(compressedData));
        chunks.push(packer.packIEND());
        return import_buffer.Buffer.concat(chunks);
      };
    }
  });

  // node_modules/pngjs/lib/png-sync.js
  var require_png_sync = __commonJS({
    "node_modules/pngjs/lib/png-sync.js"(exports) {
      "use strict";
      init_browser_shims();
      var parse = require_parser_sync();
      var pack = require_packer_sync();
      exports.read = function(buffer, options) {
        return parse(buffer, options || {});
      };
      exports.write = function(png, options) {
        return pack(png, options);
      };
    }
  });

  // node_modules/pngjs/lib/png.js
  var require_png = __commonJS({
    "node_modules/pngjs/lib/png.js"(exports) {
      "use strict";
      init_browser_shims();
      var util = require_util();
      var Stream = require_stream_browserify();
      var Parser = require_parser_async();
      var Packer = require_packer_async();
      var PNGSync = require_png_sync();
      var PNG2 = exports.PNG = function(options) {
        Stream.call(this);
        options = options || {};
        this.width = options.width | 0;
        this.height = options.height | 0;
        this.data = this.width > 0 && this.height > 0 ? import_buffer.Buffer.alloc(4 * this.width * this.height) : null;
        if (options.fill && this.data) {
          this.data.fill(0);
        }
        this.gamma = 0;
        this.readable = this.writable = true;
        this._parser = new Parser(options);
        this._parser.on("error", this.emit.bind(this, "error"));
        this._parser.on("close", this._handleClose.bind(this));
        this._parser.on("metadata", this._metadata.bind(this));
        this._parser.on("gamma", this._gamma.bind(this));
        this._parser.on(
          "parsed",
          function(data) {
            this.data = data;
            this.emit("parsed", data);
          }.bind(this)
        );
        this._packer = new Packer(options);
        this._packer.on("data", this.emit.bind(this, "data"));
        this._packer.on("end", this.emit.bind(this, "end"));
        this._parser.on("close", this._handleClose.bind(this));
        this._packer.on("error", this.emit.bind(this, "error"));
      };
      util.inherits(PNG2, Stream);
      PNG2.sync = PNGSync;
      PNG2.prototype.pack = function() {
        if (!this.data || !this.data.length) {
          this.emit("error", "No data provided");
          return this;
        }
        process.nextTick(
          function() {
            this._packer.pack(this.data, this.width, this.height, this.gamma);
          }.bind(this)
        );
        return this;
      };
      PNG2.prototype.parse = function(data, callback) {
        if (callback) {
          let onParsed, onError;
          onParsed = function(parsedData) {
            this.removeListener("error", onError);
            this.data = parsedData;
            callback(null, this);
          }.bind(this);
          onError = function(err) {
            this.removeListener("parsed", onParsed);
            callback(err, null);
          }.bind(this);
          this.once("parsed", onParsed);
          this.once("error", onError);
        }
        this.end(data);
        return this;
      };
      PNG2.prototype.write = function(data) {
        this._parser.write(data);
        return true;
      };
      PNG2.prototype.end = function(data) {
        this._parser.end(data);
      };
      PNG2.prototype._metadata = function(metadata) {
        this.width = metadata.width;
        this.height = metadata.height;
        this.emit("metadata", metadata);
      };
      PNG2.prototype._gamma = function(gamma) {
        this.gamma = gamma;
      };
      PNG2.prototype._handleClose = function() {
        if (!this._parser.writable && !this._packer.readable) {
          this.emit("close");
        }
      };
      PNG2.bitblt = function(src, dst, srcX, srcY, width, height, deltaX, deltaY) {
        srcX |= 0;
        srcY |= 0;
        width |= 0;
        height |= 0;
        deltaX |= 0;
        deltaY |= 0;
        if (srcX > src.width || srcY > src.height || srcX + width > src.width || srcY + height > src.height) {
          throw new Error("bitblt reading outside image");
        }
        if (deltaX > dst.width || deltaY > dst.height || deltaX + width > dst.width || deltaY + height > dst.height) {
          throw new Error("bitblt writing outside image");
        }
        for (let y = 0; y < height; y++) {
          src.data.copy(
            dst.data,
            (deltaY + y) * dst.width + deltaX << 2,
            (srcY + y) * src.width + srcX << 2,
            (srcY + y) * src.width + srcX + width << 2
          );
        }
      };
      PNG2.prototype.bitblt = function(dst, srcX, srcY, width, height, deltaX, deltaY) {
        PNG2.bitblt(this, dst, srcX, srcY, width, height, deltaX, deltaY);
        return this;
      };
      PNG2.adjustGamma = function(src) {
        if (src.gamma) {
          for (let y = 0; y < src.height; y++) {
            for (let x = 0; x < src.width; x++) {
              let idx = src.width * y + x << 2;
              for (let i = 0; i < 3; i++) {
                let sample = src.data[idx + i] / 255;
                sample = Math.pow(sample, 1 / 2.2 / src.gamma);
                src.data[idx + i] = Math.round(sample * 255);
              }
            }
          }
          src.gamma = 0;
        }
      };
      PNG2.prototype.adjustGamma = function() {
        PNG2.adjustGamma(this);
      };
    }
  });

  // tools/roblox-export.js
  var require_roblox_export = __commonJS({
    "tools/roblox-export.js"(exports, module) {
      init_browser_shims();
      var KEYCODE_MAP = {
        KeyA: "A",
        KeyD: "D",
        KeyW: "W",
        KeyS: "S",
        KeyJ: "J",
        KeyK: "K",
        KeyL: "L",
        KeyU: "U",
        KeyI: "I",
        KeyO: "O",
        Space: "Space"
      };
      function luaString(s) {
        return JSON.stringify(String(s));
      }
      function luaValue(v, indent) {
        const pad = "  ".repeat(indent);
        const padIn = "  ".repeat(indent + 1);
        if (v === null || v === void 0) return "nil";
        if (typeof v === "boolean") return v ? "true" : "false";
        if (typeof v === "number") return Number.isFinite(v) ? String(v) : "0";
        if (typeof v === "string") return luaString(v);
        if (Array.isArray(v)) {
          if (!v.length) return "{}";
          const parts = v.map((item) => `${padIn}${luaValue(item, indent + 1)}`);
          return `{
${parts.join(",\n")},
${pad}}`;
        }
        if (typeof v === "object") {
          const keys = Object.keys(v);
          if (!keys.length) return "{}";
          const parts = keys.map((k) => {
            const key = /^[A-Za-z_][A-Za-z0-9_]*$/.test(k) ? k : `[${luaString(k)}]`;
            return `${padIn}${key} = ${luaValue(v[k], indent + 1)}`;
          });
          return `{
${parts.join(",\n")},
${pad}}`;
        }
        return "nil";
      }
      function slimCharacterData(character) {
        const frames = {};
        const srcFrames = character.atlas && character.atlas.frames || {};
        for (const [key, fr] of Object.entries(srcFrames)) {
          frames[key] = {
            x: fr.x | 0,
            y: fr.y | 0,
            w: fr.w | 0,
            h: fr.h | 0,
            ax: fr.ax != null ? fr.ax : Math.floor((fr.w || 0) / 2),
            ay: fr.ay != null ? fr.ay : fr.h || 0
          };
        }
        const anims = { map: {}, actions: {} };
        const srcAnims = character.anims || {};
        anims.map = { ...srcAnims.map || {} };
        for (const [aid, action] of Object.entries(srcAnims.actions || {})) {
          anims.actions[aid] = {
            action: action.action,
            frames: (action.frames || []).map((f) => ({
              key: f.key,
              ticks: f.ticks != null ? f.ticks : 3,
              flipH: !!f.flipH
            }))
          };
        }
        const moves = {};
        for (const [id, m] of Object.entries(character.moves || {})) {
          const reliable = m.hitboxReliable !== false && m.hitboxSource !== "clsn2-inferred";
          const perFrame = Array.isArray(m.hitboxesPerFrame) ? m.hitboxesPerFrame.map((f) => ({
            key: f.key,
            ticks: f.ticks || 0,
            // Only export real Clsn1 frames — never inferred placeholders
            hitbox: f.hitbox || null,
            clsn1: f.clsn1 || []
          })) : [];
          moves[id] = {
            label: m.label || id,
            startup: m.startup || 0,
            active: m.active || 0,
            recovery: m.recovery || 0,
            damage: m.damage || 0,
            hitstun: m.hitstun || 0,
            blockstun: m.blockstun || 0,
            knockback: m.knockback || 0,
            animation: m.animation || id,
            band: m.band || "normal",
            // Inferred union boxes are omitted so Studio combat doesn't treat guesses as truth
            hitbox: reliable ? m.hitbox || null : null,
            hitboxReliable: reliable,
            hitboxSource: m.hitboxSource || (reliable ? "clsn1" : "none"),
            hitboxesPerFrame: perFrame,
            vfx: m.vfx || null
          };
        }
        const binds = character.binds || {};
        const keyboard = {};
        for (const [code, binding] of Object.entries(binds.keyboard || {})) {
          const rk = KEYCODE_MAP[code] || code.replace(/^Key/, "");
          keyboard[rk] = {
            move: binding.move,
            slot: binding.slot || null
          };
        }
        return {
          id: character.id,
          name: character.name,
          version: character.version || 3,
          style: "framesheet",
          atlas: {
            image: "atlas.png",
            scale: character.atlas && character.atlas.scale || 2,
            pxToWorld: character.atlas && character.atlas.pxToWorld || 0.03,
            frames
          },
          physics: character.physics || {},
          anims,
          moves,
          moveList: character.moveList || [],
          binds: {
            scheme: binds.scheme || "jkluio-v1",
            help: binds.help || "",
            keyboard,
            slots: binds.slots || {}
          },
          quality: character.quality || null
        };
      }
      function buildCharacterDataLuau(character) {
        const data = slimCharacterData(character);
        return `--!strict
-- Auto-generated by mugenSkel packer \u2014 ModuleScript
-- Parent this as: ReplicatedStorage.MugenSkel.${data.id}.CharacterData

return ${luaValue(data, 0)}
`;
      }
      var FIGHTER_LUAU = `--!strict
-- mugenSkel SpriteFighter \u2014 drop into StarterPlayerScripts or a Tool
-- Usage:
--   local Fighter = require(path.to.MugenSkelFighter)
--   local data = require(path.to.CharacterData)
--   Fighter.start(imageLabel, data)  -- ImageLabel with atlas.png as Image

local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")

export type PackData = {
	id: string,
	anims: any,
	atlas: any,
	moves: any,
	binds: any,
	physics: any,
}

local MugenSkelFighter = {}

local function setFrame(image: ImageLabel, data: PackData, key: string, facing: number)
	local fr = data.atlas.frames[key]
	if not fr then
		return
	end
	image.ImageRectOffset = Vector2.new(fr.x, fr.y)
	image.ImageRectSize = Vector2.new(fr.w, fr.h)
	-- Keep a stable on-screen size from pack scale
	local scale = data.atlas.scale or 2
	image.Size = UDim2.fromOffset(math.floor(fr.w * scale), math.floor(fr.h * scale))
	image.ResampleMode = Enum.ResamplerMode.Pixelated
	if facing < 0 then
		image.ImageRectSize = Vector2.new(-fr.w, fr.h)
		image.ImageRectOffset = Vector2.new(fr.x + fr.w, fr.y)
	end
end

function MugenSkelFighter.start(image: ImageLabel, data: PackData)
	assert(image and image:IsA("ImageLabel"), "Need an ImageLabel with the atlas uploaded")
	assert(data and data.anims and data.atlas, "Need CharacterData module")

	local state = {
		animName = "idle",
		frameIndex = 0,
		accum = 0,
		facing = 1,
		busy = false,
	}

	local function play(name: string, lock: boolean?)
		if not data.anims.map[name] then
			return
		end
		state.animName = name
		state.frameIndex = 0
		state.accum = 0
		if lock ~= nil then
			state.busy = lock
		end
	end

	local function currentAction()
		local aid = data.anims.map[state.animName]
		if aid == nil then
			return nil
		end
		return data.anims.actions[tostring(aid)] or data.anims.actions[aid]
	end

	play("idle", false)

	local connRender = RunService.RenderStepped:Connect(function(dt)
		local action = currentAction()
		if not action or not action.frames or #action.frames == 0 then
			return
		end
		local fr = action.frames[state.frameIndex + 1]
		if not fr then
			return
		end
		setFrame(image, data, fr.key, state.facing)
		-- MUGEN ticks \u2248 1/60s
		local dur = math.max(1, fr.ticks or 3) / 60
		state.accum += dt
		if state.accum >= dur then
			state.accum -= dur
			state.frameIndex += 1
			if state.frameIndex >= #action.frames then
				if state.busy then
					state.busy = false
					play("idle", false)
				else
					state.frameIndex = 0
				end
			end
		end
	end)

	local function tryMove(moveId: string)
		if state.busy then
			return
		end
		local move = data.moves[moveId]
		if not move then
			return
		end
		local anim = move.animation or moveId
		if data.anims.map[anim] then
			play(anim, true)
		end
	end

	local keyToMove: { [Enum.KeyCode]: string } = {}
	for keyName, binding in pairs(data.binds.keyboard or {}) do
		local ok, code = pcall(function()
			return Enum.KeyCode[keyName]
		end)
		if ok and code and binding.move then
			keyToMove[code] = binding.move
		end
	end

	local connInput = UserInputService.InputBegan:Connect(function(input, gp)
		if gp then
			return
		end
		if input.UserInputType ~= Enum.UserInputType.Keyboard then
			return
		end
		local moveId = keyToMove[input.KeyCode]
		if moveId then
			tryMove(moveId)
			return
		end
		-- Facing / crude locomotion anims
		if input.KeyCode == Enum.KeyCode.A then
			state.facing = -1
			if not state.busy then
				play("walkBack", false)
			end
		elseif input.KeyCode == Enum.KeyCode.D then
			state.facing = 1
			if not state.busy then
				play("walk", false)
			end
		elseif input.KeyCode == Enum.KeyCode.W then
			if not state.busy then
				play(data.anims.map.jump and "jump" or "idle", false)
			end
		elseif input.KeyCode == Enum.KeyCode.S then
			if not state.busy then
				play(data.anims.map.crouch and "crouch" or "idle", false)
			end
		end
	end)

	local connRelease = UserInputService.InputEnded:Connect(function(input)
		if input.UserInputType ~= Enum.UserInputType.Keyboard then
			return
		end
		if state.busy then
			return
		end
		if input.KeyCode == Enum.KeyCode.A or input.KeyCode == Enum.KeyCode.D or input.KeyCode == Enum.KeyCode.S then
			play("idle", false)
		end
	end)

	return function stop()
		connRender:Disconnect()
		connInput:Disconnect()
		connRelease:Disconnect()
	end
end

return MugenSkelFighter
`;
      function buildSetupTxt(character) {
        const id = character.id || "char";
        return `mugenSkel \u2192 Roblox setup (${character.name || id})
========================================

1. In Roblox Studio, create:
   ReplicatedStorage
     MugenSkel
       ${id}          (Folder)
         CharacterData   (ModuleScript)  \u2190 paste roblox/CharacterData.luau
         atlas           (optional Decal/Image \u2014 or set ImageLabel.Image to rbxassetid)

2. Upload atlas.png (from this pack) via Asset Manager \u2192 Images.
   Copy the rbxassetid:// number.

3. Create a ScreenGui or BillboardGui with an ImageLabel:
   - Image = rbxassetid://YOUR_ATLAS_ID
   - ResampleMode = Pixelated
   - BackgroundTransparency = 1

4. Add a LocalScript (e.g. StarterPlayerScripts) and paste:

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Fighter = require(ReplicatedStorage.MugenSkel.MugenSkelFighter)
local data = require(ReplicatedStorage.MugenSkel.${id}.CharacterData)
local gui = -- your ImageLabel
gui.Image = "rbxassetid://YOUR_ATLAS_ID"
Fighter.start(gui, data)

5. Also require MugenSkelFighter.luau once under ReplicatedStorage.MugenSkel.

Controls (from pack binds):
${character.binds && character.binds.help || "A/D walk \xB7 W jump \xB7 S crouch \xB7 J/K/L/U/I/O attacks"}

Notes:
- This is a sprite preview fighter (ImageRectOffset flipbook), not a full Humanoid combat system.
- Hitboxes/damage are in CharacterData.moves for you to wire into your own hit detection.
- Re-pack after bind changes in the web curator, or edit CharacterData.binds.
`;
      }
      function buildRobloxFiles(character) {
        return {
          "CharacterData.luau": buildCharacterDataLuau(character),
          "MugenSkelFighter.luau": FIGHTER_LUAU,
          "SETUP.txt": buildSetupTxt(character)
        };
      }
      function enrichRobloxMeta(character) {
        const next = { ...character.roblox || {} };
        next.upload = ["atlas.png"];
        next.animate = "ImageRectOffset";
        next.modules = [
          "roblox/CharacterData.luau",
          "roblox/MugenSkelFighter.luau"
        ];
        next.setup = "roblox/SETUP.txt";
        next.controls = character.binds && character.binds.help || "";
        character.roblox = next;
        return character;
      }
      module.exports = {
        buildRobloxFiles,
        slimCharacterData,
        enrichRobloxMeta,
        buildCharacterDataLuau
      };
    }
  });

  // node_modules/sff-extractor/src/extractMetadataFromSFFV1.mjs
  function extractMetadataFromSFFV1(buffer) {
    const build = buffer.readUInt8(12);
    const patch = buffer.readUInt8(13);
    const minor = buffer.readUInt8(14);
    const major = buffer.readUInt8(15);
    const version2 = `${major}.${minor}.${patch}.${build}`;
    const groupCount = buffer.readUInt32LE(16);
    const spriteCount = buffer.readUInt32LE(20);
    const firstSpriteOffset = buffer.readUInt32LE(24);
    const subHeaderSize = buffer.readUInt32LE(28);
    const paletteType = buffer.readUInt8(32);
    const comment = buffer.toString("ascii", 36, 512);
    return {
      version: version2,
      versionMajor: major,
      versionMinor: minor,
      versionPath: patch,
      versionBuild: build,
      groupCount,
      spriteCount,
      firstSpriteOffset,
      subHeaderSize,
      paletteType,
      comment
    };
  }
  var init_extractMetadataFromSFFV1 = __esm({
    "node_modules/sff-extractor/src/extractMetadataFromSFFV1.mjs"() {
      init_browser_shims();
    }
  });

  // node_modules/sff-extractor/src/convertPaletteRGBtoRGBA.mjs
  function convertPaletteRGBtoRGBA(rgb) {
    const rgba = import_buffer.Buffer.alloc(256 * 4);
    for (let rgbIndex = 0, rgbaIndex = 0; rgbIndex < rgb.length; rgbIndex += 3, rgbaIndex += 4) {
      rgba[rgbaIndex + 0] = rgb[rgbIndex + 0];
      rgba[rgbaIndex + 1] = rgb[rgbIndex + 1];
      rgba[rgbaIndex + 2] = rgb[rgbIndex + 2];
      rgba[rgbaIndex + 3] = 255;
    }
    return rgba;
  }
  var init_convertPaletteRGBtoRGBA = __esm({
    "node_modules/sff-extractor/src/convertPaletteRGBtoRGBA.mjs"() {
      init_browser_shims();
    }
  });

  // node_modules/sff-extractor/src/extractSpritesFromSFFV1.mjs
  function getWidthFromPcx(buffer) {
    const minX = buffer.readUInt16LE(4);
    const maxX = buffer.readUInt16LE(8);
    return maxX - minX + 1;
  }
  function getHeightFromPcx(buffer) {
    const minY = buffer.readUInt16LE(6);
    const maxY = buffer.readUInt16LE(10);
    return maxY - minY + 1;
  }
  function extractSpritesFromSFFV1(data, metadata) {
    let firstPalette = null;
    let previousPalette = null;
    const sprites = [];
    for (let index = 0, spriteOffset = metadata.firstSpriteOffset; index < metadata.spriteCount; index++) {
      let nextSpriteOffset = data.readUInt32LE(spriteOffset);
      if (nextSpriteOffset === 0) {
        nextSpriteOffset = data.length;
      }
      const spriteSection = data.subarray(spriteOffset, nextSpriteOffset);
      const length = spriteSection.readUInt32LE(4);
      const x = spriteSection.readUInt16LE(8);
      const y = spriteSection.readUInt16LE(10);
      const group = spriteSection.readUInt16LE(12);
      const number = spriteSection.readUInt16LE(14);
      let linkedSpriteIndex = spriteSection.readUInt16LE(16);
      if (linkedSpriteIndex >= index) {
        linkedSpriteIndex = 0;
      }
      const samePalette = spriteSection.readUInt8(18);
      const comment = spriteSection.toString("ascii", 19, 19 + 14);
      const c00 = index > 0 || group === 0 && number === 0;
      const paletteSize = c00 || samePalette ? 0 : 256 * 3;
      let palette = null;
      if (samePalette && firstPalette && group === 0 && number === 0) {
        palette = firstPalette;
      } else if (samePalette && previousPalette) {
        palette = previousPalette;
      } else {
        const paletteRGB = data.subarray(
          nextSpriteOffset - 256 * 3,
          nextSpriteOffset
        );
        palette = convertPaletteRGBtoRGBA(paletteRGB);
      }
      if (!firstPalette) {
        firstPalette = palette;
      }
      previousPalette = palette;
      if (length === 0) {
        sprites.push({
          ...sprites[index - 1],
          index,
          x,
          y,
          group,
          number,
          linkedSpriteIndex,
          samePalette,
          comment,
          palette
        });
        spriteOffset = nextSpriteOffset;
        continue;
      }
      let imageBuffer = linkedSpriteIndex === 0 ? data.subarray(spriteOffset + 32, nextSpriteOffset - paletteSize) : sprites[linkedSpriteIndex].buffer;
      let width = getWidthFromPcx(imageBuffer);
      let height = getHeightFromPcx(imageBuffer);
      if (width * height >= 65536 * 65536) {
        width = 1;
        height = 1;
      }
      const sprite = {
        index,
        length,
        x,
        y,
        group,
        number,
        linkedSpriteIndex,
        samePalette,
        paletteSize,
        comment,
        palette,
        buffer: imageBuffer,
        width,
        height
      };
      sprites.push(sprite);
      spriteOffset = nextSpriteOffset;
    }
    return sprites;
  }
  var init_extractSpritesFromSFFV1 = __esm({
    "node_modules/sff-extractor/src/extractSpritesFromSFFV1.mjs"() {
      init_browser_shims();
      init_convertPaletteRGBtoRGBA();
    }
  });

  // node_modules/sff-extractor/src/extractMetadataFromSFFV2.mjs
  function extractMetadataFromSFFV2(buffer) {
    const build = buffer.readUInt8(12);
    const patch = buffer.readUInt8(13);
    const minor = buffer.readUInt8(14);
    const major = buffer.readUInt8(15);
    const version2 = `${major}.${minor}.${patch}.${build}`;
    const paletteMapOffset = buffer.readUInt32LE(26);
    const spriteListOffset = buffer.readUInt32LE(36);
    const spriteCount = buffer.readUInt32LE(40);
    const paletteCount = buffer.readUInt32LE(48);
    const paletteBankOffset = buffer.readUInt32LE(52);
    const onDemandDataSize = buffer.readUInt32LE(56);
    const onDemandDataSizeTotal = buffer.readUInt32LE(60);
    const onLoadDataSize = buffer.readUInt32LE(64);
    return {
      version: version2,
      versionMajor: major,
      versionMinor: minor,
      versionPath: patch,
      versionBuild: build,
      paletteMapOffset,
      spriteListOffset,
      spriteCount,
      paletteCount,
      paletteBankOffset,
      onDemandDataSize,
      onDemandDataSizeTotal,
      onLoadDataSize
    };
  }
  var init_extractMetadataFromSFFV2 = __esm({
    "node_modules/sff-extractor/src/extractMetadataFromSFFV2.mjs"() {
      init_browser_shims();
    }
  });

  // node_modules/sff-extractor/src/extractPalettesFromSFFV2.mjs
  function extractPalettesFromSFFV2(buffer, metadata) {
    const paletteMapSize = 16;
    const palettes = [];
    for (let paletteIndex = 0; paletteIndex < metadata.paletteCount; paletteIndex++) {
      const group = buffer.readUInt16LE(
        metadata.paletteMapOffset + paletteIndex * paletteMapSize
      );
      const number = buffer.readUInt16LE(
        metadata.paletteMapOffset + paletteIndex * paletteMapSize + 2
      );
      const colorCount = buffer.readUInt16LE(
        metadata.paletteMapOffset + paletteIndex * paletteMapSize + 4
      );
      const copyPaletteIndex = buffer.readUInt16LE(
        metadata.paletteMapOffset + paletteIndex * paletteMapSize + 6
      );
      const dataOffset = buffer.readUInt32LE(
        metadata.paletteMapOffset + paletteIndex * paletteMapSize + 8
      );
      const dataLength = buffer.readUInt32LE(
        metadata.paletteMapOffset + paletteIndex * paletteMapSize + 12
      );
      let paletteBuffer = buffer.subarray(
        metadata.paletteBankOffset + dataOffset,
        metadata.paletteBankOffset + dataOffset + dataLength
      );
      if (dataLength === 0 && palettes.length > 0) {
        if (copyPaletteIndex > 0) {
          paletteBuffer = palettes[copyPaletteIndex].buffer;
        } else {
          paletteBuffer = palettes[0].buffer;
        }
      }
      palettes.push({
        index: paletteIndex,
        group,
        number,
        colorCount,
        copyPaletteIndex,
        dataOffset,
        dataLength,
        buffer: paletteBuffer
      });
    }
    return palettes;
  }
  var init_extractPalettesFromSFFV2 = __esm({
    "node_modules/sff-extractor/src/extractPalettesFromSFFV2.mjs"() {
      init_browser_shims();
    }
  });

  // node_modules/sff-extractor/src/extractSpritesFromSFFV2.mjs
  function stringifyCompressionMethod(value) {
    switch (value) {
      default:
        return "unknown";
      case 0:
        return "RAW";
      case 1:
        return "LINKED";
      case 2:
        return "RLE8";
      case 3:
        return "RLE5";
      case 4:
        return "LZ5";
      case 10:
        return "PNG8";
      case 11:
        return "PNG24";
      case 12:
        return "PNG32";
    }
  }
  function extractSpritesFromSFFV2(data, metadata, palettes) {
    const spriteNodeSize = 28;
    const sprites = [];
    for (let spriteIndex = 0; spriteIndex < metadata.spriteCount; spriteIndex++) {
      const group = data.readUInt16LE(
        metadata.spriteListOffset + spriteIndex * spriteNodeSize
      );
      const number = data.readUInt16LE(
        metadata.spriteListOffset + spriteIndex * spriteNodeSize + 2
      );
      const width = data.readUInt16LE(
        metadata.spriteListOffset + spriteIndex * spriteNodeSize + 4
      );
      const height = data.readUInt16LE(
        metadata.spriteListOffset + spriteIndex * spriteNodeSize + 6
      );
      const x = data.readUInt16LE(
        metadata.spriteListOffset + spriteIndex * spriteNodeSize + 8
      );
      const y = data.readUInt16LE(
        metadata.spriteListOffset + spriteIndex * spriteNodeSize + 10
      );
      const linkedIndex = data.readUInt16LE(
        metadata.spriteListOffset + spriteIndex * spriteNodeSize + 12
      );
      if (linkedIndex > 0) {
        sprites.push({
          index: spriteIndex,
          group,
          number,
          width,
          height,
          x,
          y,
          linkedIndex
        });
        continue;
      }
      const compressionMethodValue = data.readUInt8(
        metadata.spriteListOffset + spriteIndex * spriteNodeSize + 14
      );
      const compressionMethod = stringifyCompressionMethod(
        compressionMethodValue
      );
      const colorDepth = data.readUInt8(
        metadata.spriteListOffset + spriteIndex * spriteNodeSize + 15
      );
      const dataOffset = data.readUInt32LE(
        metadata.spriteListOffset + spriteIndex * spriteNodeSize + 16
      );
      const dataLength = data.readUInt32LE(
        metadata.spriteListOffset + spriteIndex * spriteNodeSize + 20
      );
      const paletteIndex = data.readUInt16LE(
        metadata.spriteListOffset + spriteIndex * spriteNodeSize + 24
      );
      const loadMode = data.readUInt16LE(
        metadata.spriteListOffset + spriteIndex * spriteNodeSize + 26
      );
      if (dataLength === 0) {
        sprites.push({
          ...sprites[0],
          index: spriteIndex,
          group,
          number,
          x,
          y
        });
        continue;
      }
      let spriteBuffer = data.subarray(
        metadata.paletteBankOffset + dataOffset,
        metadata.paletteBankOffset + dataOffset + dataLength
      );
      if (loadMode === 1) {
        spriteBuffer = data.subarray(
          metadata.onDemandDataSizeTotal + dataOffset,
          metadata.onDemandDataSizeTotal + dataOffset + dataLength
        );
      }
      sprites.push({
        index: spriteIndex,
        group,
        number,
        width,
        height,
        x,
        y,
        linkedIndex,
        compressionMethod,
        colorDepth,
        dataOffset,
        dataLength,
        paletteIndex,
        loadMode,
        buffer: spriteBuffer
      });
    }
    return sprites;
  }
  var init_extractSpritesFromSFFV2 = __esm({
    "node_modules/sff-extractor/src/extractSpritesFromSFFV2.mjs"() {
      init_browser_shims();
    }
  });

  // node_modules/sff-extractor/src/decodeRLE8.mjs
  function decodeRLE8(data, width, height, palette) {
    if (data.length < 4) {
      throw new Error(`Invalid RLE8, length: ${data.length}`);
    }
    const uncompressedDataLength = data.readUInt32LE(0);
    if (uncompressedDataLength !== width * height) {
    }
    if (data.length < 4) {
      throw new Error(`Invalid RLE8, too short`);
    }
    const colorComponentCount = 4;
    const out = import_buffer.Buffer.alloc(width * height * colorComponentCount, 0);
    const rawDataOffset = 4;
    let x = 0;
    let y = 0;
    let runlength = -1;
    for (let index = 0; index < data.length - rawDataOffset; index++) {
      const paletteValueIndex = data.readUInt8(index + rawDataOffset);
      if ((paletteValueIndex & 192) != 64 || runlength != -1) {
        if (runlength == -1) {
          runlength = 1;
        }
        for (let ii = 0; ii < runlength; ii++) {
          const red = palette[paletteValueIndex * colorComponentCount + 0];
          const green = palette[paletteValueIndex * colorComponentCount + 1];
          const blue = palette[paletteValueIndex * colorComponentCount + 2];
          const alpha = palette[paletteValueIndex * colorComponentCount + 3];
          out[(y * width + x) * colorComponentCount + 0] = red;
          out[(y * width + x) * colorComponentCount + 1] = green;
          out[(y * width + x) * colorComponentCount + 2] = blue;
          out[(y * width + x) * colorComponentCount + 3] = alpha;
          x++;
          if (x >= width) {
            y++;
            x = 0;
            if (y >= height) {
              break;
            }
          }
        }
        runlength = -1;
        if (y >= height) {
          break;
        }
      } else {
        runlength = paletteValueIndex - 64;
      }
    }
    return out;
  }
  var init_decodeRLE8 = __esm({
    "node_modules/sff-extractor/src/decodeRLE8.mjs"() {
      init_browser_shims();
    }
  });

  // node_modules/sff-extractor/src/decodeLZ5.mjs
  function decodeLZ5(rle, width, height, palette) {
    if (rle.length === 0) {
      return rle;
    }
    const rawDataOffset = 4;
    const length = rle.readUInt32LE(0);
    const encoded = rle.subarray(rawDataOffset);
    let decoded = import_buffer.Buffer.alloc(width * height, 0);
    let i = 0;
    let j = 0;
    let n = 0;
    let ct = encoded[i];
    let cts = 0;
    let rb = 0;
    let rbc = 0;
    if (i < encoded.length - 1) {
      i++;
    }
    while (j < decoded.length) {
      let d = encoded[i];
      if (i < encoded.length - 1) {
        i++;
      }
      if ((ct & 1 << cts) !== 0) {
        if ((d & 63) === 0) {
          d = (d << 2 | encoded[i]) + 1;
          if (i < encoded.length - 1) {
            i++;
          }
          n = encoded[i] + 2;
          if (i < encoded.length - 1) {
            i++;
          }
        } else {
          rb |= (d & 192) >> rbc;
          rbc += 2;
          n = d & 63;
          if (rbc < 8) {
            d = encoded[i] + 1;
            if (i < encoded.length - 1) {
              i++;
            }
          } else {
            d = rb + 1;
            rb = 0;
            rbc = 0;
          }
        }
        while (true) {
          if (j < decoded.length) {
            decoded[j] = decoded[j - d];
            j++;
          }
          n--;
          if (n < 0) {
            break;
          }
        }
      } else {
        if ((d & 224) === 0) {
          n = encoded[i] + 8;
          if (i < encoded.length - 1) {
            i++;
          }
        } else {
          n = d >> 5;
          d &= 31;
        }
        for (; n > 0; n--) {
          if (j < decoded.length) {
            decoded[j] = d;
            j++;
          }
        }
      }
      cts++;
      if (cts >= 8) {
        ct = encoded[i];
        cts = 0;
        if (i < encoded.length - 1) {
          i++;
        }
      }
    }
    const colorComponentCount = 4;
    const out = import_buffer.Buffer.alloc(width * height * colorComponentCount, 0);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let colorIndex = decoded[y * width + x];
        let red = palette[colorIndex * 4 + 0];
        let green = palette[colorIndex * 4 + 1];
        let blue = palette[colorIndex * 4 + 2];
        let alpha = palette[colorIndex * 4 + 3];
        let bufferIndex = (y * width + x) * 4;
        out[bufferIndex + 0] = red;
        out[bufferIndex + 1] = green;
        out[bufferIndex + 2] = blue;
        out[bufferIndex + 3] = alpha;
      }
    }
    return out;
  }
  var init_decodeLZ5 = __esm({
    "node_modules/sff-extractor/src/decodeLZ5.mjs"() {
      init_browser_shims();
    }
  });

  // node_modules/sff-extractor/src/UPNG.mjs
  var UPNG, UPNG_default;
  var init_UPNG = __esm({
    "node_modules/sff-extractor/src/UPNG.mjs"() {
      init_browser_shims();
      UPNG = {};
      UPNG.toRGBA8 = function(out) {
        var w = out.width, h = out.height;
        if (out.tabs.acTL == null)
          return [UPNG.toRGBA8.decodeImage(out.data, w, h, out).buffer];
        var frms = [];
        if (out.frames[0].data == null) out.frames[0].data = out.data;
        var len = w * h * 4, img = new Uint8Array(len), empty = new Uint8Array(len), prev = new Uint8Array(len);
        for (var i = 0; i < out.frames.length; i++) {
          var frm = out.frames[i];
          var fx = frm.rect.x, fy = frm.rect.y, fw = frm.rect.width, fh = frm.rect.height;
          var fdata = UPNG.toRGBA8.decodeImage(frm.data, fw, fh, out);
          if (i != 0) for (var j = 0; j < len; j++) prev[j] = img[j];
          if (frm.blend == 0) UPNG._copyTile(fdata, fw, fh, img, w, h, fx, fy, 0);
          else if (frm.blend == 1)
            UPNG._copyTile(fdata, fw, fh, img, w, h, fx, fy, 1);
          frms.push(img.buffer.slice(0));
          if (frm.dispose == 0) {
          } else if (frm.dispose == 1)
            UPNG._copyTile(empty, fw, fh, img, w, h, fx, fy, 0);
          else if (frm.dispose == 2) for (var j = 0; j < len; j++) img[j] = prev[j];
        }
        return frms;
      };
      UPNG.toRGBA8.decodeImage = function(data, w, h, out) {
        var area = w * h, bpp = UPNG.decode._getBPP(out);
        var bpl = Math.ceil(w * bpp / 8);
        var bf = new Uint8Array(area * 4), bf32 = new Uint32Array(bf.buffer);
        var ctype = out.ctype, depth = out.depth;
        var rs = UPNG._bin.readUshort;
        var time = Date.now();
        if (ctype == 6) {
          var qarea = area << 2;
          if (depth == 8)
            for (var i = 0; i < qarea; i += 4) {
              bf[i] = data[i];
              bf[i + 1] = data[i + 1];
              bf[i + 2] = data[i + 2];
              bf[i + 3] = data[i + 3];
            }
          if (depth == 16)
            for (var i = 0; i < qarea; i++) {
              bf[i] = data[i << 1];
            }
        } else if (ctype == 2) {
          var ts = out.tabs["tRNS"];
          if (ts == null) {
            if (depth == 8)
              for (var i = 0; i < area; i++) {
                var ti = i * 3;
                bf32[i] = 255 << 24 | data[ti + 2] << 16 | data[ti + 1] << 8 | data[ti];
              }
            if (depth == 16)
              for (var i = 0; i < area; i++) {
                var ti = i * 6;
                bf32[i] = 255 << 24 | data[ti + 4] << 16 | data[ti + 2] << 8 | data[ti];
              }
          } else {
            var tr = ts[0], tg = ts[1], tb = ts[2];
            if (depth == 8)
              for (var i = 0; i < area; i++) {
                var qi = i << 2, ti = i * 3;
                bf32[i] = 255 << 24 | data[ti + 2] << 16 | data[ti + 1] << 8 | data[ti];
                if (data[ti] == tr && data[ti + 1] == tg && data[ti + 2] == tb)
                  bf[qi + 3] = 0;
              }
            if (depth == 16)
              for (var i = 0; i < area; i++) {
                var qi = i << 2, ti = i * 6;
                bf32[i] = 255 << 24 | data[ti + 4] << 16 | data[ti + 2] << 8 | data[ti];
                if (rs(data, ti) == tr && rs(data, ti + 2) == tg && rs(data, ti + 4) == tb)
                  bf[qi + 3] = 0;
              }
          }
        } else if (ctype == 3) {
          var p = out.tabs["PLTE"], ap = out.tabs["tRNS"], tl = ap ? ap.length : 0;
          if (depth == 1)
            for (var y = 0; y < h; y++) {
              var s0 = y * bpl, t0 = y * w;
              for (var i = 0; i < w; i++) {
                var qi = t0 + i << 2, j = data[s0 + (i >> 3)] >> 7 - ((i & 7) << 0) & 1, cj = 3 * j;
                bf[qi] = p[cj];
                bf[qi + 1] = p[cj + 1];
                bf[qi + 2] = p[cj + 2];
                bf[qi + 3] = j < tl ? ap[j] : 255;
              }
            }
          if (depth == 2)
            for (var y = 0; y < h; y++) {
              var s0 = y * bpl, t0 = y * w;
              for (var i = 0; i < w; i++) {
                var qi = t0 + i << 2, j = data[s0 + (i >> 2)] >> 6 - ((i & 3) << 1) & 3, cj = 3 * j;
                bf[qi] = p[cj];
                bf[qi + 1] = p[cj + 1];
                bf[qi + 2] = p[cj + 2];
                bf[qi + 3] = j < tl ? ap[j] : 255;
              }
            }
          if (depth == 4)
            for (var y = 0; y < h; y++) {
              var s0 = y * bpl, t0 = y * w;
              for (var i = 0; i < w; i++) {
                var qi = t0 + i << 2, j = data[s0 + (i >> 1)] >> 4 - ((i & 1) << 2) & 15, cj = 3 * j;
                bf[qi] = p[cj];
                bf[qi + 1] = p[cj + 1];
                bf[qi + 2] = p[cj + 2];
                bf[qi + 3] = j < tl ? ap[j] : 255;
              }
            }
          if (depth == 8)
            for (var i = 0; i < area; i++) {
              var qi = i << 2, j = data[i], cj = 3 * j;
              bf[qi] = p[cj];
              bf[qi + 1] = p[cj + 1];
              bf[qi + 2] = p[cj + 2];
              bf[qi + 3] = j < tl ? ap[j] : 255;
            }
        } else if (ctype == 4) {
          if (depth == 8)
            for (var i = 0; i < area; i++) {
              var qi = i << 2, di = i << 1, gr = data[di];
              bf[qi] = gr;
              bf[qi + 1] = gr;
              bf[qi + 2] = gr;
              bf[qi + 3] = data[di + 1];
            }
          if (depth == 16)
            for (var i = 0; i < area; i++) {
              var qi = i << 2, di = i << 2, gr = data[di];
              bf[qi] = gr;
              bf[qi + 1] = gr;
              bf[qi + 2] = gr;
              bf[qi + 3] = data[di + 2];
            }
        } else if (ctype == 0) {
          var tr = out.tabs["tRNS"] ? out.tabs["tRNS"] : -1;
          for (var y = 0; y < h; y++) {
            var off = y * bpl, to = y * w;
            if (depth == 1)
              for (var x = 0; x < w; x++) {
                var gr = 255 * (data[off + (x >>> 3)] >>> 7 - (x & 7) & 1), al = gr == tr * 255 ? 0 : 255;
                bf32[to + x] = al << 24 | gr << 16 | gr << 8 | gr;
              }
            else if (depth == 2)
              for (var x = 0; x < w; x++) {
                var gr = 85 * (data[off + (x >>> 2)] >>> 6 - ((x & 3) << 1) & 3), al = gr == tr * 85 ? 0 : 255;
                bf32[to + x] = al << 24 | gr << 16 | gr << 8 | gr;
              }
            else if (depth == 4)
              for (var x = 0; x < w; x++) {
                var gr = 17 * (data[off + (x >>> 1)] >>> 4 - ((x & 1) << 2) & 15), al = gr == tr * 17 ? 0 : 255;
                bf32[to + x] = al << 24 | gr << 16 | gr << 8 | gr;
              }
            else if (depth == 8)
              for (var x = 0; x < w; x++) {
                var gr = data[off + x], al = gr == tr ? 0 : 255;
                bf32[to + x] = al << 24 | gr << 16 | gr << 8 | gr;
              }
            else if (depth == 16)
              for (var x = 0; x < w; x++) {
                var gr = data[off + (x << 1)], al = rs(data, off + (x << i)) == tr ? 0 : 255;
                bf32[to + x] = al << 24 | gr << 16 | gr << 8 | gr;
              }
          }
        }
        return bf;
      };
      UPNG.decode = function(buff) {
        var data = new Uint8Array(buff), offset = 8, bin = UPNG._bin, rUs = bin.readUshort, rUi = bin.readUint;
        var out = { tabs: {}, frames: [] };
        var dd = new Uint8Array(data.length), doff = 0;
        var fd, foff = 0;
        var mgck = [137, 80, 78, 71, 13, 10, 26, 10];
        for (var i = 0; i < 8; i++)
          if (data[i] != mgck[i]) throw new Error("The input is not a PNG file!");
        while (offset < data.length) {
          var len = bin.readUint(data, offset);
          offset += 4;
          var type = bin.readASCII(data, offset, 4);
          offset += 4;
          if (type == "IHDR") {
            UPNG.decode._IHDR(data, offset, out);
          } else if (type == "CgBI") {
            out.tabs[type] = data.slice(offset, offset + 4);
          } else if (type == "IDAT") {
            for (var i = 0; i < len; i++) dd[doff + i] = data[offset + i];
            doff += len;
          } else if (type == "acTL") {
            out.tabs[type] = {
              num_frames: rUi(data, offset),
              num_plays: rUi(data, offset + 4)
            };
            fd = new Uint8Array(data.length);
          } else if (type == "fcTL") {
            if (foff != 0) {
              var fr = out.frames[out.frames.length - 1];
              fr.data = UPNG.decode._decompress(
                out,
                fd.slice(0, foff),
                fr.rect.width,
                fr.rect.height
              );
              foff = 0;
            }
            var rct = {
              x: rUi(data, offset + 12),
              y: rUi(data, offset + 16),
              width: rUi(data, offset + 4),
              height: rUi(data, offset + 8)
            };
            var del = rUs(data, offset + 22);
            del = rUs(data, offset + 20) / (del == 0 ? 100 : del);
            var frm = {
              rect: rct,
              delay: Math.round(del * 1e3),
              dispose: data[offset + 24],
              blend: data[offset + 25]
            };
            out.frames.push(frm);
          } else if (type == "fdAT") {
            for (var i = 0; i < len - 4; i++) fd[foff + i] = data[offset + i + 4];
            foff += len - 4;
          } else if (type == "pHYs") {
            out.tabs[type] = [
              bin.readUint(data, offset),
              bin.readUint(data, offset + 4),
              data[offset + 8]
            ];
          } else if (type == "cHRM") {
            out.tabs[type] = [];
            for (var i = 0; i < 8; i++)
              out.tabs[type].push(bin.readUint(data, offset + i * 4));
          } else if (type == "tEXt" || type == "zTXt") {
            if (out.tabs[type] == null) out.tabs[type] = {};
            var nz = bin.nextZero(data, offset);
            var keyw = bin.readASCII(data, offset, nz - offset);
            var text, tl = offset + len - nz - 1;
            if (type == "tEXt") text = bin.readASCII(data, nz + 1, tl);
            else {
              var bfr = UPNG.decode._inflate(data.slice(nz + 2, nz + 2 + tl));
              text = bin.readUTF8(bfr, 0, bfr.length);
            }
            out.tabs[type][keyw] = text;
          } else if (type == "iTXt") {
            if (out.tabs[type] == null) out.tabs[type] = {};
            var nz = 0, off = offset;
            nz = bin.nextZero(data, off);
            var keyw = bin.readASCII(data, off, nz - off);
            off = nz + 1;
            var cflag = data[off], cmeth = data[off + 1];
            off += 2;
            nz = bin.nextZero(data, off);
            var ltag = bin.readASCII(data, off, nz - off);
            off = nz + 1;
            nz = bin.nextZero(data, off);
            var tkeyw = bin.readUTF8(data, off, nz - off);
            off = nz + 1;
            var text, tl = len - (off - offset);
            if (cflag == 0) text = bin.readUTF8(data, off, tl);
            else {
              var bfr = UPNG.decode._inflate(data.slice(off, off + tl));
              text = bin.readUTF8(bfr, 0, bfr.length);
            }
            out.tabs[type][keyw] = text;
          } else if (type == "PLTE") {
            out.tabs[type] = bin.readBytes(data, offset, len);
          } else if (type == "hIST") {
            var pl = out.tabs["PLTE"].length / 3;
            out.tabs[type] = [];
            for (var i = 0; i < pl; i++)
              out.tabs[type].push(rUs(data, offset + i * 2));
          } else if (type == "tRNS") {
            if (out.ctype == 3) out.tabs[type] = bin.readBytes(data, offset, len);
            else if (out.ctype == 0) out.tabs[type] = rUs(data, offset);
            else if (out.ctype == 2)
              out.tabs[type] = [
                rUs(data, offset),
                rUs(data, offset + 2),
                rUs(data, offset + 4)
              ];
          } else if (type == "gAMA")
            out.tabs[type] = bin.readUint(data, offset) / 1e5;
          else if (type == "sRGB") out.tabs[type] = data[offset];
          else if (type == "bKGD") {
            if (out.ctype == 0 || out.ctype == 4)
              out.tabs[type] = [rUs(data, offset)];
            else if (out.ctype == 2 || out.ctype == 6)
              out.tabs[type] = [
                rUs(data, offset),
                rUs(data, offset + 2),
                rUs(data, offset + 4)
              ];
            else if (out.ctype == 3) out.tabs[type] = data[offset];
          } else if (type == "IEND") {
            break;
          }
          offset += len;
          var crc = bin.readUint(data, offset);
          offset += 4;
        }
        if (foff != 0) {
          var fr = out.frames[out.frames.length - 1];
          fr.data = UPNG.decode._decompress(
            out,
            fd.slice(0, foff),
            fr.rect.width,
            fr.rect.height
          );
          foff = 0;
        }
        out.data = UPNG.decode._decompress(out, dd, out.width, out.height);
        delete out.compress;
        delete out.interlace;
        delete out.filter;
        return out;
      };
      UPNG.decode._decompress = function(out, dd, w, h) {
        var time = Date.now();
        var bpp = UPNG.decode._getBPP(out), bpl = Math.ceil(w * bpp / 8), buff = new Uint8Array((bpl + 1 + out.interlace) * h);
        if (out.tabs["CgBI"]) dd = UPNG.inflateRaw(dd, buff);
        else dd = UPNG.decode._inflate(dd, buff);
        var time = Date.now();
        if (out.interlace == 0) dd = UPNG.decode._filterZero(dd, out, 0, w, h);
        else if (out.interlace == 1) dd = UPNG.decode._readInterlace(dd, out);
        return dd;
      };
      UPNG.decode._inflate = function(data, buff) {
        var out = UPNG["inflateRaw"](
          new Uint8Array(data.buffer, 2, data.length - 6),
          buff
        );
        return out;
      };
      UPNG.inflateRaw = (function() {
        var H = {};
        H.H = {};
        H.H.N = function(N, W) {
          var R = Uint8Array, i = 0, m = 0, J = 0, h = 0, Q = 0, X = 0, u = 0, w = 0, d = 0, v, C;
          if (N[0] == 3 && N[1] == 0) return W ? W : new R(0);
          var V = H.H, n = V.b, A = V.e, l = V.R, M = V.n, I = V.A, e = V.Z, b = V.m, Z = W == null;
          if (Z) W = new R(N.length >>> 2 << 3);
          while (i == 0) {
            i = n(N, d, 1);
            m = n(N, d + 1, 2);
            d += 3;
            if (m == 0) {
              if ((d & 7) != 0) d += 8 - (d & 7);
              var D = (d >>> 3) + 4, q = N[D - 4] | N[D - 3] << 8;
              if (Z) W = H.H.W(W, w + q);
              W.set(new R(N.buffer, N.byteOffset + D, q), w);
              d = D + q << 3;
              w += q;
              continue;
            }
            if (Z) W = H.H.W(W, w + (1 << 17));
            if (m == 1) {
              v = b.J;
              C = b.h;
              X = (1 << 9) - 1;
              u = (1 << 5) - 1;
            }
            if (m == 2) {
              J = A(N, d, 5) + 257;
              h = A(N, d + 5, 5) + 1;
              Q = A(N, d + 10, 4) + 4;
              d += 14;
              var E = d, j = 1;
              for (var c = 0; c < 38; c += 2) {
                b.Q[c] = 0;
                b.Q[c + 1] = 0;
              }
              for (var c = 0; c < Q; c++) {
                var K = A(N, d + c * 3, 3);
                b.Q[(b.X[c] << 1) + 1] = K;
                if (K > j) j = K;
              }
              d += 3 * Q;
              M(b.Q, j);
              I(b.Q, j, b.u);
              v = b.w;
              C = b.d;
              d = l(b.u, (1 << j) - 1, J + h, N, d, b.v);
              var r = V.V(b.v, 0, J, b.C);
              X = (1 << r) - 1;
              var S = V.V(b.v, J, h, b.D);
              u = (1 << S) - 1;
              M(b.C, r);
              I(b.C, r, v);
              M(b.D, S);
              I(b.D, S, C);
            }
            while (true) {
              var T = v[e(N, d) & X];
              d += T & 15;
              var p = T >>> 4;
              if (p >>> 8 == 0) {
                W[w++] = p;
              } else if (p == 256) {
                break;
              } else {
                var z = w + p - 254;
                if (p > 264) {
                  var _ = b.q[p - 257];
                  z = w + (_ >>> 3) + A(N, d, _ & 7);
                  d += _ & 7;
                }
                var $ = C[e(N, d) & u];
                d += $ & 15;
                var s = $ >>> 4, Y = b.c[s], a = (Y >>> 4) + n(N, d, Y & 15);
                d += Y & 15;
                while (w < z) {
                  W[w] = W[w++ - a];
                  W[w] = W[w++ - a];
                  W[w] = W[w++ - a];
                  W[w] = W[w++ - a];
                }
                w = z;
              }
            }
          }
          return W.length == w ? W : W.slice(0, w);
        };
        H.H.W = function(N, W) {
          var R = N.length;
          if (W <= R) return N;
          var V = new Uint8Array(R << 1);
          V.set(N, 0);
          return V;
        };
        H.H.R = function(N, W, R, V, n, A) {
          var l = H.H.e, M = H.H.Z, I = 0;
          while (I < R) {
            var e = N[M(V, n) & W];
            n += e & 15;
            var b = e >>> 4;
            if (b <= 15) {
              A[I] = b;
              I++;
            } else {
              var Z = 0, m = 0;
              if (b == 16) {
                m = 3 + l(V, n, 2);
                n += 2;
                Z = A[I - 1];
              } else if (b == 17) {
                m = 3 + l(V, n, 3);
                n += 3;
              } else if (b == 18) {
                m = 11 + l(V, n, 7);
                n += 7;
              }
              var J = I + m;
              while (I < J) {
                A[I] = Z;
                I++;
              }
            }
          }
          return n;
        };
        H.H.V = function(N, W, R, V) {
          var n = 0, A = 0, l = V.length >>> 1;
          while (A < R) {
            var M = N[A + W];
            V[A << 1] = 0;
            V[(A << 1) + 1] = M;
            if (M > n) n = M;
            A++;
          }
          while (A < l) {
            V[A << 1] = 0;
            V[(A << 1) + 1] = 0;
            A++;
          }
          return n;
        };
        H.H.n = function(N, W) {
          var R = H.H.m, V = N.length, n, A, l, M, I, e = R.j;
          for (var M = 0; M <= W; M++) e[M] = 0;
          for (M = 1; M < V; M += 2) e[N[M]]++;
          var b = R.K;
          n = 0;
          e[0] = 0;
          for (A = 1; A <= W; A++) {
            n = n + e[A - 1] << 1;
            b[A] = n;
          }
          for (l = 0; l < V; l += 2) {
            I = N[l + 1];
            if (I != 0) {
              N[l] = b[I];
              b[I]++;
            }
          }
        };
        H.H.A = function(N, W, R) {
          var V = N.length, n = H.H.m, A = n.r;
          for (var l = 0; l < V; l += 2)
            if (N[l + 1] != 0) {
              var M = l >> 1, I = N[l + 1], e = M << 4 | I, b = W - I, Z = N[l] << b, m = Z + (1 << b);
              while (Z != m) {
                var J = A[Z] >>> 15 - W;
                R[J] = e;
                Z++;
              }
            }
        };
        H.H.l = function(N, W) {
          var R = H.H.m.r, V = 15 - W;
          for (var n = 0; n < N.length; n += 2) {
            var A = N[n] << W - N[n + 1];
            N[n] = R[A] >>> V;
          }
        };
        H.H.M = function(N, W, R) {
          R = R << (W & 7);
          var V = W >>> 3;
          N[V] |= R;
          N[V + 1] |= R >>> 8;
        };
        H.H.I = function(N, W, R) {
          R = R << (W & 7);
          var V = W >>> 3;
          N[V] |= R;
          N[V + 1] |= R >>> 8;
          N[V + 2] |= R >>> 16;
        };
        H.H.e = function(N, W, R) {
          return (N[W >>> 3] | N[(W >>> 3) + 1] << 8) >>> (W & 7) & (1 << R) - 1;
        };
        H.H.b = function(N, W, R) {
          return (N[W >>> 3] | N[(W >>> 3) + 1] << 8 | N[(W >>> 3) + 2] << 16) >>> (W & 7) & (1 << R) - 1;
        };
        H.H.Z = function(N, W) {
          return (N[W >>> 3] | N[(W >>> 3) + 1] << 8 | N[(W >>> 3) + 2] << 16) >>> (W & 7);
        };
        H.H.i = function(N, W) {
          return (N[W >>> 3] | N[(W >>> 3) + 1] << 8 | N[(W >>> 3) + 2] << 16 | N[(W >>> 3) + 3] << 24) >>> (W & 7);
        };
        H.H.m = (function() {
          var N = Uint16Array, W = Uint32Array;
          return {
            K: new N(16),
            j: new N(16),
            X: [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
            S: [
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              13,
              15,
              17,
              19,
              23,
              27,
              31,
              35,
              43,
              51,
              59,
              67,
              83,
              99,
              115,
              131,
              163,
              195,
              227,
              258,
              999,
              999,
              999
            ],
            T: [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              2,
              2,
              2,
              2,
              3,
              3,
              3,
              3,
              4,
              4,
              4,
              4,
              5,
              5,
              5,
              5,
              0,
              0,
              0,
              0
            ],
            q: new N(32),
            p: [
              1,
              2,
              3,
              4,
              5,
              7,
              9,
              13,
              17,
              25,
              33,
              49,
              65,
              97,
              129,
              193,
              257,
              385,
              513,
              769,
              1025,
              1537,
              2049,
              3073,
              4097,
              6145,
              8193,
              12289,
              16385,
              24577,
              65535,
              65535
            ],
            z: [
              0,
              0,
              0,
              0,
              1,
              1,
              2,
              2,
              3,
              3,
              4,
              4,
              5,
              5,
              6,
              6,
              7,
              7,
              8,
              8,
              9,
              9,
              10,
              10,
              11,
              11,
              12,
              12,
              13,
              13,
              0,
              0
            ],
            c: new W(32),
            J: new N(512),
            _: [],
            h: new N(32),
            $: [],
            w: new N(32768),
            C: [],
            v: [],
            d: new N(32768),
            D: [],
            u: new N(512),
            Q: [],
            r: new N(1 << 15),
            s: new W(286),
            Y: new W(30),
            a: new W(19),
            t: new W(15e3),
            k: new N(1 << 16),
            g: new N(1 << 15)
          };
        })();
        (function() {
          var N = H.H.m, W = 1 << 15;
          for (var R = 0; R < W; R++) {
            var V = R;
            V = (V & 2863311530) >>> 1 | (V & 1431655765) << 1;
            V = (V & 3435973836) >>> 2 | (V & 858993459) << 2;
            V = (V & 4042322160) >>> 4 | (V & 252645135) << 4;
            V = (V & 4278255360) >>> 8 | (V & 16711935) << 8;
            N.r[R] = (V >>> 16 | V << 16) >>> 17;
          }
          function n(A, l, M) {
            while (l-- != 0) A.push(0, M);
          }
          for (var R = 0; R < 32; R++) {
            N.q[R] = N.S[R] << 3 | N.T[R];
            N.c[R] = N.p[R] << 4 | N.z[R];
          }
          n(N._, 144, 8);
          n(N._, 255 - 143, 9);
          n(N._, 279 - 255, 7);
          n(N._, 287 - 279, 8);
          H.H.n(N._, 9);
          H.H.A(N._, 9, N.J);
          H.H.l(N._, 9);
          n(N.$, 32, 5);
          H.H.n(N.$, 5);
          H.H.A(N.$, 5, N.h);
          H.H.l(N.$, 5);
          n(N.Q, 19, 0);
          n(N.C, 286, 0);
          n(N.D, 30, 0);
          n(N.v, 320, 0);
        })();
        return H.H.N;
      })();
      UPNG.decode._readInterlace = function(data, out) {
        var w = out.width, h = out.height;
        var bpp = UPNG.decode._getBPP(out), cbpp = bpp >> 3, bpl = Math.ceil(w * bpp / 8);
        var img = new Uint8Array(h * bpl);
        var di = 0;
        var starting_row = [0, 0, 4, 0, 2, 0, 1];
        var starting_col = [0, 4, 0, 2, 0, 1, 0];
        var row_increment = [8, 8, 8, 4, 4, 2, 2];
        var col_increment = [8, 8, 4, 4, 2, 2, 1];
        var pass = 0;
        while (pass < 7) {
          var ri = row_increment[pass], ci = col_increment[pass];
          var sw = 0, sh = 0;
          var cr = starting_row[pass];
          while (cr < h) {
            cr += ri;
            sh++;
          }
          var cc = starting_col[pass];
          while (cc < w) {
            cc += ci;
            sw++;
          }
          var bpll = Math.ceil(sw * bpp / 8);
          UPNG.decode._filterZero(data, out, di, sw, sh);
          var y = 0, row = starting_row[pass];
          while (row < h) {
            var col = starting_col[pass];
            var cdi = di + y * bpll << 3;
            while (col < w) {
              if (bpp == 1) {
                var val = data[cdi >> 3];
                val = val >> 7 - (cdi & 7) & 1;
                img[row * bpl + (col >> 3)] |= val << 7 - ((col & 7) << 0);
              }
              if (bpp == 2) {
                var val = data[cdi >> 3];
                val = val >> 6 - (cdi & 7) & 3;
                img[row * bpl + (col >> 2)] |= val << 6 - ((col & 3) << 1);
              }
              if (bpp == 4) {
                var val = data[cdi >> 3];
                val = val >> 4 - (cdi & 7) & 15;
                img[row * bpl + (col >> 1)] |= val << 4 - ((col & 1) << 2);
              }
              if (bpp >= 8) {
                var ii = row * bpl + col * cbpp;
                for (var j = 0; j < cbpp; j++) img[ii + j] = data[(cdi >> 3) + j];
              }
              cdi += bpp;
              col += ci;
            }
            y++;
            row += ri;
          }
          if (sw * sh != 0) di += sh * (1 + bpll);
          pass = pass + 1;
        }
        return img;
      };
      UPNG.decode._getBPP = function(out) {
        var noc = [1, null, 3, 1, 2, null, 4][out.ctype];
        return noc * out.depth;
      };
      UPNG.decode._filterZero = function(data, out, off, w, h) {
        var bpp = UPNG.decode._getBPP(out), bpl = Math.ceil(w * bpp / 8), paeth = UPNG.decode._paeth;
        bpp = Math.ceil(bpp / 8);
        var i = 0, di = 1, type = data[off], x = 0;
        if (type > 1) data[off] = [0, 0, 1][type - 2];
        if (type == 3)
          for (x = bpp; x < bpl; x++)
            data[x + 1] = data[x + 1] + (data[x + 1 - bpp] >>> 1) & 255;
        for (var y = 0; y < h; y++) {
          i = off + y * bpl;
          di = i + y + 1;
          type = data[di - 1];
          x = 0;
          if (type == 0) for (; x < bpl; x++) data[i + x] = data[di + x];
          else if (type == 1) {
            for (; x < bpp; x++) data[i + x] = data[di + x];
            for (; x < bpl; x++) data[i + x] = data[di + x] + data[i + x - bpp];
          } else if (type == 2) {
            for (; x < bpl; x++) data[i + x] = data[di + x] + data[i + x - bpl];
          } else if (type == 3) {
            for (; x < bpp; x++)
              data[i + x] = data[di + x] + (data[i + x - bpl] >>> 1);
            for (; x < bpl; x++)
              data[i + x] = data[di + x] + (data[i + x - bpl] + data[i + x - bpp] >>> 1);
          } else {
            for (; x < bpp; x++)
              data[i + x] = data[di + x] + paeth(0, data[i + x - bpl], 0);
            for (; x < bpl; x++)
              data[i + x] = data[di + x] + paeth(data[i + x - bpp], data[i + x - bpl], data[i + x - bpp - bpl]);
          }
        }
        return data;
      };
      UPNG.decode._paeth = function(a, b, c) {
        var p = a + b - c, pa = p - a, pb = p - b, pc = p - c;
        if (pa * pa <= pb * pb && pa * pa <= pc * pc) return a;
        else if (pb * pb <= pc * pc) return b;
        return c;
      };
      UPNG.decode._IHDR = function(data, offset, out) {
        var bin = UPNG._bin;
        out.width = bin.readUint(data, offset);
        offset += 4;
        out.height = bin.readUint(data, offset);
        offset += 4;
        out.depth = data[offset];
        offset++;
        out.ctype = data[offset];
        offset++;
        out.compress = data[offset];
        offset++;
        out.filter = data[offset];
        offset++;
        out.interlace = data[offset];
        offset++;
      };
      UPNG._bin = {
        nextZero: function(data, p) {
          while (data[p] != 0) p++;
          return p;
        },
        readUshort: function(buff, p) {
          return buff[p] << 8 | buff[p + 1];
        },
        writeUshort: function(buff, p, n) {
          buff[p] = n >> 8 & 255;
          buff[p + 1] = n & 255;
        },
        readUint: function(buff, p) {
          return buff[p] * (256 * 256 * 256) + (buff[p + 1] << 16 | buff[p + 2] << 8 | buff[p + 3]);
        },
        writeUint: function(buff, p, n) {
          buff[p] = n >> 24 & 255;
          buff[p + 1] = n >> 16 & 255;
          buff[p + 2] = n >> 8 & 255;
          buff[p + 3] = n & 255;
        },
        readASCII: function(buff, p, l) {
          var s = "";
          for (var i = 0; i < l; i++) s += String.fromCharCode(buff[p + i]);
          return s;
        },
        writeASCII: function(data, p, s) {
          for (var i = 0; i < s.length; i++) data[p + i] = s.charCodeAt(i);
        },
        readBytes: function(buff, p, l) {
          var arr = [];
          for (var i = 0; i < l; i++) arr.push(buff[p + i]);
          return arr;
        },
        pad: function(n) {
          return n.length < 2 ? "0" + n : n;
        },
        readUTF8: function(buff, p, l) {
          var s = "", ns;
          for (var i = 0; i < l; i++)
            s += "%" + UPNG._bin.pad(buff[p + i].toString(16));
          try {
            ns = decodeURIComponent(s);
          } catch (e) {
            return UPNG._bin.readASCII(buff, p, l);
          }
          return ns;
        }
      };
      UPNG._copyTile = function(sb, sw, sh, tb, tw, th, xoff, yoff, mode) {
        var w = Math.min(sw, tw), h = Math.min(sh, th);
        var si = 0, ti = 0;
        for (var y = 0; y < h; y++)
          for (var x = 0; x < w; x++) {
            if (xoff >= 0 && yoff >= 0) {
              si = y * sw + x << 2;
              ti = (yoff + y) * tw + xoff + x << 2;
            } else {
              si = (-yoff + y) * sw - xoff + x << 2;
              ti = y * tw + x << 2;
            }
            if (mode == 0) {
              tb[ti] = sb[si];
              tb[ti + 1] = sb[si + 1];
              tb[ti + 2] = sb[si + 2];
              tb[ti + 3] = sb[si + 3];
            } else if (mode == 1) {
              var fa = sb[si + 3] * (1 / 255), fr = sb[si] * fa, fg = sb[si + 1] * fa, fb = sb[si + 2] * fa;
              var ba = tb[ti + 3] * (1 / 255), br = tb[ti] * ba, bg = tb[ti + 1] * ba, bb = tb[ti + 2] * ba;
              var ifa = 1 - fa, oa = fa + ba * ifa, ioa = oa == 0 ? 0 : 1 / oa;
              tb[ti + 3] = 255 * oa;
              tb[ti + 0] = (fr + br * ifa) * ioa;
              tb[ti + 1] = (fg + bg * ifa) * ioa;
              tb[ti + 2] = (fb + bb * ifa) * ioa;
            } else if (mode == 2) {
              var fa = sb[si + 3], fr = sb[si], fg = sb[si + 1], fb = sb[si + 2];
              var ba = tb[ti + 3], br = tb[ti], bg = tb[ti + 1], bb = tb[ti + 2];
              if (fa == ba && fr == br && fg == bg && fb == bb) {
                tb[ti] = 0;
                tb[ti + 1] = 0;
                tb[ti + 2] = 0;
                tb[ti + 3] = 0;
              } else {
                tb[ti] = fr;
                tb[ti + 1] = fg;
                tb[ti + 2] = fb;
                tb[ti + 3] = fa;
              }
            } else if (mode == 3) {
              var fa = sb[si + 3], fr = sb[si], fg = sb[si + 1], fb = sb[si + 2];
              var ba = tb[ti + 3], br = tb[ti], bg = tb[ti + 1], bb = tb[ti + 2];
              if (fa == ba && fr == br && fg == bg && fb == bb) continue;
              if (fa < 220 && ba > 20) return false;
            }
          }
        return true;
      };
      UPNG.encode = function(bufs, w, h, ps, dels, tabs, forbidPlte) {
        if (ps == null) ps = 0;
        if (forbidPlte == null) forbidPlte = false;
        var nimg = UPNG.encode.compress(bufs, w, h, ps, [
          false,
          false,
          false,
          0,
          forbidPlte
        ]);
        UPNG.encode.compressPNG(nimg, -1);
        return UPNG.encode._main(nimg, w, h, dels, tabs);
      };
      UPNG.encodeLL = function(bufs, w, h, cc, ac, depth, dels, tabs) {
        var nimg = {
          ctype: 0 + (cc == 1 ? 0 : 2) + (ac == 0 ? 0 : 4),
          depth,
          frames: []
        };
        var time = Date.now();
        var bipp = (cc + ac) * depth, bipl = bipp * w;
        for (var i = 0; i < bufs.length; i++)
          nimg.frames.push({
            rect: { x: 0, y: 0, width: w, height: h },
            img: new Uint8Array(bufs[i]),
            blend: 0,
            dispose: 1,
            bpp: Math.ceil(bipp / 8),
            bpl: Math.ceil(bipl / 8)
          });
        UPNG.encode.compressPNG(nimg, 0, true);
        var out = UPNG.encode._main(nimg, w, h, dels, tabs);
        return out;
      };
      UPNG.encode._main = function(nimg, w, h, dels, tabs) {
        if (tabs == null) tabs = {};
        var crc = UPNG.crc.crc, wUi = UPNG._bin.writeUint, wUs = UPNG._bin.writeUshort, wAs = UPNG._bin.writeASCII;
        var offset = 8, anim = nimg.frames.length > 1, pltAlpha = false;
        var leng = 8 + (16 + 5 + 4) + (anim ? 20 : 0);
        if (tabs["sRGB"] != null) leng += 8 + 1 + 4;
        if (tabs["pHYs"] != null) leng += 8 + 9 + 4;
        if (nimg.ctype == 3) {
          var dl = nimg.plte.length;
          for (var i = 0; i < dl; i++)
            if (nimg.plte[i] >>> 24 != 255) pltAlpha = true;
          leng += 8 + dl * 3 + 4 + (pltAlpha ? 8 + dl * 1 + 4 : 0);
        }
        for (var j = 0; j < nimg.frames.length; j++) {
          var fr = nimg.frames[j];
          if (anim) leng += 38;
          leng += fr.cimg.length + 12;
          if (j != 0) leng += 4;
        }
        leng += 12;
        var data = new Uint8Array(leng);
        var wr = [137, 80, 78, 71, 13, 10, 26, 10];
        for (var i = 0; i < 8; i++) data[i] = wr[i];
        wUi(data, offset, 13);
        offset += 4;
        wAs(data, offset, "IHDR");
        offset += 4;
        wUi(data, offset, w);
        offset += 4;
        wUi(data, offset, h);
        offset += 4;
        data[offset] = nimg.depth;
        offset++;
        data[offset] = nimg.ctype;
        offset++;
        data[offset] = 0;
        offset++;
        data[offset] = 0;
        offset++;
        data[offset] = 0;
        offset++;
        wUi(data, offset, crc(data, offset - 17, 17));
        offset += 4;
        if (tabs["sRGB"] != null) {
          wUi(data, offset, 1);
          offset += 4;
          wAs(data, offset, "sRGB");
          offset += 4;
          data[offset] = tabs["sRGB"];
          offset++;
          wUi(data, offset, crc(data, offset - 5, 5));
          offset += 4;
        }
        if (tabs["pHYs"] != null) {
          wUi(data, offset, 9);
          offset += 4;
          wAs(data, offset, "pHYs");
          offset += 4;
          wUi(data, offset, tabs["pHYs"][0]);
          offset += 4;
          wUi(data, offset, tabs["pHYs"][1]);
          offset += 4;
          data[offset] = tabs["pHYs"][2];
          offset++;
          wUi(data, offset, crc(data, offset - 13, 13));
          offset += 4;
        }
        if (anim) {
          wUi(data, offset, 8);
          offset += 4;
          wAs(data, offset, "acTL");
          offset += 4;
          wUi(data, offset, nimg.frames.length);
          offset += 4;
          wUi(data, offset, tabs["loop"] != null ? tabs["loop"] : 0);
          offset += 4;
          wUi(data, offset, crc(data, offset - 12, 12));
          offset += 4;
        }
        if (nimg.ctype == 3) {
          var dl = nimg.plte.length;
          wUi(data, offset, dl * 3);
          offset += 4;
          wAs(data, offset, "PLTE");
          offset += 4;
          for (var i = 0; i < dl; i++) {
            var ti = i * 3, c = nimg.plte[i], r = c & 255, g = c >>> 8 & 255, b = c >>> 16 & 255;
            data[offset + ti + 0] = r;
            data[offset + ti + 1] = g;
            data[offset + ti + 2] = b;
          }
          offset += dl * 3;
          wUi(data, offset, crc(data, offset - dl * 3 - 4, dl * 3 + 4));
          offset += 4;
          if (pltAlpha) {
            wUi(data, offset, dl);
            offset += 4;
            wAs(data, offset, "tRNS");
            offset += 4;
            for (var i = 0; i < dl; i++)
              data[offset + i] = nimg.plte[i] >>> 24 & 255;
            offset += dl;
            wUi(data, offset, crc(data, offset - dl - 4, dl + 4));
            offset += 4;
          }
        }
        var fi = 0;
        for (var j = 0; j < nimg.frames.length; j++) {
          var fr = nimg.frames[j];
          if (anim) {
            wUi(data, offset, 26);
            offset += 4;
            wAs(data, offset, "fcTL");
            offset += 4;
            wUi(data, offset, fi++);
            offset += 4;
            wUi(data, offset, fr.rect.width);
            offset += 4;
            wUi(data, offset, fr.rect.height);
            offset += 4;
            wUi(data, offset, fr.rect.x);
            offset += 4;
            wUi(data, offset, fr.rect.y);
            offset += 4;
            wUs(data, offset, dels[j]);
            offset += 2;
            wUs(data, offset, 1e3);
            offset += 2;
            data[offset] = fr.dispose;
            offset++;
            data[offset] = fr.blend;
            offset++;
            wUi(data, offset, crc(data, offset - 30, 30));
            offset += 4;
          }
          var imgd = fr.cimg, dl = imgd.length;
          wUi(data, offset, dl + (j == 0 ? 0 : 4));
          offset += 4;
          var ioff = offset;
          wAs(data, offset, j == 0 ? "IDAT" : "fdAT");
          offset += 4;
          if (j != 0) {
            wUi(data, offset, fi++);
            offset += 4;
          }
          data.set(imgd, offset);
          offset += dl;
          wUi(data, offset, crc(data, ioff, offset - ioff));
          offset += 4;
        }
        wUi(data, offset, 0);
        offset += 4;
        wAs(data, offset, "IEND");
        offset += 4;
        wUi(data, offset, crc(data, offset - 4, 4));
        offset += 4;
        return data.buffer;
      };
      UPNG.encode.compressPNG = function(out, filter, levelZero) {
        for (var i = 0; i < out.frames.length; i++) {
          var frm = out.frames[i], nw = frm.rect.width, nh = frm.rect.height;
          var fdata = new Uint8Array(nh * frm.bpl + nh);
          frm.cimg = UPNG.encode._filterZero(
            frm.img,
            nh,
            frm.bpp,
            frm.bpl,
            fdata,
            filter,
            levelZero
          );
        }
      };
      UPNG.encode.compress = function(bufs, w, h, ps, prms) {
        var onlyBlend = prms[0], evenCrd = prms[1], forbidPrev = prms[2], minBits = prms[3], forbidPlte = prms[4];
        var ctype = 6, depth = 8, alphaAnd = 255;
        for (var j = 0; j < bufs.length; j++) {
          var img = new Uint8Array(bufs[j]), ilen = img.length;
          for (var i = 0; i < ilen; i += 4) alphaAnd &= img[i + 3];
        }
        var gotAlpha = alphaAnd != 255;
        var frms = UPNG.encode.framize(bufs, w, h, onlyBlend, evenCrd, forbidPrev);
        var cmap = {}, plte = [], inds = [];
        if (ps != 0) {
          var nbufs = [];
          for (var i = 0; i < frms.length; i++) nbufs.push(frms[i].img.buffer);
          var abuf = UPNG.encode.concatRGBA(nbufs), qres = UPNG.quantize(abuf, ps);
          console.log(qres);
          var cof = 0, bb = new Uint8Array(qres.abuf);
          for (var i = 0; i < frms.length; i++) {
            var ti = frms[i].img, bln = ti.length;
            inds.push(new Uint8Array(qres.inds.buffer, cof >> 2, bln >> 2));
            for (var j = 0; j < bln; j += 4) {
              ti[j] = bb[cof + j];
              ti[j + 1] = bb[cof + j + 1];
              ti[j + 2] = bb[cof + j + 2];
              ti[j + 3] = bb[cof + j + 3];
            }
            cof += bln;
          }
          for (var i = 0; i < qres.plte.length; i++) plte.push(qres.plte[i].est.rgba);
        } else {
          for (var j = 0; j < frms.length; j++) {
            var frm = frms[j], img32 = new Uint32Array(frm.img.buffer), nw = frm.rect.width, ilen = img32.length;
            var ind = new Uint8Array(ilen);
            inds.push(ind);
            for (var i = 0; i < ilen; i++) {
              var c = img32[i];
              if (i != 0 && c == img32[i - 1]) ind[i] = ind[i - 1];
              else if (i > nw && c == img32[i - nw]) ind[i] = ind[i - nw];
              else {
                var cmc = cmap[c];
                if (cmc == null) {
                  cmap[c] = cmc = plte.length;
                  plte.push(c);
                  if (plte.length >= 300) break;
                }
                ind[i] = cmc;
              }
            }
          }
        }
        var cc = plte.length;
        if (cc <= 256 && forbidPlte == false) {
          if (cc <= 2) depth = 1;
          else if (cc <= 4) depth = 2;
          else if (cc <= 16) depth = 4;
          else depth = 8;
          depth = Math.max(depth, minBits);
        }
        for (var j = 0; j < frms.length; j++) {
          var frm = frms[j], nx = frm.rect.x, ny = frm.rect.y, nw = frm.rect.width, nh = frm.rect.height;
          var cimg = frm.img, cimg32 = new Uint32Array(cimg.buffer);
          var bpl = 4 * nw, bpp = 4;
          if (cc <= 256 && forbidPlte == false) {
            bpl = Math.ceil(depth * nw / 8);
            var nimg = new Uint8Array(bpl * nh);
            var inj = inds[j];
            for (var y = 0; y < nh; y++) {
              var i = y * bpl, ii = y * nw;
              if (depth == 8) for (var x = 0; x < nw; x++) nimg[i + x] = inj[ii + x];
              else if (depth == 4)
                for (var x = 0; x < nw; x++)
                  nimg[i + (x >> 1)] |= inj[ii + x] << 4 - (x & 1) * 4;
              else if (depth == 2)
                for (var x = 0; x < nw; x++)
                  nimg[i + (x >> 2)] |= inj[ii + x] << 6 - (x & 3) * 2;
              else if (depth == 1)
                for (var x = 0; x < nw; x++)
                  nimg[i + (x >> 3)] |= inj[ii + x] << 7 - (x & 7) * 1;
            }
            cimg = nimg;
            ctype = 3;
            bpp = 1;
          } else if (gotAlpha == false && frms.length == 1) {
            var nimg = new Uint8Array(nw * nh * 3), area = nw * nh;
            for (var i = 0; i < area; i++) {
              var ti = i * 3, qi = i * 4;
              nimg[ti] = cimg[qi];
              nimg[ti + 1] = cimg[qi + 1];
              nimg[ti + 2] = cimg[qi + 2];
            }
            cimg = nimg;
            ctype = 2;
            bpp = 3;
            bpl = 3 * nw;
          }
          frm.img = cimg;
          frm.bpl = bpl;
          frm.bpp = bpp;
        }
        return { ctype, depth, plte, frames: frms };
      };
      UPNG.encode.framize = function(bufs, w, h, alwaysBlend, evenCrd, forbidPrev) {
        var frms = [];
        for (var j = 0; j < bufs.length; j++) {
          var cimg = new Uint8Array(bufs[j]), cimg32 = new Uint32Array(cimg.buffer);
          var nimg;
          var nx = 0, ny = 0, nw = w, nh = h, blend = alwaysBlend ? 1 : 0;
          if (j != 0) {
            var tlim = forbidPrev || alwaysBlend || j == 1 || frms[j - 2].dispose != 0 ? 1 : 2, tstp = 0, tarea = 1e9;
            for (var it = 0; it < tlim; it++) {
              var pimg = new Uint8Array(bufs[j - 1 - it]), p32 = new Uint32Array(bufs[j - 1 - it]);
              var mix = w, miy = h, max = -1, may = -1;
              for (var y = 0; y < h; y++)
                for (var x = 0; x < w; x++) {
                  var i = y * w + x;
                  if (cimg32[i] != p32[i]) {
                    if (x < mix) mix = x;
                    if (x > max) max = x;
                    if (y < miy) miy = y;
                    if (y > may) may = y;
                  }
                }
              if (max == -1) mix = miy = max = may = 0;
              if (evenCrd) {
                if ((mix & 1) == 1) mix--;
                if ((miy & 1) == 1) miy--;
              }
              var sarea = (max - mix + 1) * (may - miy + 1);
              if (sarea < tarea) {
                tarea = sarea;
                tstp = it;
                nx = mix;
                ny = miy;
                nw = max - mix + 1;
                nh = may - miy + 1;
              }
            }
            var pimg = new Uint8Array(bufs[j - 1 - tstp]);
            if (tstp == 1) frms[j - 1].dispose = 2;
            nimg = new Uint8Array(nw * nh * 4);
            UPNG._copyTile(pimg, w, h, nimg, nw, nh, -nx, -ny, 0);
            blend = UPNG._copyTile(cimg, w, h, nimg, nw, nh, -nx, -ny, 3) ? 1 : 0;
            if (blend == 1)
              UPNG.encode._prepareDiff(cimg, w, h, nimg, {
                x: nx,
                y: ny,
                width: nw,
                height: nh
              });
            else UPNG._copyTile(cimg, w, h, nimg, nw, nh, -nx, -ny, 0);
          } else nimg = cimg.slice(0);
          frms.push({
            rect: { x: nx, y: ny, width: nw, height: nh },
            img: nimg,
            blend,
            dispose: 0
          });
        }
        if (alwaysBlend)
          for (var j = 0; j < frms.length; j++) {
            var frm = frms[j];
            if (frm.blend == 1) continue;
            var r0 = frm.rect, r1 = frms[j - 1].rect;
            var miX = Math.min(r0.x, r1.x), miY = Math.min(r0.y, r1.y);
            var maX = Math.max(r0.x + r0.width, r1.x + r1.width), maY = Math.max(r0.y + r0.height, r1.y + r1.height);
            var r = { x: miX, y: miY, width: maX - miX, height: maY - miY };
            frms[j - 1].dispose = 1;
            if (j - 1 != 0)
              UPNG.encode._updateFrame(bufs, w, h, frms, j - 1, r, evenCrd);
            UPNG.encode._updateFrame(bufs, w, h, frms, j, r, evenCrd);
          }
        var area = 0;
        if (bufs.length != 1)
          for (var i = 0; i < frms.length; i++) {
            var frm = frms[i];
            area += frm.rect.width * frm.rect.height;
          }
        return frms;
      };
      UPNG.encode._updateFrame = function(bufs, w, h, frms, i, r, evenCrd) {
        var U8 = Uint8Array, U32 = Uint32Array;
        var pimg = new U8(bufs[i - 1]), pimg32 = new U32(bufs[i - 1]), nimg = i + 1 < bufs.length ? new U8(bufs[i + 1]) : null;
        var cimg = new U8(bufs[i]), cimg32 = new U32(cimg.buffer);
        var mix = w, miy = h, max = -1, may = -1;
        for (var y = 0; y < r.height; y++)
          for (var x = 0; x < r.width; x++) {
            var cx = r.x + x, cy = r.y + y;
            var j = cy * w + cx, cc = cimg32[j];
            if (cc == 0 || frms[i - 1].dispose == 0 && pimg32[j] == cc && (nimg == null || nimg[j * 4 + 3] != 0)) {
            } else {
              if (cx < mix) mix = cx;
              if (cx > max) max = cx;
              if (cy < miy) miy = cy;
              if (cy > may) may = cy;
            }
          }
        if (max == -1) mix = miy = max = may = 0;
        if (evenCrd) {
          if ((mix & 1) == 1) mix--;
          if ((miy & 1) == 1) miy--;
        }
        r = { x: mix, y: miy, width: max - mix + 1, height: may - miy + 1 };
        var fr = frms[i];
        fr.rect = r;
        fr.blend = 1;
        fr.img = new Uint8Array(r.width * r.height * 4);
        if (frms[i - 1].dispose == 0) {
          UPNG._copyTile(pimg, w, h, fr.img, r.width, r.height, -r.x, -r.y, 0);
          UPNG.encode._prepareDiff(cimg, w, h, fr.img, r);
        } else UPNG._copyTile(cimg, w, h, fr.img, r.width, r.height, -r.x, -r.y, 0);
      };
      UPNG.encode._prepareDiff = function(cimg, w, h, nimg, rec) {
        UPNG._copyTile(cimg, w, h, nimg, rec.width, rec.height, -rec.x, -rec.y, 2);
      };
      UPNG.encode._filterZero = function(img, h, bpp, bpl, data, filter, levelZero) {
        var fls = [], ftry = [0, 1, 2, 3, 4];
        if (filter != -1) ftry = [filter];
        else if (h * bpl > 5e5 || bpp == 1) ftry = [0];
        var opts;
        if (levelZero) opts = { level: 0 };
        var CMPR = data.length > 1e7 && UZIP != null ? UZIP : pako;
        var time = Date.now();
        for (var i = 0; i < ftry.length; i++) {
          for (var y = 0; y < h; y++)
            UPNG.encode._filterLine(data, img, y, bpl, bpp, ftry[i]);
          fls.push(CMPR["deflate"](data, opts));
        }
        var ti, tsize = 1e9;
        for (var i = 0; i < fls.length; i++)
          if (fls[i].length < tsize) {
            ti = i;
            tsize = fls[i].length;
          }
        return fls[ti];
      };
      UPNG.encode._filterLine = function(data, img, y, bpl, bpp, type) {
        var i = y * bpl, di = i + y, paeth = UPNG.decode._paeth;
        data[di] = type;
        di++;
        if (type == 0) {
          if (bpl < 500) for (var x = 0; x < bpl; x++) data[di + x] = img[i + x];
          else data.set(new Uint8Array(img.buffer, i, bpl), di);
        } else if (type == 1) {
          for (var x = 0; x < bpp; x++) data[di + x] = img[i + x];
          for (var x = bpp; x < bpl; x++)
            data[di + x] = img[i + x] - img[i + x - bpp] + 256 & 255;
        } else if (y == 0) {
          for (var x = 0; x < bpp; x++) data[di + x] = img[i + x];
          if (type == 2) for (var x = bpp; x < bpl; x++) data[di + x] = img[i + x];
          if (type == 3)
            for (var x = bpp; x < bpl; x++)
              data[di + x] = img[i + x] - (img[i + x - bpp] >> 1) + 256 & 255;
          if (type == 4)
            for (var x = bpp; x < bpl; x++)
              data[di + x] = img[i + x] - paeth(img[i + x - bpp], 0, 0) + 256 & 255;
        } else {
          if (type == 2) {
            for (var x = 0; x < bpl; x++)
              data[di + x] = img[i + x] + 256 - img[i + x - bpl] & 255;
          }
          if (type == 3) {
            for (var x = 0; x < bpp; x++)
              data[di + x] = img[i + x] + 256 - (img[i + x - bpl] >> 1) & 255;
            for (var x = bpp; x < bpl; x++)
              data[di + x] = img[i + x] + 256 - (img[i + x - bpl] + img[i + x - bpp] >> 1) & 255;
          }
          if (type == 4) {
            for (var x = 0; x < bpp; x++)
              data[di + x] = img[i + x] + 256 - paeth(0, img[i + x - bpl], 0) & 255;
            for (var x = bpp; x < bpl; x++)
              data[di + x] = img[i + x] + 256 - paeth(img[i + x - bpp], img[i + x - bpl], img[i + x - bpp - bpl]) & 255;
          }
        }
      };
      UPNG.crc = {
        table: (function() {
          var tab = new Uint32Array(256);
          for (var n = 0; n < 256; n++) {
            var c = n;
            for (var k = 0; k < 8; k++) {
              if (c & 1) c = 3988292384 ^ c >>> 1;
              else c = c >>> 1;
            }
            tab[n] = c;
          }
          return tab;
        })(),
        update: function(c, buf, off, len) {
          for (var i = 0; i < len; i++)
            c = UPNG.crc.table[(c ^ buf[off + i]) & 255] ^ c >>> 8;
          return c;
        },
        crc: function(b, o, l) {
          return UPNG.crc.update(4294967295, b, o, l) ^ 4294967295;
        }
      };
      UPNG.quantize = function(abuf, ps) {
        var oimg = new Uint8Array(abuf), nimg = oimg.slice(0), nimg32 = new Uint32Array(nimg.buffer);
        var KD = UPNG.quantize.getKDtree(nimg, ps);
        var root = KD[0], leafs = KD[1];
        var planeDst = UPNG.quantize.planeDst;
        var sb = oimg, tb = nimg32, len = sb.length;
        var inds = new Uint8Array(oimg.length >> 2), nd;
        if (oimg.length < 2e7)
          for (var i = 0; i < len; i += 4) {
            var r = sb[i] * (1 / 255), g = sb[i + 1] * (1 / 255), b = sb[i + 2] * (1 / 255), a = sb[i + 3] * (1 / 255);
            nd = UPNG.quantize.getNearest(root, r, g, b, a);
            inds[i >> 2] = nd.ind;
            tb[i >> 2] = nd.est.rgba;
          }
        else
          for (var i = 0; i < len; i += 4) {
            var r = sb[i] * (1 / 255), g = sb[i + 1] * (1 / 255), b = sb[i + 2] * (1 / 255), a = sb[i + 3] * (1 / 255);
            nd = root;
            while (nd.left)
              nd = planeDst(nd.est, r, g, b, a) <= 0 ? nd.left : nd.right;
            inds[i >> 2] = nd.ind;
            tb[i >> 2] = nd.est.rgba;
          }
        return { abuf: nimg.buffer, inds, plte: leafs };
      };
      UPNG.quantize.getKDtree = function(nimg, ps, err) {
        if (err == null) err = 1e-4;
        var nimg32 = new Uint32Array(nimg.buffer);
        var root = {
          i0: 0,
          i1: nimg.length,
          bst: null,
          est: null,
          tdst: 0,
          left: null,
          right: null
        };
        root.bst = UPNG.quantize.stats(nimg, root.i0, root.i1);
        root.est = UPNG.quantize.estats(root.bst);
        var leafs = [root];
        while (leafs.length < ps) {
          var maxL = 0, mi = 0;
          for (var i = 0; i < leafs.length; i++)
            if (leafs[i].est.L > maxL) {
              maxL = leafs[i].est.L;
              mi = i;
            }
          if (maxL < err) break;
          var node = leafs[mi];
          var s0 = UPNG.quantize.splitPixels(
            nimg,
            nimg32,
            node.i0,
            node.i1,
            node.est.e,
            node.est.eMq255
          );
          var s0wrong = node.i0 >= s0 || node.i1 <= s0;
          if (s0wrong) {
            node.est.L = 0;
            continue;
          }
          var ln = {
            i0: node.i0,
            i1: s0,
            bst: null,
            est: null,
            tdst: 0,
            left: null,
            right: null
          };
          ln.bst = UPNG.quantize.stats(nimg, ln.i0, ln.i1);
          ln.est = UPNG.quantize.estats(ln.bst);
          var rn = {
            i0: s0,
            i1: node.i1,
            bst: null,
            est: null,
            tdst: 0,
            left: null,
            right: null
          };
          rn.bst = { R: [], m: [], N: node.bst.N - ln.bst.N };
          for (var i = 0; i < 16; i++) rn.bst.R[i] = node.bst.R[i] - ln.bst.R[i];
          for (var i = 0; i < 4; i++) rn.bst.m[i] = node.bst.m[i] - ln.bst.m[i];
          rn.est = UPNG.quantize.estats(rn.bst);
          node.left = ln;
          node.right = rn;
          leafs[mi] = ln;
          leafs.push(rn);
        }
        leafs.sort(function(a, b) {
          return b.bst.N - a.bst.N;
        });
        for (var i = 0; i < leafs.length; i++) leafs[i].ind = i;
        return [root, leafs];
      };
      UPNG.quantize.getNearest = function(nd, r, g, b, a) {
        if (nd.left == null) {
          nd.tdst = UPNG.quantize.dist(nd.est.q, r, g, b, a);
          return nd;
        }
        var planeDst = UPNG.quantize.planeDst(nd.est, r, g, b, a);
        var node0 = nd.left, node1 = nd.right;
        if (planeDst > 0) {
          node0 = nd.right;
          node1 = nd.left;
        }
        var ln = UPNG.quantize.getNearest(node0, r, g, b, a);
        if (ln.tdst <= planeDst * planeDst) return ln;
        var rn = UPNG.quantize.getNearest(node1, r, g, b, a);
        return rn.tdst < ln.tdst ? rn : ln;
      };
      UPNG.quantize.planeDst = function(est, r, g, b, a) {
        var e = est.e;
        return e[0] * r + e[1] * g + e[2] * b + e[3] * a - est.eMq;
      };
      UPNG.quantize.dist = function(q, r, g, b, a) {
        var d0 = r - q[0], d1 = g - q[1], d2 = b - q[2], d3 = a - q[3];
        return d0 * d0 + d1 * d1 + d2 * d2 + d3 * d3;
      };
      UPNG.quantize.splitPixels = function(nimg, nimg32, i0, i1, e, eMq) {
        var vecDot = UPNG.quantize.vecDot;
        i1 -= 4;
        var shfs = 0;
        while (i0 < i1) {
          while (vecDot(nimg, i0, e) <= eMq) i0 += 4;
          while (vecDot(nimg, i1, e) > eMq) i1 -= 4;
          if (i0 >= i1) break;
          var t = nimg32[i0 >> 2];
          nimg32[i0 >> 2] = nimg32[i1 >> 2];
          nimg32[i1 >> 2] = t;
          i0 += 4;
          i1 -= 4;
        }
        while (vecDot(nimg, i0, e) > eMq) i0 -= 4;
        return i0 + 4;
      };
      UPNG.quantize.vecDot = function(nimg, i, e) {
        return nimg[i] * e[0] + nimg[i + 1] * e[1] + nimg[i + 2] * e[2] + nimg[i + 3] * e[3];
      };
      UPNG.quantize.stats = function(nimg, i0, i1) {
        var R = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var m = [0, 0, 0, 0];
        var N = i1 - i0 >> 2;
        for (var i = i0; i < i1; i += 4) {
          var r = nimg[i] * (1 / 255), g = nimg[i + 1] * (1 / 255), b = nimg[i + 2] * (1 / 255), a = nimg[i + 3] * (1 / 255);
          m[0] += r;
          m[1] += g;
          m[2] += b;
          m[3] += a;
          R[0] += r * r;
          R[1] += r * g;
          R[2] += r * b;
          R[3] += r * a;
          R[5] += g * g;
          R[6] += g * b;
          R[7] += g * a;
          R[10] += b * b;
          R[11] += b * a;
          R[15] += a * a;
        }
        R[4] = R[1];
        R[8] = R[2];
        R[9] = R[6];
        R[12] = R[3];
        R[13] = R[7];
        R[14] = R[11];
        return { R, m, N };
      };
      UPNG.quantize.estats = function(stats) {
        var R = stats.R, m = stats.m, N = stats.N;
        var m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3], iN = N == 0 ? 0 : 1 / N;
        var Rj = [
          R[0] - m0 * m0 * iN,
          R[1] - m0 * m1 * iN,
          R[2] - m0 * m2 * iN,
          R[3] - m0 * m3 * iN,
          R[4] - m1 * m0 * iN,
          R[5] - m1 * m1 * iN,
          R[6] - m1 * m2 * iN,
          R[7] - m1 * m3 * iN,
          R[8] - m2 * m0 * iN,
          R[9] - m2 * m1 * iN,
          R[10] - m2 * m2 * iN,
          R[11] - m2 * m3 * iN,
          R[12] - m3 * m0 * iN,
          R[13] - m3 * m1 * iN,
          R[14] - m3 * m2 * iN,
          R[15] - m3 * m3 * iN
        ];
        var A = Rj, M = UPNG.M4;
        var b = [Math.random(), Math.random(), Math.random(), Math.random()], mi = 0, tmi = 0;
        if (N != 0)
          for (var i = 0; i < 16; i++) {
            b = M.multVec(A, b);
            tmi = Math.sqrt(M.dot(b, b));
            b = M.sml(1 / tmi, b);
            if (i != 0 && Math.abs(tmi - mi) < 1e-9) break;
            mi = tmi;
          }
        var q = [m0 * iN, m1 * iN, m2 * iN, m3 * iN];
        var eMq255 = M.dot(M.sml(255, q), b);
        return {
          Cov: Rj,
          q,
          e: b,
          L: mi,
          eMq255,
          eMq: M.dot(b, q),
          rgba: (Math.round(255 * q[3]) << 24 | Math.round(255 * q[2]) << 16 | Math.round(255 * q[1]) << 8 | Math.round(255 * q[0]) << 0) >>> 0
        };
      };
      UPNG.M4 = {
        multVec: function(m, v) {
          return [
            m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3] * v[3],
            m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7] * v[3],
            m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11] * v[3],
            m[12] * v[0] + m[13] * v[1] + m[14] * v[2] + m[15] * v[3]
          ];
        },
        dot: function(x, y) {
          return x[0] * y[0] + x[1] * y[1] + x[2] * y[2] + x[3] * y[3];
        },
        sml: function(a, y) {
          return [a * y[0], a * y[1], a * y[2], a * y[3]];
        }
      };
      UPNG.encode.concatRGBA = function(bufs) {
        var tlen = 0;
        for (var i = 0; i < bufs.length; i++) tlen += bufs[i].byteLength;
        var nimg = new Uint8Array(tlen), noff = 0;
        for (var i = 0; i < bufs.length; i++) {
          var img = new Uint8Array(bufs[i]), il = img.length;
          for (var j = 0; j < il; j += 4) {
            var r = img[j], g = img[j + 1], b = img[j + 2], a = img[j + 3];
            if (a == 0) r = g = b = 0;
            nimg[noff + j] = r;
            nimg[noff + j + 1] = g;
            nimg[noff + j + 2] = b;
            nimg[noff + j + 3] = a;
          }
          noff += il;
        }
        return nimg.buffer;
      };
      UPNG_default = UPNG;
    }
  });

  // node_modules/sff-extractor/src/decodePNG8.mjs
  function decodePNG8(buffer, width, height, palette) {
    const rawDataOffset = 4;
    const data = buffer.subarray(rawDataOffset);
    const decodedPng = UPNG_default.decode(data);
    const colorComponentCount = 4;
    const out = import_buffer.Buffer.alloc(width * height * colorComponentCount, 0);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const colorIndex = decodedPng.data[y * width + x];
        const red = palette[colorIndex * colorComponentCount + 0];
        const green = palette[colorIndex * colorComponentCount + 1];
        const blue = palette[colorIndex * colorComponentCount + 2];
        const index = (y * width + x) * 4;
        out[index + 0] = red;
        out[index + 1] = green;
        out[index + 2] = blue;
        out[index + 3] = colorIndex === 0 ? 0 : 255;
      }
    }
    return out;
  }
  var init_decodePNG8 = __esm({
    "node_modules/sff-extractor/src/decodePNG8.mjs"() {
      init_browser_shims();
      init_UPNG();
    }
  });

  // node_modules/sff-extractor/src/decodePCX.mjs
  function implementation2(buffer, pcxWidth, pcxHeight, encoding, bpl, palette) {
    const unknownVariable = encoding == 1 ? bpl : 0;
    const p = import_buffer.Buffer.alloc(pcxWidth * pcxHeight);
    let i = 0, j = 0, k = 0, w = pcxWidth;
    while (j < p.length) {
      let n = 1;
      let d = buffer[i];
      if (i < buffer.length - 1) {
        i++;
      }
      if (d >= 192) {
        n = d & 63;
        d = buffer[i];
        if (i < buffer.length - 1) {
          i++;
        }
      }
      while (n > 0) {
        if (k < w && j < p.length) {
          p[j] = d;
          j++;
        }
        k++;
        if (k === unknownVariable) {
          k = 0;
          n = 1;
        }
        n--;
      }
    }
    const out = import_buffer.Buffer.alloc(pcxWidth * pcxHeight * 4);
    for (let ii = 0, aa = 0; ii < p.length; ii++, aa += 4) {
      const paletteColorIndex = p[ii] * 4;
      let red = palette[paletteColorIndex + 0];
      let green = palette[paletteColorIndex + 1];
      let blue = palette[paletteColorIndex + 2];
      let alpha = palette[paletteColorIndex + 3];
      if (paletteColorIndex === 0) {
        red = 0;
        green = 0;
        blue = 0;
        alpha = 0;
      }
      out[aa + 0] = red;
      out[aa + 1] = green;
      out[aa + 2] = blue;
      out[aa + 3] = alpha;
    }
    return out;
  }
  function decodePCX(buffer, width, height, palette) {
    let offset = 0;
    const id = buffer.readUInt8(offset);
    offset += 1;
    const version2 = buffer.readUInt8(offset);
    offset += 1;
    const encoding = buffer.readUInt8(offset);
    offset += 1;
    const bitPerPixel = buffer.readUInt8(offset);
    if (bitPerPixel != 8) {
      throw new Error(`Invalid PCX, bitPerPixel: ${bitPerPixel}`);
    }
    offset += 1;
    const minX = buffer.readUInt16LE(offset);
    offset += 2;
    const minY = buffer.readUInt16LE(offset);
    offset += 2;
    let maxX = buffer.readUInt16LE(offset);
    offset += 2;
    let maxY = buffer.readUInt16LE(offset);
    offset += 2;
    const horizontalResolution = buffer.readUInt16LE(offset);
    offset += 2;
    const verticalResolution = buffer.readUInt16LE(offset);
    offset += 2;
    const colorMap = [];
    for (let i = 0; i < 16; i++) {
      var c = [];
      c[0] = buffer.readUInt8(offset);
      offset += 1;
      c[1] = buffer.readUInt8(offset);
      offset += 1;
      c[2] = buffer.readUInt8(offset);
      offset += 1;
      colorMap.push(c);
    }
    const reserved = buffer.readUInt8(offset);
    offset += 1;
    const bitplanes = buffer.readUInt8(offset);
    offset += 1;
    const bytesPerRow = buffer.readUInt16LE(offset);
    offset += 2;
    const paletteInfo = buffer.readUInt16LE(offset);
    offset += 2;
    offset = 128;
    const imageData = buffer.subarray(offset);
    const pcxWidth = maxX - minX + 1;
    const pcxHeight = maxY - minY + 1;
    if (pcxWidth * pcxHeight >= 65536 * 65536) {
      return import_buffer.Buffer.alloc(0);
    }
    return implementation2(
      imageData,
      pcxWidth,
      pcxHeight,
      encoding,
      bytesPerRow,
      palette
    );
  }
  var init_decodePCX = __esm({
    "node_modules/sff-extractor/src/decodePCX.mjs"() {
      init_browser_shims();
    }
  });

  // node_modules/sff-extractor/src/decodeSpriteBuffer.mjs
  function decodeSpriteBuffer(compressionMethod, buffer, width, height, palette) {
    switch (compressionMethod) {
      default:
        throw new Error(`Unknown compression method: ${compressionMethod}`);
      case "PCX":
        return decodePCX(buffer, width, height, palette);
      case "RLE5":
        throw new Error(`TODO RLE5`);
        break;
      case "RLE8":
        return decodeRLE8(buffer, width, height, palette);
      case "LZ5":
        return decodeLZ5(buffer, width, height, palette);
      case "PNG8":
        return decodePNG8(buffer, width, height, palette);
      case "PNG24":
      case "PNG32": {
        const png = import_pngjs.PNG.sync.read(buffer.subarray(4));
        return png.data;
      }
    }
  }
  var import_pngjs;
  var init_decodeSpriteBuffer = __esm({
    "node_modules/sff-extractor/src/decodeSpriteBuffer.mjs"() {
      init_browser_shims();
      import_pngjs = __toESM(require_png(), 1);
      init_decodeRLE8();
      init_decodeLZ5();
      init_decodePNG8();
      init_decodePCX();
    }
  });

  // node_modules/sff-extractor/src/convertPaletteRGBABufferToTable.mjs
  function convertPaletteRGBABufferToTable(buffer) {
    const table = [];
    for (let colorIndex = 0; colorIndex < buffer.length; colorIndex += 4) {
      const red = buffer[colorIndex];
      const green = buffer[colorIndex + 1];
      const blue = buffer[colorIndex + 2];
      const alpha = buffer[colorIndex + 3];
      table.push([red, green, blue, alpha]);
    }
    return table;
  }
  var init_convertPaletteRGBABufferToTable = __esm({
    "node_modules/sff-extractor/src/convertPaletteRGBABufferToTable.mjs"() {
      init_browser_shims();
    }
  });

  // node_modules/sff-extractor/src/convertExternalPaletteToRGBA.mjs
  function convertExternalPaletteToRGBA(buffer) {
    const rgba = import_buffer.Buffer.alloc(256 * 4);
    for (let rgbIndex = 0, rgbaIndex = 256 * 4 - 1; rgbIndex < buffer.length; rgbIndex += 3, rgbaIndex -= 4) {
      const red = buffer[rgbIndex];
      const green = buffer[rgbIndex + 1];
      const blue = buffer[rgbIndex + 2];
      const alpha = rgbIndex === buffer.length - 3 ? 0 : 255;
      rgba[rgbaIndex] = alpha;
      rgba[rgbaIndex - 1] = blue;
      rgba[rgbaIndex - 2] = green;
      rgba[rgbaIndex - 3] = red;
    }
    return rgba;
  }
  var init_convertExternalPaletteToRGBA = __esm({
    "node_modules/sff-extractor/src/convertExternalPaletteToRGBA.mjs"() {
      init_browser_shims();
    }
  });

  // node_modules/sff-extractor/index.mjs
  var sff_extractor_exports = {};
  __export(sff_extractor_exports, {
    default: () => extract
  });
  function extract(buffer, providedOptions) {
    const options = {
      palettes: true,
      paletteBuffer: true,
      paletteTable: true,
      sprites: true,
      spriteBuffer: true,
      decodeSpriteBuffer: false,
      spriteGroups: [],
      applyPalette: null,
      ...providedOptions
    };
    if (buffer.length < 12) {
      throw new Error(`Invalid file: too small (< 12 bytes)`);
    }
    const signature = buffer.toString("ascii", 0, 11);
    if (signature !== "ElecbyteSpr") {
      throw new Error(`Invalid file signature: "${signature}"`);
    }
    const data = {};
    const majorVersion = buffer.readUInt8(15);
    switch (majorVersion) {
      case 1:
        {
          const metadata = extractMetadataFromSFFV1(buffer);
          Object.assign(data, metadata);
          if (options.sprites) {
            let sprites = extractSpritesFromSFFV1(buffer, metadata);
            for (const sprite of sprites) {
              if (options.decodeSpriteBuffer) {
                if (sprite.linkedSpriteIndex > 0) {
                  const linkedSprite = sprites[sprite.linkedSpriteIndex];
                  sprite.decodedBuffer = linkedSprite.decodedBuffer;
                } else {
                  if (options.applyPalette && sprite.samePalette != 0) {
                    sprite.palette = convertExternalPaletteToRGBA(
                      options.applyPalette
                    );
                  }
                  sprite.decodedBuffer = decodeSpriteBuffer(
                    "PCX",
                    sprite.buffer,
                    sprite.width,
                    sprite.height,
                    sprite.palette
                  );
                }
              }
              if (!options.spriteBuffer) {
                delete sprite.buffer;
              }
              if (options.palettes) {
                if (options.paletteTable) {
                  sprite.paletteTable = convertPaletteRGBABufferToTable(
                    sprite.palette
                  );
                }
                if (!options.paletteBuffer) {
                  delete sprite.palette;
                }
              } else {
                delete sprite.palette;
              }
            }
            if (options.spriteGroups.length > 0) {
              sprites = sprites.filter((sprite) => {
                return options.spriteGroups.includes(sprite.group);
              });
            }
            Object.assign(data, { sprites });
          }
        }
        break;
      case 2:
        {
          const metadata = extractMetadataFromSFFV2(buffer);
          Object.assign(data, metadata);
          const palettes = extractPalettesFromSFFV2(buffer, metadata, options);
          const paletteBuffers = palettes.map((palette) => palette.buffer);
          if (options.palettes) {
            Object.assign(data, { palettes });
            if (options.paletteTable) {
              for (const palette of palettes) {
                palette.table = convertPaletteRGBABufferToTable(palette.buffer);
              }
            }
            if (!options.paletteBuffer) {
              for (const palette of palettes) {
                delete palette.buffer;
              }
            }
          }
          if (options.sprites) {
            let sprites = extractSpritesFromSFFV2(
              buffer,
              metadata,
              paletteBuffers
            );
            if (options.decodeSpriteBuffer) {
              for (const sprite of sprites) {
                if (sprite.linkedIndex > 0) {
                  const linkedSprite = sprites[sprite.linkedIndex];
                  sprite.decodedBuffer = linkedSprite.decodedBuffer;
                } else {
                  let palette = paletteBuffers[sprite.paletteIndex];
                  if (options.applyPalette) {
                    palette = convertExternalPaletteToRGBA(options.applyPalette);
                  }
                  try {
                    sprite.decodedBuffer = decodeSpriteBuffer(
                      sprite.compressionMethod,
                      sprite.buffer,
                      sprite.width,
                      sprite.height,
                      palette
                    );
                  } catch (error) {
                    throw new Error(
                      `Unable to decode sprite (group: ${sprite.group}, number: ${sprite.number}): ${error.message}`
                    );
                  }
                }
              }
            }
            if (options.spriteGroups.length > 0) {
              sprites = sprites.filter((sprite) => {
                return options.spriteGroups.includes(sprite.group);
              });
            }
            Object.assign(data, { sprites });
            if (!options.spriteBuffer) {
              for (const sprite of sprites) {
                delete sprite.buffer;
              }
            }
          }
        }
        break;
      default:
        throw new Error(`Invalid version: ${version}`);
    }
    return data;
  }
  var init_sff_extractor = __esm({
    "node_modules/sff-extractor/index.mjs"() {
      init_browser_shims();
      init_extractMetadataFromSFFV1();
      init_extractSpritesFromSFFV1();
      init_extractMetadataFromSFFV2();
      init_extractPalettesFromSFFV2();
      init_extractSpritesFromSFFV2();
      init_decodeSpriteBuffer();
      init_convertPaletteRGBABufferToTable();
      init_convertExternalPaletteToRGBA();
    }
  });

  // tools/pack-character.js
  var require_pack_character = __commonJS({
    "tools/pack-character.js"(exports, module) {
      init_browser_shims();
      var fs = require_memfs();
      var path = require_path_browserify();
      var { PNG: PNG2 } = require_png();
      var { buildRobloxFiles, enrichRobloxMeta } = require_roblox_export();
      function getRoot() {
        return process.env.MUGENSKEL_ROOT ? path.resolve(process.env.MUGENSKEL_ROOT) : path.join(__dirname, "..");
      }
      function getPacks() {
        return process.env.MUGENSKEL_PACKS ? path.resolve(process.env.MUGENSKEL_PACKS) : path.join(getRoot(), "packs");
      }
      var FALLBACK_REL = {
        crouchStart: 11,
        crouchEnd: 11,
        jumpStart: 15,
        jump: 16,
        jumpFwd: 41,
        jumpBack: 41,
        run: 100,
        lightPunch: 80,
        heavyKick: 81,
        parry: 6,
        parryStun: 5
      };
      var SHINOBI_SKINS = [
        { id: "shinobi1", name: "Shinobi 1", offset: 1400 },
        { id: "shinobi2", name: "Shinobi 2", offset: 1800 },
        { id: "shinobi3", name: "Shinobi 3", offset: 2200 },
        { id: "shinobi4", name: "Shinobi 4", offset: 2600 },
        { id: "shinobi5", name: "Shinobi 5", offset: 3e3 },
        { id: "shinobi6", name: "Shinobi 6", offset: 3400 },
        { id: "shinobi7", name: "Shinobi 7", offset: 3800 },
        { id: "shinobi8", name: "Shinobi 8", offset: 4200 },
        { id: "shinobi9", name: "Shinobi 9", offset: 4600 }
      ];
      var MAX_FRAMES_LOCO = 24;
      var MAX_ATLAS_EDGE = 2048;
      var TARGET_HEIGHT = 88;
      var PREVIEW_PX = 70;
      var MUGEN_PX_TO_WORLD = 1.5 / 60;
      var SMACK_SLOTS = [
        "jab",
        "forwardTilt",
        "upTilt",
        "downTilt",
        "neutralSpecial",
        "sideSpecial",
        "upSpecial",
        "downSpecial"
      ];
      function slugify(name) {
        return String(name).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "char";
      }
      function readText(filePath) {
        return fs.readFileSync(filePath, "latin1");
      }
      function findMugenFiles(dir) {
        const files = fs.readdirSync(dir);
        const byExt = (ext) => files.filter((f) => f.toLowerCase().endsWith(ext));
        const defName = byExt(".def").find((f) => !/^(intro|ending)\.def$/i.test(f)) || byExt(".def")[0];
        const defPath = defName ? path.join(dir, defName) : null;
        let sffName = null;
        let airName = null;
        let cnsName = null;
        if (defPath) {
          const def = parseDef(defPath);
          if (def.files) {
            if (def.files.sprite && files.includes(def.files.sprite)) sffName = def.files.sprite;
            if (def.files.anim && files.includes(def.files.anim)) airName = def.files.anim;
            if (def.files.cns && files.includes(def.files.cns)) cnsName = def.files.cns;
          }
        }
        if (!sffName) {
          sffName = byExt(".sff").find((f) => !/^(intro|ending)\.sff$/i.test(f)) || byExt(".sff")[0];
        }
        if (!airName) airName = byExt(".air")[0];
        if (!cnsName) cnsName = byExt(".cns").find((f) => !/common/i.test(f)) || byExt(".cns")[0];
        return {
          def: defPath,
          sff: sffName ? path.join(dir, sffName) : null,
          air: airName ? path.join(dir, airName) : null,
          cns: cnsName ? path.join(dir, cnsName) : null,
          atlasJson: files.includes("atlas.json") ? path.join(dir, "atlas.json") : null,
          atlasPng: files.includes("atlas.png") ? path.join(dir, "atlas.png") : null
        };
      }
      function parseDef(defPath) {
        if (!defPath) return {};
        const t = readText(defPath);
        const info = {};
        const mName = t.match(/^\s*name\s*=\s*"?([^"\r\n]+)"?/im);
        if (mName) info.name = mName[1].trim();
        const files = {};
        for (const key of ["sprite", "anim", "cmd", "cns", "stcommon"]) {
          const m = t.match(new RegExp(`^\\s*${key}\\s*=\\s*"?([^"\\r\\n]+)"?`, "im"));
          if (m) files[key] = m[1].trim();
        }
        info.files = files;
        return info;
      }
      function parseCnsPhysics(cnsPath) {
        if (!cnsPath || !fs.existsSync(cnsPath)) {
          return {
            height: 60,
            walkFwd: 2.4,
            walkBack: 2.2,
            jumpY: 8.4,
            jumpFwdX: 2.5,
            jumpBackX: 2.55,
            airJumpY: 8.1,
            airJumpFwdX: 2.5,
            airJumpBackX: 2.5,
            yaccel: 0.44,
            standFriction: 0.85,
            crouchFriction: 0.82,
            airJumpNum: 0,
            airJumpHeight: 35,
            jumpStartFrames: 3
          };
        }
        const t = readText(cnsPath);
        const num = (section, key, fallback) => {
          const sec = t.match(new RegExp(`\\[${section}\\]([\\s\\S]*?)(?=\\n\\[|$)`, "i"));
          if (!sec) return fallback;
          const m = sec[1].match(new RegExp(`^\\s*${key}\\s*=\\s*([^;\\r\\n]+)`, "im"));
          if (!m) return fallback;
          const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
          return parts.length === 1 ? parts[0] : parts;
        };
        const walkFwd = Math.abs(num("Velocity", "walk\\.fwd", 2.4));
        const walkBack = Math.abs(num("Velocity", "walk\\.back", 2.2));
        const jumpNeu = num("Velocity", "jump\\.neu", [0, -8.4]);
        const jumpY = Array.isArray(jumpNeu) ? Math.abs(jumpNeu[1] || 8.4) : 8.4;
        const height = num("Size", "height", 60);
        return {
          height,
          walkFwd,
          walkBack,
          jumpY,
          jumpFwdX: Math.abs(num("Velocity", "jump\\.fwd", 2.5)),
          jumpBackX: Math.abs(num("Velocity", "jump\\.back", 2.5)),
          airJumpY: jumpY,
          airJumpFwdX: 2.5,
          airJumpBackX: 2.5,
          yaccel: Math.abs(num("Movement", "yaccel", 0.44)),
          standFriction: 0.85,
          crouchFriction: 0.82,
          airJumpNum: num("Movement", "airjump\\.num", 0) || 0,
          airJumpHeight: num("Movement", "airjump\\.height", 35),
          jumpStartFrames: 3
        };
      }
      function parseClsnLine(line) {
        const m = line.match(/Clsn[12]\[\d+\]\s*=\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)/i);
        if (!m) return null;
        return {
          x1: Number(m[1]),
          y1: Number(m[2]),
          x2: Number(m[3]),
          y2: Number(m[4])
        };
      }
      function parseAirActions(airPath) {
        const t = readText(airPath);
        const actions = /* @__PURE__ */ new Map();
        const parts = t.split(/\[Begin Action\s+/i);
        for (let i = 1; i < parts.length; i++) {
          const chunk = parts[i];
          const hm = chunk.match(/^(\d+)\]/);
          if (!hm) continue;
          const id = Number(hm[1]);
          const body = chunk.slice(hm[0].length);
          const frames = [];
          let clsn1Default = [];
          let clsn2Default = [];
          let pendingClsn1 = null;
          let pendingClsn2 = null;
          let reading = null;
          let readingDefault = false;
          let expectBoxes = 0;
          let boxBuf = [];
          for (const raw of body.split(/\r?\n/)) {
            const line = raw.trim();
            if (!line || line.startsWith(";")) continue;
            if (line.startsWith("[")) break;
            const def1 = line.match(/^Clsn1Default\s*:\s*(\d+)/i);
            const def2 = line.match(/^Clsn2Default\s*:\s*(\d+)/i);
            const c1 = line.match(/^Clsn1\s*:\s*(\d+)/i);
            const c2 = line.match(/^Clsn2\s*:\s*(\d+)/i);
            if (def1) {
              reading = "1";
              readingDefault = true;
              expectBoxes = Number(def1[1]);
              boxBuf = [];
              continue;
            }
            if (def2) {
              reading = "2";
              readingDefault = true;
              expectBoxes = Number(def2[1]);
              boxBuf = [];
              continue;
            }
            if (c1) {
              reading = "1";
              readingDefault = false;
              expectBoxes = Number(c1[1]);
              boxBuf = [];
              continue;
            }
            if (c2) {
              reading = "2";
              readingDefault = false;
              expectBoxes = Number(c2[1]);
              boxBuf = [];
              continue;
            }
            if (reading && /Clsn[12]\[/i.test(line)) {
              const box = parseClsnLine(line);
              if (box) boxBuf.push(box);
              if (boxBuf.length >= expectBoxes) {
                if (reading === "1") {
                  if (readingDefault) clsn1Default = boxBuf;
                  else pendingClsn1 = boxBuf;
                } else {
                  if (readingDefault) clsn2Default = boxBuf;
                  else pendingClsn2 = boxBuf;
                }
                reading = null;
                boxBuf = [];
              }
              continue;
            }
            if (line.startsWith("Loop")) continue;
            const m = line.match(/^(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)/);
            if (!m) continue;
            let ticks = Number(m[5]);
            if (ticks < 0) ticks = 8;
            if (ticks === 0) ticks = 1;
            const flipH = /,\s*H\b/i.test(line);
            const clsn1 = pendingClsn1 != null ? pendingClsn1 : clsn1Default;
            const clsn2 = pendingClsn2 != null ? pendingClsn2 : clsn2Default;
            frames.push({
              group: Number(m[1]),
              image: Number(m[2]),
              xoff: Number(m[3]),
              yoff: Number(m[4]),
              ticks,
              flipH,
              clsn1: clsn1.map((b) => ({ ...b })),
              clsn2: clsn2.map((b) => ({ ...b }))
            });
            pendingClsn1 = null;
            pendingClsn2 = null;
          }
          if (frames.length) actions.set(id, frames);
        }
        return actions;
      }
      var MAX_NORMALS = 8;
      var MAX_SPECIALS = 10;
      var MAX_HYPERS = 6;
      var MAX_COMMANDS = 4;
      var MAX_THROWS = 2;
      var MAX_CROUCH_ATTACKS = 6;
      var MAX_AIR_ATTACKS = 6;
      var MAX_VFX_SPAWNS = 5;
      var AUTO_BIND_HELP = "A/D walk \xB7 double-tap dash \xB7 hold away block \xB7 W jump \xB7 S crouch \xB7 J/K/L attacks \xB7 U heavy \xB7 I/O specials \xB7 Space pause";
      function actionHasHitbox(frames) {
        return (frames || []).some((f) => f.clsn1 && f.clsn1.length > 0);
      }
      function dominantGroup(frames) {
        const counts = {};
        for (const f of frames || []) {
          if (f.group < 0) continue;
          counts[f.group] = (counts[f.group] || 0) + 1;
        }
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        return sorted.length ? Number(sorted[0][0]) : null;
      }
      function pickAttackCandidates(actions, candidateIds, maxPick, minFiller) {
        const scored = candidateIds.map((id) => {
          const frames = actions.get(id) || [];
          const hit = actionHasHitbox(frames);
          const frameCount = frames.filter((f) => f.group >= 0).length;
          return { id, hit, frameCount, group: dominantGroup(frames) };
        });
        const real = scored.filter((s) => s.hit && s.frameCount >= 2);
        const filler = scored.filter((s) => !real.some((r) => r.id === s.id) && s.frameCount >= 3);
        const picked = [];
        for (const s of real) {
          if (picked.length >= maxPick) break;
          picked.push(s.id);
        }
        const fillerCap = minFiller != null ? minFiller : Math.min(4, maxPick);
        if (picked.length < Math.min(2, fillerCap)) {
          for (const s of filler) {
            if (picked.length >= fillerCap) break;
            picked.push(s.id);
          }
        }
        return picked;
      }
      function bandIds(actions, offset, lo, hi) {
        const out = [];
        for (let i = lo; i <= hi; i++) {
          const id = offset + i;
          if (actions.has(id)) out.push(id);
        }
        return out;
      }
      function discoverNormals(actions, offset, maxPick) {
        const candidates = bandIds(actions, offset, 200, 299);
        for (const id of bandIds(actions, offset, 80, 199)) {
          if (!candidates.includes(id)) candidates.push(id);
        }
        candidates.sort((a, b) => a - b);
        return pickAttackCandidates(actions, candidates, maxPick);
      }
      function discoverCrouchAttacks(actions, offset, maxPick) {
        return pickAttackCandidates(actions, bandIds(actions, offset, 400, 499), maxPick, Math.min(3, maxPick));
      }
      function discoverAirAttacks(actions, offset, maxPick) {
        return pickAttackCandidates(actions, bandIds(actions, offset, 600, 699), maxPick, Math.min(3, maxPick));
      }
      function discoverCommands(actions, offset, maxPick) {
        return pickAttackCandidates(actions, bandIds(actions, offset, 300, 399), maxPick, Math.min(2, maxPick));
      }
      function discoverThrows(actions, offset, maxPick) {
        return pickAttackCandidates(actions, bandIds(actions, offset, 500, 599), maxPick, Math.min(1, maxPick));
      }
      function discoverSpecials(actions, offset, maxPick) {
        if (offset !== 0) return [];
        return pickAttackCandidates(actions, bandIds(actions, offset, 1e3, 1999), maxPick, Math.min(4, maxPick));
      }
      function discoverHypers(actions, offset, maxPick) {
        if (offset !== 0) return [];
        const a = bandIds(actions, offset, 2e3, 2999);
        const b = bandIds(actions, offset, 3e3, 3999);
        return pickAttackCandidates(actions, a.concat(b), maxPick, Math.min(2, maxPick));
      }
      function firstMove(moves, ids) {
        for (const id of ids) {
          if (moves[id]) return id;
        }
        return null;
      }
      function buildAutoBinds(moves, animMap) {
        const keyboard = {};
        const slots = {};
        const unbound = [];
        function put(code, moveId, slotName) {
          if (!moveId || !moves[moveId]) return false;
          keyboard[code] = { move: moveId, slot: slotName || code };
          return true;
        }
        function variantSlot(neutral, crouchIds, airIds) {
          return {
            neutral,
            forward: neutral,
            up: firstMove(moves, airIds.concat([neutral])),
            down: firstMove(moves, crouchIds.concat([neutral])),
            air: firstMove(moves, airIds.concat([neutral])),
            crouch: firstMove(moves, crouchIds.concat([neutral]))
          };
        }
        const atk1 = firstMove(moves, ["normal1", "special1"]);
        const atk2 = firstMove(moves, ["normal2", "normal1"]);
        const atk3 = firstMove(moves, ["normal3", "command1", "normal2", "normal1"]);
        const heavy1 = firstMove(moves, ["normal4", "normal5", "command1", "normal3", "normal2"]);
        const spec1 = firstMove(moves, ["special1", "hyper1", "command2", "normal3"]);
        const spec2 = firstMove(moves, ["special2", "hyper1", "special3", "special1"]);
        put("KeyJ", atk1, "attack1");
        put("KeyK", atk2, "attack2");
        put("KeyL", atk3, "attack3");
        put("KeyU", heavy1, "heavy1");
        put("KeyI", spec1, "special1");
        put("KeyO", spec2, "special2");
        slots.attack1 = variantSlot(atk1, ["crouchAttack1", "crouchAttack2"], ["airAttack1", "airAttack2"]);
        slots.attack2 = variantSlot(atk2, ["crouchAttack2", "crouchAttack1"], ["airAttack2", "airAttack1"]);
        slots.attack3 = variantSlot(atk3, ["crouchAttack3", "crouchAttack1"], ["airAttack3", "airAttack1"]);
        slots.heavy1 = variantSlot(heavy1, ["crouchAttack3", "crouchAttack2"], ["airAttack3", "airAttack2"]);
        slots.special1 = variantSlot(spec1, ["special1"], ["special1"]);
        slots.special2 = variantSlot(spec2, ["special2"], ["special2"]);
        const bound = /* @__PURE__ */ new Set();
        Object.values(keyboard).forEach((v) => bound.add(v.move));
        for (const group of Object.values(slots)) {
          Object.values(group).forEach((id) => {
            if (id) bound.add(id);
          });
        }
        Object.keys(moves).forEach((id) => {
          if (/^(jab|forwardTilt|upTilt|downTilt|neutralSpecial|sideSpecial|upSpecial|downSpecial|lightPunch|heavyKick|parry)$/.test(id)) return;
          if (bound.has(id)) return;
          unbound.push(id);
        });
        return {
          scheme: "jkluio-v1",
          help: AUTO_BIND_HELP,
          keyboard,
          slots,
          context: {
            crouchLight: slots.attack1.crouch,
            crouchHeavy: slots.heavy1.crouch,
            airLight: slots.attack1.air,
            airHeavy: slots.heavy1.air
          },
          unbound
        };
      }
      function scoreVfxCandidate(vfxId, bodyAnim, actions) {
        if (vfxId == null || vfxId === bodyAnim || vfxId === 9999) return -1;
        if (!actions.has(vfxId)) return -1;
        const frames = (actions.get(vfxId) || []).filter((f) => f.group >= 0);
        if (!frames.length) return -1;
        const bodyG = dominantGroup(actions.get(bodyAnim) || []);
        const g = dominantGroup(frames);
        let score = frames.length;
        if (bodyG != null && g != null && g !== bodyG) score += 25;
        if (vfxId >= 7e3 && vfxId < 9e3) score += 18;
        if (!actionHasHitbox(frames)) score += 6;
        if (frames.length >= 4) score += 4;
        return score;
      }
      function pickBestVfxEntry(entries, bodyAnim, actions, postypeFilter) {
        let best = null;
        for (const e of entries) {
          if (postypeFilter && e.postype !== postypeFilter) continue;
          const score = scoreVfxCandidate(e.anim, bodyAnim, actions);
          if (score < 0) continue;
          if (!best || score > best.score) best = { ...e, score };
        }
        return best;
      }
      function parseExplodPos(str) {
        if (!str) return [0, 0];
        const parts = String(str).split(",");
        const num = (s) => {
          const m = String(s).match(/-?\d*\.\d+|-?\d+/);
          return m ? Number(m[0]) : 0;
        };
        return [num(parts[0]), num(parts[1] || "0")];
      }
      function clampScale(pair) {
        const x = Number(pair[0]) || 1;
        const y = Number(pair[1]) || 1;
        const clamp1 = (v) => {
          if (v > 8) return Math.min(3, v / 10);
          if (v > 3) return 3;
          if (v < 0.05 && v !== 0) return 0.05;
          if (v === 0) return 1;
          return v;
        };
        return [clamp1(x), clamp1(y)];
      }
      function parseCnsInt(blk, name, fallback) {
        const m = blk.match(new RegExp(`^\\s*${name}\\s*=\\s*(-?\\d+)`, "im"));
        return m ? Number(m[1]) : fallback;
      }
      function parseCnsPair(blk, name, fallback) {
        const m = blk.match(new RegExp(`^\\s*${name}\\s*=\\s*([^\\n;]+)`, "im"));
        if (!m) return fallback.slice();
        return parseExplodPos(m[1]);
      }
      function parseTriggerDelay(blk) {
        const timeM = blk.match(/trigger\d+\s*=\s*time\s*=\s*(\d+)/i) || blk.match(/trigger\d+\s*=\s*!?\s*time\s*=\s*(\d+)/i);
        if (timeM) return Number(timeM[1]);
        const elemM = blk.match(/trigger\d+\s*=\s*animelem\s*=\s*(\d+)/i);
        if (elemM) return Math.max(0, (Number(elemM[1]) - 1) * 3);
        if (/trigger\d+\s*=\s*!time\b/i.test(blk) || /trigger\d+\s*=\s*time\s*=\s*0\b/i.test(blk)) return 0;
        return 0;
      }
      function normalizePostype(raw, fallback) {
        const t = String(raw || fallback || "p1").toLowerCase().replace(/,.*/, "").trim();
        if (t === "p2" || t === "target" || t === "enemy") return "p2";
        if (t === "front" || t === "back" || t === "left" || t === "right") return t;
        if (t === "p1" || t === "self") return "p1";
        return fallback || "p1";
      }
      function extractVelFromStateBody(body) {
        const blocks = body.split(/(?=\[State)/i);
        for (const blk of blocks) {
          if (!/^\s*type\s*=\s*VelSet/im.test(blk)) continue;
          const x = (blk.match(/^\s*x\s*=\s*([^\n;]+)/im) || [])[1];
          const y = (blk.match(/^\s*y\s*=\s*([^\n;]+)/im) || [])[1];
          if (x != null || y != null) return parseExplodPos(`${x || 0},${y || 0}`);
        }
        return [0, 0];
      }
      function makeSpawn(partial) {
        return {
          anim: partial.anim,
          kind: partial.kind || "explod",
          postype: partial.postype || "p1",
          pos: partial.pos || [0, 0],
          vel: partial.vel || [0, 0],
          bindtime: partial.bindtime != null ? partial.bindtime : partial.kind === "projectile" ? 0 : -1,
          removetime: partial.removetime != null ? partial.removetime : -2,
          scale: clampScale(partial.scale || [1, 1]),
          facing: partial.facing != null ? partial.facing : 1,
          sprpriority: partial.sprpriority != null ? partial.sprpriority : 0,
          delay: partial.delay || 0,
          removeonhit: !!partial.removeonhit
        };
      }
      function parseCnsVfxMap(dir) {
        const map = /* @__PURE__ */ new Map();
        let files = [];
        try {
          files = fs.readdirSync(dir).filter((f) => {
            const l = f.toLowerCase();
            return l.endsWith(".cns") || l.endsWith(".st");
          });
        } catch (_) {
          return map;
        }
        function addEntry(bodyAnim, entry) {
          if (!map.has(bodyAnim)) map.set(bodyAnim, []);
          const list = map.get(bodyAnim);
          const key = `${entry.anim}|${entry.postype}|${entry.kind}|${entry.delay}|${entry.pos[0]},${entry.pos[1]}`;
          if (list.some((e) => `${e.anim}|${e.postype}|${e.kind}|${e.delay}|${e.pos[0]},${e.pos[1]}` === key)) return;
          list.push(entry);
        }
        for (const file of files) {
          const t = readText(path.join(dir, file));
          const parts = t.split(/\[Statedef\s+/i);
          const stateAnim = /* @__PURE__ */ new Map();
          const stateVel = /* @__PURE__ */ new Map();
          const bodies = [];
          for (let i = 1; i < parts.length; i++) {
            const hm = parts[i].match(/^(\d+)\]/);
            if (!hm) continue;
            const sid = Number(hm[1]);
            const body = parts[i].slice(hm[0].length);
            bodies.push({ sid, body });
            const am = body.match(/^\s*anim\s*=\s*(\d+)/im);
            if (am) stateAnim.set(sid, Number(am[1]));
            stateVel.set(sid, extractVelFromStateBody(body));
          }
          for (const { body } of bodies) {
            const am = body.match(/^\s*anim\s*=\s*(\d+)/im);
            const bodyAnim = am ? Number(am[1]) : null;
            if (bodyAnim == null) continue;
            const stateBlocks = body.split(/(?=\[State)/i);
            for (const blk of stateBlocks) {
              if (!/\[State/i.test(blk)) continue;
              const typ = blk.match(/^\s*type\s*=\s*(\w+)/im);
              if (!typ) continue;
              const tname = typ[1].toLowerCase();
              const delay = parseTriggerDelay(blk);
              if (tname === "explod") {
                const ea = blk.match(/^\s*anim\s*=\s*(\d+)/im);
                if (!ea) continue;
                addEntry(bodyAnim, makeSpawn({
                  anim: Number(ea[1]),
                  kind: "explod",
                  postype: normalizePostype((blk.match(/^\s*postype\s*=\s*(\S+)/im) || [])[1], "p1"),
                  pos: parseCnsPair(blk, "pos", [0, 0]),
                  vel: parseCnsPair(blk, "vel", [0, 0]),
                  bindtime: parseCnsInt(blk, "bindtime", -1),
                  removetime: parseCnsInt(blk, "removetime", -2),
                  scale: parseCnsPair(blk, "scale", [1, 1]),
                  facing: parseCnsInt(blk, "facing", 1),
                  sprpriority: parseCnsInt(blk, "sprpriority", 0),
                  delay
                }));
              } else if (tname === "helper") {
                const sn = blk.match(/^\s*stateno\s*=\s*(\d+)/im);
                if (!sn || !stateAnim.has(Number(sn[1]))) continue;
                const hs = Number(sn[1]);
                const helperVel = stateVel.get(hs) || [0, 0];
                const pos = parseCnsPair(blk, "pos", [0, 0]);
                addEntry(bodyAnim, makeSpawn({
                  anim: stateAnim.get(hs),
                  kind: "helper",
                  postype: normalizePostype((blk.match(/^\s*postype\s*=\s*(\S+)/im) || [])[1], "p1"),
                  pos,
                  vel: helperVel,
                  bindtime: parseCnsInt(blk, "bindtime", 0),
                  removetime: parseCnsInt(blk, "removetime", 90),
                  scale: parseCnsPair(blk, "scale", [1, 1]),
                  facing: parseCnsInt(blk, "facing", 1),
                  sprpriority: parseCnsInt(blk, "sprpriority", 1),
                  delay,
                  removeonhit: true
                }));
              } else if (tname === "projectile") {
                const ea = blk.match(/^\s*projanim\s*=\s*(\d+)/im);
                if (!ea) continue;
                let spawnPos = [0, -20];
                if (/^\s*offset\s*=/im.test(blk)) spawnPos = parseCnsPair(blk, "offset", spawnPos);
                else if (/^\s*pos\s*=/im.test(blk)) spawnPos = parseCnsPair(blk, "pos", spawnPos);
                addEntry(bodyAnim, makeSpawn({
                  anim: Number(ea[1]),
                  kind: "projectile",
                  postype: "p1",
                  // spawn at attacker + offset, then fly with vel
                  pos: spawnPos,
                  vel: parseCnsPair(blk, "velocity", [4, 0]),
                  bindtime: 0,
                  removetime: parseCnsInt(blk, "projremovetime", parseCnsInt(blk, "removetime", 60)),
                  scale: (() => {
                    if (/^\s*projscale\s*=/im.test(blk)) return parseCnsPair(blk, "projscale", [1, 1]);
                    return parseCnsPair(blk, "scale", [1, 1]);
                  })(),
                  facing: 1,
                  sprpriority: parseCnsInt(blk, "projpriority", 3),
                  delay,
                  removeonhit: true
                }));
              }
            }
          }
        }
        return map;
      }
      function loadOverrides(dir, packId) {
        const paths = [
          path.join(getPacks(), packId, "overrides.json"),
          path.join(dir, "overrides.json"),
          path.join(dir, `${packId}.overrides.json`)
        ];
        const merged = {
          maxSpecials: null,
          ignoreActions: [],
          attacks: [],
          vfx: {}
          // "1480": 8001 or action-id strings
        };
        for (const p of paths) {
          if (!fs.existsSync(p)) continue;
          try {
            const o = JSON.parse(fs.readFileSync(p, "utf8"));
            if (o.maxSpecials != null) merged.maxSpecials = o.maxSpecials;
            if (Array.isArray(o.ignoreActions)) merged.ignoreActions.push(...o.ignoreActions.map(Number));
            if (Array.isArray(o.attacks)) merged.attacks.push(...o.attacks.map(Number));
            if (o.vfx && typeof o.vfx === "object") Object.assign(merged.vfx, o.vfx);
            console.log(`  overrides \u2190 ${path.relative(getRoot(), p)}`);
          } catch (err) {
            console.warn(`  warn: bad overrides ${p}: ${err.message}`);
          }
        }
        return merged;
      }
      function findAirNeighborVfx(actions, attackIds, attackId, index) {
        const nextId = attackIds[index + 1] != null ? attackIds[index + 1] : attackId + 40;
        const bodyFrames = actions.get(attackId) || [];
        const bodyGroup = dominantGroup(bodyFrames);
        let best = null;
        for (let id = attackId + 1; id < nextId; id++) {
          if (!actions.has(id) || attackIds.includes(id)) continue;
          const frames = (actions.get(id) || []).filter((f) => f.group >= 0);
          if (!frames.length) continue;
          const g = dominantGroup(frames);
          const hit = actionHasHitbox(frames);
          const differentGroup = bodyGroup != null && g != null && g !== bodyGroup;
          if (!differentGroup && hit) continue;
          if (!differentGroup && frames.length < 4) continue;
          const score = scoreVfxCandidate(id, attackId, actions);
          if (score < 0) continue;
          if (!best || score > best.score) best = { id, score, differentGroup };
        }
        return best;
      }
      function spawnFromEntry(e) {
        return makeSpawn(e);
      }
      function selectSpawns(entries, actions, attackId, extras) {
        const kindBonus = { projectile: 28, helper: 18, explod: 10, air: 6, override: 40 };
        const scored = (entries || []).filter((e) => e && actions.has(e.anim) && scoreVfxCandidate(e.anim, attackId, actions) >= 0).map((e) => ({
          ...e,
          score: scoreVfxCandidate(e.anim, attackId, actions) + (kindBonus[e.kind] || 0)
        })).sort((a, b) => b.score - a.score);
        const out = [];
        const seen = /* @__PURE__ */ new Set();
        function push(e) {
          if (!e || !actions.has(e.anim)) return;
          const s = spawnFromEntry(e);
          const key = `${s.anim}|${s.postype}|${s.kind}|${s.delay}`;
          if (seen.has(key)) return;
          seen.add(key);
          out.push(s);
        }
        for (const e of extras || []) push(e);
        for (const e of scored) {
          if (out.length >= MAX_VFX_SPAWNS) break;
          push(e);
        }
        if (!out.some((s) => s.postype === "p2")) {
          const p2 = scored.find((e) => e.postype === "p2");
          if (p2 && out.length < MAX_VFX_SPAWNS) push(p2);
        }
        return out.slice(0, MAX_VFX_SPAWNS);
      }
      function findVfxCompanions(actions, attackIds, cnsVfxMap, overrides) {
        const links = {};
        const overrideVfx = overrides && overrides.vfx ? overrides.vfx : {};
        function parseOverride(ov) {
          if (ov == null) return null;
          if (typeof ov === "number" || typeof ov === "string" && /^\d+$/.test(ov)) {
            const id = Number(ov);
            if (!actions.has(id)) return null;
            return makeSpawn({ anim: id, postype: "p1", kind: "override" });
          }
          if (typeof ov === "object") {
            const id = Number(ov.anim != null ? ov.anim : ov.id);
            if (!actions.has(id)) return null;
            return makeSpawn({
              anim: id,
              postype: normalizePostype(ov.postype, "p1"),
              pos: Array.isArray(ov.pos) ? [Number(ov.pos[0]) || 0, Number(ov.pos[1]) || 0] : [0, 0],
              vel: Array.isArray(ov.vel) ? [Number(ov.vel[0]) || 0, Number(ov.vel[1]) || 0] : [0, 0],
              bindtime: ov.bindtime != null ? Number(ov.bindtime) : void 0,
              removetime: ov.removetime != null ? Number(ov.removetime) : void 0,
              scale: Array.isArray(ov.scale) ? ov.scale : [1, 1],
              facing: ov.facing != null ? Number(ov.facing) : 1,
              delay: ov.delay || 0,
              kind: ov.kind || "override"
            });
          }
          return null;
        }
        for (let i = 0; i < attackIds.length; i++) {
          const attackId = attackIds[i];
          let self2 = null;
          let hit = null;
          const extras = [];
          const ov = overrideVfx[String(attackId)] != null ? overrideVfx[String(attackId)] : overrideVfx[attackId];
          const entries = cnsVfxMap && cnsVfxMap.get(attackId) || [];
          const cnsP2Early = pickBestVfxEntry(entries, attackId, actions, "p2");
          if (ov != null && typeof ov === "object" && !Array.isArray(ov) && (ov.self != null || ov.hit != null || ov.spawns)) {
            self2 = parseOverride(ov.self);
            hit = parseOverride(ov.hit);
            if (Array.isArray(ov.spawns)) {
              for (const s of ov.spawns) {
                const p = parseOverride(s);
                if (p) extras.push(p);
              }
            }
            if (self2) extras.push(self2);
            if (!hit && cnsP2Early) hit = spawnFromEntry(cnsP2Early);
            if (hit) extras.push(hit);
            const spawns2 = selectSpawns(entries, actions, attackId, extras);
            links[attackId] = { self: self2 || spawns2.find((s) => s.postype !== "p2") || null, hit, spawns: spawns2 };
            continue;
          }
          if (ov != null) {
            const one = parseOverride(ov);
            if (one) {
              if (one.postype === "p2") hit = one;
              else self2 = one;
              if (self2) extras.push(self2);
              if (!hit && cnsP2Early) hit = spawnFromEntry(cnsP2Early);
              if (hit) extras.push(hit);
              const spawns2 = selectSpawns(entries, actions, attackId, extras);
              links[attackId] = { self: self2, hit, spawns: spawns2 };
              continue;
            }
          }
          const cnsP1 = pickBestVfxEntry(entries, attackId, actions, "p1");
          const cnsProj = entries.filter((e) => e.kind === "projectile");
          const bestProj = cnsProj.length ? pickBestVfxEntry(cnsProj, attackId, actions, null) : null;
          const cnsP2 = pickBestVfxEntry(entries, attackId, actions, "p2");
          const cnsAny = pickBestVfxEntry(entries, attackId, actions, null);
          const cnsSelf = cnsP1 || bestProj || (cnsAny && cnsAny.postype !== "p2" ? cnsAny : null);
          const hasCns = entries.length > 0;
          if (hasCns) {
            if (cnsSelf) self2 = spawnFromEntry(cnsSelf);
            else if (cnsAny && cnsAny.postype === "p2") hit = spawnFromEntry(cnsAny);
          } else {
            const air = findAirNeighborVfx(actions, attackIds, attackId, i);
            if (air && (air.differentGroup || air.score >= 12)) {
              self2 = makeSpawn({ anim: air.id, postype: "p1", kind: "air" });
            }
          }
          if (cnsP2 && (!self2 || cnsP2.anim !== self2.anim)) hit = spawnFromEntry(cnsP2);
          if (self2) extras.push(self2);
          if (hit) extras.push(hit);
          const spawns = selectSpawns(entries, actions, attackId, extras);
          if (self2 || hit || spawns.length) links[attackId] = { self: self2, hit, spawns };
        }
        return links;
      }
      function mapVfxForAttack(map, prefix, n, link) {
        if (!link) return;
        const actionToKey = /* @__PURE__ */ new Map();
        let slot = 0;
        for (const sp of link.spawns || []) {
          if (actionToKey.has(sp.anim)) {
            sp.animKey = actionToKey.get(sp.anim);
            continue;
          }
          const key = `${prefix}${n}_s${slot}`;
          slot += 1;
          actionToKey.set(sp.anim, key);
          sp.animKey = key;
          map[key] = sp.anim;
        }
        if (link.self) {
          const k = actionToKey.get(link.self.anim) || link.spawns[0] && link.spawns[0].animKey;
          if (k) {
            map[`${prefix}${n}_fx`] = link.self.anim;
            link.self.animKey = k;
          }
        }
        if (link.hit) {
          const k = actionToKey.get(link.hit.anim);
          if (k) {
            map[`${prefix}${n}_hitfx`] = link.hit.anim;
            link.hit.animKey = k;
          }
        }
      }
      function resolveAnimMap(actions, offset, cnsVfxMap, overrides) {
        overrides = overrides || {};
        const map = {};
        function pick(name, primary, fallback) {
          const a = offset + primary;
          const b = offset + (fallback != null ? fallback : FALLBACK_REL[name] || primary);
          if (actions.has(a)) {
            map[name] = a;
            return true;
          }
          if (actions.has(b)) {
            map[name] = b;
            return true;
          }
          const idle = offset + 0;
          if (actions.has(idle)) {
            map[name] = idle;
            return true;
          }
          return false;
        }
        function pickOptional(name, primary, fallback) {
          const a = offset + primary;
          const b = offset + (fallback != null ? fallback : FALLBACK_REL[name] || primary);
          if (actions.has(a)) {
            map[name] = a;
            return true;
          }
          if (fallback != null && b !== a && actions.has(b)) {
            map[name] = b;
            return true;
          }
          return false;
        }
        pick("idle", 0, 0);
        pick("hitstun", 5, 5);
        pick("block", 6, 6);
        pickOptional("crouchStart", 10, 11);
        pick("crouch", 11, 11);
        pickOptional("crouchEnd", 12, 11);
        pick("walk", 20, 20);
        pick("walkBack", 21, 20);
        pick("jumpStart", 40, 15);
        pick("jump", 41, 16);
        pickOptional("jumpFwd", 42, 41);
        pickOptional("jumpBack", 43, 41);
        pick("land", 47, 0);
        pickOptional("dash", 100, 100);
        pickOptional("run", 101, 100);
        pickOptional("dashBack", 105, 105);
        pick("parry", 230, 6);
        pick("parryStun", 5, 5);
        const ignore = new Set((overrides.ignoreActions || []).map(Number));
        const maxN = overrides.maxNormals != null ? overrides.maxNormals : MAX_NORMALS;
        const maxS = overrides.maxSpecials != null ? overrides.maxSpecials : MAX_SPECIALS;
        const maxH = overrides.maxHypers != null ? overrides.maxHypers : MAX_HYPERS;
        const maxCmd = overrides.maxCommands != null ? overrides.maxCommands : MAX_COMMANDS;
        const maxTh = overrides.maxThrows != null ? overrides.maxThrows : MAX_THROWS;
        const maxC = overrides.maxCrouchAttacks != null ? overrides.maxCrouchAttacks : MAX_CROUCH_ATTACKS;
        const maxA = overrides.maxAirAttacks != null ? overrides.maxAirAttacks : MAX_AIR_ATTACKS;
        let normalIds = discoverNormals(actions, offset, maxN).filter((id) => !ignore.has(id));
        let specialIds = discoverSpecials(actions, offset, maxS).filter((id) => !ignore.has(id));
        let hyperIds = discoverHypers(actions, offset, maxH).filter((id) => !ignore.has(id));
        let commandIds = discoverCommands(actions, offset, maxCmd).filter((id) => !ignore.has(id));
        let throwIds = discoverThrows(actions, offset, maxTh).filter((id) => !ignore.has(id));
        let crouchIds = discoverCrouchAttacks(actions, offset, maxC).filter((id) => !ignore.has(id));
        let airIds = discoverAirAttacks(actions, offset, maxA).filter((id) => !ignore.has(id));
        for (const id of overrides.attacks || []) {
          if (actions.has(id) && !normalIds.includes(id) && !ignore.has(id)) normalIds.push(id);
        }
        const sortTrim = (arr, max) => {
          arr.sort((a, b) => a - b);
          return arr.length > max ? arr.slice(0, max) : arr;
        };
        normalIds = sortTrim(normalIds, maxN);
        specialIds = sortTrim(specialIds, maxS);
        hyperIds = sortTrim(hyperIds, maxH);
        commandIds = sortTrim(commandIds, maxCmd);
        throwIds = sortTrim(throwIds, maxTh);
        crouchIds = sortTrim(crouchIds, maxC);
        airIds = sortTrim(airIds, maxA);
        const allAttackIds = [
          ...normalIds,
          ...specialIds,
          ...hyperIds,
          ...commandIds,
          ...throwIds,
          ...crouchIds,
          ...airIds
        ];
        const vfxLinks = findVfxCompanions(actions, allAttackIds, cnsVfxMap, overrides);
        const attackGroups = [
          { prefix: "normal", label: "Normal", ids: normalIds },
          { prefix: "special", label: "Special", ids: specialIds },
          { prefix: "hyper", label: "Hyper", ids: hyperIds },
          { prefix: "command", label: "Command", ids: commandIds },
          { prefix: "throw", label: "Throw", ids: throwIds },
          { prefix: "crouchAttack", label: "Crouch", ids: crouchIds },
          { prefix: "airAttack", label: "Air", ids: airIds }
        ];
        for (const group of attackGroups) {
          group.ids.forEach((actionId, i) => {
            const n = i + 1;
            map[`${group.prefix}${n}`] = actionId;
            mapVfxForAttack(map, group.prefix, n, vfxLinks[actionId]);
          });
        }
        if (normalIds[0] != null) map.lightPunch = normalIds[0];
        if (normalIds[1] != null) map.heavyKick = normalIds[1];
        else if (normalIds[0] != null) map.heavyKick = normalIds[0];
        return {
          map,
          attackIds: normalIds,
          normalIds,
          specialIds,
          hyperIds,
          commandIds,
          throwIds,
          crouchAttackIds: crouchIds,
          airAttackIds: airIds,
          attackGroups,
          vfxLinks
        };
      }
      function unionClsn(boxes) {
        if (!boxes.length) return null;
        let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
        for (const b of boxes) {
          x1 = Math.min(x1, b.x1, b.x2);
          y1 = Math.min(y1, b.y1, b.y2);
          x2 = Math.max(x2, b.x1, b.x2);
          y2 = Math.max(y2, b.y1, b.y2);
        }
        return { x1, y1, x2, y2 };
      }
      function clsnToHitbox(box) {
        if (!box) return null;
        const s = MUGEN_PX_TO_WORLD;
        const left = Math.min(box.x1, box.x2) * s;
        const right = Math.max(box.x1, box.x2) * s;
        const top = -Math.min(box.y1, box.y2) * s;
        const bottom = -Math.max(box.y1, box.y2) * s;
        const w = Math.max(0.2, right - left);
        const h = Math.max(0.2, top - bottom);
        return {
          w: Math.round(w * 100) / 100,
          h: Math.round(h * 100) / 100,
          offsetX: Math.round(left * 100) / 100,
          offsetY: Math.round(bottom * 100) / 100
        };
      }
      function inferHitboxFromClsn2(frames) {
        const withBody = frames.filter((f) => f.clsn2 && f.clsn2.length);
        if (!withBody.length) {
          return { w: 0.55, h: 0.5, offsetX: 0.4, offsetY: 0.55 };
        }
        const start = Math.floor(withBody.length * 0.3);
        const end = Math.max(start + 1, Math.ceil(withBody.length * 0.75));
        const slice = withBody.slice(start, end);
        const boxes = [];
        for (const f of slice) boxes.push(...f.clsn2);
        const body = unionClsn(boxes);
        if (!body) return { w: 0.55, h: 0.5, offsetX: 0.4, offsetY: 0.55 };
        const bw = Math.abs(body.x2 - body.x1);
        const bh = Math.abs(body.y2 - body.y1);
        const x1 = Math.max(body.x1, body.x2) - Math.max(4, bw * 0.15);
        const x2 = Math.max(body.x1, body.x2) + Math.max(12, bw * 0.85);
        const yMid = (body.y1 + body.y2) / 2;
        const y1 = yMid - Math.max(8, bh * 0.35);
        const y2 = yMid + Math.max(8, bh * 0.35);
        return clsnToHitbox({ x1, y1, x2, y2 });
      }
      function timingFromFrames(frames) {
        let startup = 0;
        let active = 0;
        let recovery = 0;
        let phase = "startup";
        const activeBoxes = [];
        for (const f of frames) {
          const hasHit = f.clsn1 && f.clsn1.length > 0;
          if (phase === "startup") {
            if (hasHit) {
              phase = "active";
              active += f.ticks;
              activeBoxes.push(...f.clsn1);
            } else startup += f.ticks;
          } else if (phase === "active") {
            if (hasHit) {
              active += f.ticks;
              activeBoxes.push(...f.clsn1);
            } else {
              phase = "recovery";
              recovery += f.ticks;
            }
          } else {
            recovery += f.ticks;
          }
        }
        let hitbox = clsnToHitbox(unionClsn(activeBoxes));
        let hitboxSource = "clsn1";
        let hitboxReliable = true;
        if (active === 0 || !hitbox) {
          const total = frames.reduce((s, f) => s + f.ticks, 0) || 1;
          startup = Math.max(1, Math.floor(total * 0.25));
          active = Math.max(2, Math.floor(total * 0.35));
          recovery = Math.max(1, total - startup - active);
          hitbox = inferHitboxFromClsn2(frames);
          hitboxSource = "clsn2-inferred";
          hitboxReliable = false;
        }
        return {
          startup: Math.max(1, startup),
          active: Math.max(1, active),
          recovery: Math.max(1, recovery),
          hitbox,
          hitboxSource,
          hitboxReliable
        };
      }
      function buildMovesFromPack(animMap, actions, attackGroups, vfxLinks) {
        const moves = {};
        const moveList = [];
        vfxLinks = vfxLinks || {};
        const groups = attackGroups || [{ prefix: "special", label: "Special", ids: [] }];
        for (const group of groups) {
          (group.ids || []).forEach((actionId, i) => {
            const animName = `${group.prefix}${i + 1}`;
            const frames = actions.get(actionId) || [];
            const timing = timingFromFrames(frames);
            const damage = Math.min(120, 28 + i * 8 + (group.prefix === "airAttack" ? 4 : 0));
            const move = {
              label: `${group.label} ${i + 1}`,
              startup: timing.startup,
              active: timing.active,
              recovery: timing.recovery,
              damage,
              hitstun: 10 + Math.min(10, i * 2),
              blockstun: 8 + Math.min(6, i),
              knockback: 0.35 + i * 0.06,
              hitbox: timing.hitbox,
              hitboxSource: timing.hitboxSource || "clsn1",
              hitboxReliable: timing.hitboxReliable !== false,
              animation: animName,
              sourceAction: actionId,
              band: group.prefix
            };
            const link = vfxLinks[actionId];
            if (link && link.self) {
              move.vfx = link.self.animKey || `${animName}_fx`;
              move.vfxAction = link.self.anim;
              move.vfxPostype = link.self.postype || "p1";
              move.vfxPos = link.self.pos || [0, 0];
            }
            if (link && link.hit) {
              move.vfxHit = link.hit.animKey || `${animName}_hitfx`;
              move.vfxHitAction = link.hit.anim;
              move.vfxHitPostype = "p2";
              move.vfxHitPos = link.hit.pos || [0, 0];
            }
            if (!move.vfx && link && link.hit) {
              move.vfx = move.vfxHit;
              move.vfxAction = move.vfxHitAction;
              move.vfxPostype = "p2";
              move.vfxPos = move.vfxHitPos;
            }
            if (link && link.spawns && link.spawns.length) {
              move.vfxSpawns = link.spawns.map((s) => ({
                anim: s.animKey,
                action: s.anim,
                kind: s.kind,
                postype: s.postype,
                pos: s.pos,
                vel: s.vel,
                bindtime: s.bindtime,
                removetime: s.removetime,
                scale: s.scale,
                facing: s.facing,
                sprpriority: s.sprpriority,
                delay: s.delay,
                removeonhit: !!s.removeonhit
              }));
            }
            moves[animName] = move;
            moveList.push({ id: animName, label: move.label, band: group.prefix });
          });
        }
        const smackSources = [
          moves.normal1 || moves.special1,
          moves.normal2 || moves.special2 || moves.normal1,
          moves.airAttack1 || moves.normal3 || moves.normal1,
          moves.crouchAttack1 || moves.normal2 || moves.normal1,
          moves.special1 || moves.hyper1 || moves.normal1,
          moves.special2 || moves.special1 || moves.normal2,
          moves.special3 || moves.hyper1 || moves.special1,
          moves.special4 || moves.hyper2 || moves.special2 || moves.special1
        ];
        SMACK_SLOTS.forEach((slot, i) => {
          const src = smackSources[i] || smackSources[0];
          if (!src) return;
          moves[slot] = {
            ...src,
            label: slot,
            animation: src.animation
          };
        });
        moves.parry = {
          label: "Parry",
          startup: 1,
          active: 8,
          recovery: 10,
          damage: 0,
          hitstun: 0,
          blockstun: 0,
          knockback: 0,
          hitbox: { w: 0.55, h: 0.85, offsetX: 0.45, offsetY: 0.7 },
          animation: "parry",
          isParry: true
        };
        if (moves.normal1) {
          moves.lightPunch = { ...moves.normal1, label: "Light", animation: moves.normal1.animation };
        } else if (moves.special1) {
          moves.lightPunch = { ...moves.special1, label: "Light", animation: moves.special1.animation };
        }
        if (moves.normal2 || moves.normal1 || moves.special2 || moves.special1) {
          const s = moves.normal2 || moves.special2 || moves.normal1 || moves.special1;
          moves.heavyKick = { ...s, label: "Heavy", animation: s.animation };
        }
        return { moves, moveList };
      }
      async function loadSffSprites(sffPath) {
        const extract2 = (await Promise.resolve().then(() => (init_sff_extractor(), sff_extractor_exports))).default;
        const buf = fs.readFileSync(sffPath);
        const data = extract2(buf, {
          decodeSpriteBuffer: true,
          spriteBuffer: false,
          paletteBuffer: false,
          paletteTable: false
        });
        const byKey = /* @__PURE__ */ new Map();
        for (const s of data.sprites) {
          byKey.set(`${s.group}_${s.number}`, s);
        }
        return { meta: data, byKey };
      }
      function scaleRgba(src, sw, sh, tw, th) {
        const out = import_buffer.Buffer.alloc(tw * th * 4);
        for (let y = 0; y < th; y++) {
          for (let x = 0; x < tw; x++) {
            const sx = Math.min(sw - 1, Math.floor((x + 0.5) * sw / tw));
            const sy = Math.min(sh - 1, Math.floor((y + 0.5) * sh / th));
            const si = (sy * sw + sx) * 4;
            const di = (y * tw + x) * 4;
            out[di] = src[si];
            out[di + 1] = src[si + 1];
            out[di + 2] = src[si + 2];
            out[di + 3] = src[si + 3];
          }
        }
        return out;
      }
      function knockOutBackground(data, w, h) {
        const match = (i, r, g, b) => {
          const o = i * 4;
          return Math.abs(data[o] - r) <= 2 && Math.abs(data[o + 1] - g) <= 2 && Math.abs(data[o + 2] - b) <= 2;
        };
        const seeds = [0, w - 1, (h - 1) * w, (h - 1) * w + (w - 1)];
        const key = seeds.map((i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]);
        const visited = new Uint8Array(w * h);
        const stack = [];
        function tryPush(i, r, g, b) {
          if (i < 0 || i >= w * h || visited[i]) return;
          if (!match(i, r, g, b)) return;
          visited[i] = 1;
          stack.push(i);
        }
        for (const i of seeds) {
          const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
          tryPush(i, r, g, b);
        }
        while (stack.length) {
          const i = stack.pop();
          data[i * 4 + 3] = 0;
          const x = i % w;
          const y = i / w | 0;
          for (const [kr, kg, kb] of key) {
            if (x > 0) tryPush(i - 1, kr, kg, kb);
            if (x + 1 < w) tryPush(i + 1, kr, kg, kb);
            if (y > 0) tryPush(i - w, kr, kg, kb);
            if (y + 1 < h) tryPush(i + w, kr, kg, kb);
          }
        }
        for (let i = 0; i < w * h; i++) {
          if (match(i, 255, 0, 255) || match(i, 0, 255, 0)) data[i * 4 + 3] = 0;
        }
      }
      function contentBounds(data, w, h) {
        let minX = w, minY = h, maxX = 0, maxY = 0, found = false;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            if (data[(y * w + x) * 4 + 3] > 8) {
              found = true;
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            }
          }
        }
        if (!found) return { x: 0, y: 0, w, h };
        return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
      }
      function cropRgba(data, w, h, box) {
        const out = import_buffer.Buffer.alloc(box.w * box.h * 4);
        for (let y = 0; y < box.h; y++) {
          const src = ((box.y + y) * w + box.x) * 4;
          data.copy(out, y * box.w * 4, src, src + box.w * 4);
        }
        return out;
      }
      function packFramesOnce(images, maxEdge) {
        const gap = 2;
        const sorted = images.map((im, i) => ({ ...im, i })).sort((a, b) => b.h - a.h);
        let shelfX = gap, shelfY = gap, shelfH = 0, atlasW = gap, atlasH = gap;
        const placed = new Array(images.length);
        for (const im of sorted) {
          if (shelfX + im.w + gap > maxEdge && shelfX > gap) {
            shelfY += shelfH + gap;
            shelfX = gap;
            shelfH = 0;
          }
          placed[im.i] = { x: shelfX, y: shelfY, w: im.w, h: im.h };
          shelfX += im.w + gap;
          shelfH = Math.max(shelfH, im.h);
          atlasW = Math.max(atlasW, shelfX);
          atlasH = Math.max(atlasH, shelfY + shelfH + gap);
        }
        const data = import_buffer.Buffer.alloc(atlasW * atlasH * 4);
        const frames = {};
        images.forEach((im, i) => {
          const p = placed[i];
          for (let y = 0; y < im.h; y++) {
            for (let x = 0; x < im.w; x++) {
              const si = (y * im.w + x) * 4;
              const di = ((p.y + y) * atlasW + (p.x + x)) * 4;
              data[di] = im.data[si];
              data[di + 1] = im.data[si + 1];
              data[di + 2] = im.data[si + 2];
              data[di + 3] = im.data[si + 3];
            }
          }
          frames[im.key] = {
            x: p.x,
            y: p.y,
            w: im.w,
            h: im.h,
            ax: im.ax,
            ay: im.ay
          };
        });
        return { width: atlasW, height: atlasH, data, frames };
      }
      function scalePackedImage(im, factor) {
        if (factor >= 0.999) return im;
        const tw = Math.max(1, Math.round(im.w * factor));
        const th = Math.max(1, Math.round(im.h * factor));
        return {
          ...im,
          data: scaleRgba(im.data, im.w, im.h, tw, th),
          w: tw,
          h: th,
          ax: Math.round(im.ax * (tw / im.w)),
          ay: Math.round(im.ay * (th / im.h))
        };
      }
      function packFrames(images) {
        let cur = images;
        let extraScale = 1;
        for (let attempt = 0; attempt < 10; attempt++) {
          const atlas2 = packFramesOnce(cur, MAX_ATLAS_EDGE);
          if (atlas2.width <= MAX_ATLAS_EDGE && atlas2.height <= MAX_ATLAS_EDGE) {
            if (extraScale < 0.999) {
              console.log(`  atlas fit: scaled sprites \xD7${extraScale.toFixed(2)} \u2192 ${atlas2.width}x${atlas2.height}`);
            }
            return { ...atlas2, fitScale: extraScale };
          }
          const factor = Math.min(
            MAX_ATLAS_EDGE / Math.max(1, atlas2.width),
            MAX_ATLAS_EDGE / Math.max(1, atlas2.height),
            0.9
          ) * 0.96;
          extraScale *= factor;
          cur = cur.map((im) => scalePackedImage(im, factor));
        }
        const atlas = packFramesOnce(cur, MAX_ATLAS_EDGE);
        console.warn(`  warn: atlas ${atlas.width}x${atlas.height} still over ${MAX_ATLAS_EDGE} after shrink`);
        return { ...atlas, fitScale: extraScale };
      }
      function writePng(filePath, img) {
        const png = new PNG2({ width: img.width, height: img.height });
        png.data = import_buffer.Buffer.from(img.data);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, PNG2.sync.write(png, { colorType: 6 }));
      }
      function buildCharacterJson({ id, name, physics, frames, anims, scale, pxToWorld, source, moves, moveList, binds }) {
        return {
          id,
          name,
          version: 3,
          style: "framesheet",
          roblox: {
            upload: ["atlas.png"],
            animate: "ImageRectOffset",
            moduleFrom: "character.json"
          },
          skin: {
            style: "framesheet",
            atlasPack: id,
            bone: "#c8d0dc",
            joint: "#7eb8ff",
            accent: null
          },
          physics,
          moves: moves || {},
          moveList: moveList || [],
          binds: binds || { scheme: "auto-v1", keyboard: {}, context: {}, help: AUTO_BIND_HELP },
          atlas: {
            image: "atlas.png",
            scale,
            // Clsn boxes in character.json are in atlas pixel space; world = atlasPx * pxToWorld
            pxToWorld: pxToWorld != null ? pxToWorld : scale / PREVIEW_PX,
            frames
          },
          anims,
          source
        };
      }
      function scaleClsnBoxes(boxes, sc) {
        if (!boxes || !boxes.length || sc === 1) return boxes || [];
        return boxes.map((b) => ({
          x1: b.x1 * sc,
          y1: b.y1 * sc,
          x2: b.x2 * sc,
          y2: b.y2 * sc
        }));
      }
      function atlasClsnToWorldHitbox(box, pxToWorld) {
        if (!box) return null;
        const left = Math.min(box.x1, box.x2) * pxToWorld;
        const right = Math.max(box.x1, box.x2) * pxToWorld;
        const top = -Math.min(box.y1, box.y2) * pxToWorld;
        const bottom = -Math.max(box.y1, box.y2) * pxToWorld;
        return {
          w: Math.round(Math.max(0.15, right - left) * 100) / 100,
          h: Math.round(Math.max(0.15, top - bottom) * 100) / 100,
          offsetX: Math.round(left * 100) / 100,
          offsetY: Math.round(bottom * 100) / 100
        };
      }
      function recomputeMoveHitboxes(moves, anims, pxToWorld) {
        if (!moves || !anims) return;
        for (const id of Object.keys(moves)) {
          const move = moves[id];
          if (!move || !move.animation) continue;
          const actionId = anims.map[move.animation];
          if (actionId == null) continue;
          const action = anims.actions[String(actionId)];
          if (!action || !action.frames) continue;
          const activeBoxes = [];
          move.hitboxesPerFrame = action.frames.map((f) => {
            const boxes = f.clsn1 && f.clsn1.length ? f.clsn1.map((b) => ({ ...b })) : [];
            if (boxes.length) activeBoxes.push(...boxes);
            return {
              key: f.key,
              ticks: f.ticks,
              clsn1: boxes,
              hitbox: boxes.length ? atlasClsnToWorldHitbox(unionClsn(boxes), pxToWorld) : null
            };
          });
          const hadRealClsn1 = activeBoxes.length > 0;
          if (hadRealClsn1) {
            const box = unionClsn(activeBoxes);
            move.hitbox = atlasClsnToWorldHitbox(box, pxToWorld);
            move.hitboxSource = "clsn1-atlas";
            move.hitboxReliable = true;
          } else {
            move.hitboxReliable = false;
            if (move.hitboxSource !== "clsn2-inferred") {
              move.hitboxSource = move.hitboxSource || "none";
            }
          }
        }
      }
      function buildQualityReport(character, missingSprites) {
        const moves = character.moves || {};
        const attackIds = Object.keys(moves).filter(
          (k) => /^(normal|special|hyper|command|throw|crouchAttack|airAttack)\d+$/.test(k)
        );
        let withClsn1 = 0;
        let inferred = 0;
        let unreliable = 0;
        let withVfx = 0;
        let frameHitboxes = 0;
        for (const id of attackIds) {
          const m = moves[id];
          if (!m) continue;
          if (m.hitboxSource === "clsn1" || m.hitboxSource === "clsn1-atlas") withClsn1 += 1;
          if (m.hitboxSource === "clsn2-inferred") inferred += 1;
          if (m.hitboxReliable === false) unreliable += 1;
          if (m.vfx || m.vfxSpawns && m.vfxSpawns.length) withVfx += 1;
          if (m.hitboxesPerFrame && m.hitboxesPerFrame.some((f) => f.hitbox)) frameHitboxes += 1;
        }
        const n = attackIds.length || 1;
        return {
          attackMoves: attackIds.length,
          clsn1Rate: Math.round(withClsn1 / n * 100) / 100,
          inferredHitboxRate: Math.round(inferred / n * 100) / 100,
          unreliableHitboxRate: Math.round(unreliable / n * 100) / 100,
          vfxLinkRate: Math.round(withVfx / n * 100) / 100,
          movesWithPerFrameHitboxes: frameHitboxes,
          missingSprites: missingSprites || [],
          missingSpriteCount: missingSprites && missingSprites.length || 0,
          notes: [
            "Attack/VFX anims keep all AIR frames (not trimmed).",
            "Roblox export omits inferred move hitboxes (hitboxReliable=false).",
            "Prefer packs/<id>/overrides.json vfx{} for stubborn CNS links."
          ]
        };
      }
      function isAttackOrFxAnimName(animName) {
        return /^(normal|special|hyper|command|throw|crouchAttack|airAttack)\d+/i.test(animName) || /_(fx|hitfx|s\d+)$/i.test(animName);
      }
      function trimAnimFrames(frames, animName) {
        if (isAttackOrFxAnimName(animName)) return frames;
        if (frames.length <= MAX_FRAMES_LOCO) return frames;
        const out = [];
        for (let i = 0; i < MAX_FRAMES_LOCO; i++) {
          const idx = Math.round(i * (frames.length - 1) / (MAX_FRAMES_LOCO - 1));
          out.push(frames[idx]);
        }
        return out;
      }
      async function packFromMugen(dir, skin, preload) {
        const files = findMugenFiles(dir);
        if (!files.sff || !files.air) throw new Error(`No .sff/.air in ${dir}`);
        const def = parseDef(files.def);
        const cnsPath = files.cns || (def.files && def.files.cns ? path.join(dir, def.files.cns) : null);
        const physics = parseCnsPhysics(cnsPath);
        const usingJsmugen = !!(preload && preload.actions && preload.byKey);
        const actions = usingJsmugen ? preload.actions : parseAirActions(files.air);
        const offset = skin ? skin.offset : 0;
        const id = skin ? skin.id : slugify(def.name || path.basename(dir));
        const name = skin ? skin.name : def.name || path.basename(dir);
        const overrides = loadOverrides(dir, id);
        const cnsVfxMap = parseCnsVfxMap(dir);
        console.log(`  CNS VFX map: ${cnsVfxMap.size} body anims with Explod/Helper/Proj`);
        if (usingJsmugen) {
          console.log(`  sprite/AIR source: JSMugen engine (${preload.byKey.size} sprites preloaded)`);
        }
        const {
          map: animMap,
          attackIds,
          normalIds,
          specialIds,
          hyperIds,
          commandIds,
          throwIds,
          crouchAttackIds,
          airAttackIds,
          attackGroups,
          vfxLinks
        } = resolveAnimMap(actions, offset, cnsVfxMap, overrides);
        const { moves, moveList } = buildMovesFromPack(animMap, actions, attackGroups, vfxLinks);
        const binds = buildAutoBinds(moves, animMap);
        const vfxCount = Object.keys(vfxLinks || {}).length;
        if (vfxCount) {
          const allIds = [
            ...normalIds,
            ...specialIds,
            ...hyperIds,
            ...commandIds,
            ...throwIds,
            ...crouchAttackIds,
            ...airAttackIds
          ];
          const pairs = allIds.filter((a) => vfxLinks[a]).map((a) => {
            const L = vfxLinks[a];
            const n = (L.spawns || []).length;
            const kinds = [...new Set((L.spawns || []).map((s) => s.kind))].join("+");
            return `${a}\xD7${n}(${kinds || "fx"})`;
          });
          console.log(`  linked ${vfxCount} attack VFX sets: ${pairs.join(", ")}`);
        }
        console.log(`Packing ${name} (${id}) offset=${offset}`);
        console.log(
          `  N=${normalIds.length} S=${specialIds.length} H=${hyperIds.length} cmd=${commandIds.length} thr=${throwIds.length} c=${crouchAttackIds.length} a=${airAttackIds.length} keys=${Object.keys(binds.keyboard).length}`
        );
        console.log(`  \u2192`, Object.keys(animMap).join(", "));
        const { byKey } = usingJsmugen ? { byKey: preload.byKey } : await loadSffSprites(files.sff);
        const neededKeys = /* @__PURE__ */ new Set();
        const animActions = {};
        for (const [animName, actionId] of Object.entries(animMap)) {
          let fr = actions.get(actionId) || [];
          const full = fr;
          fr = trimAnimFrames(fr, animName);
          if (fr.length && full.length > fr.length) {
            fr = fr.map((f) => {
              const match = full.find((x) => x.group === f.group && x.image === f.image) || f;
              return { ...f, clsn1: match.clsn1 || [], clsn2: match.clsn2 || [] };
            });
          }
          fr = fr.filter((f) => f.group >= 0);
          animActions[animName] = { actionId, frames: fr };
          fr.forEach((f) => neededKeys.add(`${f.group}_${f.image}`));
        }
        const imageByKey = /* @__PURE__ */ new Map();
        const missingSprites = [];
        for (const key of neededKeys) {
          const spr = byKey.get(key);
          if (!spr || !spr.decodedBuffer) {
            console.warn(`  missing sprite ${key}`);
            missingSprites.push(key);
            continue;
          }
          let w = spr.width, h = spr.height;
          let data = import_buffer.Buffer.from(spr.decodedBuffer);
          knockOutBackground(data, w, h);
          let box = contentBounds(data, w, h);
          const axisX = Math.max(0, Math.min(w - 1, spr.x || 0));
          const axisY = Math.max(0, Math.min(h - 1, spr.y || 0));
          const x1 = Math.min(box.x, axisX);
          const y1 = Math.min(box.y, axisY);
          const x2 = Math.max(box.x + box.w - 1, axisX);
          const y2 = Math.max(box.y + box.h - 1, axisY);
          box = { x: x1, y: y1, w: x2 - x1 + 1, h: y2 - y1 + 1 };
          data = cropRgba(data, w, h, box);
          w = box.w;
          h = box.h;
          const ax0 = (spr.x || 0) - box.x;
          const ay0 = (spr.y || 0) - box.y;
          const sprScale = Math.min(1, TARGET_HEIGHT / Math.max(1, h));
          let tw = Math.max(1, Math.round(w * sprScale));
          let th = Math.max(1, Math.round(h * sprScale));
          if (sprScale < 1) data = scaleRgba(data, w, h, tw, th);
          else {
            tw = w;
            th = h;
          }
          imageByKey.set(key, {
            data,
            w: tw,
            h: th,
            ax0: ax0 * (tw / Math.max(1, w)),
            ay0: ay0 * (th / Math.max(1, h)),
            sprScale,
            // original MUGEN px → atlas px
            rawW: spr.width,
            rawH: spr.height
          });
        }
        const packedImages = [];
        const keyToFrameKey = /* @__PURE__ */ new Map();
        let fi = 0;
        for (const [key, im] of imageByKey) {
          const frameKey = `1_${fi}`;
          keyToFrameKey.set(key, frameKey);
          packedImages.push({
            key: frameKey,
            data: im.data,
            w: im.w,
            h: im.h,
            ax: Math.round(im.ax0),
            ay: Math.round(im.ay0)
          });
          fi += 1;
        }
        const atlas = packFrames(packedImages);
        const fitScale = atlas.fitScale != null ? atlas.fitScale : 1;
        if (fitScale < 0.999) {
          for (const im of imageByKey.values()) im.sprScale *= fitScale;
        }
        const actionsOut = {};
        const mapOut = {};
        let syntheticId = 0;
        const nameToSynth = {
          idle: 0,
          walk: 20,
          walkBack: 21,
          crouchStart: 10,
          crouch: 11,
          crouchEnd: 12,
          jumpStart: 40,
          jump: 41,
          jumpFwd: 42,
          jumpBack: 43,
          land: 47,
          dash: 100,
          run: 101,
          dashBack: 105,
          block: 6,
          lightPunch: 200,
          heavyKick: 240,
          parry: 230,
          hitstun: 5,
          parryStun: 5
        };
        function synthAttackId(animName) {
          const bands = {
            normal: { body: 500, fx: 600, hit: 700, spawn: 800 },
            crouchAttack: { body: 1100, fx: 1150, hit: 1160, spawn: 1170 },
            airAttack: { body: 1200, fx: 1250, hit: 1260, spawn: 1270 },
            special: { body: 1300, fx: 1350, hit: 1360, spawn: 1370 },
            hyper: { body: 1400, fx: 1450, hit: 1460, spawn: 1470 },
            command: { body: 1500, fx: 1550, hit: 1560, spawn: 1570 },
            throw: { body: 1600, fx: 1650, hit: 1660, spawn: 1670 }
          };
          for (const [prefix, ids] of Object.entries(bands)) {
            const mSpawn = new RegExp(`^${prefix}(\\d+)_s(\\d+)$`).exec(animName);
            const mHit = new RegExp(`^${prefix}(\\d+)_hitfx$`).exec(animName);
            const mFx = new RegExp(`^${prefix}(\\d+)_fx$`).exec(animName);
            const m = new RegExp(`^${prefix}(\\d+)$`).exec(animName);
            if (mSpawn) return ids.spawn + Number(mSpawn[1]) * 10 + Number(mSpawn[2]);
            if (mHit) return ids.hit + Number(mHit[1]);
            if (mFx) return ids.fx + Number(mFx[1]);
            if (m) return ids.body + Number(m[1]);
          }
          return null;
        }
        for (const [animName, { frames }] of Object.entries(animActions)) {
          let actionId = nameToSynth[animName];
          if (actionId == null) {
            actionId = synthAttackId(animName);
            if (actionId == null) actionId = 900 + syntheticId++;
          }
          mapOut[animName] = actionId;
          const outFrames = [];
          for (const f of frames) {
            const srcKey = `${f.group}_${f.image}`;
            const frameKey = keyToFrameKey.get(srcKey);
            const im = imageByKey.get(srcKey);
            if (!frameKey || !im) continue;
            const sc = im.sprScale;
            outFrames.push({
              group: 1,
              image: Number(frameKey.split("_")[1]),
              xoff: Math.round(f.xoff * sc),
              yoff: Math.round(f.yoff * sc),
              ticks: f.ticks,
              flipH: !!f.flipH,
              key: frameKey,
              // Clsn in atlas pixel space (matches drawn sprite)
              clsn1: scaleClsnBoxes(f.clsn1, sc),
              clsn2: scaleClsnBoxes(f.clsn2, sc)
            });
          }
          if (!outFrames.length && mapOut.idle != null && actionsOut[String(mapOut.idle)]) {
            actionsOut[String(actionId)] = JSON.parse(JSON.stringify(actionsOut[String(mapOut.idle)]));
            actionsOut[String(actionId)].action = actionId;
          } else {
            actionsOut[String(actionId)] = {
              action: actionId,
              total: outFrames.reduce((s, x) => s + x.ticks, 0),
              frames: outFrames
            };
          }
        }
        if (mapOut.parryStun == null) mapOut.parryStun = mapOut.hitstun;
        const drawScale = 2;
        const pxToWorld = drawScale / PREVIEW_PX;
        const animsOut = { actions: actionsOut, map: mapOut };
        recomputeMoveHitboxes(moves, animsOut, pxToWorld);
        const character = buildCharacterJson({
          id,
          name,
          physics,
          frames: atlas.frames,
          anims: animsOut,
          scale: drawScale,
          pxToWorld,
          moves,
          moveList,
          binds,
          source: {
            type: "mugen",
            folder: path.relative(getRoot(), dir).replace(/\\/g, "/"),
            offset,
            attackActions: attackIds,
            normalActions: normalIds,
            specialActions: specialIds,
            hyperActions: hyperIds,
            commandActions: commandIds,
            throwActions: throwIds,
            crouchAttackActions: crouchAttackIds,
            airAttackActions: airAttackIds,
            skipped: [".snd", "full CNS state machines", "helper AI beyond VelSet"],
            missingSprites
          }
        });
        character.quality = buildQualityReport(character, missingSprites);
        if (usingJsmugen) {
          character.quality.spriteEngine = "jsmugen";
          character.quality.notes = [
            "Sprites + AIR/Clsn decoded by JSMugen (same engine as the compare panel).",
            ...character.quality.notes || []
          ];
        }
        console.log(
          `  quality: clsn1=${character.quality.clsn1Rate} inferred=${character.quality.inferredHitboxRate} vfx=${character.quality.vfxLinkRate} missingSprites=${character.quality.missingSpriteCount}` + (usingJsmugen ? " engine=jsmugen" : "")
        );
        enrichRobloxMeta(character);
        const outDir = path.join(getPacks(), id);
        fs.mkdirSync(outDir, { recursive: true });
        writePng(path.join(outDir, "atlas.png"), atlas);
        fs.writeFileSync(path.join(outDir, "character.json"), JSON.stringify(character, null, 2));
        fs.writeFileSync(path.join(outDir, "quality.json"), JSON.stringify(character.quality, null, 2));
        const atlasJson = {
          mode: "framesheet",
          image: `packs/${id}/atlas.png`,
          width: atlas.width,
          height: atlas.height,
          scale: drawScale,
          frames: atlas.frames,
          anims: character.anims
        };
        fs.writeFileSync(path.join(outDir, "atlas.json"), JSON.stringify(atlasJson, null, 2));
        const robloxDir = path.join(outDir, "roblox");
        fs.mkdirSync(robloxDir, { recursive: true });
        const robloxFiles = buildRobloxFiles(character);
        for (const [name2, body] of Object.entries(robloxFiles)) {
          fs.writeFileSync(path.join(robloxDir, name2), body);
        }
        const pngSize = fs.statSync(path.join(outDir, "atlas.png")).size;
        console.log(`  \u2192 packs/${id}/  atlas ${atlas.width}x${atlas.height} (${(pngSize / 1024).toFixed(1)} KB), sprites ${packedImages.length}`);
        console.log(`  \u2192 packs/${id}/roblox/  CharacterData.luau + MugenSkelFighter.luau + SETUP.txt`);
        return { id, outDir, pngSize, sprites: packedImages.length, robloxFiles, quality: character.quality };
      }
      function packFromExistingFramesheet(dir) {
        const files = findMugenFiles(dir);
        if (!files.atlasJson || !files.atlasPng) throw new Error(`No atlas.json/png in ${dir}`);
        const meta = JSON.parse(fs.readFileSync(files.atlasJson, "utf8"));
        const id = slugify(path.basename(dir));
        const name = path.basename(dir);
        const physics = parseCnsPhysics(null);
        const existingMoves = meta.moves || {};
        const character = buildCharacterJson({
          id,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          physics: {
            ...physics,
            height: 40,
            walkFwd: 2,
            walkBack: 2,
            jumpY: 7.5
          },
          frames: meta.frames,
          anims: meta.anims,
          scale: meta.scale || 2.35,
          moves: existingMoves,
          moveList: meta.moveList || Object.keys(existingMoves).map((k) => ({ id: k, label: k })),
          source: {
            type: "framesheet",
            folder: path.relative(getRoot(), dir).replace(/\\/g, "/"),
            note: "Slimmed from existing atlas; loose sprites/ not copied"
          }
        });
        enrichRobloxMeta(character);
        const outDir = path.join(getPacks(), id);
        fs.mkdirSync(outDir, { recursive: true });
        fs.copyFileSync(files.atlasPng, path.join(outDir, "atlas.png"));
        fs.writeFileSync(path.join(outDir, "character.json"), JSON.stringify(character, null, 2));
        const atlasJson = {
          mode: "framesheet",
          image: `packs/${id}/atlas.png`,
          width: meta.width,
          height: meta.height,
          scale: character.atlas.scale,
          frames: meta.frames,
          anims: meta.anims
        };
        fs.writeFileSync(path.join(outDir, "atlas.json"), JSON.stringify(atlasJson, null, 2));
        const robloxDir = path.join(outDir, "roblox");
        fs.mkdirSync(robloxDir, { recursive: true });
        for (const [fname, body] of Object.entries(buildRobloxFiles(character))) {
          fs.writeFileSync(path.join(robloxDir, fname), body);
        }
        const pngSize = fs.statSync(path.join(outDir, "atlas.png")).size;
        console.log(`Slimmed ${name} \u2192 packs/${id}/ (${(pngSize / 1024).toFixed(1)} KB atlas)`);
        return { id, outDir, pngSize };
      }
      async function main() {
        const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
        const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("--")));
        if (!args.length) {
          console.log(`Usage: node tools/pack-character.js <charFolder> [--all-shinobi]`);
          process.exit(1);
        }
        const input = path.resolve(args[0]);
        if (!fs.existsSync(input)) throw new Error(`Not found: ${input}`);
        const files = findMugenFiles(input);
        const results = [];
        if (files.atlasJson && files.atlasPng && !files.sff) {
          results.push(packFromExistingFramesheet(input));
        } else if (files.sff && files.air) {
          const isShinobi = /shinobi\s*alliance/i.test(path.basename(input)) || flags.has("--all-shinobi");
          if (isShinobi || flags.has("--all-shinobi")) {
            for (const skin of SHINOBI_SKINS) {
              results.push(await packFromMugen(input, skin));
            }
          } else {
            results.push(await packFromMugen(input, null));
          }
        } else {
          throw new Error(`Unrecognized char folder (need .sff+.air or atlas.json+.png): ${input}`);
        }
        const manifest = {
          generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          source: path.relative(getRoot(), input).replace(/\\/g, "/"),
          packs: results.map((r) => ({
            id: r.id,
            path: `packs/${r.id}`,
            atlasKB: Math.round(r.pngSize / 1024 * 10) / 10,
            sprites: r.sprites || null
          }))
        };
        fs.mkdirSync(getPacks(), { recursive: true });
        const manifestPath = path.join(getPacks(), "manifest.json");
        let prev = { packs: [] };
        if (fs.existsSync(manifestPath)) {
          try {
            prev = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
          } catch (_) {
          }
        }
        const byId = new Map((prev.packs || []).map((p) => [p.id, p]));
        for (const p of manifest.packs) byId.set(p.id, p);
        const merged = { updatedAt: manifest.generatedAt, packs: [...byId.values()] };
        fs.writeFileSync(manifestPath, JSON.stringify(merged, null, 2));
        console.log("\nDone. Manifest \u2192 packs/manifest.json");
        console.log(merged.packs.map((p) => `  ${p.id}: ${p.atlasKB} KB`).join("\n"));
      }
      module.exports = {
        packFromMugen,
        findMugenFiles,
        getPacks,
        getRoot,
        slugify
      };
      if (__require.main === module) {
        main().catch((err) => {
          console.error(err);
          process.exit(1);
        });
      }
    }
  });

  // tools/pack-browser-entry.js
  var require_pack_browser_entry = __commonJS({
    "tools/pack-browser-entry.js"(exports, module) {
      init_browser_shims();
      var fs = require_memfs();
      var path = require_path_browserify();
      var { packFromMugen, findMugenFiles } = require_pack_character();
      var { buildRobloxFiles, enrichRobloxMeta } = require_roblox_export();
      function findCharDir(rootDir) {
        const stack = [rootDir];
        while (stack.length) {
          const dir = stack.pop();
          let files;
          try {
            files = fs.readdirSync(dir);
          } catch (_) {
            continue;
          }
          const hasSff = files.some((f) => f.toLowerCase().endsWith(".sff"));
          const hasAir = files.some((f) => f.toLowerCase().endsWith(".air"));
          if (hasSff && hasAir) return dir;
          for (const f of files) {
            if (f === "node_modules" || f === "__MACOSX") continue;
            const p = path.join(dir, f);
            try {
              if (fs.statSync(p).isDirectory()) stack.push(p);
            } catch (_) {
            }
          }
        }
        return null;
      }
      async function packFromFileMap(fileMap, preload) {
        if (!fileMap || !Object.keys(fileMap).length) {
          throw new Error("No files to pack");
        }
        fs.__reset();
        const workRoot = "/work";
        const packsRoot = "/packs";
        process.env.MUGENSKEL_ROOT = workRoot;
        process.env.MUGENSKEL_PACKS = packsRoot;
        fs.mkdirSync(workRoot, { recursive: true });
        fs.mkdirSync(packsRoot, { recursive: true });
        for (const [relRaw, data] of Object.entries(fileMap)) {
          const rel = String(relRaw).replace(/\\/g, "/").replace(/^\/+/, "");
          if (!rel || rel.includes("..") || /__MACOSX/i.test(rel)) continue;
          const out = path.join(workRoot, rel);
          fs.mkdirSync(path.dirname(out), { recursive: true });
          fs.writeFileSync(out, import_buffer.Buffer.from(data instanceof ArrayBuffer ? new Uint8Array(data) : data));
        }
        const charDir = findCharDir(workRoot);
        if (!charDir) throw new Error("No MUGEN char found (need .sff + .air)");
        const files = findMugenFiles(charDir);
        if (!files.sff || !files.air) throw new Error("Char folder missing .sff/.air");
        let normalizedPreload = null;
        if (preload && preload.actions && preload.byKey) {
          const actions = preload.actions instanceof Map ? preload.actions : (() => {
            const m = /* @__PURE__ */ new Map();
            for (const [id2, frames] of Object.entries(preload.actions)) m.set(Number(id2), frames);
            return m;
          })();
          const byKey = preload.byKey instanceof Map ? preload.byKey : (() => {
            const m = /* @__PURE__ */ new Map();
            for (const [key, spr] of Object.entries(preload.byKey)) {
              m.set(key, {
                width: spr.width,
                height: spr.height,
                x: spr.x || 0,
                y: spr.y || 0,
                decodedBuffer: import_buffer.Buffer.from(
                  spr.decodedBuffer || spr.rgba || spr.data || []
                )
              });
            }
            return m;
          })();
          normalizedPreload = { actions, byKey, engine: preload.engine || "jsmugen" };
        }
        const result = await packFromMugen(charDir, null, normalizedPreload);
        const id = result.id;
        const packDir = path.join(packsRoot, id);
        const charPath = path.join(packDir, "character.json");
        const atlasPath = path.join(packDir, "atlas.png");
        if (!fs.existsSync(charPath) || !fs.existsSync(atlasPath)) {
          throw new Error(`Pack incomplete for ${id}`);
        }
        const character = JSON.parse(fs.readFileSync(charPath, "utf8"));
        enrichRobloxMeta(character);
        const robloxFiles = buildRobloxFiles(character);
        const atlasBuf = fs.readFileSync(atlasPath);
        const atlasPng = new Uint8Array(atlasBuf.buffer, atlasBuf.byteOffset, atlasBuf.byteLength);
        return { id, character, atlasPng, robloxFiles };
      }
      module.exports = { packFromFileMap, buildRobloxFiles };
    }
  });
  return require_pack_browser_entry();
})();
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

assert/build/internal/util/comparisons.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
   * @license  MIT
   *)
*/
