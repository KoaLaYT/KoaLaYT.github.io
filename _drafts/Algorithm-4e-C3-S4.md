# Chapter 3 / Section 4 : Hash Tables

## Main Content

Search algorithm that use hashing consist of two separate parts :

1. compute a *hash function* that transforms the search key into an array index
2. *collision-resolution* process that deals with the situation when two or more different keys hash to a same array index

### 1. Hash functions

The three primary requirements in implementing a good hash function for a given data type :

- It should be *consistent* - equal keys must produce the same hash value
- It should be *efficient* to compute
- It should *uniformly distribute* the key

When we using hashing, we make the following fundamental assumption :

> The hash functions that we use uniformly and independently distribute keys among the integer values between 0 and M-1

### 2. Hashing with separate chaining

This method is to build for each of the M array indices, a linked list of the key-value pairs whose keys hash to that index. The basic idea is to choose a sufficiently large `M` so that the lists are sufficiently short to enable efficient search through a two-step process : 

1. hash to find the list that contain the key
2. sequentially search through that list for the key

This figure shows a standard indexing client of  hashing with separate chaining : (image from text book)

![Hash with separate chaining](../img/HashWithSeparateChaining.png)

The implementation is as follow :

```java
public class SeparateChainingHashST<Key, Value>
{
    private SequentialSearchST<Key, Value>[] st;
    private int N;
    private int M;
    
    public SeparateChainingHashST()
    { this(997); }
    
    public SeparateChainingHashST(int M)
    {
        this.M = M;
        st = (SequentialSearchST<Key, Value>[]) new SequentialSearchST[M];
        for (int i = 0; i < M; i++)
            st[i] = new SequentialSearchST();
    }
    
    private int hash(Key key)
    { return (key.hashcode() & 0x7fffffff) % M; }
    
    public Value get(Key key)
    { return (Value) st[hash(key)].get(key); }
    
    public void put(Key key, Value val)
    { st[hash(key)].put(key, val); }
}
```

**Separate-chaining hash table analysis** :

> In a separate-chaining hash table with M lists and N keys :
>
> - the probability that the number of keys in a list is within a small constant factor of N/M is extremely close to 1. 
>
> - the number of compares for search miss and insert is ~N/M.

### 3. Hashing with linear probing

We can use a hash table of size M > N, which N represent the number of key-value pairs, relying on empty entries in the table to help with collision resolution. A simplest method applying this principle is called *linear probing* : when there is a collision, we just check the next entry in the table. Thus, there are three possible outcomes :

1. Key equal to search key : search hit
2. Empty position : search miss
3. Key not equal to search key : try next entry

This is the trace of a linear-probing hash table : (image from text book)

![LinearProbingHashST trace](../img/LinearProbingHashSTTrace.png)

The implementation is as follow :

```java
public class LinearProbingHashST<Key, Value>
{
    private Key[] keys;
    private Value[] vals;
    private int N;
    private int M = 16;
    
    public LinearProbingHashST()
    {
        keys = (Key[]) new Object[M];
        vals = (Value[]) new Object[M];
    }
    
    private int hash(Key key)
    { return (key.hashcode() & 0x7fffffff) % M; }
    
    public Value get(Key key)
    {
        int k = hash(key);
        for (int i = k; keys[i] != null; i = (i+1) % M)
            if (keys[i].equals(key))
                return vals[i];
        return null;
    }
    
    public void put(Key key, Value val)
    {
        if (N >= M/2) resize(2*M);
        int i;
        for (i = hash(key); keys[i] != null; i = (i+1) % M)
            if (keys[i].equals(key))
            {
                vals[i] = val;
                return;
            }
        keys[i] = key;
        vals[i] = val;
        N++;
    }
}
```

The `delete()` method is trickier than it might seem :

```java
public void delete(Key key)
{
    if (!contains(key)) return;
    int i = hash(key);
    while (!keys[i].equals(key))
        i = (i+1) % M;
    keys[i] = null;
    vals[i] = null;
    i = (i+1) % M;
    while (keys[i] != null)
    {
        Key keyReput = keys[j];
        Value valReput = vals[j];
        keys[j] = null;
        vals[j] = null;
        N--;
        put(keyReput, valReput);
        i = (i+1) % M;
    }
    N--;
    if (N > 0 && N == M/8) resize(M/2);
}
```

Here is the `resize()` method's implementation :

```java
private void resize(int cap)
{
    LinearProbingHashST<Key, Value> t = new LinearProbingHashST<>(cap);
    for (int i = 0; i < M; i++)
        if (keys[i] != null)
            t.put(keys[i], vals[i]);
    keys = t.keys;
    vals = t.vals;
    M = t.M;
}
```

**Linear-probing hash table analysis** :

> In a linear-probing hash table with M lists and N = a M keys, the average number of probes required is
>
> ![equation](http://latex.codecogs.com/gif.latex?\sim\frac{1}{2}(1&space;+&space;\frac{1}{1&space;-&space;a})&space;and&space;\sim\frac{1}{2}(1&space;+&space;\frac{1}{(1-a)^2}))
> 
> for search hits and search misses (or inserts), respectively.
> 
> Suppose a hash table is built with array resizing, starting with an empty table. Any sequence of t search, insert, and delete symbol-table operations is executed in expected time proportional to t and with memory usage always within a constant factor of the number of keys in the table.

### 4. Memory

Understanding memory usage is an important factor if we want to tune hashing algorithm for optimum performance. Here is a table of space usage in different symbol tables : (image from text book)

![Space usage in ST](../img/SpaceUsage.png)

## Exercise
### 3.4.32 Hash attack.
> Find 2 N strings, each of length 2 N , that have the same hashCode() value, supposing that the hashCode() implementation for String is the following:
```
public int hashCode()
{
    int hash = 0;
    for (int i = 0; i < length(); i ++)
    hash = (hash * 31) + charAt(i);
    return hash;
}
```
I write a program that can compute all 4-letter strings that have same `hashCode()` value:
```java
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.LinearProbingHashST;
import edu.princeton.cs.algs4.Queue;

public class HashAttack
{
	public static int hashCode(String s)
	{
		int hash = 0;
		for (int i = 0; i < s.length(); i++)
			hash = (hash * 31) + s.charAt(i);
		return hash;
	}

	public static void main(String[] args)
	{
		int[] charIndex = new int[52];
		for (int i = 0; i < 26; i++)
			charIndex[i] = i;
		for (int i = 26; i < 52; i++)
			charIndex[i] = i + 6;

		LinearProbingHashST<Integer, Queue<String>> st = new LinearProbingHashST<>();

		for (int i = 0; i < 52; i++)
			for (int j = 0; j < 52; j++)
				for (int k = 0; k < 52; k++)
					for (int l = 0; l < 52; l++)
					{
						char[] four = new char[4];
						four[0] = (char) (65 + charIndex[i]);
						four[1] = (char) (65 + charIndex[j]);
						four[2] = (char) (65 + charIndex[k]);
						four[3] = (char) (65 + charIndex[l]);
						String s = new String(four);
						int key = hashCode(s);

						if(!st.contains(key))
							st.put(key, new Queue<String>());
						st.get(key).enqueue(s);
					}
		for (Integer k : st.keys())
		{
			if (st.get(k).size() > 1)
			{
				StdOut.print(k + ":");
				for (String s : st.get(k))
					StdOut.print(" " + s);
				StdOut.println();
			}
		}
	}
}
```
And here is some of the result, the number represent the `hashCode()` value:
```
...
3754135: zyia zyjB zzJa zzKB
3754136: zyib zyjC zzJb zzKC
3754137: zyic zyjD zzJc zzKD
3754138: zyid zyjE zzJd zzKE
3754139: zyie zyjF zzJe zzKF
3754140: zyif zyjG zzJf zzKG
3754141: zyig zyjH zzJg zzKH
3754142: zyih zyjI zzJh zzKI
3754143: zyii zyjJ zzJi zzKJ
3754144: zyij zyjK zzJj zzKK
3754145: zyik zyjL zzJk zzKL
3754146: zyil zyjM zzJl zzKM
3754147: zyim zyjN zzJm zzKN
3754148: zyin zyjO zzJn zzKO
...
```
