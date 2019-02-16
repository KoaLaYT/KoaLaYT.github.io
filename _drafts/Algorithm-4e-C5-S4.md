# Chapter 5 / Section 4 : Regular Expressions

## Main Content

### 1. Describing patterns with regular expressions

- *Concatenation* : AB specifies {AB}
- *Or* : AB | BCD specifies {AB, BCD}
- *Closure* : A*B specifies strings with 0 or more As followed by a B
- *Parentheses* : to override the default precedence rules

Here are some examples : (image from text book)

![RE examples](../img/RegularExpressionExamples.png)

### 2. Simulating an NFA

This figure shows how it works : (image from text book)

![NFA simulation](../img/NFASimulation.png)

```java
public boolean recognize(String txt)
{
    Bag<Integer> reachable = new Bag<>();
    DirectedDFS dfs = new DirectedDFS(G, 0);
    for (int v = 0; v < G.V(); v++)
        if (dfs.marked(v))
            reachable.add(v);

    for (int i = 0; i < txt.length(); i++)
    {
        Bag<Integer> match = new Bag<>();
        for (Integer v : reachable)
            if (v < M)
            	if (re[v] == '.' || re[v] = txt.charAt(i))
                	match.add(v+1);
        reachable = new Bag<Integer>();
        dfs = new DirectedDFS(G, match);
        for (int v = 0; v < G.V(); v++)
            if (dfs.marked(v))
                reachable.add(v)
    }
    for (Integer v : reachable)
        if (v == M)
            return true;
    return false;
}
```

**Simulating NFA analysis** :

> Determining whether an N-character text string is recognized by the NFA corresponding to an M-character RE takes time proportional to NM in the worst case.

### 3. Building an NFA corresponding to an RE

![NFA construction rules](../img/NFAConstructionRules.png)

![Building NFA](../img/BuildingNFA.png)

```java
public class NFA
{
    private char[] re;
    private Digraph G;
    private int M;
    
    public NFA(String regexp)
    {
        re = regexp.toCharArray();
        M = re.length;
        Stack<Integer> ops = new Stack<>();
        G = new Digraph(M+1);
        for (int i = 0; i < M; i++)
        {
            int lp = i;
            if (re[i] == '(' || re[i] == '|')
                ops.push(i);
            if (re[i] == ')')
            {
                lp = ops.pop();
                if (re[lp] == '|')
                {
                    int or = lp;
                    lp = ops.pop();
                    G.addEdge(lp, or+1);
                	G.addEdge(or, i);
                }
            }
            if (i < M-1 && re[i+1] == '*')
            {
                G.addEdge(lp, i+1);
                G.addEdge(i+1, lp);
            }
            if (re[i] == ')' || re[i] == '*' || re[i] == '(')
                G.addEdge(i, i+1);
        }
    }
}
```

**Building NFA analysis** :

> Building the NFA corresponding to an M-character RE takes time and space proportional to M in the worst case.

## Exercise
### 5.4.16 Multiway or.
> Add multiway or to NFA . Your code should produce the machine drawn below for the pattern ( . * A B ( ( C | D | E ) F ) * G ) .
Add a `Bag` to collect all ops `|` will implement this function:
```java
public NFA(String regexp)
{
	Stack<Integer> ops = new Stack<>();
	re = regexp.toCharArray();
	M = re.length;
	g = new Digraph(M+1);

	for (int i = 0; i < M; i++)
	{
		int lp = i;
		if (re[i] == '(' || re[i] == '|')
			ops.push(i);
		else if (re[i] == ')')
		{
			int or = ops.pop();
			if (re[or] == '|')
			{
			    // implementation of multiway or
				Bag<Integer> multiOr = new Bag<>();
				while (re[or] == '|')
				{
					multiOr.add(or);
					or = ops.pop();
				}
				lp = or;
				for (Integer j : multiOr)
				{
					g.addEdge(lp, j+1);
					g.addEdge(j, i);
				}
				// end of multiway or
			}
			else
				lp = or;
		}
		if (i < M-1 && re[i+1] == '*')
		{
			g.addEdge(lp, i+1);
			g.addEdge(i+1, lp);
		}
		if (re[i] == '(' || re[i] == ')' || re[i] == '*')
			g.addEdge(i, i+1);
	}
}
```

### 5.4.18 One or more.
> Add to NFA the capability to handle the + closure operator.

To implement this function, I use a pre process in the constructor to turn the `A+` to `AA*`:
```java
public NFA(String regexp)
{
	// pre process of +
	KMP finder = new KMP("+");
	int offset = finder.search(regexp);
	while (offset != regexp.length())
	{
		int start;
		if (regexp.charAt(offset-1) == ')')
		{
			start = offset - 2;
			while (regexp.charAt(start) != '(')
				start--;
		}
		else
			start = offset - 1;
		regexp = regexp.substring(0, start) + 
			     regexp.substring(start, offset) + regexp.substring(start, offset) + "*" + 
			     regexp.substring(offset+1, regexp.length());
		offset = finder.search(regexp);
	}
	...
}
```

### 5.4.19 Specified set.
> Add to NFA the capability to handle specified-set descriptors.
### 5.4.20 Range.
> Add to NFA the capability to handle range descriptors.
### 5.4.21 Complement.
> Add to NFA the capability to handle complement descriptors.

These functions are similar, the ops `[` should be pushed to the stack and add edges when meeting a `*` or `+`:
```java
public NFA(String regexp)
{
    ...
	for (int i = 0; i < M; i++)
	{
		int lp = i;
		if (re[i] == '(' || re[i] == '|' || re[i] == '[')
			ops.push(i);
		else if (re[i] == ')')
		{
		    ...
		}
		else if (re[i] == ']')
			lp = ops.pop();
		if (i < M-1 && re[i+1] == '*')
		{
		    ...
		}
		if (re[i] == '(' || re[i] == ')' || re[i] == '*' || re[i] == ']')
			g.addEdge(i, i+1);
	}
}

public boolean recognizes(String txt)
{
	...
	for (int i = 0; i < txt.length(); i++)
	{
		Bag<Integer> match = new Bag<>();
		for (Integer v : pc)
		{
			if (v < M)
			{
				if (txt.charAt(i) == re[v] || re[v] == '.')
					match.add(v+1);
				else if (re[v] == '[')
				{
					// range descriptors
					if (re[v+2] == '-')
					{
						if (txt.charAt(i) >= re[v+1] && txt.charAt(i) <= re[v+3])
							match.add(v+5);
					}
					// complement
					else if (re[v+1] == '^')
					{
						int x = 2, flag = 1;
						while (re[v+x] != ']')
						{
							if (txt.charAt(i) == re[v+x])
								flag = 0;
							x++;
						}
						if (flag == 1)
							match.add(v+x+1);
					}
					// specified sets
					else
					{
						int x = 1, flag = 0;
						while (re[v+x] != ']')
						{
							if (txt.charAt(i) == re[v+x])
								flag = 1;
							x++;
						}
						if (flag == 1)
							match.add(v+x+1);
					}
				}
			}
		}
		...
	}
}
