---
comments: true
---
# 斜堆 {#斜堆}

神必算法

- 每Merge必调换左右儿子
- **只有在合并的末尾，即叶子节点才无需交换左右儿子** ，这是与下面这份代码实现不同的

<details>
	<summary>早年的代码一份</summary>
	<pre><code>
    newnode(int v){//返回节点编号 	
    	int x=++cnt; 	
    	val[x]=v,ls[x]=rs[x]=0; 	
    	return x; 
    } 
    int merge(int a,int b){//以a,b为根的树合并,返回根节点 	
    	if(!a||!b) return a+b;
        if(val[a] > val[b]) swap(a,b); 	
        rs[a]=merge(rs[a],b); 	
        swap(ls[a],rs[a]);
        return a; 
    }
  </code></pre>
</details>



- 复杂度：均摊分析
  - $D_i = the\ \ root\ \ of\ \ the\ \ resulting\ \ tree$ 
  - $\Phi (D_i) = number\ \  of\ \ heavy\ \ nodes$
    - heavy nodes :  右子树大于左子树的节点
    - 除了在归并路线上的节点，其他节点的轻重性质不变化
      - 重节点一定会变轻，但是轻节点不一定变重
    - 定义最开始的右路径（即归并路线）上轻节点 $l_i$ ，重节点 $h_i$ 。
      - 则 $l_i$ 越多 $l_i$ 越少（ $l_i$ 多则堆趋于左倾堆，则右路径长度就短，至多到 $O(\log N)$ 级别）
    - 极端情况变化：轻全变重

$$
T_{worst}=l_1+h_1+l_2+h_2\\
\phi_i = h_1+h_2+h\\
\phi_{i+1} \le l_1+l_2+h\\
T_{amortized} = T_{worst}+\phi_{i+1}-\phi_i\le 2(l_1+l_2) \Rightarrow O(\log N)
$$

## 作业题 {#作业}

直接把结论列出来好了

- 按顺序插入 $1-2^k-1$ 得到的总是完全满二叉树
- 斜堆的 right path 长度是任意的，只是轻节点数受到限制