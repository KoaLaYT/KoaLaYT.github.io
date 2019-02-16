# Chapter 2 / Section 3 : Quicksort

## Main Content

Quicksort is probably used more widely than any other sorting algorithm because of  :

1. not difficult to implement
2. works well for a variety of different kinds of input data
3. is substantially faster than any other method in typical applications

It has two desirable features :

1. it is in-place (uses only a small auxiliary stack)
2. it requires time proportional to NlogN on the average

### 1. Basic algorithm

It works by *partitioning* an array into two subarrays, then sorting the subarrays independently.

Here is the overview of quicksort : (image from text book)

![Quicksort Overview](../img/QuicksortOverview.png)

```java
public class Quick
{
    public static void sort(Comparable[] a)
    {
        int N = a.length;
        StdRandom.shuffle(a);
        sort(a, 0, N-1);
    }
    
    private static void sort(Comparable[] a, int lo, int hi)
    {
        if (hi <= lo)
            return;
        
        int j = partition(a, lo, hi);
        sort(a, lo, j-1);
        sort(a, j+1, hi);
    }
    
    private static int partition(Comparable[] a, int lo, int hi)
    {
        int i = lo, j = hi+1;
        Comparable v = a[lo];
        while (true)
        {
            while (less(a[++i], v))
                if (i == hi) break;
            while (less(v, a[--j]))
               	if (j == lo) break;
            if (i >= j) break;
            exch(a, i, j);
        }
        exch(a, lo, j);
        return j;
    }
}
```

Here is the partitioning overview and its trace : (image from text book)

![Partitioning Overview](../img/PartitionOverview.png)

![Partitioning Trace](../img/PartitionTrace.png)

**Quicksort analysis** :

> - To sort an array of length N with distinct keys, it uses ~2NlnN compares and 1/6 that many exchanges
>
> - In worst case, it will take ~N^2^/2 compares but random shuffling protects against this case

### 2. Algorithm improvements

Experiments are needed to determine the effectiveness of the following improvements and to determine the best choice of parameters for the implementation. About 20 to 30 percent improvements are available.

1. Cutoff to insertion sort
2. Median-of-three partitioning
3. Entropy-optimal sorting

One straightforward idea is to partition the array into three parts, one each for items with keys smaller than, equals to, and larger than the partitioning item's key. Dijkstra's solution shows as below and it's overviews is as follow : (image from text book)

![3-way partitioning overview](../img/ThreeWayPartitionOverview.png)

```java
public class Quick3way
{
    private static void sort(Comparable[] a, int lo, int hi)
    {
        if (hi <= lo) return;
        
        int lt = lo, gt = hi;
        int i = lt+1;
        Comparable v = a[lo];
        while (i <= gt)
        {
            int cmp = a[i].compareTo(v);
            if (cmp < 0) exch(a, i++, lt++);
            else if (cmp > 0) exch(a, i, gt--);
            else i++;
        }
        sort(a, lo, lt-1);
        sort(a, gt+1, hi);
    }
}
```

The partitioning trace is shown as follow : (image from text book)

![3-way partitioning trace](../img/ThreeWayPartitionTrace.png)

And the visual trace is also very enlightening : (image from text book)

![Visual Trace of 3-way partitioning](../img/VisualTraceThreeWayPartition.png)

**Quicksort with 3-way partitioning analysis** :

> To sort N items, it uses ~(2ln2)NH compares, where H is the Shannon entropy

In practice, it can reduce the time of sort from *linearithmic* to *linear* for arrays with large numbers of duplicate keys.

## Exercise
### 2.3.17 Sentinels.
> Modify the code in Algorithm 2.5 to remove both bounds checks in the inner while loops. The test against the left end of the subarray is redundant since the partitioning item acts as a sentinel ( v is never less than a[lo] ). To enable removal of the other test, put an item whose key is the largest in the whole array into a[length-1] just after the shuffle. This item will never move (except possibly to be swapped with an item having the same key) and will serve as a sentinel in all subarrays involving the end of the array. Note : When sorting interior subarrays, the leftmost entry in the subarray to the right serves as a sentinel for the right end of the subarray.

Follow the instruction of the book, and we can get: 
```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdOut;

public class SentinelsQuick
{
	public static <T extends Comparable<T>> void sort(T[] a)
	{
		int N = a.length;
		StdRandom.shuffle(a);

		int max = 0;
		for (int i = 1; i < N; i++)
		{
			if (less(a[max], a[i]))
				max = i;
		}
		exch(a, max, N-1);

		sort(a, 0, N - 1);
	}

	private static <T extends Comparable<T>> void sort(T[] a, int lo, int hi)
	{
		if (hi <= lo)
			return;
		int j = partition(a, lo, hi);
		sort(a, lo, j-1);
		sort(a, j+1, hi);
	}

	private static <T extends Comparable<T>> int partition(T[] a, int lo, int hi)
	{
		int i = lo;
		int j = hi + 1;
		T v = a[lo];

		while (true)
		{
			while (less(a[++i], v))
				continue;
			while (less(v, a[--j]))
				continue;
			if (i >= j)
				break;
			exch(a, i, j);
		}
		exch(a, lo, j);
		return j;
	}

	private static <T extends Comparable<T>> boolean less(T v, T w)
	{
		return v.compareTo(w) < 0;
	}

	private static <T extends Comparable<T>> void exch(T[] a, int i, int j)
	{
		T tmp = a[i];
		a[i] = a[j];
		a[j] = tmp;
	}

	private static <T extends Comparable<T>> void show(T[] a)
	{
		int N = a.length;
		for (int i = 0; i < N; i++)
			StdOut.print(a[i] + " ");
		StdOut.println();
	}

	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		Integer[] a = new Integer[N];
		for (int i = 0; i < N; i++)
			a[i] = StdRandom.uniform(N);
		show(a);
		sort(a);
		show(a);
	}
}
```

### 2.3.18 Median-of-3 partitioning.
> Add median-of-3 partitioning to quicksort, as described in the text (see page 296). Run doubling tests to determine the effectiveness of the change.

Here is the core code and the doubling test will be performed later with other variants of *Quicksort*.
```java
private static <T extends Comparable<T>> void sort(T[] a, int lo, int hi)
{
	if (hi <= lo + 5)
	{
	    insertionSort(a, lo, hi);
		return;
	}

	int N = hi - lo + 1;
	int first = lo + StdRandom.uniform(N);
	int second = lo + StdRandom.uniform(N);
	int third = lo + StdRandom.uniform(N);
	int mid = findMid(a, first, second, third);
	exch(a, mid, lo);

	int j = partition(a, lo, hi);
	sort(a, lo, j-1);
	sort(a, j+1, hi);
}

private static <T extends Comparable<T>> int findMid(T[] a, int x, int y, int z)
{
	if (less(a[y], a[x]))
	{
		int t = x;
		x = y;
		y = t;
	}
	if (less(a[y], a[z]))
		return y;
	else if (less(a[z], a[x]))
		return x;
	else
		return z;
}
```

### 2.3.19 Median-of-5 partitioning.
> Implement a quicksort based on partitioning on the median of a random sample of five items from the subarray. Put the items of the sample at the appropriate ends of the array so that only the median participates in partitioning. Run doubling tests to determine the effectiveness of the change, in comparison both to the standard algorithm and to median-of-3 partitioning (see the previous exercise). Extra credit : Devise a median-of-5 algorithm that uses fewer than seven compares on any input.

So here is my core code for this finding median-of-5, it will take at least 4 compares and at most 6 compares for any input:
```java
private static <T extends Comparable<T>> int findMid(T[] A, int a, int b, int c, int d, int e)
{
	// 1st compare
	if (less(A[b], A[a]))
	{
		int t = a;
		a = b;
		b = t;
	}
	// 2nd compare
	if (less(A[b], A[c]))
	{
		// 3rd compare
		if (less(A[d], A[b]))
		{
			// 4th compare
			if (less(A[e], A[b]))
				return findMax(A, a, d, e); // need 2 compares, total 6 compares
			else
				return b; // total 4 compares
		}
		else
		{
			// 4th compare
			if (less(A[e], A[b]))
				return b; // total 4 compares
			else
				return findMin(A, c, d, e); // need 2 compares, total 6 compares
		}
	}
	else
	{
		// 3rd compare
		if (less(A[d], A[b]))
		{
			// need 2 compares, 5th compare
			int max = findMax(A, a, c, d);
			// 6th compare
			if (less(A[max], A[e]))
				return max; // total 6 compares
			else
				return e; // total 6 compares
		}
		else
		{
			// 4th compare
			if (less(A[e], A[b]))
				return findMax(A, a, c, e); // need 2 compares, total 6 compares
			else
				return b; // total 4 compares
		}
	}

}

private static <T extends Comparable<T>> int findMax(T[] a, int x, int y, int z)
{
	int max = x;
	if (less(a[max], a[y]))
		max = y;
	if (less(a[max], a[z]))
		max = z;
	return max;
}

private static <T extends Comparable<T>> int findMin(T[] a, int x, int y, int z)
{
	int min = x;
	if (less(a[y], a[min]))
		min = y;
	if (less(a[z], a[min]))
		min = z;
	return min;
}
```

### 2.3.20 Nonrecursive quicksort.
> Implement a nonrecursive version of quicksort based on a main loop where a subarray is popped from a stack to be partitioned, and the resulting subarrays are pushed onto the stack. Note : Push the larger of the subarrays onto the stack first, which guarantees that the stack will have at most lg N entries.

I didn't push the whole array into the stack, instead, I push the subarrays' left and right boundry number into the stack. Here is the core `sort` function:
```java
private static <T extends Comparable<T>> void sort(T[] a, int lo, int hi)
{
	Stack<Integer> s = new Stack<Integer>();
	s.push(lo);
	s.push(hi);
	while (!s.isEmpty())
	{
		int ri = s.pop();
		int le = s.pop();
		while (le < ri)
		{
			int j = partition(a, le, ri);
			s.push(j+1);
			s.push(ri);
			le = le;
			ri = j - 1;
		}
	}
}
```

### 2.3.22 Fast 3-way partitioning.
> ( J. Bentley and D. McIlroy) Implement an entropyoptimal sort based on keeping item's with equal keys at both the left and right ends of the subarray. Maintain indices p and q such that a[lo..p-1] and a[q+1..hi] are all equal to a[lo] , an index i such that a[p..i-1] are all less than a[lo] , and an index j such that a[j+1..q] are all greater than a[lo] . Add to the inner partitioning loop code to swap a[i] with a[p] (and increment p ) if it is equal to v and to swap a[j] with a[q] (and decrement q ) if it is equal to v before the usual comparisons of a[i] and a[j] with v . After the partitioning loop has terminated, add code to swap the items with equal keys into position. Note : This code complements the code given in the text, in the sense that it does extra swaps for keys equal to the partitioning item’s key, while the code in the text does extra swaps for keys that are not equal to the partitioning item’s key.

According to the book, we can have the following code of function `sort`:
```java
private static <T extends Comparable<T>> void sort(T[] a, int lo, int hi)
{
	if (hi <= lo)
		return;
	// start partition
	int p = lo + 1;
	int q = hi;
	int i = lo + 1;
	int j = hi;
	T v = a[lo];
	while (i <= j)
	{
		int cmp = a[i].compareTo(v);
		if (cmp > 0)
			exch(a, i, j--);
		else if (cmp == 0)
			exch(a, i++, p++);
		else
			i++;

		if (i > j)
			break;

		cmp = a[j].compareTo(v);
		if (cmp > 0)
			j--;
		else if (cmp == 0)
			exch(a, j--, q--);
		else
			exch(a, i++, j);
	}
	// all elements equal to v is sorted at left and right ends
	// now move them to the middle
	while (p > lo)
		exch(a, --p, j--);
	while (q < hi)
		exch(a, ++q, i++);

	sort(a, lo, j);
	sort(a, i, hi);
}
```

### 2.3.23 Java system sort.
> Add to your implementation from Exercise 2.3.22 code to use the Tukey ninther to compute the partitioning item—choose three sets of three items, take the median of each, then use the median of the three medians as the partitioning item. Also, add a cutoff to insertion sort for small subarrays.

With the function used in exercise 2.3.18: `findMid(T[]a, int x, int y, int z)`, we can get the code: 
```java
private static <T extends Comparable<T>> void sort(T[] a, int lo, int hi)
{
	if (hi <= lo + 8)
	{
		insertionSort(a, lo, hi);
		return;
	}
	// select partition item
	int mid1, mid2, mid3;
	mid1 = findMid(a, 0, 1, 2);
	mid2 = findMid(a, 3, 4, 5);
	mid3 = findMid(a, 6, 7, 8);
	int mid = findMid(a, mid1, mid2, mid3);
	exch(a, mid, lo);
	// start partition
	// same with last exercise
    ...
```

### 2.3.24 Samplesort.
> ( W. Frazer and A. McKellar) Implement a quicksort based on using a sample of size 2^k - 1. First, sort the sample, then arrange to have the recursive routine partition on the median of the sample and to move the two halves of the rest of the sample to each subarray, such that they can be used in the subarrays, without having to be sorted again. This algorithm is called samplesort.

I will use a sample size of 7, which k = 3: 
```java
private static <T extends Comparable<T>> void sort(T[] a, int lo, int hi)
{
	if (hi <= lo + 6)
	{
		inserionSort(a, lo, hi);
		return;
	}

	int mid = lo + (hi - lo) / 2;
	inserionSort(a, mid-3, mid+3);
	exch(a, mid, lo);

	int j = partition(a, lo, hi);
	sort(a, lo, j-1);
	sort(a, j+1, hi);
}
```
And now is the time to compare all these  **7** variants of *Quicksort*, using the same method as last section, we can have the following results:
```
$ java QuickSortCompare 128 1000
      size      BasicQuick[ratio]  SentinelsQuick[ratio]    Median3Quick[ratio]    Median5Quick[ratio]     NonrecQuick[ratio]   Fast3WayQuick[ratio] JavaSystemQuick[ratio]     SampleQuick[ratio] 
       256           0.021[ 0.57]           0.018[ 0.46]           0.018[ 0.78]           0.022[ 0.71]           0.045[ 1.55]           0.058[ 3.22]           0.149[ 6.21]           0.037[ 1.37] 
       512           0.042[ 2.00]           0.040[ 2.22]           0.043[ 2.39]           0.037[ 1.68]           0.046[ 1.02]           0.046[ 0.79]           0.058[ 0.39]           0.043[ 1.16] 
      1024           0.090[ 2.14]           0.083[ 2.08]           0.088[ 2.05]           0.086[ 2.32]           0.095[ 2.07]           0.106[ 2.30]           0.126[ 2.17]           0.106[ 2.47] 
      2048           0.186[ 2.07]           0.193[ 2.33]           0.196[ 2.23]           0.195[ 2.27]           0.206[ 2.17]           0.205[ 1.93]           0.268[ 2.13]           0.218[ 2.06] 
      4096           0.404[ 2.17]           0.399[ 2.07]           0.438[ 2.23]           0.417[ 2.14]           0.433[ 2.10]           0.463[ 2.26]           0.596[ 2.22]           0.460[ 2.11] 
      8192           0.867[ 2.15]           0.858[ 2.15]           0.920[ 2.10]           0.886[ 2.12]           0.935[ 2.16]           0.996[ 2.15]           1.284[ 2.15]           0.983[ 2.14] 
     16384           1.899[ 2.19]           1.871[ 2.18]           2.008[ 2.18]           1.949[ 2.20]           2.054[ 2.20]           2.217[ 2.23]           2.858[ 2.23]           2.146[ 2.18] 
     32768           4.143[ 2.18]           4.056[ 2.17]           4.353[ 2.17]           4.207[ 2.16]           4.419[ 2.15]           4.873[ 2.20]           6.256[ 2.19]           4.627[ 2.16] 
     65536           8.937[ 2.16]           8.761[ 2.16]           9.416[ 2.16]           9.073[ 2.16]           9.495[ 2.15]          10.527[ 2.16]          13.611[ 2.18]           9.895[ 2.14] 
    131072          19.387[ 2.17]          19.128[ 2.18]          20.484[ 2.18]          20.274[ 2.23]          20.724[ 2.18]          23.113[ 2.20]          29.742[ 2.19]          21.383[ 2.16] 
Conclusion:
	 SentinelsQuick is  1.01 times faster than BasicQuick
	   Median3Quick is  0.95 times faster than BasicQuick
	   Median5Quick is  0.96 times faster than BasicQuick
	    NonrecQuick is  0.94 times faster than BasicQuick
	  Fast3WayQuick is  0.84 times faster than BasicQuick
	JavaSystemQuick is  0.65 times faster than BasicQuick
	    SampleQuick is  0.91 times faster than BasicQuick
```
So for total *random array*, the BasicQuick will just be fine, and the *JavaSystemQuick* is the slowest, maybe its because it calls too many `findMid` function. 
If we change the random array to those have plenty of repeated elements' array, for the result I get as follow, I set the array to have only five different keys;
```
$ java QuickSortCompare 128 1000
      size      BasicQuick[ratio]  SentinelsQuick[ratio]    Median3Quick[ratio]    Median5Quick[ratio]     NonrecQuick[ratio]   Fast3WayQuick[ratio] JavaSystemQuick[ratio]     SampleQuick[ratio] 
       256           0.019[ 0.47]           0.053[ 2.12]           0.036[ 1.64]           0.019[ 0.66]           0.063[ 2.63]           0.048[ 6.00]           0.074[ 4.93]           0.040[ 2.00] 
       512           0.037[ 1.95]           0.037[ 0.70]           0.038[ 1.06]           0.037[ 1.95]           0.040[ 0.63]           0.019[ 0.40]           0.029[ 0.39]           0.040[ 1.00] 
      1024           0.078[ 2.11]           0.083[ 2.24]           0.073[ 1.92]           0.082[ 2.22]           0.083[ 2.08]           0.038[ 2.00]           0.051[ 1.76]           0.073[ 1.83] 
      2048           0.161[ 2.06]           0.165[ 1.99]           0.156[ 2.14]           0.159[ 1.94]           0.168[ 2.02]           0.078[ 2.05]           0.097[ 1.90]           0.161[ 2.21] 
      4096           0.333[ 2.07]           0.327[ 1.98]           0.321[ 2.06]           0.330[ 2.08]           0.351[ 2.09]           0.162[ 2.08]           0.181[ 1.87]           0.341[ 2.12] 
      8192           0.709[ 2.13]           0.728[ 2.23]           0.694[ 2.16]           0.702[ 2.13]           0.730[ 2.08]           0.312[ 1.93]           0.364[ 2.01]           0.705[ 2.07] 
     16384           1.444[ 2.04]           1.476[ 2.03]           1.409[ 2.03]           1.470[ 2.09]           1.558[ 2.13]           0.635[ 2.04]           0.726[ 1.99]           1.516[ 2.15] 
     32768           3.065[ 2.12]           3.129[ 2.12]           2.981[ 2.12]           3.083[ 2.10]           3.216[ 2.06]           1.272[ 2.00]           1.471[ 2.03]           3.141[ 2.07] 
     65536           6.438[ 2.10]           6.566[ 2.10]           6.207[ 2.08]           6.475[ 2.10]           6.706[ 2.09]           2.534[ 1.99]           2.927[ 1.99]           6.579[ 2.09] 
    131072          13.510[ 2.10]          13.967[ 2.13]          13.062[ 2.10]          13.674[ 2.11]          14.124[ 2.11]           5.226[ 2.06]           5.992[ 2.05]          13.874[ 2.11] 
Conclusion:
	 SentinelsQuick is  0.97 times faster than BasicQuick
	   Median3Quick is  1.03 times faster than BasicQuick
	   Median5Quick is  0.99 times faster than BasicQuick
	    NonrecQuick is  0.96 times faster than BasicQuick
	  Fast3WayQuick is  2.59 times faster than BasicQuick
	JavaSystemQuick is  2.25 times faster than BasicQuick
	    SampleQuick is  0.97 times faster than BasicQuick
```
The variants which use 3-way partition is much more faster than those don't.
