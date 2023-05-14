// Author: Michael Perkins
// Date 2023-05-013
// Version: 1.0.0
// Description: A linked list implementation in JavaScript

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  addToHead(value) {
    const newNode = new Node(value, this.head);
    this.head = newNode;
    if (!this.tail) this.tail = newNode;
  }

  addToTail(value) {
    const newNode = new Node(value, null);
    if (this.tail) this.tail.next = newNode;
    this.tail = newNode;
    if (!this.head) this.head = newNode;
  }

  removeHead() {
    if (!this.head) return null;
    const value = this.head.value;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    return value;
  }

  removeTail() {
    if (!this.tail) return null;
    const value = this.tail.value;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
      return value;
    }
    let currentNode = this.head;
    while (currentNode.next !== this.tail) {
      currentNode = currentNode.next;
    }
    currentNode.next = null;
    this.tail = currentNode;
    return value;
  }

  search(value) {
    let currentNode = this.head;
    while (currentNode) {
      if (currentNode.value === value) return currentNode.value;
      currentNode = currentNode.next;
    }
    return null;
  }

  indexOf(value) {
    const indexes = [];
    let currentIndex = 0;
    let currentNode = this.head;
    while (currentNode) {
      if (currentNode.value === value) indexes.push(currentIndex);
      currentNode = currentNode.next;
      currentIndex++;
    }
    return indexes;
  }

  size() {
    let size = 0;
    let currentNode = this.head;
    while (currentNode) {
      size++;
      currentNode = currentNode.next;
    }
    return size;
  }

  head() {
    return this.head;
  }
}

class Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

const list = new LinkedList();

document.getElementById("add").addEventListener("click", function () {
  const value = document.getElementById("input").value;
  if(value === "") return alert("Please enter a value")
  list.addToHead(value);
  document.getElementById("input").value = "";
  document.getElementById("list").innerHTML = list.head.value;
});