export class ByteSet {
    constructor() {
        this.data = ''
        return this
    }

    setRange(from, to, value) {
        if (this.data.length < to) {
            const add0 = Array(to - this.data.length).fill(0).join('')
            this.data = this.data.concat(add0)
        }
        const dataArr = this.data.split('')
        for (let i = from; i < to; i++) {
            dataArr[i] = value
        }
        this.data = dataArr.join('')
    }

    toString() {
        return this.data
    }

    parse(data) {
        this.data = data
    }
}