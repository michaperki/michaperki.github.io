// Binary Search Tree

function Node(data, left = null, right = null) {
  return {
    data: data,
    left: left,
    right: right,
  };
}

function buildTree(arr, start = 0, end = arr.length - 1) {
  if (start > end) return null;

  const mid = parseInt((start + end) / 2);
  const root = Node(arr[mid]);

  root.left = buildTree(arr, start, mid - 1);
  root.right = buildTree(arr, mid + 1, end);

  return root;
}

function Tree(arr) {
  root = buildTree(arr);
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

BST = new Tree([1,5,3,7,33,7,32,9]);
prettyPrint(BST.root);
