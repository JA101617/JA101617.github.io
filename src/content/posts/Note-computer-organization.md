---
title: 计组笔记
published: 2024-09-24
description: '计算机组成课堂笔记'
image: ''
tags: [computer-organization,hardware]
category: 'notebook'
draft: false 
lang: 'zh-CN'
---



# 目录

- [Chapter1: Computer Abstraction and Technology](#Chapter1)
- [**Chapter2: Instructions: Language of the Computer**](#Chapter2)
- [**Chapter3: Arithmetic for Computers**](#Chapter3)
- **Chapter4: The Processor: Datapath and Control**
- **Chapter5: Large and Fast: Exploiting Memory Hierarchy**
- Chapter 6: Parallel processor from client to Cloud (选讲，非考试内容)
- Appendix: Storage, Networks, and Other Peripherals (了解概念)

# Chapter 1<a id="Chapter1"></a>

- $Performance = \dfrac{1}{Execution Time}$
  - 算法：影响IC，可能影响CPI
  - 编程语言：影响IC和CPI
  - 编译器：影响IC和CPI
  - ISA：影响IC，CPI和$T_c$

- **Execution Time**
  - Elapsed time: Total response time,determines system performance
    - Processing , IO, OS overhead, idle time...
  - CPU time: Time spent processing a given job
    - different programs are affected differently by CPU & system performance
    - Comprises user CPU time & system CPU time
    - $CPU\ \ Time = \frac{CPU\ \ Clock\ \ Cycles}{Clock\ \ Rate} = CPU\ \ Clock\ \ Cycles \times Clock\ \ Cycle\ \ Time $
      - 提速：Clock Cycles和Clock Rate的trade off

$$
\begin{aligned}
CPU\ \ Time =& \frac{CPU\ \ Clock\ \ Cycles}{Clock\ \ Rate}\\
=& CPU\ \ Clock\ \ Cycles \times Clock\ \ Cycle\ \ Time\\
=&Instruction\ \ Count \times CPI\times Clock\ \ Cycle\ \ Time\\
=&\dfrac{Instruction\ \ Count \times CPI}{Clock\ \ Rate}\\
=& \dfrac{Instructions}{Program} \times \dfrac{Clock\ \ cycles}{Instructions}\times\dfrac{Seconds}{Clock cycle}
\end{aligned}
$$

- 平均CPI由CPU硬件、指令类型等决定

$$
Average CPI = \sum(CPI_i\times \dfrac{Instruction\ \ Count_i}{Instruction\ \ Count})
$$

- Instruction Count由程序、指令集（ISA）和编译器决定

- CMOS IC technology中

$$
Power = Capacitive\ \ load\times Voltage^2\times Frequency
$$

- Pitfall

  - **Amdahl's Law**

  $$
  T_{imporved} = \dfrac{T_affected}{improvement\ \ factor}+T_{unaffected}
  $$
  
  - MIPS

  $$
  \begin{aligned}
  MIPS =&\dfrac{IC}{Execution\ \ time \times 10^6}\\
  =& \dfrac{IC}{\dfrac{IC\times CPI}{Clock\ \ rate} \times 10^6}\\
  =&\dfrac{Clock\ \ rate}{CPI \times 10^6}
  \end{aligned}
  $$
  
  
  
  
  
  ![image-20240925113511973](/img/CO/EightIdea.jpg)



+ [x] 作业1.2,1.5,1.6,1.7,1.13

# Chapter 2<a id="Chapter2"></a>

## 2 key principles

- Instruction are represented as numbers.

- 
  Programs can be stored in memory to be read or written just like numbers.

## Operations

- 指令的Format决定了指令的结构

  - RISC-V指令集

    ![RISC-V Instruction Format](/img/CO/RISC-VInstructionFormat.jpg)

    - R型：操作全寄存器
    - I型：两个寄存器，一个立即数
    - S型：两个寄存器，一个立即数（被腰斩了）
    - SB型：分支结构，与S型大体相似
      - SB指令的imm[4:1,11]的安排是为了与S对齐 ~~没有imm[0]，很神奇吧~~，imm[12]是符号位拓展，默认第零位是0
    
  - MIPS指令集
  
  ![MIPS Instruction Format](/img/CO/MIPSInstructionFormat.jpg)
  
- Arithmetic

  - One operation per instruction

  - 3 variables(2 src+1 dest)

    - add dest src1 src2 (dest = src1 + src2)
    - sub dest src1 src2 (dest = src1-src2)

  - 操作数得是寄存器

  - Risc-V有32个64位的寄存器（x0~x31)

    - 32b $\rightarrow$ word，64b $\rightarrow$ doublewords

    功能表如下

    ![RISC-V operands](/img/CO/RegTable.jpg)

- Memory

    - 只有读写两种操作

    - 按byte操作

    - RISC-V是Little Endian（更低位的byte放在更小的地址）（Big Endian反之）

    - RISC-V不要求Memory Alignment

      - 对齐：存储为0到3,4到7等，起始地址是4的倍数不会跨byte

    - 示例：`A[12]=h+A[8]`，h在x21，A基址x22

      - 指令如下

        ```
        ld x9, 64(x22)
        add x9, x21,x9
        sd 72(x22), x9
        ```

        ` ld`是load double word,`64(x22)`指A[8]，即数字部分是相对基址的偏移量（以字节为单位）

    - 示例：`h=h+55`

      ```
      addi x9 x9 55
      ```

- Logical Operations

  ![BitwiseOperation](/img/CO/BitwiseOperation.jpg)

  按位取反是不需要的（与全一取异或）

  - Shift Operations : I format
  - AND Operations & OR Operations & XOR Operations: R format 
  
- Conditional Operations & Loop<a id="条件与循环"></a>
  - beq : 相等则执行；bne : 不等则执行
  
    `beq x21,x22,L1`,其中L1指代一个指令，值为那条指令与本指令的相对位置。
  
  - slt : 以 `slt x5, x19, x20` 为例，若 $x_{19}<x_{20}$ 则 $x_5$ 为1
  
  - blt : 若 $rs_1<rs_2$ 则跳转；bge : 若 $rs_1\ge rs_2$ 则跳转
  
    - 以及相应的unsigned形式bltu,bgeu
    
  - 循环的写法
  
	    - g ~ k对应x20 ~ x24,  base A[i] 存在 x25
  
  
      ```c
      do{
      	g = g + A[i];
      	i = i + j;
      }while(i!=h);
      ```
  
      ```
      LOOP:	slli x10,x22,3  #按字节数A[i]相对于A的偏移量
      		add x10,x10,x25 #x10存储A[i]的地址
      		ld x19 ,0(x10)  #x19存储A[i]的值
      		add x20 x20 x19 
      		add x22,x22,x23
      		bne x22,x21,LOOP
      ```
  
      ```
      while(A[i] == k) i+=1;
      ```
  
      ```
      LOOP: slli x10,x22,3
      	  add x10,x10,x25
      	  ld x9,0(x10)
      	  bne x9,x24,EXIT
      	  addi x22,x22,1
      	  beq x0,x0,LOOP
      EXIT:....
      ```
  
  - 使用jalr实现Switch
  
    ```
    switch ( k )  {
    	case  0 :    f  =  i+  j ;  break ;    /*  k  =  0  */
    	case  1 :    f  =  g +  h ;  break ;   /*  k  =  1  */
    	case  2 :    f  =  g  -h ;  break ;   /*  k  =  2  */
    	case  3 :    f  =  i-j ;  break ;    /*  k  =  3  */
    }
    ```
  
    使用 **jump address table** 解决
  
    假设 f ~ k 对应 x20 ~ x25， x6 存储 jump address table 的基址，则对应汇编代码如下
  
    ```
    blt x25, x0, Exit      # test if  k  <  0 
    bge x25, x5, Exit      # if  k  >=  4,  go to Exit
    slli x7, x25, 3        # temp reg x7  =  8  *  k  (0<=k<=3)        add x7, x7, x6         # x7  =  address of JumpTable[k]
    ld x7, 0(x7)           # temp reg x7 getsJumpTable[k]
    jalr x1, 0(x7)         # jump based on register x7(entrance)
    Exit:...
    ...
    L0:add $s0, $s3, $s4   # k  =  0  so  f  gets  i+j
       jalr x0, 0(x1)      # end of this case so go to Exit 
    L1:add $s0, $s1, $s2   # k  =  1  so  f  gets  g+h
       jalr x0, 0(x1)      # end of this case so go to Exit 
    L2:sub $s0, $s1, $s2   # k  =  2  so  f  gets  g-h
       jalr x0, 0(x1)      # end of this case so go to Exit 
    L3:sub $s0, $s3, $s4   # k  =  3  so  f  gets  i-j
       jalr x0, 0(x1)      # end of  switch statement
    ```
  
    代码理解：
  
    1. 为什么 `slli x7, x25, 3` ？
  
       A：每条指令都是4B的，下面每个case带2条指令，因此乘以8
  
    2. 每个case的最后一句的 `jalr x0, 0(x1)` 是什么作用？
  
       A：跳转回 x1 指令（即Exit），下一条指令没有必要存下来
  
    3. 代码中出现的 `$s0,$s3,$s4` 都是什么东西？
  
       A：这是寄存器的别名
  
    4. `ld x7 0(x7)` 是为什么？
  
       A：类似于C语言中解引用的过程，可以这么理解。如L0这种label存储的是指令单位置（是一个指向指令的指针），而x6存储的是L0的地址（也就是x6是一个二级指针），因此通过 `x7=x6+8*k` 得到的是存储Lk的地址的寄存器的地址，则此处 ld 指令过后就得到了 Lk的地址
  
- Basic Blocks
  - 要求：
    - 没有分支
    - 不会有跳转到中间的情况 ("No branch targets/branch labels, except at beginning")
  - 编译器会对 basic blocks 进行加速

## Supporting Procedures

- 函数调用的6个步骤
  - Place Parameters in a place where the procedure can access them
  - Transfer control to the procedure：jump to
  - Acquire the storage resources needed for the procedure
  - Perform the desired task Place the result value in a place where the calling program can access it
  - Return control to the point of origin 
- Procedure Call Instructions
  - jal jalr : 无条件跳转
    - Jump-and-link : `jal x1,ProcedureAddress` [UJ型]
      - 将紧随其后的下一条指令存入 x1 （如果是 x0 就与 goto 指令等价）
      - 并跳转至`ProcedureAddress`
    - Jump-and-link-register : `jalr x0,0(x1)` [I型]
      - 跳转到 `0(x1)` 的位置
      - 下一条指令存入 x0 （丢掉不要）
      - 因为寄存器的引入可以实现更大的跳转范围
      - 可以用作switch功能（实例见[Conditional Operations](#条件与循环)部分）
- 参数的功用
  - a0 ~ a7(x10 ~ x17) : 传参
  - ra/x1 : 传返回地址

- 堆栈

  - 栈：高地址到低地址

  - 堆：低地址到高地址

  - 包括3个参数： push, pop, 堆栈指针(sp)，其中sp指向最后一个有数据的地方

    以栈为例：

    push: 

    ```
    addi sp, sp, -8
    sd ..., 8(sp)
    ```

    pop:

    ```
    ld ..., 8(sp)
    addi sp, sp, 8
    ```

- 样例：阶乘求解

    ```c
    int fact ( int n ){
        if ( n  <  1 )   return  ( 1 ) ;
        else return   ( n  *  fact ( n  -1 ) ) ;
    }
    ```

    ```
    fact:   addi sp, sp, -16   # adjust stack for 2 items
            sd ra, 8(sp)       # save the return address：x1
            sd a0, 0($sp)      # save the argument  n:x10(a0)
            addi t0, a0, -1    # x5 = n  - 1
            bge t0, zero, L1   # if  n  >=  1, go to L1(else)
            addi a0, zero, 1   # return 1 if n <1
            addi sp, sp, 16    # Recover sp(Why not recover x1 and x10 ?)
            jalr zero, 0(ra)   # return to caller
    L1:     addi a0,  a0, -1   # n  >=  1: argument gets ( n  -1 )
            jal ra, fact	   # call fact with ( n  -1)
            add t1, a0, zero   # move result of fact(n -1) to x6(t1)
            ld a0, 0(sp)	   # return from jal: restore argument n
            ld ra, 8(sp)	   # restore the return address
            add sp, sp, 16     # adjust stack pointer to pop 2 items
            mul a0, a0, t1	   # return  n*fact ( n  -1 )
            jalr zero, 0(ra)   # return to the  caller
    ```

​	代码理解：

 1. ra是干什么的？

    书上说法是”保存函数调用返回地址“，这里可以举例子帮助理解。

    在这段代码中，修改ra的地方除了ld只有jal，前者没啥分析价值，只看`jal ra, fact`那句。此处会将jal的后一条指令存入ra，也就是说如果运行了这句话，跳转到fact标签运行，一通操作完之后（肯定入栈和弹栈数量持平），运行`jalr zero,0(ra)`就会跳回到jal的下一句，即从`add t1, a0, zero`开始跑。

    如果放到c里面理解（因为高级语言没有对应的东西），相当于在调用函数之前标记了一下函数后面那句话说是在这里断开开始递归的所以要从这里接着跑。

 2. 怎么理解a0的双重身份？

    a0在传入参数的时候代表 $n$ ，计算完成的时候才作为 $n!$ 存在。例如考虑L1的部分。

    `addi a0,  a0, -1` 是 n

    `jal ra, fact`和` add t1, a0, zero` 处因为递归调用的完成是存储的 $(n-1)!$ 于是很快就用 t1这个临时变量存起来了

    `ld a0, 0(sp)` 恢复 a0 为 $n$

    `mul a0, a0, t1` `jalr zero, 0(ra)` 的位置 a0 终于成为计算结果 $n!$

# Chapter 3<a id="Chapter3"></a>

**默认64bit为double word，一个word为32bit**

- 补码可以直接加减，不可直接相乘！
  - （？）如(1001)2平方不会得到49，但是如果补全成(11111001)2的平方可以

- 浮点数：Single precicion ~ Quadruple precision

## ALU

- 加减法溢出条件

  ![image-20240925114525853](/img/CO/overflowCondition.jpg)

![image-20240925115021116](/img/CO/ALUstruct.jpg)

注：上图的set传到less是为了执行slt操作

![image-20240925115107894](/img/CO/ALUFunctionTable&logo.jpg)

### 超前进位加法器

#### 一位版本

$G_i = A_i \& B_i$(generate)

$P_i = A_i|B_i$ (propogation)

则$S_i = P_i \bigoplus C_i$, $C_{i+1}=G_i+P_iC_i$

#### 四位版本

对每个 $C_i$ 进行展开，得到结果如下

$$
\begin{aligned}
C_1 &= G_0 + P_0C_0\\
C_2 &= G_1 + P_1C_1 = G_1 + P_1G_0 + P_1P_0C_0\\
C_3 &= G_2 + P_2C_2 = G_2 + P_2G_1 + P_2P_1G_0 + P_2P_1P_0C_0\\
C_4 &= G_3 + P_3C_3 = G_3 + P_3G_2 + P_3P_2G_1 + P_3P_2P_1G_0 + P_3P_2P_1P_0C_0
\end{aligned}
$$

![CarryLookaheadAdder4b](/img/CO/CarryLookaheadAdder4b.jpg)

-  $C_1$ 到 $C_4$ 同步可得

#### 十六位版本

- fan-in限制不能继续展开了

### 乘法

- 符号问题：一般转成绝对值运算再回去

- 实操：龟速乘做法$\rightarrow$ “山不就我我来就山” 运算结果右移，被乘数不动

$\Rightarrow$ 乘数和结果右移同步，可以利用低位存储乘数

![image-20240925121430846](/img/CO/Multiplier_example.jpg)

- [了解] Booth's Algorithm

​		Idea: 1111010-> 10000000 + 10 -1000

### 除法

- 长除法的减法版本
  - 允许有试减环节，不判断先减再说
- 具体操作（V1）：除数存在寄存器左边，逐渐右移试减；被除数（余数）放在寄存器右边不用动

![DivisionV1](/img/CO/DivisionV1.jpg)

![DivisionV1Process](/img/CO/DivisionV1Process.jpg)

- V2（优化了存储空间）：除数不用开二倍长度，Remainder寄存器将被除数放在右侧，逐步左移，Divisior对齐Remainder最左侧进行减法操作。减法结果从右侧存入Remainder充当V1的Quotient

![DivisionV2](/img/CO/DivisionV2.jpg)

![DivisionV2Process](/img/CO/DivisionV2Process.jpg)

- 因为第一次减法结果必定为0，所以先左移再做减法。随之导致最后多移一次，故加上了ShiftRight接口

**Q：负数除法，余数和商的符号问题？**

**A:Remainder和Dividend保持一致**

- 除法无法并行实现：依赖前一次的结果
- [可以了解]Faster dividers（e.g. SRT division)
- Risc-V中的除法指令
  - div,rem:有符号除法
  - divu,remu:无符号除法
  - 处理器不会对除0和溢出的情况进行报错，需要自行处理

### 浮点数

仿照科学计数法，可以将浮点数记为 $(-1)^s\times F \times 2^E$ 。

- 上溢：正指数太大
- 下溢：负指数太小

#### 表示形式

- RISC-V

  - float : 1位符号位+8位指数+23位尾数
  - double : 1位符号位+11位指数+52位尾数

- IEEE 754浮点数标准：将尾数的1隐含掉（类似科学计数法没有前导零，尾数的第一位必然为1），但0是例外，其表示为 $0....0_2$ 。例如一个浮点数尾数部分表示为 $f_1f_2...f_n$ ，则其值实际为 $1+0.f_1f_2f_3...f_n$   。

  - 对异常值有特殊的表示

  ![image-20241006135825563](/img/CO/FloatNumberSpecialExpression.jpg)

  - 整个浮点数不是补码表示法而是符号-数值形式，但指数部分使用补码表示
  - **移码表示法** ：对指数部分加上一个偏移量以方便比较大小（类似从有符号整数到无符号整数范围的位移），IEEE 754规定 float 偏移量127， double 偏移量1023。则一个浮点数实际值为 $(-1)^S\times (1+有效位数) \times 2^{指数-偏移量}$ 。
  - 所以float绝对值最小的是 $\pm 1.0\times 2^{-126}$，最大的Fraction:111111，约为2.0，绝对值最大的就是$\pm 2.0\times 2^{127}$ 。双精度分别为 $\pm 1.0\times 2^{-1022}$ 和 $\pm 2.0 \times 2^{1023}$

#### 加减

- 对齐：指数小往指数大对齐

![FloatCalcProcess](/img/CO/FloatCalcProcess.jpg)

![FloatCalcStruct](/img/CO/FloatCalcStruct.jpg)

#### 乘除

- 指数相加（但是要把bias补回来）

![FloatMulProcess](/img/CO/FloatMulProcess.jpg)

![FloatMulStruct](/img/CO/FloatMulStruct.jpg)

（除法类似）

#### Accurate Arithmetic

- 三个extra bits（不一定系统有）
  - guard:
  - round:
  - sticky:

+ [ ] 作业：3.7,3.20,3.26,3.27,3.32

# 

