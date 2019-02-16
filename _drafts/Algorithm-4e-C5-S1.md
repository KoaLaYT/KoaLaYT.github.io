# Chapter 5 / Section 1 : String Sorts
## Main Content
### 1. LSD string sort

Least-significant-digit first string sort use the principle of key-indexed counting as follow four steps :

1. Compute frequency counts
2. Transform counts to indices
3. Distribute the data
4. Copy back

This figure shows its trace : (image from text book)

![Key-indexed trace](../img/KeyIndexedTrace.png)

```java
public class LSD
{
    public static void sort(String[] a, int W)
    {
        int R = 256;
        int N = a.length;
        String[] aux = new String[N];
        for (int d = W-1; d >= 0; d--)
        {
            int[] count = new int[R+1];
            
            for (int i = 0; i < N; i++)
                count[a[i].charAt(d)+1]++;
            for (int r = 0; r < R; r++)
                count[r+1] += count[r];
            for (int i = 0; i < N; i++)
                aux[count[a[i].charAt(d)]++] = a[i];
            for (int i = 0; i < N; i++)
                a[i] = aux[i];
        }
    }
}
```

Here is its trace : (image from text book)

![LSD trace](../img/LSDTrace.png)

**LSD string sort analysis** :

> LSD string sort uses ~7WN + 3WR array accesses and extra space proportional to N+R to sort N items whose keys are W-character strings taken from an R-character alphabet.

### 2. MSD string sort

To implement a general-purpose string sort, where strings are not necessarily all the same length, we consider the characters in left-to-right order, by using most-significant-digit-first string sort. Here is its overview : (image from text book)

![MSD overview](../img/MSDOverview.png)

```java
public class MSD
{
    private final int M = 15;
    private static int R = 256;
    private static String[] aux;
    
    private int charAt(String s, int d)
    {
        if (d < s.length) return s.charAt(d);
        else return -1;
    }
    
    public static void sort(String[] a)
    {
        int N = a.length;
        aux = new String[N];
        sort(a, 0, N-1, 0);
    }
    
    private static void sort(String[] a, int lo, int hi, int d)
    {
        if (hi <= lo + M) 
        {
            Insertion.sort(a, lo, hi, d);
            return;
        }
        
        int[] count = new int[R+2];
        
        for (int i = lo; i <= hi; i++)
            count[charAt(a[i], d)+2]++;
        for (int r = 0; r < R+1; r++)
            count[r+1] += count[r];
        for (int i = lo; i <= hi; i++)
            aux[count[charAt(a[i], d)+1]++] = a[i];
        for (int i = lo; i <= hi; i++)
            a[i] = aux[i-lo];
        
        for (int r = 0; r < R; r++)
        	sort(a, lo+count[r], lo+count[r+1]-1, d+1);
    }
}
```

Here is its recursive calls' trace : (image from text book)

![MSD trace](../img/MSDTrace.png)

**MSD string sort analysis** :

> To sort N random string from an R-character alphabet, MSD string sort :
>
> - examines about Nlog<sub>R</sub>N character on average.
>
> - uses between 8N+3R and ~7wN + 3WR array accesses, where w is the average string length.
> - space is proportional to R times the length of the longest string in the worst case.

### 3. Three-way string quicksort

To combine normal quicksort with MSD string sort, we can have the following algorithm which adapts well to handling all situations where MSD string sort runs slowly :

- equal keys
- keys with long common prefixes
- keys that fall into a small range
- small arrays

```java
public class Quick3string
{
    private int charAt(String s, int d)
    {
        if (d < s.length) return s.charAt(d);
        else return -1;
    }
    public static void sort(String[] a)
    {
        sort(a, 0, a.length-1, 0);
    }
    
    private static void sort(String[] a, int lo, int hi, int d)
    {
        if (hi <= lo) return;
        
        int v = charAt(a[lo], d);
        int lt = lo, gt = hi;
        int i = lo+1;
        while ( i <= gt)
        {
            int w = charAt(a[i], d);
            if (w < v) exch(a, i++, lt++);
            else if (w > v) exch(a, i, gt--);
            else i++;
        }
        sort(a, lo, lt-1, d);
        if (v >= 0) sort(a, lt, gt, d+1);
        sort(a, gt+1, hi, d);
    }
}
```

Here is its trace : (image from text book)

![3-way string quick sort trace](../img/Quick3stringTrace.png)

**3-way string quick sort analysis** :

> To sort an array of N random strings, 3-way string quicksort uses ~2NlnN character compares on the average.

### 4. Summary

![Performance comparison](../img/StringSortingAlgorithmComparison.png)

## Exercise
### 5.1.11 Queue sort.
> Implement MSD string sorting using queues, as follows: Keep one queue for each bin. On a first pass through the items to be sorted, insert each item into the appropriate queue, according to its leading character value. Then, sort the sublists and stitch together all the queues to make a sorted whole. Note that this method does not involve keeping the count[] arrays within the recursive method.

I'm not sure if I meet the requirement, because my method don't even use the `count[]` array, instead, it will create a lot of `Queue<String>[]` within the recursive method:
```java
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.StdIn;
import edu.princeton.cs.algs4.Queue;

public class QueueSort
{
	private static int R = 256;
	private static int index;

	private static int charAt(String s, int d)
	{
		if (d < s.length())
			return s.charAt(d);
		else
			return -1;
	}

	public static void sort(String[] a)
	{
		int N = a.length;
		Queue<String> q = new Queue<>();

		for (int i = 0; i < N; i++)
			q.enqueue(a[i]);

		index = 0;
		sort(a, q, 0);
	}

	private static void sort(String[] a, Queue<String> q, int d)
	{
		Queue<String>[] tmp = (Queue<String>[]) new Queue[R];
		for (String s : q)
		{
			int r = charAt(s, d);
			if (r == -1)
			{
				a[index++] = s;
				continue;
			}
			if (tmp[r] == null)
				tmp[r] = new Queue<String>();
			tmp[r].enqueue(s);
		}

		for (int r = 0; r < R; r++)
		{
			if (tmp[r] == null)
				continue;
			if (tmp[r].size() == 1)
			{
				a[index++] = tmp[r].dequeue();
				continue;
			}
			sort(a, tmp[r], d+1);
		}
	}
	
	public static void main(String[] args)
	{
		String[] a = StdIn.readAll().split("\\s+");
		
		StdOut.println("Origin array:");
		for (String s : a)
			StdOut.println(s);

		sort(a);

		StdOut.println("Sorted array:");
		for (String s : a)
			StdOut.println(s);
	}
}
```

### 5.1.12 Alphabet.
> Develop an implementation of the Alphabet API that is given on page 698 and use it to develop LSD and MSD sorts for general alphabets.

The implementation of `Alphabet` is as follow:
```java
import edu.princeton.cs.algs4.ST;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.StdIn;

public class Alphabet
{
	private ST<Character, Integer> st;
	private String s;

	public Alphabet(String s)
	{
		this.s = s;

		st = new ST<Character, Integer>();
		for (int i = 0; i < s.length(); i++)
			st.put(s.charAt(i), i);
	}

	public char toChar(int index)
	{
		return s.charAt(index);
	}

	public int toIndex(char c)
	{
		return st.get(c);
	}

	public boolean contains(char c)
	{
		return st.contains(c);
	}

	public int R()
	{
		return s.length();
	}

	public int lgR()
	{
		return (int) (Math.log10(R()) / Math.log10(2));
	}

	public int[] toIndices(String s)
	{
		int[] indices = new int[s.length()];
		for (int i = 0; i < s.length(); i++)
			indices[i] = toIndex(s.charAt(i));

		return indices;
	}

	public String toChars(int[] indices)
	{
		String s = "";
		for (int i = 0; i < indices.length; i++)
			s += toChar(indices[i]) + "";
		return s;
	}

	public static void main(String[] args)
	{
		Alphabet alpha = new Alphabet("ATCG");
		StdOut.println("The alphabet is ATCG");
		StdOut.println("toIndex test T: " + alpha.toIndex('T'));
		StdOut.println("toChar test 3: " + alpha.toChar(3));
		StdOut.println("lgR: " + alpha.lgR());
		StdOut.println("ACTGGT: ");
		for (Integer i : alpha.toIndices("ACTGGT"))
			StdOut.print(i + " ");
		StdOut.println();
		int[] test = { 1, 2, 3, 3, 2, 1, 0, 0 };
		for (Integer i : test)
			StdOut.print(i + " ");
		StdOut.println();
		StdOut.println(alpha.toChars(test));
	}
}
```

### 5.1.15 Sublinear sort.
> Develop a sort implementation for int values that makes two passes through the array to do an LSD sort on the leading 16 bits of the keys, then does an insertion sort.

Here is my implementation:
```java
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.Alphabet;

public class SublinearSort
{
	private static Alphabet alpha = Alphabet.BINARY;

	private static String toBinaryString(int i)
	{
		String s = Integer.toBinaryString(i);
		int N = 32 - s.length();
		String zero = "";
		for (int n = 0; n < N; n++)
			zero += "0";
		s = zero + s;
		return s;
	}

	private static int charAt(int i, int d)
	{
		String s = toBinaryString(i);
		return alpha.toIndex(s.charAt(d));
	}

	public static void sort(int[] a)
	{
		StdOut.println("The origin array: ");
		for (Integer i : a)
			StdOut.printf("%10d -> %32s\n", i, toBinaryString(i));

		int N = a.length;
		int[] aux = new int[N];

		for (int d = 15; d >= 0; d--)
		{
			int[] count = new int[alpha.radix()+1];

			for (int i = 0; i < N; i++)
				count[charAt(a[i], d)+1]++;

			for (int r = 0; r < alpha.radix(); r++)
				count[r+1] += count[r];

			for (int i = 0; i < N; i++)
				aux[count[charAt(a[i], d)]++] = a[i];

			for (int i = 0; i < N; i++)
				a[i] = aux[i];
		}
		
		StdOut.println("After LSD Sort of leading 16-bits:");
		for (Integer i : a)
			StdOut.printf("%10d -> %32s\n", i, toBinaryString(i));

		for (int i = 0; i < N; i++)
		{
			for (int j = i; j > 0 && a[j] < a[j-1]; j--)
				exch(a, j, j-1);
		}

		StdOut.println("After insertion Sort:");
		for (Integer i : a)
			StdOut.printf("%10d -> %32s\n", i, toBinaryString(i));
	}

	private static void exch(int[] a, int i, int j)
	{
		int t = a[i];
		a[i] = a[j];
		a[j] = t;
	}

	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		int[] test = new int[N];
		for (int i = 0; i < N; i++)
		{
			int sign = StdRandom.uniform(2);
			if (sign == 0)
				test[i] = StdRandom.uniform(N*1000000);
			else
				test[i] = -1 * StdRandom.uniform(N*1000000);
		}
		sort(test);
	}
}
```
And the test result is as follow:
```
$ java SublinearSort 10
The origin array: 
  -4178216 -> 11111111110000000011111011011000
   6608773 -> 00000000011001001101011110000101
  -9021397 -> 11111111011101100101100000101011
  -7035298 -> 11111111100101001010011001011110
   7635310 -> 00000000011101001000000101101110
   9169917 -> 00000000100010111110101111111101
   3555504 -> 00000000001101100100000010110000
  -8238493 -> 11111111100000100100101001100011
  -6884003 -> 11111111100101101111010101011101
   7482597 -> 00000000011100100010110011100101
After LSD Sort of leading 16-bits:
   3555504 -> 00000000001101100100000010110000
   6608773 -> 00000000011001001101011110000101
   7482597 -> 00000000011100100010110011100101
   7635310 -> 00000000011101001000000101101110
   9169917 -> 00000000100010111110101111111101
  -9021397 -> 11111111011101100101100000101011
  -8238493 -> 11111111100000100100101001100011
  -7035298 -> 11111111100101001010011001011110
  -6884003 -> 11111111100101101111010101011101
  -4178216 -> 11111111110000000011111011011000
After insertion Sort:
  -9021397 -> 11111111011101100101100000101011
  -8238493 -> 11111111100000100100101001100011
  -7035298 -> 11111111100101001010011001011110
  -6884003 -> 11111111100101101111010101011101
  -4178216 -> 11111111110000000011111011011000
   3555504 -> 00000000001101100100000010110000
   6608773 -> 00000000011001001101011110000101
   7482597 -> 00000000011100100010110011100101
   7635310 -> 00000000011101001000000101101110
   9169917 -> 00000000100010111110101111111101
```

### 5.1.18 Random decimal keys.
> Write a static method randomDecimalKeys that takes int values N and W as arguments and returns an array of N string values that are each W -digit decimal numbers.

Here it is:
```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdOut;

public class RandomDecimalKeys
{
	public static String[] generate(int N, int W)
	{
		String[] a = new String[N];
		for (int i = 0; i < N; i++)
		{
			a[i] = "";
			for (int j = 0; j < W; j++)
				a[i] += StdRandom.uniform(10) + "";
			a[i] = "0." + a[i];
		}
		return a;
	}

	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		int W = Integer.parseInt(args[1]);
		for (String s : generate(N, W))
			StdOut.println(s);
	}
}
```
And here is an example:
```
$ java RandomDecimalKeys 10 10
0.7036676645
0.9898106291
0.6950418483
0.0955368849
0.6837895828
0.4367937462
0.8162533871
0.6481000673
0.7073520662
0.8027891959
```

### 5.1.19 Random CA license plates.
> Write a static method randomPlatesCA that takes an int value N as argument and returns an array of N String values that represent CA license plates as in the examples in this section.

```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdOut;

public class RandomPlatesCA
{
	public static String[] generate(int N)
	{
		String[] a = new String[N];

		for (int i = 0; i < N; i++)
		{
			String s = StdRandom.uniform(10) + "";
			for (int j = 0; j < 3; j++)
				s += (char) StdRandom.uniform(65, 91) + "";
			for (int j = 0; j < 3; j++)
				s += StdRandom.uniform(10) + "";
			a[i] = s;
		}

		return a;
	}

	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		for (String s : generate(N))
			StdOut.println(s);
	}
}
```
```
$ java RandomPlatesCA 10
2WHN274
2QRP261
3DKG955
3ZCA704
8HQN458
0YIU451
7DHE559
0MDJ654
3YXM856
8RSR985
```

### 5.1.20 Random fixed-length words.
> Write a static method randomFixedLengthWords that takes int values N and W as arguments and returns an array of N string values that are each strings of W characters from the alphabet.

Once again, very similar with previous generators: 
```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdOut;

public class RandomFixedLengthWords
{
	public static String[] generate(int N, int W)
	{
		String[] a = new String[N];
		for (int i = 0; i < N; i++)
		{
			a[i] = "";
			for (int j = 0; j < W; j++)
			{
				int UpperOrLower =  StdRandom.uniform(2);
				if (UpperOrLower == 0)
					a[i] += (char) StdRandom.uniform(65, 91);
				else
					a[i] += (char) StdRandom.uniform(97, 123);
			}
		}
		return a;
	}

	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		int W = Integer.parseInt(args[1]);

		for (String s : generate(N, W))
			StdOut.println(s);
	}
}
```
```
$ java RandomFixedLengthWords 10 10
npooZXWsdK
WGqAQEHerx
kpYewlMSbL
fLxAxYjThc
qZeeVHCNPR
dHqbSRKQfb
TaKGyJWJiy
YopPeDXczA
UvlzfkcpFQ
kLYZGBBGia
```

### 5.1.21 Random items.
> Write a static method randomItems that takes an int value N as argument and returns an array of N string values that are each strings of length between 15 and 30 made up of three fields: a 4-character field with one of a set of 10 fixed strings; a 10-char field with one of a set of 50 fixed strings; a 1-character field with one of two given values; and a 15-byte field with random left-justified strings of letters equally likely to be 4 through 15 characters long.

Using the previous generator will make it easier:
```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdOut;

public class RandomItems
{
	public static String[] generate(int N)
	{
		String[] a = new String[N];
		String[] p1 = RandomFixedLengthWords.generate(10, 4);
		String[] p2 = RandomFixedLengthWords.generate(50, 10);
		String[] p3 = RandomFixedLengthWords.generate(2, 1);

		for (int i = 0; i < N; i++)
		{
			int n1 = StdRandom.uniform(10);
			int n2 = StdRandom.uniform(50);
			int n3 = StdRandom.uniform(2);
			int n4 = StdRandom.uniform(4, 16);
			a[i] = p1[n1] + p2[n2] + p3[n3] + RandomFixedLengthWords.generate(1, n4)[0];
		}

		return a;
	}

	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		StdOut.printf("%-4s%-10s%-1s4\n", "1", "2", "3");
		for (String s : generate(N))
			StdOut.println(s);
	}
}
```
Here is an example:
```
$ java RandomItems 20
1   2         34
qYPKSYPBdOBHnQKIvupIDj
LuHlaorwMqkLMjGAwqiJgbS
OMCBVjHKRHnNKxKLThKWNOH
hTrkQXfZxGyyffGIVdDpefpotaMnbz
hTrkDIeQqaOjrnKEfYBIse
MRPkqrYyeIZuqEGjOfDgFCp
gsBCXySGFLAMJkGlBVzlRXuxzaIP
gsBCORxjiQOXDGGDrSITwMH
hTrkjSRrGoRdfoKfSBFqciShaQ
bCLwKNfeQTcabuGBcYgclCnhYGWTIJ
qYPKfcSUYCJXuQGLKVqJDH
GPMSLBOVqxvDUFGbuEJWk
ZfAeIxtMxtEodWGXisFEGutsQLsd
MRPkaorwMqkLMjGGvcc
GPMSoAegFjhmUOKRqhH
MRPkXySGFLAMJkGMbzAnPMnwdTJu
hTrklfUcheHpXHKKFUuVvzih
qYPKEFIESqTggrKafXaRo
LuHlkeYrSwpJzdGVKWIZoJKxraSkMr
LuHlMdVcDNemDsGricBBnNphtNk
```

### 5.1.22 Timings.
> Compare the running times of MSD string sort and 3-way string quicksort, using various key generators. For fixed-length keys, include LSD string sort.

The code is not difficult:
```java
import edu.princeton.cs.algs4.Stopwatch;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.MSD;
import edu.princeton.cs.algs4.LSD;
import edu.princeton.cs.algs4.Quick3string;

public class Timings
{
	public static void random(int N)
	{
		double t1 = 0.0;
		double t2 = 0.0;
		for (int t = 0; t < 10; t++)
		{
			String[] a1 = RandomItems.generate(N);
			String[] a2 = new String[N];
			for (int i = 0; i < N; i++)
				a2[i] = a1[i];

			Stopwatch timer1 = new Stopwatch();
			MSD.sort(a1);
			t1 += timer1.elapsedTime();

			Stopwatch timer2 = new Stopwatch();
			Quick3string.sort(a2);
			t2 += timer2.elapsedTime();
		}

		StdOut.println("For " + N + " random Items:");
		StdOut.printf("MSD          sort takes: %5.2f\n", t1/10);
		StdOut.printf("Quick3string sort takes: %5.2f\n", t2/10);
	}

	public static void fixed(int N, int W)
	{
		double t1 = 0.0;
		double t2 = 0.0;
		double t3 = 0.0;
		for (int t = 0; t < 10; t++)
		{
			String[] a1 = RandomFixedLengthWords.generate(N, W);
			String[] a2 = new String[N];
			String[] a3 = new String[N];
			for (int i = 0; i < N; i++)
			{
				a2[i] = a1[i];
				a3[i] = a1[i];
			}

			Stopwatch timer1 = new Stopwatch();
			MSD.sort(a1);
			t1 += timer1.elapsedTime();

			Stopwatch timer2 = new Stopwatch();
			Quick3string.sort(a2);
			t2 += timer2.elapsedTime();

			Stopwatch timer3 = new Stopwatch();
			LSD.sort(a3, W);
			t3 += timer3.elapsedTime();
		}

		StdOut.println("For " + N + " fixed Items (length " + W + "):");
		StdOut.printf("MSD          sort takes: %5.2f\n", t1/10);
		StdOut.printf("Quick3string sort takes: %5.2f\n", t2/10);
		StdOut.printf("LSD          sort takes: %5.2f\n", t3/10);
	}

	public static void main(String[] args)
	{
		int N = Integer.parseInt(args[0]);
		int W1 = Integer.parseInt(args[1]);
		int W2 = Integer.parseInt(args[2]);
		random(N);
		fixed(N, W1);
		fixed(N, W2);
	}
}
```
And the result is consistent with the table on the text book:
```
$ java Timings 1000000 30 5
For 1000000 random Items:
MSD          sort takes:  1.46
Quick3string sort takes:  0.50
For 1000000 fixed Items (length 30):
MSD          sort takes:  0.26
Quick3string sort takes:  0.42
LSD          sort takes:  7.35
For 1000000 fixed Items (length 5):
MSD          sort takes:  0.27
Quick3string sort takes:  0.40
LSD          sort takes:  0.89
```
