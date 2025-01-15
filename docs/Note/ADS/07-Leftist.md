# 左偏树 {# 左偏树}

虽然名为树，但左偏树实际上是一种 **可并堆** ，其特性在于可以直接合并两个堆。

回忆之前的普通的堆，其合并需要将两个堆先拍平成数组，然后再重新建，或者从一个堆中逐步弹出插入另一个堆。

而左偏树希望能将两棵树直接以树形结构的方式结合。在不考虑复杂度的情况下，永远将值更小的根节点作为结合后的根，然后将另外一棵树与其一个子树合并，如此递归进行即可合并。这样容易产生的问题是：与哪棵子树合并，合并后的树高是否还是 $O(\log{n})$ ？

左偏树为了满足树高 $O(\log{n})$ 的性质，其思路是保持右子树一直是更“短”的子树，这样就可以将另一棵子树无脑合并到右子树。

而为了衡量这个“更短”，左偏树引入了一个新概念： Npl 。

!!! definition "Npl"
    Npl，即null path length，一个节点到其子树内 **没有两个孩子的节点** 的最短距离。特别的，Npl(NULL) = -1 。
    
    - $Npl(X) = \displaystyle\min_{\forall C \in son(X)} \{Npl(C) + 1\}$

这样左偏树的要求就等价为 $Npl(ls) \ge Npl(rs)$ ，而对于不满足的情况可以通过交换左右子树来修正。

修正之后，对于合法的左偏树， $Npl(X)=Npl(rs)+1$ 。

!!! note "性质"
    右路径长度为 r 的左偏堆至少拥有 $2^r-1$ 个节点。（此时是满二叉树）（数学归纳法证明即可）


## 操作 {# 操作}

??? code "结构体定义"
    ```cpp
    struct TreeNode{
        ElementType Element;
        PriorityQueue Left,Right;
        int Npl;
    };
    ```

### Merge {#Merge}

如前文所说，无脑向右子树合并，合并后递归向上维护左偏性质即可

??? code
    ```cpp
    PriorityQueue Merge( PriorityQueue H1, PriorityQueue H2 )
    {
        if(H1 == NULL) return H2;
        if(H2 == NULL) return H1;
        if(H1->Element > H2->Element) swap(H1,H2);
        if(H1->Left == NULL) H1->Left = H2;
        else{
            H1->Right = Merge(H1->Right,H2);
            if(H1->Left->Npl < H1->Right->Npl) SwapChildren(H1);
            H1->Npl = H1->Right->Npl + 1;
        }
        return H1;
    }
    ```
- 由上文的性质可以看出，一次合并递归的深度是 $O(\log{n})$ 的，因此复杂度也是 $O(\log{n})$ 的。

### DeleteMin {#DeleteMin}
可并堆的性质让删除无需限制在子节点，直接将根节点左右儿子合并就行，$O(\log{n})$

## 作业题 {#作业}

??? note "T1：Build heap"
    <center>![T1](/img/ads/LH-T1.jpg)</center>

    由这道题可以理解为什么左偏树和斜堆的BuildHeap复杂度是（斜堆是均摊）O(n)