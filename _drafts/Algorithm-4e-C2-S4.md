# Chapter 2 / Section 4 : Priority Queues

## Main Content

In this section, a priority-queue implementation based on the *binary heap* data structure is introduced. And then a sorting algorithm known as *heapsort* can be implemented on the base of a priority queue.

The API of a generic priority queue : (image from text book)

![PQ API](../img/PQAPI.png)

### 1. Elementary implementation

- Array representation (unordered)
- Array representation (ordered)
- Linked-list representations

All these implementations will take *linear* time in the worst case of calling the `insert()` or `delMax()` function, as shown in the below table. (image from text book)

![PQRunningTime](../img/PQRunningTime.png)

### 2. Heap definitions

- A binary tree is *heap-ordered* if the key in each node is larger than or equal to the keys in that node's two children (if any).
- A binary heap is a collection of keys arranged in a complete heap-ordered binary tree, represented in level order in an array (not using the first entry).

This is a representation of a heap : (image from text book)

![Heap Representation](../img/HeapRepresentation.png)

### 3. Algorithm on heaps

This is the full implementation of priority queue based on heap :

```java
public class MaxPQ<key extends Comparable<Key>>
{
	private Key[] pq;
	private int N = 0;
	
	public MaxPQ(int maxN)
    { pq = (Key[]) new Comparable[maxN]; }
    
    public void insert(Key v)
    {
    	pq[++N] = v;
    	swim(N);
    }
    
    public Key max()
    { return pq[1]; }
    
    public Key delMax()
    {
    	Key max = pq[1];
    	exch(1, N--);
    	pq[N+1] = null;
    	sink(1);
    	return max;
    }
    
    public boolean isEmpty()
    { return N == 0; }
    
    public int size()
    { return N; }
    
    private boolean less(int i, int j)
    { return pq[i].compareTo(pq[j]) < 0; }
    
    private void exch(int i, int j)
    {
    	Key tmp = pq[i];
    	pq[i] = pq[j];
    	pq[j] = tmp;
    }
    
    private void swim(int k)
    {
    	while (k > 1 && less(k/2, k))
        {
        	exch(k/2, k);
        	k = k/2;
        }
    }
    
    private void sink(int k)
    {
    	while (2*k <= N)
        {
        	int j = 2*k;
        	if (j < N && less(j, j+1))
        		j = j+1;
        	if (!less(k, j)) break;
        	exch(k, j);
        	k = j;
        }
    }
}
```

There is some enlightening images from the text book that can help us to understand its algorithm :

![swim and sink](../img/swimAndsink.png)

![Heap Operations](../img/HeapOperations.png)

**Priority queue analysis** :

> In an N-key priority queue, the heap algorithm requires no more than 1+lgN compares for `insert()` and no more than 2lgN compares for `delMax()`

### 4. Heapsort

Heapsort breaks into two phases :

1. heap construction, where we recognize the original array into a heap
2. sortdown, where we pull the items out of the heap in decreasing order to build the sorted result

```java
public static void sort(Comparable[] a)
{
    int N = a.length;
    for (int k = N/2; k >= 1; k--)
        sink(a, k, N);
    while (N > 1)
    {
        exch(a, 1, N--);
        sink(a, 1, N);
    }
}
```

The heapsort trace is as follow : (image from text book)

![HeapTrace](../img/HeapTrace.png)

![Heapsort](../img/Heapsort.png)

**Heapsort analysis** :

> To sort N items, it uses fewer than 2NlgN + 2N compares and half that many exchanges

## Exercise
### 2.4.22 Array resizing.
> Add array resizing to MaxPQ , and prove bounds like those of Proposition Q for array accesses, in an amortized sense.

Just exactly the same with previous chapter: 
```java
import edu.princeton.cs.algs4.StdOut;

public class ResizingMaxPQ<Key extends Comparable<Key>>
{
	private Key[] pq;
	private int N = 0;

	public ResizingMaxPQ(int maxN)
	{
		pq = (Key[]) new Comparable[maxN+1];
	}

	public ResizingMaxPQ()
	{
		pq = (Key[]) new Comparable[2];
	}

	private void resize(int max)
	{
		Key[] tmp = (Key[]) new Comparable[max];
		for (int i = 1; i < N+1; i++)
			tmp[i] = pq[i];
		pq = tmp;
	}

	public boolean isEmpty()
	{
		return N == 0;
	}

	public int size()
	{
		return N;
	}

	public void insert(Key v)
	{
		if (N+1 == pq.length)
			resize(pq.length*2);
		pq[++N] = v;
		swim(N);
	}

	public Key delMax()
	{
		Key max = pq[1];
		exch(1, N);
		pq[N--] = null;
		sink(1);
		if (N+1 == pq.length/4)
			resize(pq.length/2);
		return max;
	}

	private boolean less(int i, int j)
	{
		return pq[i].compareTo(pq[j]) < 0;
	}

	private void exch(int i, int j)
	{
		Key t = pq[i];
		pq[i] = pq[j];
		pq[j] = t;
	}

	private void swim(int k)
	{
		while (k > 1 && less(k/2, k))
		{
			exch(k/2, k);
			k = k/2;
		}
	}

	private void sink(int k)
	{
		while (2*k <= N)
		{
			int i = 2 * k;
			if (i < N && less(i, i+1))
				i++;
			if (less(k, i))
			{
				exch(k, i);
				k = i;
			}
			else
				break;
		}
	}

	public static void main(String[] args)
	{
		ResizingMaxPQ<Integer> rpq = new ResizingMaxPQ<Integer>();
		rpq.insert(1);
		rpq.insert(3);
		rpq.insert(5);
		rpq.insert(2);
		StdOut.println(rpq.delMax() + " [expect 5]");
		StdOut.println(rpq.delMax() + " [expect 3]");
		StdOut.println(rpq.delMax() + " [expect 2]");
	}
}
```

### 2.4.25 Computational number theory.
> Write a program CubeSum.java that prints out all integers of the form a 3 + b 3 where a and b are integers between 0 and N in sorted order, without using excessive space. That is, instead of computing an array of the N 2 sums and sorting them, build a minimum-oriented priority queue, initially containing (0 3 , 0, 0), (1 3 , 1, 0), (2 3 , 2, 0), . . . , (N 3 , N, 0). Then, while the priority queue is nonempty, remove the smallest item(i 3 + j 3 , i, j), print it, and then, if j < N, insert the item (i 3 + (j+1) 3 , i, j+1). Use this program to find all distinct mintegers a, b, c, and d between 0 and 10 6 such that a 3 + b 3 = c 3 + d 3 .

Here is the code and result:
```java
import edu.princeton.cs.algs4.MinPQ;
import edu.princeton.cs.algs4.StdOut;

public class CubeSum
{
	private class Sum implements Comparable<Sum>
	{
		int sum;
		int i;
		int j;

		public Sum(int a, int b)
		{
			sum = a*a*a + b*b*b;
			i = a;
			j = b;
		}

		public int compareTo(Sum that)
		{
			return this.sum - that.sum;
		}
	}

	private void print(int N)
	{
		MinPQ<Sum> q = new MinPQ<Sum>();
		Sum s = new Sum(0, 0);
		for (int i = 1; s.sum < N; i++)
		{
			q.insert(s);
			s = new Sum(i, i);
		}

		Sum min1 = q.delMin();
		Sum t1 = new Sum(min1.i, min1.j+1);
		if (t1.sum < N)
			q.insert(t1);

		while (!q.isEmpty())
		{
			Sum min2 = q.delMin();
			Sum t2 = new Sum(min2.i, min2.j+1);
			if (t2.sum < N)
				q.insert(t2);
			
			if (min2.sum == min1.sum)
				StdOut.printf("%6d = (%3d, %3d) = (%3d, %3d)\n", min1.sum, min1.i, min1.j, min2.i, min2.j);
			
			min1 = min2;
		}
	}

	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		CubeSum c = new CubeSum();
		c.print(N);
	}
}
```
```
$ java CubeSum 1000000
  1729 = (  1,  12) = (  9,  10)
  4104 = (  9,  15) = (  2,  16)
 13832 = (  2,  24) = ( 18,  20)
 20683 = ( 19,  24) = ( 10,  27)
 32832 = ( 18,  30) = (  4,  32)
 39312 = ( 15,  33) = (  2,  34)
 40033 = (  9,  34) = ( 16,  33)
 46683 = ( 27,  30) = (  3,  36)
 64232 = ( 17,  39) = ( 26,  36)
 65728 = ( 31,  33) = ( 12,  40)
110656 = ( 36,  40) = (  4,  48)
110808 = (  6,  48) = ( 27,  45)
134379 = ( 38,  43) = ( 12,  51)
149389 = (  8,  53) = ( 29,  50)
165464 = ( 20,  54) = ( 38,  48)
171288 = ( 24,  54) = ( 17,  55)
195841 = ( 22,  57) = (  9,  58)
216027 = ( 22,  59) = (  3,  60)
216125 = (  5,  60) = ( 45,  50)
262656 = (  8,  64) = ( 36,  60)
314496 = (  4,  68) = ( 30,  66)
320264 = ( 32,  66) = ( 18,  68)
327763 = ( 51,  58) = ( 30,  67)
373464 = ( 54,  60) = (  6,  72)
402597 = ( 42,  69) = ( 56,  61)
439101 = (  5,  76) = ( 48,  69)
443889 = ( 38,  73) = ( 17,  76)
513000 = ( 10,  80) = ( 45,  75)
513856 = ( 34,  78) = ( 52,  72)
515375 = ( 15,  80) = ( 54,  71)
525824 = ( 24,  80) = ( 62,  66)
558441 = ( 57,  72) = ( 30,  81)
593047 = ( 63,  70) = (  7,  84)
684019 = ( 51,  82) = ( 64,  75)
704977 = ( 41,  86) = (  2,  89)
805688 = ( 11,  93) = ( 30,  92)
842751 = ( 63,  84) = ( 23,  94)
885248 = (  8,  96) = ( 72,  80)
886464 = ( 54,  90) = ( 12,  96)
920673 = ( 33,  96) = ( 20,  97)
955016 = ( 24,  98) = ( 63,  89)
984067 = ( 59,  92) = ( 35,  98)
994688 = ( 60,  92) = ( 29,  99)
```
