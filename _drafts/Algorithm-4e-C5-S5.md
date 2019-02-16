# Chapter 5 / Section 5 : Data Compression

## Main Content

### 1. Rules of games

Basic model :

- A *compress* box that transforms a bitstream B into a compressed version C(B)
- An *expand* box that transforms C(B) back into B

![Basic model for data compression](../img/BasicModelForDataCompression.png)

### 2. Run-length encoding

The simplest type of redundancy in a bitstream is long runs of repeated bits. The *run-length encoding* is taking advantage of this redundancy to compress data.

```java
public class RunLength
{
    public static void expand()
    {
        boolean b = false;
        while (!BinaryStdIn.isEmpty())
        {
            char length = BinaryStdIn.readChar();
            for (int i = 0; i < length; i++)
                BinaryStdOut.write(b);
            b = !b;
        }
        BinaryStdOut.close();
    }
    
    public static void compress()
    {
        char cnt = 0;
        boolean b, oldb = false;
        while (!BinaryStdIn.isEmpty())
        {
            b = BinaryStdIn.readBoolean();
            if (b != oldb)
            {
                BinaryStdOut.write(cnt);
                cnt = 0;
                oldb = !oldb;
            }
            if (cnt == 255)
            {
                BinaryStdOut.write(cnt);
                cnt = 0;
                BinaryStdOut.write(cnt);
            }
            cnt++;
        }
        BinaryStdOut.write(cnt);
        BinaryStdOut.close();
    }
}
```

![Compressing and expanding bitstream with run-length encoding](../img/RunLengthExample.png)

### 3. Huffman compression

Instead of using the usual 7 or 8 bits for each character, we use *variable-length prefix-free codes* to encode the characters that appear often with fewer bits than for those that appear rarely. And we can use a trie to represent the prefix-free code : (image from text book)

![two prefix-free codes](../img/PrefixFreeCodeTrie.png)

The complete implementation of Huffman compression takes the following steps :

- To compress a stream :

1. Read the input
2. Tabulate the frequency of occurrence of each char value in the input
3. Build the Huffman encoding trie corresponding to those frequencies
4. Build the corresponding codeword table, to associate a bitstring with each char value in the input
5. Write the trie, encoded as a bitstring
6. Write the count of characters in the input, encoded as a bitstring
7. Use the codeword table to write for each input character

- To expand a bitstream :

1. Read the trie
2. Read the count of characters to be decoded
3. Use the trie to decode the bitstream

```java
public class Huffman
{
    private static int R = 256;
    private static class Node implements Comparable<Node>
    {
        char c;
        int freq;
        Node left, right;
        
        public Node(char c, int freq, Node left, Node right)
        {
            this.c = c;
            this.freq = freq;
            this.left = left;
            this.right = right;
        }
        
        public boolean isLeaf()
        { return x.left == null && x.right == null; }
        
        public int compareTo(Node that)
        { return this.freq - that.freq; }
    }
    
    public static void expand()
    {
        Node root = readTrie();
        int N = BinaryStdIn.readInt();
        for (int i = 0; i < N; i++)
        {
            Node x = root;
            while (!x.isLeaf())
            {
                boolean b = BinaryStdIn.readBoolean();
                if (b) 
                    x = x.right;
                else 
                    x = x.left;
            }
            BinaryStdOut.write(x.c);
        }
        BinaryStdOut.close();
    }
    
    public static void compress()
    {
        // step 1
        char[] input = BinaryStdIn.readString().toCharArray();
        // step 2
        int[] freq = new int[R];
        for (int i = 0; i < input.length; i++)
            freq[input[i]]++;
        // step 3
        Node root = buildTrie(freq);
        // step 4
        String[] codeword = new String[R];
        buildCode(root, codeword, "");
        // step 5
        writeTrie(root);
        // step 6
        BinaryStdOut.write(input.length);
        // step 7
        for (int i = 0; i < input.length; i++)
        {
            String s = codeword[input[i]];
            for (int j = 0; j < s.length(); j++)
                if (s.charAt(j) == '1')
                    BinaryStdOut.write(true);
            	else
                    BinaryStdOut.write(false);
        }
        BinaryStdOut.close();
    }
    
    private Node buildTrie(int[] freq)
    {
        MinPQ<Node> pq = new MinPQ<>();
        for (char i = 0; i < R; i++)
            if (freq[i] > 0)
                pq.insert(new Node(i, freq[i], null, null));
        while (pq.size() > 1)
        {
            Node x = pq.delMin();
            Node y = pq.delMin();
            pq.insert(new Node('\0', x.freq + y.freq, x, y));
        }
        return pq.delMin();
    }
    
    private void buildCode(Node x, String[] codeword, String s)
    {
        if (x.isLeaf())
        {
            codeword[x.c] = s;
            return;
        }
        buildCode(x.left, codeword, s+'0');
        buildCode(x.right, codeword, s+'1');
    }
    
    private void writeTrie(Node x)
    {
        if (x.isLeaf())
        {
            BinaryStdOut.write(true);
            BinaryStdOut.write(x.c);
            return;
        }
        BinaryStdOut.write(false);
        writeTrie(x.left);
        writeTrie(x.right);
    }
    
    private void readTrie()
    {
        if (BinaryStdIn.readBoolean())
            return new Node(BinaryStdIn.readChar(), 0, null, null);
        else
            return new Node('\0', 0, readTrie(), readTrie());
    }
}
```

Here is the trace of constructing a Huffman encoding trie : (image from text book)

![Constructing a Huffman encoding trie](../img/ConstructingHuffmanTrie.png)

This is an example of Huffman encoding : (image from text book)

![Huffman encoding example](../img/HuffmanExample.png)

### 4. LZW compression

To compress, we perform the following steps as long as there are unscanned input characters :

- Find the longest string s in the symbol table that is a prefix of the unscanned input
- Write the 8-bit value associated with s
- Scan one character past s in the input
- Associate the next codeword value with s+c (c appended to s) in the symbol table, where c is the next character in the input

To expand, we perform the following steps until end of file :

- Write the current string val
- Read a codeword x from the input
- Set s to the value associated with x in the symbol table
- Associate the next unassigned codeword value to val+c in the symbol table, where c is the first character of s
- Set the current string val to s

![LZW compression](../img/LZWCompression.png)

```java
private static int R = 256;
private static int W = 12;
private static int L = 4096;

public static void compress()
{
    TST<Integer> st = new TST<>();
    int i;
    for (i = 0; i < R; i++)
        st.put((char) i + "", i);
    i++;
    String input = BinaryStdIn.readString();
    
    while (input.length() > 0)
    {
    	String pre = st.longestPrefixOf(input);
        BinaryStdOut.write(st.get(pre), W);
        
        int length = pre.length();
        if (i < L && length < input.length())
            st.put(input.substring(0, length+1), i++);
        input = input.substring(length);
    }
    
    BinaryStdOut.write(R, W);
    BinaryStdOut.close();
}
```

![LZW expansion](../img/LZWExpansion.png)

```java
public static void expand()
{
    String[] st = new String[L];
    int i;
    for (i = 0; i < R; i++)
        st[i] = (char) i + "";
    st[i++] = " ";
    
    int code = BinaryStdIn.readInt(W);
    String val = st[code];
    while (true)
    {
        BinaryStdOut.write(val);        
        code = BinaryStdIn.readInt(W);
        if (code == R) break;
        String s = st[code];
        if (i == code)
            s = val + val.charAt(0);
        if (i < L)
        st[i++] = val + s.charAt(0);
        val = s;
    }
    BinaryStdOut.close();
}
```

![LZW example](../img/LZWExample.png)

## Exercise

### 5.5.25 Fixed length width code.

> Implement a class RLE that uses fixed-length encoding, to compress ASCII bytestreams using relatively few different characters, including the code as part of the encoded bitstream. Add code to compress() to make a string alpha with all the distinct characters in the message and use it to make an Alphabet for use in compress(), prepend alpha (8-bit encoding plus its length) to the compressed bitstream, then add code to expand() to read the alphabet before expansion.

I use a ST to record all the different characters appeared in the stream, so I need to read the stream twice.

```java
import edu.princeton.cs.algs4.BinaryStdOut;
import edu.princeton.cs.algs4.BinaryStdIn;
import edu.princeton.cs.algs4.Alphabet;
import edu.princeton.cs.algs4.ST;

public class REL
{
	public static void compress()
	{
		String s = BinaryStdIn.readString();
		char[] input = s.toCharArray();
		// put all different character into the set
		ST<Character, Boolean> st = new ST<>();
		for (int i = 0; i < input.length; i++)
			if (!st.contains(input[i]))
				st.put(input[i], true);
		// use the set to create alphabet and put them into the bitstream
		BinaryStdOut.write(st.size());
		String alpha = "";
		for (Character key : st.keys())
		{
			alpha += key;
			BinaryStdOut.write(key);
		}
		Alphabet alphabet = new Alphabet(alpha);
		// same with text book
		int N = s.length();
		BinaryStdOut.write(N);
		for (int i = 0; i < N; i++)
		{
			int d = alphabet.toIndex(s.charAt(i));
			BinaryStdOut.write(d, alphabet.lgR());
		}
		BinaryStdOut.close();
	}

	public static void expand()
	{
		// recreate the alphabet 
		String alpha = "";
		int alphaLength = BinaryStdIn.readInt();
		for (int i = 0; i < alphaLength; i++)
			alpha += BinaryStdIn.readChar();
		// same with text book
		Alphabet alphabet = new Alphabet(alpha);
		int w = alphabet.lgR();
		int N = BinaryStdIn.readInt();
		for (int i = 0; i < N; i++)
		{
			char c = BinaryStdIn.readChar(w);
			BinaryStdOut.write(alphabet.toChar(c));
		}
		BinaryStdOut.close();
	}

	public static void main(String[] args)
	{
		String order = args[0];
		if (order.equals("-")) compress();
		else if (order.equals("+")) expand();
		else
			throw new IllegalArgumentException("No a valid order");
	}
}
```

### 5.5.26 Rebuilding the LZW dictionary.

> Modify LZW to empty the dictionary and start over when it is full. This approach is recommended in some applications because it better adapts to changes in the general character of the input.

This is simple but quite amazing, because two `static` function `compress()` and `expand()` clear their own dictionary separatly, still will  get exactly the same file when expanded. That makes me get deeper understand of why LZW do not need a code table as Huffman's method do.

```java
import edu.princeton.cs.algs4.BinaryStdOut;
import edu.princeton.cs.algs4.BinaryStdIn;
import edu.princeton.cs.algs4.TST;

public class RebuildLZW
{
	private static int R = 256;
	private static int L = 4096;
	private static int W = 12;

	public static void compress()
	{
		TST<Integer> st = new TST<>();
		for (int i = 0; i < R; i++)
			st.put((char)i + "", i);

		String input = BinaryStdIn.readString();
		int code = R+1;

		while (input.length() > 0)
		{
			String s = st.longestPrefixOf(input);
			BinaryStdOut.write(st.get(s), W);

			int t = s.length();
			// clear the dictionary
			if (code == L)
			{
				st = new TST<>();
				for (int i = 0; i < R; i++)
					st.put((char) i + "", i);
				code = R+1;
			}

			if (t < input.length() && code < L)
				st.put(input.substring(0, t+1), code++);
			input = input.substring(t);
		}
		BinaryStdOut.write(R, W);
		BinaryStdOut.close();
	}

	public static void expand()
	{
		String[] st = new String[L];

		int i;
		for (i = 0; i < R; i++)
			st[i] = (char) i + "";
		st[i++] = " ";

		int codeword = BinaryStdIn.readInt(W);
		String val = st[codeword];

		while (true)
		{
			BinaryStdOut.write(val);
			codeword = BinaryStdIn.readInt(W);
			if (codeword == R)
				break;
			String s = st[codeword];
			if (i == codeword)
				s = val + val.charAt(0);
            // clear the dictionary
			if (i == L)
			{
				for (int j = R+1; j < L; j++)
					st[j] = null;
				i = R+1;
			}
			if (i < L)
				st[i++] = val + s.charAt(0);
			val = s;
		}

		BinaryStdOut.close();
	}
	
	public static void main(String[] args)
	{
		String order = args[0];
		if (order.equals("-")) compress();
		else if (order.equals("+")) expand();
		else
			throw new IllegalArgumentException("No a valid order");
	}
}
```

And I use a novel to do a test to compare the effect of this change:

```
$ java HexDump 0 < SqueezePlay.txt 
478360 bits
$ java Huffman - < SqueezePlay.txt | java HexDump 0
267584 bits
$ java LZW - < SqueezePlay.txt | java HexDump 0
236256 bits
$ java RebuildLZW - < SqueezePlay.txt | java HexDump 0
272656 bits
```

Seems that it isn't suitable for this novel. But after I insert enough digits of **PI** into the beginning of this novel, it starts to take effect:

```
$ java HexDump 0 < SqueezePlayModified.txt 
540184 bits
$ java Huffman - < SqueezePlayModified.txt | java HexDump 0
328256 bits
$ java LZW - < SqueezePlayModified.txt | java HexDump 0
346896 bits
$ java RebuildLZW - < SqueezePlayModified.txt | java HexDump 0
311832 bits
```
