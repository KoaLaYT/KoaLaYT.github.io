# Chapter 5 / Section 2 : Tries

## Main Content

We can take advantage of properties of strings to develop search methods that can be more efficient than the general-purpose methods for typical application where search keys are strings.

![ST with string keys API](../img/TriesAPI.png)

### 1. Tries

![Anatomy of a trie](../img/AnatomyOfTrie.png)

- search in a trie

![Tries search example](../img/TriesSearch.png)

- insert into a trie

![Tries insertion example](../img/TriesInsertion.png)

- Node representation

![Tries representation](../img/TriesRepresentation.png)

```java
public class Tries<Value>
{
    private static int R = 256;
    private Node root;
    
    private static class Node
    {
        Object val;
        Node[] next = new Node[R];
    }
    
    public void put(String key, Value val)
    {
        root = put(root, key, val, 0);
    }
    
    private Node put(Node x, String key, Value val, int d)
    {
        if (x == null) x = new Node();
        if (d == key.length()) { x.val = val; return x;}
        char c = key.charAt(d);
        x.next[c] = put(x.next[c], key, val, d+1);
        return x;
    }
    
    public Value get(String key)
    {
        Node x = get(root, key, 0);
        if (x == null) return null;
        else return (Value) x.val;
    }
    
    private Node get(Node x, String key, int d)
    {
        if (x == null) return null;
        if (d == key.length()) return x;
        char c = key.charAt(d);
        return get(x.next[c], key, d+1);
    }
    
    public Iterable<String> keysWithPrefix(String s)
    {
        Queue<String> q = new Queue<>();
        collect(get(root, s, 0), s, q);
        return q;
    }
    
    private void collect(Node x, String s, Queue<String> q)
    {
        if (x == null) return;
        if (x.val != null) q.enqueue(s);
        for (char c = 0; c < R; c++)
            collect(x.next[c], s+c, q);
    }
    
    public Iterable<String> keysThatMatch(String s)
    {
        Queue<String> q = new Queue<>();
        collect(root, s, "", q);
        return q;
    }
    
    private void collect(Node x, String pat, String pre, Queue<String> q)
    {
        int d = pre.length();
        if (x == null) return;
        if (d == pat.length() && x.val != null) q.enqueue(pat);
        if (d == pat.length()) return;
        char next = pat.charAt(d);
        for (char c = 0; c < R; c++)
            if (next == c || next == '.')
                collect(x.next[c], pat, pre+c, q);
    }
    
    public String longestPrefixOf(String s)
    {
        int length = search(root, s, 0, 0);
        return s.substring(0, length);
    }
    
    private int search(Node x, String s, int length, int d)
    {
        if (x == null) return length;
        if (x.val != null) length = d;
        if (d == s.length()) return length;
        return search(x.next[s.charAt(d)], s, length, d+1);
    }
    
    public void delete(String key)
    {
        root = delete(root, key, 0);
    }
    
    private Node delete(Node x, String key, int d)
    {
        if (x == null) return null;
        if (d == key.length()) 
            x.val = null;
        else
        {
            char c = key.charAt(d);
            x.next[c] = delete(x.next[c], key, d+1);
        }
        
        if (x.val != null) return x;
        for (char r = 0; r < R; r++)
            if (x.next[r] != null)
                return x;
        return null;
    }
}
```

**Tries analysis** :

> - The number of array access when searching in a tries or inserting a key into a trie is at most 1 plus the length of the key.
> - The average number of nodes examined for search miss in a trie built from N random keys over an alphabet of size R is ~log<sub>R</sub>N.
> - The number of links in a trie is between RN and RNw, where w is the average key length.

### 2. Ternary search tries (TSTs)

The ternary search trie can help us avoid the excessive space cost associated with R-way tries.

Following two figures show its basic idea : (image from text book)

![TST representation](../img/TSTRepresentation.png)

![TST search example](../img/TSTSearch.png)

```java
public class TST<Value>
{
    private Node root;
    
    private class Node
    {
        char c;
        Value val;
        Node left, mid, right;
    }
    
    public void put(String key, Value val)
    {
        root = put(root, key, val, 0);
    }
    
    private Node put(Node x, String key, Value val, int d)
    {
        char c = key.charAt(d);
        if (x == null) 
        {
            x = new Node();
            x.c = c;
        }
        if (c < x.c) x.left = put(x.left, key, val, d);
        else if (c > x.c) x.right = put(x.right, key, val, d);
        else if (d < key.length()-1)
            x.mid = put(x.mid, key, val, d+1);
        else
            x.val = val;
        return x;
    }
    
    public Value get(String key)
    {
        Node x = get(root, key, 0);
        if (x == null) return null;
        else return x.val;
    }
    
    private Node get(Node x, String key, int d)
    {
        if (x == null) return null;
        char c = key.charAt(d);
        if (c < x.c) return get(x.left, key, d);
        else if (c > x.c) return get(x.right, key, d);
        else if (d < key.length()-1) return get(x.mid, key, d+1);
        else return x;
    }
}
```

**TST analysis** :

> - The number of links in a TST built from N string keys of average length w is between 3N and 3Nw.
>
> - A search miss in a TST built from N random string keys requires ~lnN character compares on the average. A search hit or an insertion in a TST uses a character compare for each character in the search key.

### 3. Summary

![Performance of string-searching algorithm](../img/StringSearchAlgorithmComparison.png)

## Exercise
### 5.2.8 Ordered operations for tries.
> Implement the floor() , ceil() , rank() , select() (from our standard ordered ST API from Chapter 3) for TrieST .

Here is my implementation:
```java
public String floor(String s)
{
	return longestPrefixOf(s);
}

public String ceiling(String s)
{
	return collect(get(root, s, 0), s);
}

private String collect(Node x, String s)
{
	if (x == null)
		return null;
	if (x.val != null)
		return s;
	String t = null;
	for (char c = 0; c < R; c++)
	{
		t = collect(x.next[c], s+c);
		if (t != null)
			break;
	}
	return t;
}
	
public int rank(String s)
{
	return rank(root, s, 0);
}

private int rank(Node x, String s, int d)
{
	if (x == null)
		return 0;
	if (d == s.length())
		return 0;

	int t = 0;
	if (x.val != null)
		t++;
	char c = s.charAt(d);
	t += rank(x.next[c], s, d+1);
	
	for (char r = 0; r < c; r++)
		if (x.next[r] != null)
			t += x.next[r].N;
	return t;
}

public String select(int k)
{
	return select(root, k);
}

private String select(Node x, int k)
{
	if (k == 0)
		return "";
	String s = "";
	int rank = 0;
	for (char c = 0; c < R; c++)
		if (x.next[c] != null)
		{
			rank += x.next[c].N;
			if (rank >= k)
			{
				if (x.next[c].val != null)
					k--;
				s = c + select(x.next[c], k-rank+x.next[c].N);
				break;
			}
		}
	return s;
}
```
And here is the test of these functions:
```
$ java MyTrieST < test.txt 
she sells sea shells by the shore seashore bye bar 
by : 4
Longest prefix of shell: she
Longest prefix of shellsort: shells
Keys with prefix she: she shells
Keys that match s..: sea she
Floor of bye: bye
Ceiling of shell: shells
Ceiling of s: sea
Rank of she: 6
Rank of shell: 7
Rank of shellsort: 8
Rank of the: 9
Rank of they: 10
Select 1st key: bar
Select 2nd key: by
Select 3rd key: bye
Select 4th key: sea
Select 5th key: seashore
Select 6th key: sells
Select 7th key: she
Select 8th key: shells
10 keys in total
After delete sea, 9 keys in total
```

### 5.2.9 Extended operations for TSTs.
> Implement keys() and the extended operations introduced in this section— longestPrefixOf() , keysWithPrefix() , and keysThatMatch() —for TST .

Here is the implementation:
```java
public String longestPrefixOf(String s)
{
	int length = search(root, s, 0, 0);
	return s.substring(0, length+1);
}

private int search(Node x, String s, int length, int d)
{
	if (x == null)
		return length;
	char c = s.charAt(d);
	if (x.c < c)
		length =  search(x.right, s, length, d);
	else if (x.c > c)
		length =  search(x.left, s, length, d);
	else 
	{
		if (x.val != null)
			length = d;
		if (d < s.length()-1)
			length = search(x.mid, s, length, d+1);
	}
	return length;
}

public Iterable<String> keysWithPrefix(String s)
{
	Queue<String> q = new Queue<>();
	Node x = get(root, s, 0);
	if (x.val != null)
		q.enqueue(s);
	if (x == root)
		collect(x, s, q);
	else
		collect(x.mid, s, q);
	return q;
}

private void collect(Node x, String s, Queue<String> q)
{
	if (x == null) 
		return;
	if (x.val != null)
		q.enqueue(s + x.c);
	collect(x.left, s, q);
	collect(x.right, s, q);
	collect(x.mid, s+x.c, q);
}

public Iterable<String> keysThatMatch(String pat)
{
	Queue<String> q = new Queue<>();
	collect(root, "", pat, q);
	return q;
}

private void collect(Node x, String s, String pat, Queue<String> q)
{
	int d = s.length();
	if (x == null) 
		return;

	char next = pat.charAt(d);
	if (next < x.c || next == '.')
		collect(x.left, s, pat, q);
       	if (next > x.c || next == '.')
		collect(x.right, s, pat, q);
	if (next == x.c || next == '.')
	{
		if (d == pat.length()-1 && x.val != null)
		{
			q.enqueue(s+x.c);
			return;
		}
		if (d == pat.length()-1)
			return;
		collect(x.mid, s+x.c, pat, q);
	}
}

public Iterable<String> keys()
{
	return keysWithPrefix("");
}
```

### 5.2.14 Unique substrings of length L.
> Write a TST client that reads in text from standard input and calculates the number of unique substrings of length L that it contains. For example, if the input is cgcgggcgcg , then there are five unique substrings of length 3: cgc , cgg , gcg , ggc , and ggg . Hint : Use the string method substring(i, i + L) to extract the i th substring, then insert it into a symbol table.

The hint is quite clear:
```java
import edu.princeton.cs.algs4.TST;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.StdIn;

public class UniqueSubstringsOfLength
{
	public static void main(String[] args)
	{
		int L = Integer.parseInt(args[0]);
		String s = StdIn.readAll();

		TST<Integer> st = new TST<>();
		for (int i = 0; i+L <= s.length(); i++)
		{
			String sub = s.substring(i, i+L);
			if (!st.contains(sub))
				st.put(sub, i);
		}
		StdOut.println("Unique substring: " + st.size());
		for (String a : st.keys())
			StdOut.println("  " + a);
	}
}
```

### 5.2.22 Typing monkeys.
> Suppose that a typing monkey creates random words by appending each of 26 possible letter with probability p to the current word and finishes the word with probability 1-26p. Write a program to estimate the frequency distribution of the lengths of words produced. If "abc" is produced more than once, count it only once.

The main program is simple:
```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdDraw;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.TST;
import edu.princeton.cs.algs4.ST;
import java.awt.Font;

public class TypingMonkey
{
	public static void main(String[] args)
	{
		double p = Double.parseDouble(args[0]);
		int N = Integer.parseInt(args[1]);
		TST<Integer> st = new TST<>();
		ST<Integer, Integer> pst = new ST<>();

		for (int i = 0; i < N; i++)
		{
			String s = inputWord(p);
			int length = s.length();

			pst.put(0, 0);
			if (length == 0)
				pst.put(0, pst.get(0)+1);
			else if (!st.contains(s))
			{
				st.put(s,i);
				if (!pst.contains(length))
					pst.put(length, 1);
				else
					pst.put(length, pst.get(length)+1);
			}
		}

        // code that used to draw the result
		int total = 0;
		int max = 0;
		int maxIndex = 0;
		for (Integer i : pst.keys())
		{
			int t = pst.get(i);
			if (t > max)
			{
				max = t;
				maxIndex = i;
			}
			total += t;
		}

		StdDraw.setXscale(-1, pst.size()+1);
		StdDraw.setYscale(-(max+0.0)/total*0.05, (max+0.0)/total*1.05);

		Font f = new Font("sans serif", Font.PLAIN, 12);
		StdDraw.setFont(f);
		for (Integer i : pst.keys())
		{
			StdDraw.filledRectangle(i, (pst.get(i)+0.0)/total/2, 0.4, (pst.get(i)+0.0)/total/2);
			StdDraw.text(i, -(max+0.0)/total*0.02, i.toString());
		}
		double prob = (pst.get(maxIndex)+0.0) / total;
		String probText = String.format("%.2f", prob);
		StdDraw.text(maxIndex, prob*1.02, probText);
	}

	private static String inputWord(double p)
	{
		double end = 1 - 26 * p;
		String s = "";
		while (!StdRandom.bernoulli(end))
			s += (char) StdRandom.uniform(97, 123);
		return s;
	}
}
```
And here are three pictures of the result when p = 0.1, 0.2 and 0.35:

![](../img/TypingMonkey-0.01p.jpg)

![](../img/TypingMonkey-0.02p.jpg)

![](../img/TypingMonkey-0.035p.jpg)
