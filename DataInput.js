module.exports = class DataInput {
    constructor(buffer) {
        this.pos = 0;
        this.buf = buffer;
    }

    _advance(bytes) {
        if (this.pos + bytes > this.buf.length) {
            throw new Error("EOF: Tried to read " + bytes + " bytes at offset " +
                this.pos + ", but buffer size is only " + this.buf.length)
        }
        const p = this.pos;
        this.pos += bytes;
        return p;
    }

    readBoolean() {
        return this.readByte() !== 0;
    }

    readByte() {
        return this.buf[this._advance(1)];
    }

    readUnsignedShort() {
        return this.buf.readUInt16BE(this._advance(2));
    }

    readInt() {
        return this.buf.readInt32BE(this._advance(4));
    }

    readLong() {
        const msb = this.buf.readInt32BE(this._advance(4));
        const lsb = this.buf.readInt32BE(this._advance(4));
        //msb << 32 | lsb
        //since no bits overlap, addition is the same as a bitwise or
        return BigInt(msb) * BigInt(2 ** 32) + BigInt(lsb);
    }

    readUTF() {
        const len = this.readUnsignedShort();
        const start = this._advance(len);
        return this.buf.toString("utf8", start, start + len);
    }
};
