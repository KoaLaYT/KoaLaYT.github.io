# Chapter 2 / Section 1 : Elementary Sorts

## Main Content

The conventions for implementing array sorts :

```java
public class Sort
{
	public static void sort(Comparable[] a)
	{}
	
	public static boolean less(Comparable v, Comparable w)
	{ return v.compareTo(w) < 0; }
	
	public static void exch(Comparable[] a, int i, int j)
	{
		Comparable tmp = a[i];
		a[i] = a[j];
		a[j] = tmp;
	}
	
	public static void show(Comparable[] a)
	{
		for (int i = 0; i < a.length; i++)
			StdOut.print(a[i] + " ");
		StdOut.println();
	}
	
	public static boolean isSorted(Comparable[] a)
	{
		for (int i = 1; i < a.length; i++)
			if (less(a[i], a[i-1]))
				return false;
		return true;
	}
	
	public static void main(String[] args)
	{
		String[] a = In.readStrings();
		sort(a);
		assert isSorted(a);
		show(a);
	}
}
```

### 1. Selection Sort

Its principle is as follow :

1. find the smallest item in the array and exchange it with the first entry
2. find the next smallest item and exchange it with the second entry
3. continue until the entire array is sorted

```java
public class Selection
{
	public static void sort(Comparable[] a)
	{
		int N = a.length;
		for (int i = 0; i < N; i++)
		{
			int min = i;
			for (int j = i + 1; j < N; j++)
				if (less(a[j], a[min]))
					min = j;
			exch(a, min, i);
		}
	}
}
```

Here is the trace of selection sort : (image from text book)

![SelectionSortTrace](../img/SelectionSortTrace.png)

**Selection sort analysis** :

> to sort an array of length N, it uses ~N^2^/2 compares and N exchanges

It has two signature properties :

1. Running time is insensitive to input

1. Data movement is minimal	

### 2. Insertion Sort

The method is like how people sort bridge hands :

- insert the current item by moving larger items one position to the right

```java
public class Insertion
{
	public static void sort(Comparable[] a)
	{
		int N = a.length;
		for (int i = 1; i < N; i++)
		{
			for (int j = i; j > 0 && less(a[j], a[j-1]); j--)
				exch(a, j, j-1);
		}
	}
}
```

Here is the trace of insertion sort : (image from text book)

![InsertionSortTrace](../img/InsertionSortTrace.png)

**Insertion sort analysis** :

> to sort an array of length N, it takes
> ~N^2^/4 compares and ~N^2^/4 exchanges in average cases
> ~N^2^/2compares and ~N^2^/2 exchanges in the worst case
> N-1 compares and no exchanges in the best case

Insertion sort works well for certain types of nonrandom arrays that often arise in practice :

- An array where each entry is not far from its final postion
- A small array appended to a larger sorted array
- An array with only a few entries that are not in place

### 3. Shell Sort

It is a simple extension of insertion sort that gains speed by allowing exchanges of array entries that are far apart, to produce partially sorted array that can be eventually sorted efficiently by insertion sort.
Modifing the decrement by h instead of 1, we can get an insertion-sort-like implementation :

```java
public class Shell
{
	public static void sort(Comparable[] a)
	{
		int N = a.length;
		int h = 1;
		while (h < N/3) h = 3*h + 1;
		
		while (h >= 1)
		{
			for (int i = h; i < N; i++)
			{
				for (int j = i; j >= h && less(a[j], a[j-h]); j -= h)
					exch(a, j, j-h);
			}
			h = h / 3;
		}
	}
}
```

Here is a visual trace of shell sort : (image from text book)

![ShellSortTrace](../img/ShellSortTrace.png)

To decide which increment sequence to use is a difficult question to answer. Using the sequence of 1, 4, 13, ..., 3N + 1 will performs just as well as more sophisticated ones.

**Shell sort analysis** :

> in worst case, number of compares of our implementation is proportional to N^3/2^. 
> No mathematical results are available about the average-case number of compares for shell sort for randomly ordered input.

## Exercise

### 2.1.15 Expensive exchange.
> A clerk at a shipping company is charged with the task of rearranging a number of large crates in order of the time they are to be shipped out. Thus, the cost of compares is very low (just look at the labels) relative to the cost of exchanges (move the crates). The warehouse is nearly full—there is extra space sufficient to hold any one of the crates, but not two. What sorting method should the clerk use?

Apparently, he should use the selection sort, cause its cost least numbers of exchanges.

### 2.1.18 Visual trace.
> Modify your solution to the previous exercise to make Insertion and Selection produce visual traces such as those depicted in this section. Hint : Judicious use of setYscale() makes this problem easy. Extra credit : Add the code necessary to produce red and gray color accents such as those in our figures.

My Java knowledge is very limited, and I don't know why the code on the book doesn't work on my computer, so I spend some time to figure out how to implement `Comparable` in my code. And here is my successful code: 
```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdDraw;

public class VisualTraceOfSelectionSort
{
	public static <T extends Comparable<T>> void sort(T[] a)
	{
		int N = a.length;
		for (int i = 0; i < N; i++)
		{
			int min = i;
			for (int j = i + 1; j < N; j++)
			{
				if (less(a[j], a[min]))
					min = j;
			}
			show(a, min, i);
			exch(a, i, min);
		}
	}

	private static <T extends Comparable<T>> boolean less(T v, T w)
	{
		return v.compareTo(w) < 0;
	}

	private static <T extends Comparable<T>> void exch(T[] a, int i, int j)
	{
		T t = a[i];
		a[i] = a[j];
		a[j] = t;
	}

	private static <T extends Comparable<T>> void show(T[] a, int min, int stepNum)
	{
		int N = a.length;
		if (stepNum == 0)
		{
			StdDraw.setCanvasSize(512, 980);
			StdDraw.setYscale(1, 1.5 * (N+1));
			StdDraw.setXscale(-1.0, N + 1.0);
		}
		for (int i = 0; i < N; i++)
		{
			if (i == min)
				StdDraw.setPenColor(StdDraw.PRINCETON_ORANGE);
			else if (i < stepNum)
				StdDraw.setPenColor(StdDraw.GRAY);
			else
				StdDraw.setPenColor(StdDraw.BLACK);
			double hi = (Double) a[i];
			StdDraw.filledRectangle(i+0.5, 1.5*(N-stepNum)+hi/2, 0.4, hi/2);
		}
	}

	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		Double[] a = new Double[N];
		for (int i = 0; i < N; i++)
			a[i] = StdRandom.uniform();
		sort(a);
	}
}
```
And for the **Insertion sort** and **Shell sort**, code is very similar, so I'll just omit them. Here is the picture generated from my code:

This is **Selection sort** 

![](../img/VisualTraceOfSelectionSort.jpg)

And this is **Insertion sort**

![](../img/VisualTraceOfInsertionSort.jpg)

And follow is the **Shell sort**

![](../img/VisualTraceOfShellSort.jpg)

### 2.1.24 Insertion sort with sentinel.
> Develop an implementation of insertion sort that eliminates the j>0 test in the inner loop by first putting the smallest item into position. Use SortCompare to evaluate the effectiveness of doing so. Note : It is often possible to avoid an index-out-of-bounds test in this way—the element that enables the test to be eliminated is known as a sentinel.

The code is easy, its `sort` function is as follow:
```java
public static <T extends Comparable<T>> void sort(T[] a)
{
	int N = a.length;
	int min = 0;
	for (int i = 1; i < N; i++)
	{
		if (less(a[i], a[min]))	
			min = i;
	}
	exch(a, min, 0);
	for (int i = 1; i < N; i++)
	{
		for (int j = i; less(a[j], a[j-1]); j--)
			exch(a, j, j-1);
	}
}
```
And add this sort function into the *SortCompare*, we can have this result:
```
$ java SortCompare InsertionSortWithSentinel Insertion 10000 100
For 10000 random Doubles
	InsertionSortWithSentinel is 1.3 times faster than Insertion
```
Set a *sentinel* need at most N-1 times comparation and 1 time exchange, while index-out-of-bounds test will happen at least N times. Avoid this cound save us some precious time.

### 2.1.25 Insertion sort without exchanges.
> Develop an implementation of insertion sort that moves larger elements to the right one position with one array access per entry, rather than using exch() . Use SortCompare to evaluate the effectiveness of doing so.

The `sort` funciton is like this:
```java
public static <T extends Comparable<T>> void sort(T[] a)
{
	int N = a.length;
	for (int i = 1; i < N; i++)
	{
		T min = a[i];
		int j;
		for (j = i; j > 0 && less(min, a[j-1]); j--)
			a[j] = a[j-1];
		a[j] = min;
	}
}
```
And comparation result is as follow:
```
$ java SortCompare InsertionSortWithoutExchanges Insertion 10000 100
For 10000 random Doubles:
	InsertionSortWithoutExchanges is 2.1 times faster than Insertion
Details:
	InsertionSortWithoutExchanges takes 4.45 seconds for 100 times' loops
	Insertion                     takes 9.53 seconds for 100 times' loops
```

### 2.1.26 Primitive types.
> Develop a version of insertion sort that sorts arrays of int values and compare its performance with the implementation given in the text (which sorts Integer values and implicitly uses autoboxing and auto-unboxing to convert).

The result is unexpectedly:
```
$ java SortCompareIntWithInteger 10000 100
For 10000 random Integers:
	Using primitive types is 2.9 times faster than using auto-boxing
Details:
	Primitive types takes 3.40 seconds for 100 times' loops
	Auto-boxing     takes 9.78 seconds for 100 times' loops
```

### 2.1.27 Shellsort is subquadratic.
> Use SortCompare to compare shellsort with insertion sort and selection sort on your computer. Use array sizes that are increasing powers of 2, starting at 128.

This is the modified `main` function of *SortCompare* to meet the requirement of this exercise:
```java
public static void main(String[] args)
{
	String alg1 = args[0];
	String alg2 = args[1];
	String alg3 = args[2];
	int N = Integer.parseInt(args[3]);
	int T = Integer.parseInt(args[4]);
	double ot1 = timeRandomInput(alg1, N, T);
	double ot2 = timeRandomInput(alg2, N, T);
	double ot3 = timeRandomInput(alg3, N, T);
	StdOut.printf("%15s %15s[ratio] %15s[ratio] %15s[ratio]\n", "size", alg1, alg2, alg3);
	for (int i = 0; i < 10; i++)
	{
		N *= 2;
		double t1 = timeRandomInput(alg1, N, T);
		double t2 = timeRandomInput(alg2, N, T);
		double t3 = timeRandomInput(alg3, N, T);
		StdOut.printf("%15d %15.1f[%5.2f] %15.1f[%5.2f] %15.1f[%5.2f]\n", N, t1, t1/ot1, t2, t2/ot2, t3, t3/ot3);
		ot1 = t1;
		ot2 = t2;
		ot3 = t3;
	}
}
```
And we get this result:
```
$ java SortCompare Selection Insertion Shell 64 10
For 10 times loop for each array size:
           size       Selection[ratio]       Insertion[ratio]           Shell[ratio]
            128             0.0[ 1.00]             0.0[ 3.00]             0.0[ 1.00]
            256             0.0[ 2.00]             0.0[ 1.33]             0.0[ 1.00]
            512             0.0[ 4.25]             0.0[ 0.75]             0.0[ 2.00]
           1024             0.0[ 0.47]             0.0[ 3.33]             0.0[ 1.50]
           2048             0.0[ 3.75]             0.0[ 4.30]             0.0[ 0.33]
           4096             0.1[ 3.90]             0.2[ 3.95]             0.0[ 6.00]
           8192             0.5[ 3.93]             0.7[ 4.06]             0.0[ 1.83]
          16384             2.2[ 4.67]             2.9[ 4.16]             0.0[ 2.73]
          32768             9.4[ 4.35]            12.0[ 4.19]             0.1[ 2.50]
          65536            39.5[ 4.22]            49.7[ 4.13]             0.2[ 2.24]
```
The *ratio* says everything.

### 2.1.30 Geometric increments.
> Run experiments to determine a value of t that leads to the lowest running time of shell sort for random arrays for the increment sequence 1, ⎣t⎦, ⎣t^2 ⎦, ⎣t^3 ⎦, ⎣t^4 ⎦, . . . for N = 10^6 . Give the values of t and the increment sequences for
the best three values that you find.

The first **t** I find that will be faster than the sequences on the text book is `2.5`:
```
$ java ShellSortIncrement 1000000 2.5 10
For 10 loops of 1000000 Doubles:
	With a t = [ 2.50],   Shell sort takes   7.3 seconds
	While a 1, 4, 13, ... Shell sort takes   8.2 seconds
```
And with a `t = 2.1`, the result is even better:
```
$ java ShellSortIncrement 1000000 2.1 10
For 10 loops of 1000000 Doubles:
	With a t = [ 2.10],   Shell sort takes   6.5 seconds
	While a 1, 4, 13, ... Shell sort takes   8.6 seconds
```
And `1.9` is the best result I can find:
```
$ java ShellSortIncrement 1000000 1.9 10
For 10 loops of 1000000 Doubles:
	With a t = [ 1.90],   Shell sort takes   6.4 seconds
	While a 1, 4, 13, ... Shell sort takes   8.1 seconds
```

### 2.1.34 Corner cases.
> Write a client that runs sort() on difficult or pathological cases that might turn up in practical applications. Examples include arrays that are already in order, arrays in reverse order, arrays where all keys are the same, arrays consisting of only two distinct values, and arrays of size 0 or 1.

Here is my test result:
```
$ java CornerCasesTest 10000 100
For 10000 Integers in these corner cases, 100 loops were calculcated:
                            Selection    Insertion     Shell
            Ordered Array     5.11(s)      0.00(s)   0.01(s)
    Reverse ordered Array     6.02(s)      0.20(s)   0.01(s)
            One key Array    20.38(s)      0.00(s)   0.02(s)
            Two key Array    20.35(s)      0.05(s)   0.02(s)
             Size 1 Array     0.00(s)      0.00(s)   0.00(s)
```
