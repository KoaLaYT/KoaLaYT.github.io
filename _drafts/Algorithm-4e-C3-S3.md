# Chapter 3 / Section 3 : Balanced Search Trees

## Main Content

In this section, a data structure that slightly relaxes the perfect balance requirement to provide guaranteed logarithmic performance not just for *insert* and *search* operations in our symbol-table API but also for all of the ordered operations (except range search).

### 1. 2-3 search trees

To archieve our goal, we need to allow the nodes to hold more than one key. The formal definition is as follow :

> A 2-3 search tree is a tree that is either empty or
>
> - A 2-node, with one key and two links, a left link to a 2-3 search tree with smaller keys, and a right link to 2-3 search tree with larger keys
> - A 3-node, with two keys and three links, a left link to a 2-3 search tree with smaller keys, a middle link to a 2-3 search tree with keys between the node's keys, and a right link to a 2-3 search tree with larger keys
>   Here is the anatomy of a 2-3 search tree : (image from text book)

![Anatomy of a 2-3 search tree](../img/AnatomyOf23Tree.png)

A *perfectly balanced* 2-3 search tree is one whose null links are all the same distance from the root.

The following are illustrations of *search* and *insert* operations in 2-3 search tree : (image from text book)

- search :

![Search in a 2-3 tree](../img/SearchIn23Tree.png)

- insert :

1. Insert into a 2-node or a single 3-node

![Insert into a 2-node or a single 3-node](../img/InsertInto2node3node.png)

  2. Insert into a 3-node whose parent is a 2-node or a 3-node :

![Insert into a 3-node](../img/InsertInto3node.png)

  3. Split a temporary 4-node :

![Spilt a temporary 4-node](../img/Spilt4node.png)

The figure below shows how a 2-3 search tree is grown up : (image from text book)

![Trace of 2-3 tree](../img/ConstructionOf23Tree.png)

### 2. Red-black BSTs

The basic idea of red-black BSTs is defining two different types of links :

1. *red* links : bind together two 2-nodes to represent 3-nodes
2. *black* links : bind together 2-3 tree

And so we get an equivalent definition :

> - Red links lean left
> - No node has two red links connected to it
> - The tree has *perfect black balance* : every path from the root to a null link has the same number of black links

There is a **1-1 correspondence** between red-black BSTs and 2-3 trees : (image from text book)

![One by one correspondence between red-black BST and 2-3 tree](../img/CorresBetweenRBtreeAnd23tree.png)

Here is its implementation :

```java
public class RedBlackBST<Key extends Comparable<Key>, Value>
{
	private static final boolean RED = true;
	private static final boolean BLACK = false;
	
	private Node root;
	
	private class Node
	{
		Key key;
		Value val;
		Node left, right;
		int N;
		boolean color;
		
		public Node(Key key, Value val, int N, boolean color)
		{
			this.key = key;
			this.val = val;
			this.N = N;
			this.color = color;
		}
	}
	
	private boolean isRed(Node x)
	{
		if (x == null) return false;
		else return x.color == RED;
	}
	
	private void rotateLeft(Node t)
	{
		Node x = t.right;
		t.right = x.left;
		x.left = t;
		x.color = t.color;
		t.color = RED;
		x.N = t.N;
		t.N = size(t.left) + size(t.right) + 1;
	}
	
	private void rotateRight(Node t)
	{
		Node x = t.left;
		t.left = x.right;
		x.right = t;
		x.color = t.color;
		t.color = RED;
		x.N = t.N;
		t.N = size(t.left) + size(t.right) + 1;
	}
	
	private void flipColor(Node x)
	{
		x.left.color = BLACK;
		x.right.color = BLACK;
		x.color = RED;
	}
	
	public void put(Key key, Value val)
	{
		root = put(root, key, val);
		root.color = BLACK;
	}
	
	private Node put(Node x, Key key, Value val)
	{
		if (x == null) return new Node(key, val, 1, RED);
		int cmp = key.compareTo(x.key);
		if (cmp < 0) x.left = put(x.left, key, val);
		else if (cmp > 0) x.right = put(x.right, key, val);
		else x.val = val;
		
		if (!isRed(x.left) && isRed(x.right)) x = rotateLeft(x);
		if (isRed(x.left) && isRed(x.left.left)) x = rotateRight(x);
		if (isRed(x.left) && isRed(x.right)) flipColor(x);
		
		x.N = size(x.left) + size(x.right) + 1;
		return x;
	}
}
```

To insert a new node, we can performing the following operations one after the other :

1. If the right child is red and the left child is black, rotate left
2. If both the left child and its left child are red, rotate right
3. If both children are red, flip colors

The following figure may be enlightening : (image from text book)

![Passing red link up a red-black BST](../img/PassingRedLink.png)

And here is the contruction traces of building a red-black BST : (image from text book)

![Red-black BST construction trace](../img/RedBlackBSTConstructionTrace.png)

**Delete** operations are a bit more complicated. To delete the minimum node, on the way down the tree, one of the following cases must hold :

1. If the left child of the current node is not a 2-node, there is nothing to do
2. If the left child is a 2-node and its immediate sibling is not a 2-node, move a key from the sibling to the left child
3. If the left child and its immediate sibling are 2-nodes, then combine them with the smallest key in the parent to make a 4-node, changing the parent from a 3-node to 2-node or from a 4-node to a 3-node.

The figure shows all these different conditions : (image from the text)

![Transformations for delete the minimum](../img/DeleteMinTransformation.png)

Following is its implementation, and be careful that the `flipcolors()` method is modified, it will set parent to `BLACK` and the two children to `RED` :

```java
private Node moveRedLeft(Node h)
{
	flipColors(h);
	if (isRed(h.right.left))
	{
		h.right = rotateRight(h.right);
		h = rotateLeft(h);
	}
	return h;
}

public void deleteMin()
{
	if (!isRed(root.left) && !isRed(root.right))
		root.color = RED;
	root = deleteMin(root);
	if (!isEmpty()) root.color = BLACK;
}

private Node deleteMin(Node h)
{
	if (h.left == null)
		return null;
	if (!isRed(h.left) && !isRed(h.left.left))
		h = moveRedLeft(h);
	h.left = deleteMin(h.left);
	return balance(h);
}

private Node balance(Node h)
{
	if (isRed(h.right)) h = rotateLeft(h);
	if (!isRed(h.left) && isRed(h.right)) h = rotateLeft(h);
	if (isRed(h.left) && isRed(h.left.left)) h = rotateRight(h);
	if (isRed(h.left) && isRed(h.right)) flipColor(h);
	h.N = size(h.left) + size(h.right) + 1;
	return h;
}
```

The `deleteMax()` method is similar but differ slightly because red links are left-leaning :

```java
private Node moveRedRight(Node h)
{
	flipColors(h);
	if (!isRed(h.left.left))
		h = rotateRight(h);
	return h;
}

public void deleteMax()
{
	if (!isRed(root.left) && !isRed(root.right))
		root.color = RED;
	root = deleteMax(root);
	if (!isEmpty()) root.color = BLACK;
}

private Node deleteMax(Node h)
{
	if (isRed(h.left))
		h = rotateRight(h);
	if (h.right == null)
		return null;
	if (!isRed(h.right) && !isRed(h.right.left))
		h = moveRedRight(h);
	h.right = deleteMax(h.right);
	return balance(h);
}
```

And combining the previous two method, we can get the implementation of `delete()` method :

```java
public void delete(Key key)
{
	if (!isRed(root.left) && !isRed(root.right))
		root.color = RED;
	root = delete(root, key);
	if (!isEmpty()) root.color = BLACK;
}

private Node delete(Node h, Key key)
{
	if (key.compareTo(h.key) < 0)
	{
		if (!isRed(h.left) && !isRed(h.left.left))
			h = moveRedLeft(h);
		h.left = delete(h.left, key);
	}
	else
	{
		if (isRed(h.left))
			h = rotateRight(h);
		if (key.compareTo(h.key) == 0 && h.right == null)
			return null;
		if (!isRed(h.right) && !isRed(h.right.left))
			h = moveRedRight(h);
		if (key.compareTo(h.key) == 0)
		{
			h.val = get(h.right, min(h.right).key);
			h.key = min(h.right).key;
			h.right = deleteMin(h.right);
		}
		else
			h.right = delete(h.right, key);
	}
	
	return balance(h);
}
```

**Red-black BST analysis** :

> - The height of a red-black BST with N nodes is no more than 2lgN
> - The average length of a path from the root to a node in a red-black BST with N nodes is ~1.00 lgN
> - In a red-black BST, the following operations take logarithmic time in the worst case : `put()`, `get()`, `min()`, `max()`, `floor()`, `ceiling()`, `rank()`, `select()`, `delMin()`, `delMax()`, `delete()` and range count

The updated cost summary for symbol-table implementations is as follow : (image from text book)

![Cost summary added red-black BST](../img/CostSummaryWithRedblackBST.png)

## Exercise
### 3.3.31 Tree drawing.
> Add a method draw() to RedBlackBST that draws red-black BST figures in the style of the text

Unlike the implementation of BST `draw` function, I use two `queue` to record the node's level information:
```java
public void draw(int number)
{
	int high = height();
	StdDraw.setXscale(0, number+1);
	StdDraw.setYscale(0, high+1.5);

	Queue<Node> nodes = new Queue<>();
	Queue<Integer> levels = new Queue<>();
	Node x = root;
	nodes.enqueue(x);
	levels.enqueue(0);

	while (!nodes.isEmpty())
	{
		Node t = nodes.dequeue();
		int level = levels.dequeue();
		if (t == null)
			continue;
		int i = rank(t.key) + 1;
		int j = high - level + 1;
		StdDraw.setPenRadius(0.01);
		StdDraw.setPenColor(StdDraw.BLACK);
		StdDraw.point(i, j);
		StdDraw.setPenRadius();

		if (t.left != null)
		{
			int li = rank(t.left.key) + 1;
			int lj = j - 1;
			if (t.left.color == RED)
				StdDraw.setPenColor(StdDraw.PRINCETON_ORANGE);
			else
				StdDraw.setPenColor(StdDraw.GRAY);
			StdDraw.line(i, j, li, lj);
		}
		else
		{
			StdDraw.setPenColor(StdDraw.GRAY);
			StdDraw.line(i, j, i-0.2, j-0.5);
		}
		if (t.right != null)
		{
			int ri = rank(t.right.key) + 1;
			int rj = j - 1;
			StdDraw.setPenColor(StdDraw.GRAY);
			StdDraw.line(i, j, ri, rj);
		}
		else
		{
			StdDraw.setPenColor(StdDraw.GRAY);
			StdDraw.line(i, j, i+0.2, j-0.5);
		}
		nodes.enqueue(t.left);
		nodes.enqueue(t.right);
		levels.enqueue(level+1);
		levels.enqueue(level+1);
	}
}
```
If we put keys in ascending order (from 0 to 99), we will get the following balanced tree.

![](../img/DrawRedBlackTree.jpg)

### 3.3.42 Count red nodes.
> Write a program that computes the percentage of red nodes in a given red-black BST. Test your program by running at least 100 trials of the experiment of inserting N random keys into an initially empty tree, for N = 10^4 , 10^5 , and 10^6 , and formulate an hypothesis.

So this is my result, and I guess the percentage of red nodes is about 25%.
```
$ java CountRed
For N =   10000, average red nodes is:   2535.810, about 25.358% percentage
For N =  100000, average red nodes is:  25398.360, about 25.398% percentage
For N = 1000000, average red nodes is: 253905.480, about 25.391% percentage
```
