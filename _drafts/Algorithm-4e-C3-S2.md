# Chapter 3 / Section 2 : Binary Search Trees

## Main Content

Binary search tree is a data structure that using *two* links per node which can combines the flexibility of insertion in a linked list with the efficiency of search in an ordered array. Its formal definition is :

> A *binary search tree* (BST) is a binary tree where each node has a `Comparable` key (and an associated value) and satisfies the restriction that the key in any node is larger than the keys in all nodes in that node's left subtree and smaller than the keys in all nodes in that node's right subtree.

Here is the anatomy of a binary search tree : (image from text book)

![BinarySearchTreeAnatomy](../img/BinarySearchTreeAnatomy.png)

### 1. Basic implementation

The following implemented the `get()` (*search*) and `put()` (*insert*) method of *binary search tree* :

```java
public class BST<Key extends Comparable<Key>, Value>
{
    private Node root;
    private class Node
    {
        Key key;
        Value val;
        Node left, right;
        int N;
        
        public Node(Key key, Value val, int N)
        {
            this.key = key;
            this.val = val;
            this.N = N;
        }
    }
    
    public int size()
    { return size(root); }
    
    private int size(Node x)
    {
        if (x == null) return 0;
        else return x.N;
    }
    
    public Value get(Key key)
    { return get(root, key); }
    
    private Value get(Node x, Key key)
    {
        if (x == null) return null;
        int cmp = key.compareTo(x.key);
        if (cmp < 0) return get(x.left, key);
        else if (cmp > 0) return get(x.right, key);
        else return x.val;
    }
    
    public void put(Key key, Value val)
    {
        root = put(root, key, val);
    }
    
    private Node put(Node x, Key key, Value val)
    {
        if (x == null) return new Node(key, val, 1);
        
        int cmp = key.compareTo(x.key);
        if (cmp < 0) x.left = put(x.left, key, val);
        else if (cmp > 0) x.right = put(x.right, key, val);
        else x.val = val;
        
        x.N = size(x.left) + size(x.right) + 1;
        return x;
    }
}
```

The following three images may help to understand its implementation : (image from text book)

![Search In BST](../img/SearchInBST.png)

![Insertion In BST](../img/InsertionInBST.png)

![BSTTrace](../img/BSTTrace.png)

**BST analysis** :

> - Search hits, search misses and insertions in a BST built from N random keys all require ~ 2lnN (about 1.39 lgN) compares on the average.
> - All operations will take time proportional to the height of the tree in the worst case.
> - The average height of a BST built from random keys approaches 2.99lgN for large N.

A typical BST and its costs is shown below : (image from text book)

![Typical BST](../img/TypicalBST.png)

### 2. Order-based methods and deletion

- Minimum and maximum :

```java
public Key min()
{
    Node x = min(root);
    return x.key;
}

private Node min(Node x)
{
    if (x.left == null) return x;
    return min(x.left);
}
```

- Floor and ceiling :

```java
public Key floor(Key key)
{
    Node x = floor(root, key);
    if (x == null) return null;
    return x.key;
}

private Node floor(Node x, Key key)
{
    if (x == null) return null;
    int cmp = key.compareTo(x.key);
    if (cmp < 0) return floor(x.left, key);
    else if (cmp > 0) 
    {
        Node t = floor(x.right, key);
        if (t == null) return x;
        else return t;
    }
    else return x;
}
```

- Selection :

```java
public Key select(int k)
{
    Node x = select(root, k);
    if (x == null) return null;
    return x.key;
}

private Node select(Node x, int k)
{
    if (x == null) return null;
    int t = size(x.left);
    if (t > k) return select(x.left, k);
    else if (t < k) return select(x.right, k-t-1);
    else return x;
}
```

- Rank :

```java
public int rank(Key key)
{
    return rank(root, key);
}

private int rank(Node x, Key key)
{
    if (x == null) return 0;
    int cmp = key.compareTo(x.key);
    if (cmp < 0) return rank(x.left, key);
    else if (cmp > 0) return size(x.left) + 1 + rank(x.right, key);
    else return size(x.left);
}
```

- Delete the minimum / maximum :

```java
public void deleteMin()
{
    root = deleteMin(root);
}

private Node deleteMin(Node x)
{
    if (x.left == null) return x.right;
    x.left = deleteMin(x.left);
    x.N = size(x.left) + size(x.right) + 1;
    return x;
}
```

- Delete :

To delete any node has one child is easy, and we can delete a node that has two children in four steps :

1. Save a link to the node **x **to be deleted in `t`
2. Set **x** to point to its successor `min(t.right)`
3. Set the right link of **x** to `deleteMin(t.right)`
4. Set the left link of **x** to `t.left`

The image below maybe more instructive : (image from text book)

![DeletionInBST](../img/DeletionInBST.png)

And here is its implementation :

```java
public void delete(Key key)
{
    root = delete(root, key);
}

private Node delete(Node x, Key key)
{
    if (x == null) return null;
    int cmp = key.compareTo(x.key);
    if (cmp < 0) x.left = delete(x.left, key);
    else if (cmp > 0) x.right = delete(x.right, key);
    else
    {
        if (x.right == null) return x.left;
        if (x.left == null) return x.right;
        Node t = x;
        x = min(t.right);
        x.right = deleteMin(t.right);
        x.left = t.left;
    }
    x.N = size(x.left) + size(x.right) + 1;
    return x;
}
```

- Range queries :

```java
public Iterable<Key> keys()
{
    return keys(min(), max());
}

public Iterable<Key> keys(Key lo, Key hi)
{
    Queue<Key> queue = new Queue<>();
    keys(root, queue, lo, hi);
    return queue;
}

private void keys(Node x, Queue<Key> q, Key lo, Key hi)
{
    if (x == null) return;
    int cmplo = lo.compareTo(x.key);
    int cmphi = hi.compareTo(x.key);
    if (cmplo < 0) keys(x.left, q, lo, hi);
    if (cmplo <= 0 && cmphi >= 0) q.enqueue(x.key);
    if (cmphi > 0) keys(x.right, q, lo, hi);
}
```

### 3. Summary

BSTs are not difficult to implement and can provide fast search and insert for practical application of all kinds if the key insertions are well-approximated by the random-key model.

But, the bad worst-case performance of BSTs may not be tolerable in some situations. And indeed, the worst-case behavior is not unlikely in practice - it arises when a client inserts keys in order or in reverse order which some client certainly might attempt in the absence of any explicit warnings to avoid doing so.

Here is an updated summary for basic symbol-table implementations : (image from text book)

![CostSummaryUpdate](../img/CostSummaryUpdate.png)

## Exercise 
### 3.2.6
> Add to BST a method height() that computes the height of the tree. Develop two implementations: a recursive method (which takes linear time and space proportional to the height), and a method like size() that adds a field to each node in the tree (and takes linear space and constant time per query).

This is my implementation of `height()` in a recursive way, I will omit the other way.
```java
public int height()
{
	return height(root);
}

private int height(Node x)
{
	if (x == null)
		return 0;
	int left = size(x.left);
	int right = size(x.right);
	if (left == 0 && right == 0)
		return 0;
	if (left < right)
		return 1 + height(x.right);
	else
		return 1 + height(x.left);
}
```

### 3.2.13
> Give nonrecursive implementations of get() and put() for BST .

Here is my implementation: 
```java
public Value get(Key key)
{
	Node x = root;
	while (x != null)
	{
		int cmp = key.compareTo(x.key);
		if (cmp > 0)
			x = x.right;
		else if (cmp < 0)
			x = x.left;
		else
			return x.val;
	}
	return null;
}

public void put(Key key, Value val)
{
	if (root == null)
	{
		root = new Node(key, val, 1);
		return;
	}

	Node father = root;
	Node son = root;
	do
	{
		int cmp = key.compareTo(son.key);
		if (cmp == 0)
		{
			son.val = val;
			return;
		}
		else if (cmp > 0)
		{
			son = son.right;
			if (son == null)
			{
				father.right = new Node(key, val, 1);
				break;
			}
		}
		else
		{
			son = son.left;
			if (son == null)
			{
				father.left = new Node(key, val, 1);
				break;
			}
		}
		father = son;
	} while (true);

	Node x = root;
	int cmp = key.compareTo(x.key);
	while (cmp != 0)
	{
		x.N++;
		if (cmp > 0)
			x = x.right;
		else
			x = x.left;
		cmp = key.compareTo(x.key);
	}
}
```
And compare to the implementation on the book's [website](https://algs4.cs.princeton.edu/32bst/NonrecursiveBST.java.html), mine will take two time compares for the `put` method, which seems to be unnecessary and can be avoid by putting these `null` comparation outside the `while` loop.

### 3.2.37 Level-order traversal.
> Write a method printLevel() that takes a Node as argument and prints the keys in the subtree rooted at that node in level order (in order of their distance from the root, with nodes on each level in order from left to right). Hint : Use a Queue .

Here is the code by using two queue: 
```java
public Iterable<Key> printLevel()
{
	Queue<Key> qk = new Queue<>();
	Queue<Node> qn = new Queue<>();
	qn.enqueue(root);
	while (!qn.isEmpty())
	{
		Node t = qn.dequeue();
		if (t == null)
			continue;
		qk.enqueue(t.key);
		qn.enqueue(t.left);
		qn.enqueue(t.right);
	}
	return qk;
}
```

### 3.2.38 Tree drawing.
> Add a method draw() to BST that draws BST figures in the style of the text. Hint : Use instance variables to hold node coordinates, and use a recursive method to set the values of these variables.

I create a variable `level` in node to record its y value, while its x value can be calculated by `rank()` method. Then test if the current node has left or right nodes to draw a line between them.
Following is the modified method `put` , a new method `draw` and a help method `height` which has been appeared in previous exercise.
```java
public void put(Key key, Value val)
{
	root = put(root, key, val, 0);
}

private Node put(Node x, Key key, Value val, int level)
{
	if (x == null)
		return new Node(key, val, 1, level);

	int cmp = key.compareTo(x.key);
	if (cmp > 0)
		x.right = put(x.right, key, val, level+1);
	else if (cmp < 0)
		x.left = put(x.left, key, val, level+1);
	else
		x.val = val;
	x.N = size(x.left) + size(x.right) + 1;
	return x;
}

private void draw(Node x, Key lo, Key hi, int height)
{
	if (x == null)
		return;
	int cmplo = lo.compareTo(x.key);
	int cmphi = hi.compareTo(x.key);
	if (cmplo < 0)
		draw(x.left, lo, hi, height);
	if (cmplo <= 0 && cmphi >= 0)
	{
		int i = rank(x.key) + 1;
		int j = height - x.level + 1;
		if (x.left != null)
		{
			int li = rank(x.left.key) + 1;
			int lj = height - x.left.level + 1;
			StdDraw.line(i, j, li, lj);
		}
		else
			StdDraw.line(i, j, i-0.2, j-0.5);
		if (x.right != null)
		{
			int ri = rank(x.right.key) + 1;
			int rj = height - x.right.level + 1;
			StdDraw.line(i, j, ri, rj);
		}
		else
			StdDraw.line(i, j, i+0.2, j-0.5);
		StdDraw.setPenRadius(0.01);
		StdDraw.setPenColor(StdDraw.BLACK);
		StdDraw.point(i, j);
		StdDraw.setPenRadius();
		StdDraw.setPenColor(StdDraw.GRAY);
	}
	if (cmphi > 0)
		draw(x.right, lo, hi , height);
}

public void draw(int number)
{
	int high = height();
	StdDraw.setXscale(0, number+1);
	StdDraw.setYscale(0, high+1.5);
	StdDraw.setPenColor(StdDraw.GRAY);
	draw(root, min(), max(), high);
}

public int height()
{
	return height(root);
}

private int height(Node x)
{
if (x == null)
	return 0;
int left = size(x.left);
int right = size(x.right);
if (left == 0 && right == 0)
	return 0;
if (left < right)
	return 1 + height(x.right);
else
	return 1 + height(x.left);
}
```
For a test `main` function, I create a random `N` length integer array as the key:
```java
public static void main(String[] args)
{
	int N = Integer.parseInt(args[0]);

	int[] keys = new int[N];
	int[] vals = new int[N];
	for (int i = 0; i < N; i++)
	{
		keys[i] = i;
		vals[i] = i;
	}
	StdRandom.shuffle(keys);

	DrawBST<Integer, Integer> dtr = new DrawBST<>();

	for (int i = 0; i < N; i++)
		dtr.put(keys[i], vals[i]);
	dtr.draw(N);
}
```
And we can get the following result when `N = 100`

![](../img/DrawBST.jpg)
