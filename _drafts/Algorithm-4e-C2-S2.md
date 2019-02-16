# Chapter 2 / Section 2 : Mergesort

## Main Content

The main principle of mergesort is :

- divide it into two halves, sort the two halves (recursively), and then merge the results

It is one of the best-known examples of the utility of *divide-and-conquer* paradigm for efficient algorithm design. 

![MergesortOverview](../img/MergesortOverview.png)

### 1. Abstract in-place merge

```java
public static void merge(Comparable[] a, int lo, int mid, int hi)
{
	int i = lo;
	int j = mid+1;
	
	for (int k = lo; k <= hi; k++)
		aux[k] = a[k];
	
	for (int k = lo; k <= hi; k++)
	{
		if (i > mid)
			a[k] = aux[j++];
		else if (j > hi)
			a[k] = aux[i++];
		else if (less(a[j], a[i]))
			a[k] = aux[j++];
		else
			a[k] = aux[i++];
	}
}
```

Here is a trace of it : (image from the text book)

![InplaceMergeTrace](../img/InplaceMergeTrace.png)

### 2. Top-down mergesort

Base on the abstract in-place merge, we can get an implementation :

```java
public class Merge
{
	private static Comparable[] aux;
	
	public static void sort(Comparable[] a)
	{
		int N = a.length;
		aux = new Comparable[N];
		
		sort(a, 0, N-1);
	}
	
	private static void sort(Comparable[] a, int lo, int hi)
	{
		if (hi <= lo)
			return;
		
		int mid = lo + (hi - lo)/2;
		sort(a, lo, mid);
		sort(a, mid+1, hi);
		
		merge(a, lo, mid, hi);
	}
}
```

The trace of merge results for top-down mergesort on the text book is very enlightening : (image from the text book)

![TopDownMergesortTrace](../img/TopDownMergesortTrace.png)

**Top-down mergesort analysis** :

> to sort any array of length N, it uses between 1/2NlgN and NlgN compares

The image below may help to understand the analysis : (image from the text book)

![MergesortDependenceTree](../img/MergesortDependenceTree.png)

There are some modifications to the origin implementation that can cut the running time of mergesort :

- Use insertion sort for small subarrays

- Test whether the array is already in order

- Eliminate the copy to the auxiliary array

![TopDownVisualTrace](../img/TopDownVisualTrace.png)

### 3. Bottom-up mergesort

This is another way to implement mergesort : do all the merges of tiny subarrays on one pass, then do a second pass to merge those subarrays in pairs, and so forth until encompasses the whole array.

```java
public class Merge
{
	private static Comparable[] aux;
	
	public static void sort(Comparable[] a)
	{
		int N = a.length;
		aux = new Comparable[N];
		
		for (int sz = 1; sz < N; sz = sz+sz)
			for (int lo = 0; lo < N-sz; lo += sz+sz)
				merge(a, lo, lo+sz-1, Math.min(lo+sz+sz-1, N-1));
	}
}
```

This is the trace of merge results for bottom-up mergesort : (image from the text book)

![BottomUpMergesortTrace](../img/BottomUpMergesortTrace.png)

And this is the visual trace : (image from the text book)

![BottomUpVisualTrace](../img/BottomVisualTrace.png)

### 4. The complexity of sorting

> No compare-based sorting algorithm can guarantee to sort N items with fewer than ~NlgN compares

## Exercise
### 2.2.9 
> Use of a static array like aux[] is inadvisable in library software because multiple clients might use the class concurrently. Give an implementation of Merge that does not use a static array. Do not make aux[] local to merge() (see the Q&A for this section). Hint : Pass the auxiliary array as an argument to the recursive sort() .

Here is my code:
```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdOut;
import java.lang.reflect.Array;

public class ArgMerge
{
	public static <T extends Comparable<T>> void sort(T[] a)
	{
		T[] aux = (T[]) Array.newInstance(a.getClass().getComponentType(), a.length);
		sort(a, aux, 0, a.length - 1);
	}

	private static <T extends Comparable<T>> void sort(T[] a, T[] aux, int lo, int hi)
	{
		if (hi <= lo)
			return;
		int mid = lo + (hi - lo) / 2;
		sort(a, aux, lo, mid);
		sort(a, aux, mid+1, hi);
		merge(a, aux, lo, mid, hi);
	}

	private static <T extends Comparable<T>> void merge(T[] a, T[] aux, int lo, int mid, int hi)
	{
		int i = lo;
		int j = mid + 1;

		for (int k = lo; k <= hi; k++)
			aux[k] = a[k];

		for (int k = lo; k <= hi; k++)
		{
			if (i > mid)
				a[k] = aux[j++];
			else if (j > hi)
				a[k] = aux[i++];
			else if (less(aux[i], aux[j]))
				a[k] = aux[i++];
			else
				a[k] = aux[j++];
		}
	}

	private static <T extends Comparable<T>> boolean less(T v, T w)
	{
		return v.compareTo(w) < 0;
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
I met a **Object cannot be cast to Comparable error** first, then I found the solution in [Stack Overflow](https://stackoverflow.com/questions/6536248/cast-object-to-comparable-in-java) that writing `T[] aux = (T[]) Array.newInstance(a.getClass().getComponentType(), a.length)` instead of `T[] aux = (T[]) new Object(a.length)` will do the trick. And remeber to `import java.lang.reflect.Array` at first of your code.

### 2.2.10 Faster merge.
> Implement a version of merge() that copies the second half of a[] to aux[] in decreasing order and then does the merge back to a[] . This change allows you to remove the code to test that each of the halves has been exhausted from the inner loop. Note: The resulting sort is not stable (see page 341).

We can change the `merge` function as follow:
```java
private static <T extends Comparable<T>> void merge(T[] a, T[] aux, int lo, int mid, int hi)
{
	int i = lo;
	int j = hi;

	for (int k = lo; k <= mid; k++)
		aux[k] = a[k];
	for (int k = 1; k <= hi-mid; k++)
		aux[mid + k] = a[hi-k+1];

	for (int k = lo; k <= hi; k++)
	{
		if (less(aux[i], aux[j]))
			a[k] = aux[i++];
		else
			a[k] = aux[j--];
	}
}
```

### 2.2.11 Improvements.
> Implement the three improvements to mergesort that are described in the text on page 275: Add a cutoff for small subarrays, test whether the array is already in order, and avoid the copy by switching arguments in the recursive code.

first, **add a cutoff for small subarrays**, to subarrays smaller than 7, I will use insertion sort:
```java
private static <T extends Comparable<T>> void sort(T[] a, T[] aux, int lo, int hi)
{
	if (hi - lo < 7)
	{
		for (int i = lo; i <= hi; i++)
		{
			for (int j = i; j > lo && less(a[j], a[j-1]); j--)
				exch(a, j, j-1);
		}
		return;
	}
	int mid = lo + (hi - lo) / 2;
	sort(a, aux, lo, mid);
	sort(a, aux, mid+1, hi);
	merge(a, aux, lo, mid, hi);
}
```

second, **test whether the array is already in order**, this one is easy, just follow the instruction on the book:
```java
private static <T extends Comparable<T>> void sort(T[] a, T[] aux, int lo, int hi)
{
	if (hi <= lo)
		return;
	int mid = lo + (hi - lo) / 2;
	sort(a, aux, lo, mid);
	sort(a, aux, mid+1, hi);
	if (less(a[mid], a[mid+1]))
		return;
	merge(a, aux, lo, mid, hi);
}
```

third, **avoid the copy by switching arguments in the recursive code**. This one is a little bit tricky, I use an Integer `flag` to determine the switching, and here is my code:
```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdOut;
import java.lang.reflect.Array;

public class SwitchMerge
{
	public static <T extends Comparable<T>> void sort(T[] a)
	{
		int N = a.length;
		int flag = 0;
		T[] aux = (T[]) Array.newInstance(a.getClass().getComponentType(), N);
		flag = sort(a, aux, 0, N - 1, flag);
		if (flag % 2 == 0)
		{
			for (int i = 0; i < N; i++)
				a[i] = aux[i];
		}
	}

	private static <T extends Comparable<T>> int sort(T[] a, T[] aux, int lo, int hi, int flag)
	{
		if (hi <= lo)
		{
			flag = 1;
			return flag;
		}
		int mid = lo + (hi - lo) / 2;
		int flag1 = sort(a, aux, lo, mid, flag);
		int flag2 = sort(a, aux, mid+1, hi, flag);
		flag = merge(a, aux, lo, mid, hi, flag1, flag2);
		return flag;
	}

	private static <T extends Comparable<T>> int merge(T[] a, T[] aux, int lo, int mid, int hi, int flag1, int flag2)
	{
		int i = lo;
		int j = mid + 1;

		if (flag1 % 2 == 1 && flag2 % 2 == 1)
		{
			for (int k = lo; k <= hi; k++)
			{
				if (i > mid)
					aux[k] = a[j++];
				else if (j > hi)
					aux[k] = a[i++];
				else if (less(a[i], a[j]))
					aux[k] = a[i++];
				else
					aux[k] = a[j++];
			}
			return flag1+1;
		}
		else if (flag1 % 2 == 0 && flag2 % 2 == 1)
		{
			for (int k = lo; k <= hi; k++)
			{
				if (i > mid)
					a[k] = a[j++];
				else if (j > hi)
					a[k] = aux[i++];
				else if (less(aux[i], a[j]))
					a[k] = aux[i++];
				else
					a[k] = a[j++];
			}
			return flag1+1;
		}
		else if (flag1 % 2 == 0 && flag2 % 2 == 0)
		{
			for (int k = lo; k <= hi; k++)
			{
				if (i > mid)
					a[k] = aux[j++];
				else if (j > hi)
					a[k] = aux[i++];
				else if (less(aux[i], aux[j]))
					a[k] = aux[i++];
				else
					a[k] = aux[j++];
			}
			return flag1+1;
		}
		else
		{
			for (int k = lo; k <= hi; k++)
			{
				if (i > mid)
					aux[k] = aux[j++];
				else if (j > hi)
					aux[k] = a[i++];
				else if (less(a[i], aux[j]))
					aux[k] = a[i++];
				else
					aux[k] = aux[j++];
			}
			return flag1+1;
		}
	}

	private static <T extends Comparable<T>> boolean less(T v, T w)
	{
		return v.compareTo(w) < 0;
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
		StdOut.print("Origin Array: ");
		show(a);
		sort(a);
		StdOut.print("Sorted Array: ");
		show(a);
	}
}
```
So in the `merge` function, I split it into four conditions according to the parity of `flag1` and `flag2`, which represent where is the current sorted subarray, in the array *a* or in the array *aux*. If add some print function in the code we can see the trace of it:
```
$ java SwitchMerge 10
Origin Array: 1 5 9 6 8 9 0 3 0 4 

Array a--[2]: 1 5 9 6 8 9 0 3 0 4 
Array x--[2]: 1 5 null null null null null null null null 

Array a--[3]: 1 5 9 6 8 9 0 3 0 4 
Array x--[3]: 1 5 null null null null null null null null 

Array a--[2]: 1 5 9 6 8 9 0 3 0 4 
Array x--[2]: 1 5 null 6 8 null null null null null 

Array a--[4]: 1 5 9 6 8 9 0 3 0 4 
Array x--[4]: 1 5 6 8 9 null null null null null 

Array a--[2]: 1 5 9 6 8 9 0 3 0 4 
Array x--[2]: 1 5 6 8 9 0 9 null null null 

Array a--[3]: 1 5 9 6 8 0 3 9 0 4 
Array x--[3]: 1 5 6 8 9 0 9 null null null 

Array a--[2]: 1 5 9 6 8 0 3 9 0 4 
Array x--[2]: 1 5 6 8 9 0 9 null 0 4 

Array a--[4]: 1 5 9 6 8 0 3 9 0 4 
Array x--[4]: 1 5 6 8 9 0 0 3 4 9 

Array a--[5]: 0 0 1 3 4 5 6 8 9 9 
Array x--[5]: 1 5 6 8 9 0 0 3 4 9 

Sorted Array: 0 0 1 3 4 5 6 8 9 9 
```

### 2.2.23 Improvements.
> Run empirical studies to evaluate the effectiveness of each of the three improvements to mergesort that are described in the text (see Exercise 2.2.11). Also, compare the performance of the merge implementation given in the text with the merge described in Exercise 2.2.10. In particular, empirically determine the best value of the parameter that decides when to switch to insertion sort for small subarrays.

Here is my result:
```
$ java MergeCompare 64 1000
           Size             ArgMerge[ratio]          FasterMerge[ratio]       AddCutoffMerge[ratio]     TestInOrderMerge[ratio]          SwitchMerge[ratio]
            128                0.030[ 1.50]                0.087[ 6.21]                0.019[ 2.11]                0.060[ 5.00]                0.050[ 4.55]
            256                0.029[ 0.97]                0.026[ 0.30]                0.056[ 2.95]                0.027[ 0.45]                0.021[ 0.42]
            512                0.057[ 1.97]                0.048[ 1.85]                0.041[ 0.73]                0.047[ 1.74]                0.040[ 1.90]
           1024                0.106[ 1.86]                0.125[ 2.60]                0.092[ 2.24]                0.101[ 2.15]                0.094[ 2.35]
           2048                0.239[ 2.25]                0.223[ 1.78]                0.202[ 2.20]                0.217[ 2.15]                0.202[ 2.15]
           4096                0.525[ 2.20]                0.498[ 2.23]                0.458[ 2.27]                0.490[ 2.26]                0.446[ 2.21]
           8192                1.135[ 2.16]                1.068[ 2.14]                1.001[ 2.19]                1.048[ 2.14]                0.969[ 2.17]
          16384                2.498[ 2.20]                2.340[ 2.19]                2.190[ 2.19]                2.317[ 2.21]                2.118[ 2.19]
          32768                5.437[ 2.18]                5.020[ 2.15]                4.774[ 2.18]                4.973[ 2.15]                4.587[ 2.17]
          65536               11.634[ 2.14]               10.854[ 2.16]               10.416[ 2.18]               10.853[ 2.18]                9.933[ 2.17]
Conclusion:
	         FasterMerge is  1.07 times faster than Merge
	      AddCutoffMerge is  1.12 times faster than Merge
	    TestInOrderMerge is  1.07 times faster than Merge
	         SwitchMerge is  1.17 times faster than Merge
```
So the third improvement has the best effect, and then first. The other two method has little improvements.
