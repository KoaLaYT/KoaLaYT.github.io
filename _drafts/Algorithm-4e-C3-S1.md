# Chapter 3 / Section 1 : Symbol Tables

## Main Content

A *symbol table* is a data structure for key-value pairs that supports two operations: *insert* (put) a new pair into the table and *search* for (get) the value associated with a given key.
API for a generic basic symbol table : (image from text book)

![ST API](../img/SymbolTableAPI.png)

In typical applications, keys are *Comparable* objects, so we can think of the symbol table as keeping the keys in order and consider a significantly expanded API that defines numerous natural and useful operations involving relative key order, as shown below : (image from text book)

![Ordered ST API](../img/OrderedSymbolTableAPI.png)

### 1. Sequential search in an unordered linked list

This is a straightforward data structure that use a linked list of nodes that contain keys and values. This is the trace of it : (image from text book)

![LinkedListSTTrace](../img/LinkedListSTTrace.png)

And here is an implementation of it :

```java
public class SequentialSearchST<Key, Value>
{
	private Node first;
	
	private class Node
	{
		Key key;
		Value val;
		Node next;

		public Node(Key key, Value val, Node next)
		{
			this.key = key;
			this.val = val;
			this.next = next;
		}
	}
	
	public void put(Key key, Value val)
	{		
		for (Node x = first; x != null; x = x.next)
		{
			if (key.equals(x.key))
			{
				x.val = val;
				return;
			}
		}
		
		first = new Node(key, val, first);
	}
	
	public Value get(Key key)
	{
		for (Node x = first; x != null; x = x.next)
		{
			if (key.equals(x.key))
				return x.val;
		}
		return null;
	}
}
```

**Sequential search analysis** :

> Inserting N distinct keys into an initially empty linked-list symbol table uses ~ N<sup>2</sup>/2 compares

This is a result of an experiment to validate analytic results : (image from text book)

![SequentialSearchST Cost](../img/SequentialSearchSTCost.png)

### 2. Binary search in an ordered array

In this implementation, a pair of parallel arrays which one for keys and one for values is used. The heart of it is the `rank()` method, which tells where to find the key when calls to `get()` and where to put the key when calls to `put()`.
Thr trace of it is an instructive introduction to this data structure : (image from text book)

![BinarySearchSTTrace](../img/BinarySearchSTTrace.png)

And here is an full implementation :

```java
public class BinarySearchST<Key extends Comparable<Key>, Value>
{
	private Key[] keys;
	private Value[] vals;
	private int N = 0;
	
	public BinarySearchST(int cap)
	{
		keys = (Key[]) new Comparable[cap];
		vals = (Value[]) new Object[cap];
	}
	
	public void put(Key key, Value val)
	{
		int i = rank(key);
		if (i < N && keys[i].compareTo(key) == 0)
		{
			vals[i] = val;
			return;
		}
		for (int j = N; j > i; j--)
		{
			vals[j] = vals[j-1];
			keys[j] = keys[j-1];
		}
		vals[i] = val;
		keys[i] = key;
		N++;
	}
	
	public Value get(Key key)
	{
		if (isEmpty()) return null;
		int i = rank(key);
		if (i < N && keys[i].compareTo(key) == 0)
			return vals[i];
		else
			return null;
	}
	
	// Iterative
	private int rank(Key key)
	{
		int lo = 0;
		int hi = N-1;
		while (lo <= hi)
		{
			int mid = lo + (hi - lo) / 2;
			int cmp = key.compareTo(keys[mid]);
			if (cmp < 0)
				hi = mid - 1;
			else if (cmp > 0)
				lo = mid + 1;
			else
				return mid;
		}
		return lo;
	}
	
	// Recursive
	private int rank(Key key, int lo, int hi)
	{
		if (hi < lo)
			return lo;
		int mid = lo + (hi - lo) / 2;
		int cmp = key.compareTo(keys[mid]);
		if (cmp < 0)
			return rank(key, lo, mid-1);
		else if (cmp > 0)
			return rank(key, mid+1, hi);
		else
			return mid;
	}
}
```

The trace of rank may help to understand this heart method :

![BinarySearchRankTrace](../img/BinarySearchRankTrace.png)

**Binary search analysis** :

> - search for a given key will use no more than lnN+1 compares
> - insert a new key will use ~2N array access in the worst case
> - thus inserting N keys into an initially empty table will uses ~ N<sup>2</sup> array accesses in the worst case

Here is the overview costs of *BinarySearchST* : (image modified from text book)

![BinarySearchSTCosts](../img/BinarySearchSTCosts.png)

The picture below shows the improvement of this algorithm : (image from text book)

![BinarySearchST Costs](../img/BinarySearchSTCostsImprovement.png)

### 3. Preview

Binary search is typically far better than sequential search, here is a table summarizes performance characteristics for these two elementary symbol table :

![BasicSTCostSummary](../img/BasicSTCostSummary.png)

Here is a brief preview of six symbol-table implementation in this chapter :

![ProsAndConsOfST](../img/ProsAndConsOfST.png)

## Exercise 
### 3.1.5 
> Implement size() , delete() , and keys() for SequentialSearchST.

The code is simple, just to sure that I totally understand the implementation of  `SequentialSearchST`.
```java
import edu.princeton.cs.algs4.Queue;
import edu.princeton.cs.algs4.StdOut;

public class FullSeqSearchST<Key, Value>
{
	private Node first;
	private int N;

	private class Node
	{
		Key key;
		Value val;
		Node next;

		public Node(Key key, Value val, Node next)
		{
			this.key = key;
			this.val = val;
			this.next = next;
		}
	}

	public Value get(Key key)
	{
		for (Node x = first; x != null; x = x.next)
		{
			if (key.equals(x.key))
				return x.val;
		}
		return null;
	}

	public void put(Key key, Value val)
	{
		for (Node x = first; x != null; x = x.next)
		{
			if (key.equals(x.key))
			{
				x.val = val;
				return;
			}
		}
		first = new Node(key, val, first);
		N++;
	}

	public int size()
	{
		return N;
	}

	public void delete(Key key)
	{
		// deal with the special condition (N = 0 or Delete the first node)
		if (first == null)
			return;
		if (key.equals(first.key))
		{
			first = first.next;
			N--;
			return;
		}

		for (Node father = first, son = first.next; son != null; father = father.next, son = son.next)
		{
			if (key.equals(son.key))
			{
				father.next = son.next;
				N--;
				return;
			}
		}
	}

	public Iterable<Key> keys()
	{
		Queue<Key> q = new Queue<Key>();

		for (Node x = first; x != null; x = x.next)
			q.enqueue(x.key);
		return q;
	}

	public static void main(String[] args)
	{
		FullSeqSearchST<String, Integer> st = new FullSeqSearchST<String, Integer>();
		st.put("Apple", 1);
		st.put("Banana", 2);
		st.put("Cat", 3);
		for (String s : st.keys())
			StdOut.println(s + " " + st.get(s));
		StdOut.println("Delete the Banana");
		st.delete("Banana");
		for (String s : st.keys())
			StdOut.println(s + " " + st.get(s));
		StdOut.println("Delete the Cat");
		st.delete("Cat");
		for (String s : st.keys())
			StdOut.println(s + " " + st.get(s));
		StdOut.println("ST size: " + st.size());
	}
}
```

### 3.1.16 & 17
> Implement the delete() method for BinarySearchST .
> Implement the floor() method for BinarySearchST .

Some of the API functions are omitted: 
```java
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.Queue;

public class FullBinarySearchST<Key extends Comparable<Key>, Value>
{
	private Key[] keys;
	private Value[] vals;
	private int N;

	public FullBinarySearchST(int cap)
	{
		keys = (Key[]) new Comparable[cap];
		vals = (Value[]) new Object[cap];
	}

	public int size()
	{
		return N;
	}

	public Value get(Key key)
	{
		if (N == 0)
			return null;
		int i = rank(key);
		if (i < N && key.compareTo(keys[i]) == 0)
			return vals[i];
		else
			return null;
	}

	public void put(Key key, Value val)
	{
		int i = rank(key);
		if (i < N && key.compareTo(keys[i]) == 0)
		{
			vals[i] = val;
			return;
		}
		for (int j = N; j > i; j--)
		{
			keys[j] = keys[j-1];
			vals[j] = vals[j-1];
		}
		keys[i] = key;
		vals[i] = val;
		N++;
	}

	public int rank(Key key)
	{
		int lo = 0;
		int hi = N -1 ;
		while (lo <= hi)
		{
			int mid = lo + (hi - lo) / 2;
			int cmp = key.compareTo(keys[mid]);
			if (cmp > 0)
				lo = mid + 1;
			else if (cmp < 0)
				hi = mid - 1;
			else
				return mid;
		}
		return lo;
	}

	public void delete(Key key)
	{
		if (N == 0)
			return;
		int i = rank(key);
		if (i < N && key.compareTo(keys[i]) == 0)
		{
			for (int j = i+1; j < N; j++)
			{
				keys[j-1] = keys[j];
				vals[j-1] = vals[j];
			}
			N--;
			keys[N] = null;
			vals[N] = null;
		}
	}

	public Key floor(Key key)
	{
		int i = rank(key);
		if (i == 0)
			return null;
		else
			return keys[i-1];
	}

	public Iterable<Key> keys(Key lo, Key hi)
	{
		Queue<Key> q = new Queue<Key>();
		for (int i = rank(lo); i < rank(hi); i++)
			q.enqueue(keys[i]);
		if (get(hi) != null)
			q.enqueue(keys[rank(hi)]);
		return q;
	}

	public Iterable<Key> keys()
	{
		Queue<Key> q = new Queue<Key>();
		for (int i = 0; i < N; i++)
			q.enqueue(keys[i]);
		return q;
	}

	public static void main(String[] args)
	{
		FullBinarySearchST<String, Integer> st = new FullBinarySearchST<String, Integer>(10);
		st.put("r", 1);
		st.put("g", 3);
		st.put("f", 5);
		st.put("d", 7);
		st.put("e", 9);
		StdOut.println("The input sequence is: r, g, f, d, e");
		StdOut.println("And the ST sequence is: ");
		for (String s : st.keys())
			StdOut.println(s + " " + st.get(s));
		StdOut.println();
		StdOut.println("Delete d");
		st.delete("d");
		for (String s : st.keys())
			StdOut.println(s + " " + st.get(s));
		StdOut.println();
		StdOut.println("For key 'h', the floor key is: " + st.floor("h"));
	}
}
```

### 3.1.35 Performance validation I.
> Run doubling tests that use the first N words of Tale of Two Cities for various values of N to test the hypothesis that the running time of FrequencyCounter is quadratic when it uses SequentialSearchST for its symbol table.

I read words from 200 to 102400, and for each words number, I loop 10 times to get an average running time of the *SequentialSearchST*:
```java
import edu.princeton.cs.algs4.SequentialSearchST;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.Stopwatch;
import edu.princeton.cs.algs4.In;

public class NFrequencyCounter
{
	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		String filename = args[1];

		double[] t = new double[10];
		StdOut.println("ReadNWords times[ratio]");
		for (int i = 0; i < 10; i++)
		{
			double time = 0.0;
			for (int x = 0; x < 10; x++)
			{
				In tale = new In(filename);
				SequentialSearchST<String, Integer> st = new SequentialSearchST<String, Integer>();
				for (int j = 0; j < N; j++)
				{
					String s = tale.readString();
					Stopwatch timer = new Stopwatch();
					if (!st.contains(s))
						st.put(s, 1);
					else
						st.put(s, st.get(s)+1);
					time += timer.elapsedTime();
				}
				tale.close();
			}
			t[i] = time/10;
			if (i == 0)
			{
				StdOut.printf("%10d %5.2f[-----]\n", N, time);
				N *= 2;
				continue;
			}
			double ratio = t[i] / t[i-1];
			StdOut.printf("%10d %5.2f[%5.2f]\n", N, t[i], ratio);
			N *= 2;
		}
	}
}
```
And here is the result, which proves that it is quadratic.
```
$ java NFrequencyCounter 200 tale.txt 
ReadNWords times[ratio]
       200  0.00[-----]
       400  0.00[ 2.50]
       800  0.00[ 2.80]
      1600  0.01[ 4.57]
      3200  0.02[ 3.55]
      6400  0.10[ 4.31]
     12800  0.40[ 4.10]
     25600  1.58[ 3.93]
     51200  4.92[ 3.13]
    102400 14.24[ 2.89]
```
