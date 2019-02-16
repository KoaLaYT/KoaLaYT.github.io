# Chapter 1 / Section 1 : Programming Model
## Main Content
In this section, basic **java** knowledge is introduced along with some self-designed libraries that the book will use.
Here is the list of these libraries, more information about them can be find in the [website](https://algs4.cs.princeton.edu/11model/) of this book.

- `StdIn`
- `StdOut`
- `StdRandom`
- `StdDraw`

## Exercise
### 1.1.11
> Write a code fragment that prints the contents of a two-dimensional boolean array, using * to represent true and a space to represent false . Include row and column numbers.

The code is simple, so I will just omit it. Here is the result:
```
$ java Print2DBooleanArray 10 10
      1   2   3   4   5   6   7   8   9  10 
  1               *                   *     
  2   *       *   *   *   *           *   * 
  3           *   *   *   *   *   *   *     
  4       *   *   *               *         
  5   *   *           *           *   *   * 
  6       *           *               *     
  7       *   *   *   *   *   *   *   *     
  8               *           *       *   * 
  9   *   *   *   *       *       *         
 10   *   *           *       *   *       * 
```

### 1.1.15
> Write a static method histogram() that takes an array a[] of int values and an integer M as arguments and returns an array of length M whose i th entry is the number of times the integer i appeared in the argument array. If the values in a[] are all between 0 and M–1 , the sum of the values in the returned array should be equal to a.length .

Here is the code and result:
```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdOut;

public class Histogram
{
	public static int[] histogram(int[] a, int M)
	{
		int[] gram = new int[M];
		int count = 0;

		for (int i = 0; i < M; i++)
		{
			for (int j = 0; j < a.length; j++)
			{
				if (a[j] == i)
					count++;
			}
			gram[i] = count;
			count = 0;
		}
    
		return gram;
	}

	public static void main (String[] args)
	{
		if (args.length != 1)
		{
			StdOut.println("Miss M number.");
			return;
		}

		int m = Integer.parseInt(args[0]);
		int[] a = new int[20];
		int[] b;

		for (int i = 0; i < 20; i++)
			a[i] = StdRandom.uniform(m);
		
		b = histogram(a, m);
		int acc = 0;

		StdOut.print("The return array is: ");
		for (int i = 0; i < m; i++)
		{
			acc += b[i];
			StdOut.print("[" + b[i] + "] ");
		}
		StdOut.println(", and its sum is " + acc);

		StdOut.print("The origin array is: ");
		for (int i = 0; i < 20; i++)
			StdOut.print("[" + a[i] + "] ");
		StdOut.println(", and its length is " + a.length);
	}
}
```
```
$ java Histogram 10
The return array is: [1] [0] [0] [2] [2] [3] [2] [5] [3] [2] , and its sum is 20
The origin array is: [4] [8] [7] [7] [4] [5] [5] [3] [8] [7] [7] [9] [9] [5] [3] [0] [6] [6] [8] [7] , and its length is 20
```

### 1.1.28 Remove duplicates.
> Modify the test client in BinarySearch to remove any duplicate keys in the whitelist after the sort.

The code and test result are as follow:
```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdOut;
import java.util.Arrays;

public class UniqByBinarySearch
{
	public static int rank1(int key, int start, int[] a)
	{
		int lo = start;
		int hi = a.length - 1;

		while (lo <= hi)
		{
			int mid = lo + (hi - lo) / 2;
			if (key < a[mid])
				hi = mid - 1;
			else if (key > a[mid])
				lo = mid + 1;
			else 
				return mid;
		}
		return -1;
	}

	public static void main (String[] args)
	{
		int len = 30;
		int Max = 20;

		int[] test = new int[len];
		StdOut.print("The origin array is: ");
		for (int i = 0; i < len; i++)
		{
			test[i] = StdRandom.uniform(Max);
			StdOut.printf("%02d ", test[i]);
		}
		StdOut.println();

		Arrays.sort(test);
		StdOut.print("The sorted array is: ");
		for (int i = 0; i < len; i++)
		{
			StdOut.printf("%02d ", test[i]);
		}
		StdOut.println();

		StdOut.print("The uniqed array is: ");
		for (int i = 0; i < len; i++)
		{
			if (rank1(test[i], i + 1, test) < 0)
			{
				StdOut.printf("%02d ", test[i]);
			}
		}
		StdOut.println();
	}
}
```
```
$ java UniqByBinarySearch
The origin array is: 10 05 17 16 10 02 10 02 05 09 13 13 03 07 06 07 09 15 16 00 15 17 14 17 10 19 08 19 00 15 
The sorted array is: 00 00 02 02 03 05 05 06 07 07 08 09 09 10 10 10 10 13 13 14 15 15 15 16 16 17 17 17 19 19 
The uniqed array is: 00 02 03 05 06 07 08 09 10 13 14 15 16 17 19 
```

### 1.1.29 Equal keys.
> Add to BinarySearch a static method rank() that takes a key and a sorted array of int values (some of which may be equal) as arguments and returns the number of elements that are smaller than the key and a similar method count() that returns the number of elements equal to the key. Note : If i and j are the values returned by rank(key, a) and count(key, a) respectively, then a[i..i+j-1 ] are the values in the array that are equal to key .

Again, code and result:
```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdOut;
import java.util.Arrays;

public class CountByBinarySearch
{
	private static int counter = 0;

	public static int rank(int key, int[] a)
	{
		int lo = 0;
		int hi = a.length - 1;

		while (lo <= hi)
		{
			int mid = lo + (hi - lo) / 2;
			if (key < a[mid])
				hi = mid - 1;
			else if (key > a[mid])
				lo = mid + 1;
			else 
				return mid;
		}
		return -1;
	}

	public static int count(int key, int[] a)
	{
		int mid;
		if ((mid = rank(key, a)) >= 0)
		{
			counter++;
			if (mid > 0)
			{
				int[] low = new int[mid];
				for (int i = 0; i < low.length; i++)
					low[i] = a[i];
				int[] high = new int[a.length - mid - 1];
				for (int i = 0; i < high.length; i++)
					high[i] = a[mid + i + 1];
				count(key, low);
				count(key, high);
			}
			else
			{
				int[] high = new int[a.length - mid - 1];
				for (int i = 0; i < high.length; i++)
					high[i] = a[mid + i + 1];
				count(key, high);
			}
		}
		return counter;
	}

	public static void main (String[] args)
	{
		int len = 30;
		int Max = 20;

		int[] test = new int[len];
		for (int i = 0; i < len; i++)
			test[i] = StdRandom.uniform(Max);

		Arrays.sort(test);
		StdOut.print("The sorted array is: ");
		for (int i = 0; i < len; i++)
		{
			StdOut.printf("%02d ", test[i]);
		}
		StdOut.println();
		StdOut.println("There is " + count(10, test) + " number 10 in the array");
	}
}
```
```
$ java CountByBinarySearch
The sorted array is: 00 00 00 02 03 04 04 04 06 06 07 08 09 10 10 10 10 12 14 14 14 15 15 16 16 16 17 18 19 19 
There is 4 number 10 in the array
```

### 1.1.31 Random connections.
> Write a program that takes as command-line arguments an integer N and a double value p (between 0 and 1), plots N equally spaced dots of size .05 on the circumference of a circle, and then, with probability p for each pair of points, draws a gray line connecting them.

This a picture of `N = 20` and `p = 0.2`

![](../img/RandomLining.jpg)

