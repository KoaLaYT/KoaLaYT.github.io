# Chapter 5 / Section 3 : Substring Search

## Main Content

### 1. Brute-force substring search

Version 1 :

```java
public static int search(String pat, String txt)
{
    int M = pat.length();
    int N = txt.length();
    for (int i = 0; i <= N-M; i++)
    {
        int j;
        for (j = 0; j < M; j++)
            if (pat.charAt(j) != txt.charAt(i+j))
                break;
        if (j == M) return i;
    }
    return N;
}
```

Version 2 :

```java
public static int search(String pat, String txt)
{
    int M = pat.length();
    int N = txt.length();
    int i, j;
    for (i = 0, j = 0; i < N && j < M; i++)
    {
        if (pat.charAt(j) == txt.charAt(i))
            j++;
        else
        {
            i -= j;
            j = 0;
        }
    }
    if (j == M) return i-M;
    else return N;
}
```

![Brute-force substring trace](../img/BruteForceSubstringSearchTrace.png)

**Brute-force substring search analysis** :

> Brute-force substring search requires ~NM character compares to search for a pattern of length M in a text of length N in the worst case.

### 2. Knuth-Morris-Pratt substring search

The basic idea of this algorithm is that whenever we detect a mismatch, we already know some of the characters in the text. We can take advantage of this information to avoid backing up the text pointer over all those known characters.

```java
public class KMP
{
    private int[][] dfa;
    private String pat;
    
    public KMP(String pat)
    {
        this.pat = pat;
        int M = pat.length();
        int R = 256;
        dfa = new int[R][M];
        
        dfa[pat.charAt(0)][0] = 1;
        for (int X = 0, j = 1; j < M; j++)
        {
            for (int c = 0; c < R; c++)
            	dfa[c][j] = dfa[c][X];
            dfa[pat.charAt(j)][j] = j+1;
            X = dfa[pat.charAt(j)][X];
        }
    }
    
    public static int search(String txt)
    {
        int N = txt.length();
        int M = pat.length();
        int i, j;
		for (i = 0, j = 0; i < N && j < M; i++)
            j = dfa[txt.charAt(i)][j];
        if (j == M) return i-M;
        else return N;
    }
}
```

Here is the constructing trace of DFA for KMP substring search : (image from text book)

![DFA](../img/DFA.png)

And here is the trace of KMP substring search : (image from text book)

![KMP trace](../img/KMPTrace.png)

**KMP substring search analysis** :

> Knuth-Morris-Pratt substring search accesses on more than M+N characters to search for a pattern of length M in a text of length N.

### 3. Boyer-Moore substring search

When backup in the text string is not a problem, this algorithm can be significantly faster by scanning the pattern from *right* to *left*.

Its principle is as follow : (image from text book)

![Boyer-Moore basic idea](../img/BoyerMooreBasicIdea.png)

```java
public class BoyerMoore
{
    private int[] right;
    private String pat;
    
    public BoyerMoore(String pat)
    {
        this.pat = pat;
        int M = pat.length();
        int R = 256;
        right = new int[R];
        for (int i = 0; i < R; i++)
            right[i] = -1;
        for (int i = 0; i < M; i++)
            right[pat.charAt(i)] = i;
    }
    
    public static int search(String txt)
    {
        int N = txt.length();
        int M = pat.length();
        int skip;
        for (int i = 0; i <= N-M; i += skip)
        {
            skip = 0;
            for (int j = M-1; j >= 0; j--)
                if (txt.charAt(i+j) != pat.charAt(j))
                {
                    skip = j - right[txt.charAt(i+j)];
                    if (skip < 1) skip = 1;
                    break;
                }
            if (skip == 0) return i;
        }
        return N;
    }
}
```

**Boyer-Moore substring search analysis** :

> On typical inputs, substring search with the Boyer-Moore mismatched character heuristic uses ~N/M character compares to search for a pattern of length M in a text of length N.

### 4. Rabin-Karp fingerprint search

This method is based on hashing. We computed a hash function for the pattern and then look for a match by using the same hash function for each possible M-character substring of the text. If we find a text substring with the same hash value as the pattern, we can check for a match. M. O. Rabin and R. A. Karp develop a method that can compute hash function for M-character substrings in constant time, which leads to a *linear-time* substring search in practical situations. And the following figure is its basic idea : (image from text book)

![Rabin-Karp substring search basic](../img/RabinKarpSubstringSearchBasic.png)

```java
public class RabinKarp
{
    private String pat;
    private long patHash;
    private long RM;
    private long Q;
    private int M;
    private int R = 256;
    
    private long hash(String key, int M)
    {
        long h = 0;
        for (int i = 0; i < M; i++)
            h = (h*R + key.charAt(i)) % Q;
        return h;
    }
    
    private boolean check(int i)
    { return true; }
    
    public RabinKarp(String pat)
    {
        this.pat = pat;
        M = pat.length();
        Q = longRandomPrime();
        RM = 1;
        for (int i = 1; i < M; i++)
            RM = (RM*R) % Q;
        patHash = hash(pat, M);
    }
    
    public int search(String txt)
    {
        int N = txt.length();
        long txtHash = hash(txt, M);
        if (txtHash == patHash)
            if (check(0))
                return 0;
        for (int i = M; i < N; i++)
        {
            txtHash = (txtHash + Q - (RM*txt.charAt(i-M)) % Q) % Q;
            txtHash = (txtHash*R + txt.charAt(i)) % Q;
            if (txtHash == patHash && check(i-M+1))
                return i-M+1;
        }
        return N;
    }
}
```

Here is an example of Rabin-Karp substring search : (image from text book)

![Rabin-Karp substring search example](../img/RabinKarpSubstringSearchExample.png)

**Rabin-Karp substring search analysis** :

> The Monte Carlo version of Rabin-Karp substring search is linear-time and extremely likely to be correct, and the Las Vegas version of Rabin-Karp substring search is correct and extremely likely to be linear-time.

### 5. Summary

![Substring search comparison](../img/SubstringSearchComparison.png)

## Exercise
### 5.3.1
> Develop a brute-force substring search implementation Brute , using the same API as Algorithm 5.6.

```java
import edu.princeton.cs.algs4.StdOut;

public class Brute
{
	private String pat;

	public Brute(String pat)
	{
		this.pat = pat;
	}

	public int search(String txt)
	{
		int N = txt.length();
		int M = pat.length();

		for (int i = 0; i <= N-M; i++)
		{
			int j;
			for (j = 0; j < M; j++)
				if (txt.charAt(i+j) != pat.charAt(j))
					break;
			if (j == M)
				return i;
		}

		return N;
	}

	public static void main(String[] args)
	{
		String pat = args[0];
		String txt = args[1];
		Brute b = new Brute(pat);
		int offset = b.search(txt);
		StdOut.println("text:    " + txt);
		StdOut.print("pattern: ");
		for (int i = 0; i < offset; i++)
			StdOut.print(" ");
		StdOut.println(pat);
	}
}
```

### 5.3.3
> Give the dfa\[ ]\[ ]array for the Knuth-Morris-Pratt algorithm for the pattern A B R A C A D A B R A , and draw the DFA, in the style of the figures in the text.

![](../img/DFA.jpg)

### 5.3.24 Find all occurrences.
> Add a method findAll() to each of the four substringsearch algorithms given in the text that returns an Iterable<Integer> that allows clients to iterate through all offsets of the pattern in the text.

For `Brute`:

```java
public Iterable<Integer> findAll(String txt)
{
    int N = txt.length();
    int M = pat.length();
    Queue<Integer> q = new Queue<>();

    for (int i = 0; i <= N-M; i++)
    {
        int j;
        for (j = 0; j < M; j++)
            if (txt.charAt(i+j) != pat.charAt(j))
                break;
        if (j == M)
            q.enqueue(i);
    }

    return q;
}
```

And the test result is as follow:

```
$ java Brute ACG < test.txt 
TCGAGCTTACGTGCTAGCTAAGCTAGAGCTAGCATACGTTTTACGTGTGACG
        ACG
                                   ACG
                                          ACG
                                                 ACG
```

For `KMP`:

```java
public Iterable<Integer> findAll(String txt)
{
    int N = txt.length();
    int M = pat.length();
    Queue<Integer> q = new Queue<>();

    for (int i = 0, j = 0; i < N; i++)
    {
        j = dfa[txt.charAt(i)][j];
        if (j == M)
        {
            q.enqueue(i-M+1);
            j = 0;
        }
    }

    return q;
}
```

For `Boyer-Moore`:

```java
public Iterable<Integer> findAll(String txt)
{
    int N = txt.length();
    int M = pat.length();
    Queue<Integer> q = new Queue<>();

    int skip;
    for (int i = 0; i <= N-M; i += skip)
    {
        skip = 0;
        for (int j = M-1; j >= 0; j--)
            if (txt.charAt(i+j) != pat.charAt(j))
            {
                skip = j - right[txt.charAt(i+j)];
                if (skip < 1)
                    skip = 1;
                break;
            }
        if (skip == 0)
        {
            q.enqueue(i);
            skip = M;
        }
    }

    return q;
}
```

For `Rabin-Karp`:

```java
public Iterable<Integer> findAll(String txt)
{
    int N = txt.length();
    long txtHash = hash(txt, M);
    Queue<Integer> q = new Queue<>();

    if (txtHash == patHash)
        q.enqueue(0);
    for (int i = M; i < N; i++)
    {
        txtHash = (txtHash + Q - (RM*txt.charAt(i-M)) % Q) % Q;
        txtHash = (txtHash*R + txt.charAt(i)) % Q;
        if (txtHash == patHash)
            q.enqueue(i-M+1);
    }

    return q;
}
```

And these functions all have same test result with `Brute`.

### 5.3.26 Cyclic rotation check.
> Write a program that, given two strings, determines whether one is a cyclic rotation of the other, such as example and ampleex.

This exercise is exactly the same with exercise 1.2.6:

```java
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.KMP;

public class CyclicRotationCheck
{
	public static void main(String[] args)
	{
		String s1 = args[0];
		String s2 = args[1];

		int offset1 = check(s1, s2);
		int offset2 = check(s2, s1);
		if (offset1 != -1 && offset2 != -1)
		{
			print(s1, s2, offset1);
			print(s2, s1, offset2);
		}
		else
			StdOut.println(s1 + " " + s2 + " are not cyclic rotations");
	}

	private static void print(String v, String w, int offset)
	{
		StdOut.println(v+v);
		for (int i = 0; i < offset; i++)
			StdOut.print(" ");
		StdOut.println(w);
	}

	public static int check(String v, String w)
	{
		int V = v.length();
		int W = w.length();
		if (V != W)
			return -1;
		KMP finder = new KMP(w);
		int offset = finder.search(v+v);
		if (offset == 2*V)
			return -1;
		else
			return offset;
	}
}
```

And here are the test result:

```
$ java CyclicRotationCheck example ampleex
exampleexample
  ampleex
ampleexampleex
     example
     
$ java CyclicRotationCheck apple banana
apple banana are not cyclic rotations
```

### 5.3.30 Two-dimensional search.
> Implement a version of the Rabin-Karp algorithm to search for patterns in two-dimensional text. Assume both pattern and text are rectangles of characters.

For a two-dimension pattern, I plus all rows together so that it can be treated as a normal String:

```java
import edu.princeton.cs.algs4.StdOut;

public class TwoDimensionalSearch
{
	private String[] pat;
	private int I;
	private int J;
	private int R = 256;
	private long Q = 997;
	private long RM;
	private long patHash;

	public TwoDimensionalSearch(String[] pat)
	{
		this.pat = pat;
		I = pat.length;
		J = pat[0].length();
		RM = 1;
		for (int i = 1; i <= J-1; i++)
			RM = (R*RM) % Q;
		patHash = hash(pat, 0, I, J);
	}

	private long hash(String[] pat, int lo, int hi, int J)
	{
		long h = 0;
		for (int j = 0; j < J; j++)
		{
			int key = 0;
			for (int i = lo; i < hi; i++)
				key += pat[i].charAt(j);
			h = (R*h + key) % Q;
		}
		return h;
	}

	public void search(String[] txt, int[] result)
	{
		int N = txt.length;
		int M = txt[0].length();
		result[0] = -1;
		result[1] = -1;

		for (int n = 0; n <= N-I; n++)
		{
			long txtHash = hash(txt, n, I+n, J);
			if (txtHash == patHash)
			{
				result[0] = n;
				result[1] = 0;
				return;
			}

			for (int j = J; j < M; j++)
			{
				int key = 0;
				int next = 0;
				for (int i = 0; i < I; i++)
				{
					key += txt[i+n].charAt(j-J);
					next += txt[i+n].charAt(j);
				}
				txtHash = (txtHash + Q - RM*key % Q) % Q;
				txtHash = (txtHash*R + next) % Q;
				
				if (txtHash == patHash)
				{
					result[0] = n;
					result[1] = j-J+1;
					return;
				}
			}
		}

		return;
	}
	
	public static void main(String[] args)
	{
		String[] pat = { "123",
				 "456",
				 "789" };
		String[] txt = { "01234567",
				 "65432107",
				 "01231236",
				 "01234565",
				 "32107894" };
		TwoDimensionalSearch finder = new TwoDimensionalSearch(pat);
		int[] result = new int[2]; 
		finder.search(txt, result);
		StdOut.println("Text:");
		for (String s : txt)
			StdOut.println(s);
		StdOut.println("Pattern:");
		for (String s : pat)
			StdOut.println(s);
		StdOut.printf("pattern start at: (%d, %d)\n", result[0], result[1]);
	}
}
```

And here is the test result:

```
$ java TwoDimensionalSearch
Text:
01234567
65432107
01231236
01234565
32107894
Pattern:
123
456
789
pattern start at: (2, 4)
```
