class MinHeap {
  constructor(maxSize, compareFn) {
    this.maxSize = maxSize;
    this.compareFn = compareFn;
    this.heap = [];
  }

  push(item) {
    if (this.heap.length < this.maxSize) {
      this.heap.push(item);
      this.up(this.heap.length - 1);
    } else if (this.compareFn(item, this.heap[0]) > 0) {
      this.heap[0] = item;
      this.down(0);
    }
  }

  up(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.compareFn(this.heap[i], this.heap[parent]) < 0) {
        this.swap(i, parent);
        i = parent;
      } else {
        break;
      }
    }
  }

  down(i) {
    const len = this.heap.length;
    while (2 * i + 1 < len) {
      let left = 2 * i + 1;
      let right = 2 * i + 2;
      let best = i;

      if (this.compareFn(this.heap[left], this.heap[best]) < 0) {
        best = left;
      }
      if (right < len && this.compareFn(this.heap[right], this.heap[best]) < 0) {
        best = right;
      }

      if (best !== i) {
        this.swap(i, best);
        i = best;
      } else {
        break;
      }
    }
  }

  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  getSorted() {
    return [...this.heap].sort((a, b) => this.compareFn(b, a));
  }
}

module.exports = MinHeap;
