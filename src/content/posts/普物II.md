---
title: 百高峰的天线！
published: 2024-11-17
description: '普物半期考试补天失败产物，强烈不推荐看'
image: ''
tags: [physics]
category: 'notebook'
draft: false
lang: 'zh-CN'
---

# 普物公式整理

前面没空做了

### 定理

## Chapter28 电势能、电势

### 定义

1. $\Delta U_{a\rightarrow b}=-\int_{a}^b \vec{F}\cdot d\vec{l}$ ，若定义 $U_{\infin} = 0$ 则 $U_p = \int_p^{\infin} \vec{F}\cdot d\vec{l} $
   - 单位 : J
2. 力矩 $\vec{\tau} = \vec{p}\times\vec{E}$
   - 由此定义的 $U = -\vec{p}\cdot \vec{E}$
3. $V=\frac{U}{q_0}$ 若定义 $V_{\infin} = 0$ 则 $V_p =  \int_p^{\infin} \vec{E}\cdot d\vec{l} $
   - 单位 : V = J/C

从 $E$ 到 $V$ :  $V_p =  \int_p^{\infin} \vec{E}\cdot d\vec{l} $

从 $V$ 到 $E$ : $E=-\nabla V$

### 定理

1. **静电场环路定理**
   $$
   \oint \vec{E}\cdot\vec{dl} = 0\\
   \nabla \times \vec{E} = 0
   $$
   

​		注：对于变化的电场，有（参见Chapter34)
$$
\oint \vec{E}\cdot\vec{dl} = -\frac{d\Phi_B}{dt}\\
\nabla \times \vec{E} = -\frac{\partial\vec{B}}{\partial t}
$$


### 模型

1. 点电荷

   -  $U(r) = \frac{q_1q_2}{4\pi\epsilon_0r}$
   - $ V(r) = \frac{q}{4\pi\epsilon_0r}$

2. 电偶极矩

   <img src="/img/phyII/Ch28-dipole.jpg" alt="image-20241115134647840" style="zoom:33%;" />
$$
V(r) = \frac{q}{4\pi\epsilon_0}(\frac{1}{r_1}-\frac{1}{r_2}) \approx \frac{p\cdot \hat{r}}{4\pi\epsilon_0r^2}
$$
   如果使用 $r-\theta$ 的坐标系
$$
   V(r,\theta) = \frac{2aq\cos{\theta}}{4\pi\epsilon_0r^2} \Rightarrow \vec{E} = \frac{p}{4\pi\epsilon_0r^3}((2\cos{\theta})\hat{r}+(\sin{\theta})\hat{\theta})
$$

3. 电四偶极矩

<img src="/img/phyII/Ch28-quadrupole.jpg" alt="image-20241115134806513" style="zoom:33%;" />
$$
\begin{aligned}
V(r) &= \frac{1}{4\pi\epsilon_0}\frac{Q}{r^3(1-d^2/r^2)}\\
Q &= 2qd^2(Electric\ quadrupole\ moment)
\end{aligned}
$$

4. 带电球壳

$$
(Gauss'\ Law\Rightarrow)E=\begin{cases}
\frac{q}{4\pi\epsilon_0r^2},r>R\\
0,r\le R
\end{cases}
\Rightarrow V(r)=
\begin{cases}
\frac{q}{4\pi\epsilon_0r},r>R\\
\frac{q}{4\pi\epsilon_0R},r\le R
\end{cases}
$$

​			 电势能：微元
$$
U&=\sum_{1\le i<j\le n} \frac{q_iq_j}{4\pi\epsilon_0r_{ij}}
=\frac{1}{2}\sum_{i=1}^n\sum_{j=1}^n\frac{q_iq_j}{4\pi\epsilon_0r_{ij}}\\
&=\frac{1}{2}\sum_{i=1}^n q_iV_i
=\frac{1}{2}\int Vdq
=\frac{1}{2}\frac{q}{4\pi\epsilon_0R}q\\
&= \frac{q^2}{8\pi\epsilon_0R}
$$


5. 带电圆环

<img src="/img/phyII/Ch28-ring.jpg" alt="image-20241115141829333" style="zoom:33%;" />
$$
V=\int dV = \frac{1}{4\pi\epsilon_0}\oint \frac{\lambda ds}{r} =  \frac{q}{4\pi\epsilon_0} \frac{1}{\sqrt{z^2+R^2}}
$$

6. 带电圆盘

<img src="/img/phyII/Ch28-disk.jpg" alt="image-20241115142128963" style="zoom:33%;" />
$$
\begin{aligned}
V&=\int_0^R \frac{dq}{4\pi\epsilon_0} \frac{1}{\sqrt{z^2+w^2}} \\
&=\int_0^R \frac{2\pi wdw\sigma}{4\pi\epsilon_0} \frac{1}{\sqrt{z^2+w^2}}\\
&=\frac{\sigma}{2\epsilon_0}(\sqrt{z^2+R^2}-z)\\
\\
&if(z>>R)\ V = \frac{q}{4\pi\epsilon_0z}\\
\\
\\
E &= -\nabla V = -\frac{\partial V}{\partial z} = - \frac{\sigma}{2\epsilon_0}(1-\frac{1}{\sqrt{1+R^2/z^2}})
\end{aligned}
$$

### 其他

1. 尖端放电

   在电势相同的情况下，尖端附近电场更强，容易放电

2. 镜像法处理感应电荷分布

   感应电荷可以等效成一个导体内的镜像电荷，从而达到在导体表面产生电场与源电荷电场相抵消的效果

## Chapter29(30) 电容(capacitance)和电介质(dielectrics)

### 定义

1. 电容 $C=\frac{q}{\Delta V}$

2. 电容的串并联

   - 串联： $C=C_1+C_2$
   - 并联： $\frac{1}{C} = \frac{1}{C_1}+\frac{1}{C_2}$

3. 电场能量密度（单位体积电场中的能量） $u_E = \frac{1}{2}\epsilon_0E^2$

   **推导**（以平行板为例）：

   - 给电容器充电 $U=\frac{1}{C}\int_0^Q qdq = \frac{1}{2}\frac{Q^2}{C}$ 同时也 $U = \frac{1}{2}CV^2$ 
   - $U = \frac{1}{2}\frac{Q^2}{A\epsilon_0/d}$ 且 $E=\frac{\sigma}{\epsilon_0} = \frac{Q}{\epsilon_0A}$ $\Rightarrow U = \frac{1}{2}E^2\epsilon_0Ad$
   - $u_E=\frac{W}{volume} = \frac{U}{Ad} = \frac{1}{2}\epsilon_0E^2$

   - [ ] 例题：验证该 $u_E$ 适用于圆筒形电容器（tip: 即将用 $U=\int u_E dv$ 得到的结果与预期进行比较）

4. 介电常数 $\kappa_e$ ： $C=\kappa_eC_0$ 介电常数表现了电容器中使用该种介质与真空相比的电容差距（总是大于1）

   **微观理解**

   - 对于无极分子电介质，初始 $p=qd=0$ ，在 $\vec{E_0}$ 作用下 $p\neq 0$ 从而在两端产生正负电荷。产生束缚电荷，反向的电场。“电子位移极化”
   - 对于有极分子电介质，初始 $p$ 方向混乱，求和为 0，在 $\vec{E_0}$ 作用下方向统一从而在两端产生正负电荷。“取向极化”（当然也存在电子位移极化，然而相比之下效应太小，仅在电场高频变化的时候比较明显）

5. 极化强度矢量 $\vec{P}=\frac{\sum \vec{p_i}}{\Delta V}$

   - **介质表面的$\sigma$** : $\sigma = \vec{P}\cdot\vec{n}$ （$\vec{n}$ 是法向量）
   - 计算思路 $P\Rightarrow \sigma_e' \Rightarrow E' \Rightarrow E$ （$E'$是在理解过程中认定介质产生的束缚电荷的电场，名为退极化场depolarization field，$E$ 是最后表现出来的电场）
   - 可用的一个式子 $\oiint \vec{P}\cdot\vec{dA} = -\sum q_{in}$

6. 极化率 $\chi_e$ : 对于一般的*具有各向同性*的材料，有 $P=\chi_e\epsilon_0E$

   -  $\kappa_e= 1+\chi_e$

7. 电位移矢量（电感应强度）$\vec{D} = \epsilon_0E+P$

### 定理

1. **介质中的高斯定律**

$$
\oiint D\cdot dA = \sum q_{in}
$$

​	note:此处的 $q_{in}$ 指的是内部的自由电荷（也即束缚电荷不算在内）

2. 环路定律不成立
   $$
   \oint \vec{D}\cdot\vec{dl} \neq 0
   $$
   因为 $\kappa_e$ 在不同路径不一样 

### 模型
1. 平行板电容器
   $$
   C=\frac{q}{\Delta V} = \frac{\sigma A}{\frac{\sigma d}{\kappa_e\epsilon_0}}=\kappa_e\dfrac{\epsilon_0A}{d}
   $$

2. 圆筒形电容器

<img src="/img/phyII/Ch29-Cylindrical.jpg" alt="image-20241115151357731" style="zoom:33%;" />
$$
C=\frac{q}{\Delta V} = \frac{\kappa_eQ}{\int_a^b \frac{Q}{2\pi\epsilon_0rL}dr}=\kappa_e\dfrac{2\pi\epsilon_0L}{\ln{\frac{b}{a}}}
$$

3. 球形电容器

<img src="/img/phyII/Ch29-Spherical.jpg" alt="image-20241115151719937" style="zoom:33%;" />
$$
C=\frac{q}{\Delta V} = \kappa_e\frac{q}{\int_a^b \frac{q}{4\pi\epsilon_0r^2}dr}=\kappa_e\dfrac{4\pi\epsilon_0ab}{b-a}
$$
​		令 $b\rightarrow \infin$ ，单独一个球也是电容器， $C=4\kappa_e\pi\epsilon_0a$

4. 球体介质在电场中的退极化场

<img src="/img/phyII/Ch29-Sphericaldielectrics.jpg" alt="image-20241115202518185" style="zoom:33%;" />

取表面的微元（蓝色部分）
$$
\begin{aligned}
\sigma_e'&=P\cos{\theta}\\
dE'&=\frac{dq'}{4\pi\epsilon_0R^2}=\frac{\sigma_e'dA}{4\pi\epsilon_0R^2}=\frac{P\cos{\theta}dA}{4\pi\epsilon_0R^2}\\
dA&=Rd\theta R\sin{\theta}d\varphi\\
dE'_z &= -dE'\cos{\theta} = \frac{P\cos{\theta}\sin{\theta}d\theta d\varphi}{4\pi\epsilon_0}\\
E'_z&=\oiint dE'_z = -\frac{P}{3\epsilon_0}
\end{aligned}
$$

# Chapter31 恒定电流

## 定义

1. 电流强度 $i =\frac{dq}{dt}$
2. 电流密度矢量 $j$  $di = \vec{j}\cdot\vec{dA}$
   - $\oiint_A  \vec{j}\cdot\vec{dA} =-\frac{dq}{dt}$
3. 恒定电流的电流场有 $\oiint_A  \vec{j}\cdot\vec{dA} =0$
4. 电阻率和电导率
   - $R=\rho \frac{L}{A}$
   - $\rho$ 电阻率， $\sigma=\frac{1}{\rho}$ 电导率
   - 对于金属在一定范围内有 $\rho(T) = \rho_0+\alpha T$
5. 电功率 $P = \frac{W}{\Delta t}$
6. 电动势 $\epsilon = \int_{-}^{+} \vec{K}\cdot\vec{dl}$ 
   - 把单位正电荷从负极由电源内部移到正极的非静电力做功

## 定理

1. 欧姆定律 $R=\frac{dV}{dI}$

   - 微分形式： $\vec{j} = \sigma\vec{E}$

   $$
   \begin{aligned}
   \Delta i &=\frac{\Delta V}{R}\Rightarrow
   j\Delta A =\frac{E\Delta l}{\rho \frac{\Delta l}{\Delta A}}\\
   j &= \frac{E}{\rho} = \sigma E
   \end{aligned}
   $$
   

   - 微观解释

<img src="/img/phyII/Ch31-ExplainOhm.jpg" alt="image-20241115211310228" style="zoom:67%;" />

2. 焦耳定律 $P = i^2R = \frac{V^2}{R}$

## 模型

1. 电极的接地电阻

<img src="/img/phyII/Ch31-LandResist.jpg" alt="image-20241115205955291" style="zoom: 80%;" />

​		视为多层球壳作电阻
$$
R=\int\rho\frac{dl}{A} =\int_a^\infin \rho \frac{dr}{2\pi r^2} = \frac{\rho}{2\pi a}
$$

# Chapter 32(33) 稳恒磁场

## 定义

1. 磁感应强度 $\vec{B} = \frac{\mu_0}{4\pi}\oint\frac{i_1\vec{ds_1}\times \hat{r_{12}}}{r_{12}^2}$
   - 单位 $1T =1N/(m\cdot A)$
2. 磁力 $\vec{dF} = i_2\vec{ds_2}\times \vec{B}$
3. 磁偶极矩 $\vec{\mu_m} = iA\vec{n}$ 
   - 如果多匝线圈要乘以相应的线圈匝数
   - 方向为 $A$ 的法向方向（$\vec{n}$）
4. 力矩 $\vec{\tau} = iA(\vec{n}\times\vec{B}) = \vec{\mu_m}\times\vec{B}$
   - 由此定义的 $U = - \vec{\mu_m}\cdot\vec{B}$ （貌似都是 - X偶极矩 点乘 X场）
5. 洛伦兹力 $\vec{f} = q\vec{v}\times\vec{B}$
   - $\vec{F} = i\vec{ds}\times\vec{B}$ 对应的微观描述

## 定理

1. Biot-Savart Law

   其实就是 $\vec{B} = \frac{\mu_0}{4\pi}\oint\frac{i_1\vec{ds_1}\times \hat{r_{12}}}{r_{12}^2}$

2. 高斯定律
   $$
   \oiint \vec{B}\cdot\vec{dA} = 0\\
   \nabla\cdot \vec{B} = 0
   $$

3. 磁场安培环路定律

$$
\oint \vec{B}\cdot\vec{dl} = \mu_0\sum_{in\ loop} i
$$
   notes

   - i 的符号： 符合右手定则为正，反之为负
   - 如果多次穿入穿出则要多次计算


## 模型

1. 长直导线

   <img src="/img/phyII/Ch32-straitline.jpg" alt="image-20241115221254689" style="zoom:33%;" />
   $$
   B=\frac{\mu_0 i}{4\pi r_0}(\cos{\theta_1} -\cos{\theta_2})
   $$
   无穷长导线则有（可用安培环路）
   $$
   B=\frac{\mu_0 i}{2\pi r_0}
   $$
   

​		补充：导线内部：
$$
B=\frac{\mu_0 ir}{2\pi R^2}
$$


1. 环形导线

<img src="/img/phyII/Ch32-circularloop.jpg" alt="image-20241115221433906" style="zoom:50%;" />
$$
B =\frac{\mu_0}{2}\frac{iR^2}{(R^2+r_0^2)^{3/2}} = \frac{\mu_0}{2\pi}\frac{\mu}{(R^2+r_0^2)^{3/2}}
$$
​		若在导线正中则有
$$
B=\frac{\mu_0 i}{2R}
$$
​		若距离很远则有
$$
B=\frac{\mu_0 iR^2}{2r_0^3}
$$

3. 大平板

<img src="/img/phyII/Ch32-flatstrip.jpg" alt="image-20241115221950055" style="zoom: 67%;" />
$$
B_x=\frac{\mu_0 i}{\pi a} \arctan{\frac{a}{2R}}
$$
​		若离平板很近则有
$$
B=\frac{\mu_0 i}{2\pi R}
$$
​		若离平板很远则有
$$
B=\frac{\mu_0 i}{2a}
$$

4. 螺旋管

<img src="/img/phyII/Ch32-solenoid.jpg" alt="image-20241115223949605" style="zoom:50%;" />
$$
B=\frac{1}{2}\mu_0ni(\cos{\beta_1}-\cos{\beta_2})
$$
​		如果螺线管无限长
$$
B=\mu_0ni
$$
​		这个也可以用安培环路计算

​		![image-20241115234430675](/img/phyII/Ch32-ampereLoopLaw_solenoid.jpg)

​		如果在螺线管一端
$$
B=\frac{1}{2}\mu_0ni
$$

6. 多层螺线管

<img src="/img/phyII/Ch32-multiple_solenoid.jpg" alt="image-20241115224915821" style="zoom:50%;" />

- 各层加起来的总匝数：N
- $ni =\frac{Ni}{L}\Rightarrow jdr = \frac{Ni}{2l(R_2-R_1)}dr$

$$
B=\mu_0jl\ln{\frac{R_2+\sqrt{R_2^2+l^2}}{R_2+\sqrt{R_2^2+l^2}}}
$$

7. 无限大电流板

<img src="/img/phyII/Ch32-infinCurrentSheet.jpg" alt="image-20241115232401861" style="zoom:67%;" />
$$
\oint \vec{V}\cdot\vec{dl} = 2Bw = \mu_0nwi\\
B=\frac{1}{2}\mu_0ni
$$

7. 螺绕环(Toroid)

   <img src="/img/phyII/Ch32-Toroid.jpg" alt="image-20241115234606553" style="zoom:67%;" />

$$
\oint \vec{B}\cdot\vec{dl} = \mu_0Ni\\
B = \mu_0ni
$$

![image-20241115235151968](/img/phyII/Ch32-summary.jpg)

8. 质谱仪

9. 瓷瓶

10. 动量仪

11. 回旋加速器

    加速到一定程度后相对论效应明显，需要特别设置磁场

12. 霍尔效应

    <img src="/img/phyII/Ch32-HallEffect.jpg" alt="image-20241116000706302" style="zoom:50%;" />

$$
V_{AA'} = \frac{1}{nq}\frac{iB}{d} = \kappa\frac{iB}{d}
$$

- Hall Resistance $R_H=\frac{V_{AA'}}{i} = \frac{B}{nqd}$
- 载流子密度 $n =\frac{iB}{qd}\frac{1}{V_{AA'}}$

# Chapter 34&35(36) 法拉第电磁感应定律 & 电感(Inductance) 和材料磁性性质

## 定义

1. 磁通量 $\Phi_B = \iint \vec{B}\cdot\vec{dA}$

2. 磁通匝链数 $\Psi = N\Phi_B$ 

3. 动生电动势 $\epsilon =\int_-^+(\vec{v}\times\vec{B})\cdot\vec{dl}$

   - 绕一端旋转的棒 $\epsilon = -\frac{1}{2}B\omega R^2$

4. 互感系数 $M = \frac{\Psi}{i}$

   - 单位 : 1H=1Wb/1A
   - 互感系数和两线圈自感系数的关系：

   $$
   No\ flux\ leakage : M=\sqrt{L_1L_2}\\
   Direct\ in\ series : L = L_1+L_2+2M\\
   Opposite\ in\ series : L = L_1+L_2-2M
   $$

5. 自感系数：线圈自己由于电流变化产生感应电动势对自己的影响的衡量 $L = \frac{\Psi}{i}$

   - $\epsilon_L =-\frac{d\Psi}{dt} = -L\frac{di}{dt}$
     - 即使在电阻为0的回路中自感也会限制电流最大值

6. 磁导率permeability constant $\kappa_m$

   - 线圈插入磁性材料，$L=\kappa_m L_0$
   - 顺磁逆磁 $\kappa_m \approx 1$ ，铁磁材料 $\kappa_m \approx 10^3 -10^4$

7. 磁化强度矢量 $\vec{M} =\frac{\sum\vec{\mu_m}}{\Delta V}$

   - $\mu_m$ 磁偶极矩

   - 则有 $\oint_l \vec{M}\cdot\vec{dl} = \sum_{inl}i'$
     - $i'$ : induced current 束缚电流

8. 磁场强度 $\vec{H} = \frac{\vec{B}}{\mu_0}-\vec{M}$

   - 单位：奥斯特 1Os = 1A/m

9. 磁化率susceptibility magnetization coefficient  $\chi_m$

   -  $\kappa_m = 1+\chi_m$
## 定理

1. 法拉第电磁感应定律

$$
\epsilon = -\frac{d\Phi_B}{dt}
$$

$$
\Rightarrow\begin{cases}\oint \vec{E}\cdot\vec{dl} = -\frac{d\Phi_B}{dt}\\
\nabla \times \vec{E} = -\frac{\partial\vec{B}}{\partial t}\end{cases}
$$



2. 楞次定律

>The induced current will appear in such a direction that it opposes the change in flux that produced it.

3. **磁性材料加入后的安培环路定律和高斯定律**

$$
\oint_l \vec{H}\cdot\vec{dl} = \sum_{inl} i_0\\
\oiint \vec{B}\cdot\vec{dA} = 0
$$



## 模型

1. 螺线圈的自感系数

![image-20241116232428039](/img/phyII/Ch35-Lsolenoid.jpg)
$$
L=\frac{\Psi}{i} = \frac{nl \mu_0ni A}{i} = \mu_0n^2lA\\
L_v = \frac{L}{lA} = \mu_0n^2\\
$$

2. 长方形螺绕环的自感系数

![image-20241116232632692](/img/phyII/Ch35-LToroidofRectangular.jpg)
$$
\oint B\cdot dl =\mu_0Ni\Rightarrow B =\frac{\mu_0iN}{2\pi r}\\
\Phi_B =\iint B\cdot dA = \frac{\mu_0iNh}{2\pi}\ln{\frac{b}{a}}\\
L = \frac{\mu_0iN^2h}{2\pi}\ln{\frac{b}{a}}
$$

3. 同轴电缆

![image-20241116233306227](/img/phyII/Ch35-coaxial_cable.jpg)
$$
B=\frac{\mu_0i}{2\pi r}\\
\Phi_B = \int_{R_1}^{R_2} Bldr = \frac{\mu_0il}{2\pi r}\ln{\frac{R_2}{R_1}}
$$

4. RC电路与RL电路



![image-20241117002757947](/img/phyII/Ch35-RLcircuits.jpg)

![image-20241117002818933](/img/phyII/Ch35-RLcircuitsEpsilonOn.jpg)

![image-20241117002829796](/img/phyII/Ch35-RLcircuitsEpsilonOFF.jpg)

![image-20241117002841696](/img/phyII/Ch35-RLcircuitsEpsilonOFF2.jpg)

5. LC振荡电路

- 可以与弹簧振子做一个类比

| 简谐运动                      | 电磁震荡                              |
| ----------------------------- | ------------------------------------- |
| 弹簧 $U_s=\frac{1}{2}kx^2$    | 电容 $U_E = \frac{1}{2}\frac{q^2}{C}$ |
| 木块 $K = \frac{1}{2} mv^2$   | 电感 $U_B = \frac{1}{2}Li^2$          |
| $v=\frac{dx}{dt}$             | $i=\frac{dq}{dt}$                     |
| $\omega = \sqrt{\frac{k}{m}}$ | $\omega = \sqrt{\frac{1}{LC}}$        |

- 也可以直接推导

$$
\begin{aligned}
\frac{dU}{dt} &= d(\frac{1}{2}Li^2+\frac{1}{2}\frac{q^2}{C}) = Li\frac{di}{dt} +\frac{q}{C}\frac{dq}{dt} = Li\frac{d^2q}{dt^2} +\frac{q}{C}i = 0\\
&\Rightarrow \frac{d^2q}{dt^2}+\frac{1}{LC}q = 0\\
&\Rightarrow q=q_m\cos{(\omega t+\varphi)},\omega = \sqrt{\frac{1}{LC}}\\
&t = 0,q=q_m,\varphi = 0
\end{aligned}
$$

6. RLC电路

$$
L\frac{di}{dt}+iR+\frac{q}{C} = 
\begin{cases}
\epsilon, K\rightarrow a\\
0, K\rightarrow b
\end{cases}
$$

- 当$\lambda^2=\frac{b^2}{4ac} = \frac{R^2}{4L\frac{1}{C}}>1$ 时

  - $q= e^{-\frac{R}{2L}t}(Ae^{\sqrt{\frac{R^2}{4L^2}-\frac{1}{LC}t}}+Be^{-\sqrt{\frac{R^2}{4L^2}-\frac{1}{LC}t}})+C\epsilon$

  - 称为过阻尼，图像如下

  ![image-20241118102019527](/img/phyII/Ch36-RLCOverDamped.jpg)

- 当 $\lambda = \frac{R}{2}\sqrt{\frac{C}{L}} = 1$ 时

  - $q= e^{-\frac{R}{2L}t}(A+Bt)+C\epsilon$
  - 称为临界阻尼，图像如下

  ![image-20241118102205093](/img/phyII/Ch36-RLCCriticalDamped.jpg)

- 当 $\lambda = \frac{R}{2}\sqrt{\frac{C}{L}}$

  - $q=q_me^{-\frac{R}{2L}t}\cos{(\omega t + \varphi)}+C\epsilon$
    - $\omega=\sqrt{\omega_0^2-(\frac{R}{2L})^2}$
  - 称为阻尼振荡，图像如下

  <img src="/img/phyII/Ch36-RLCDampedOscillation.jpg" alt="image-20241118102911727" style="zoom:50%;" />

  - 若 $\epsilon =\epsilon_m\cos{\omega''t}$，则随着 $\omega''$ 变化振幅变化如下

  <img src="/img/phyII/Ch36-RLCDampedOscillation_Resonance.jpg" alt="image-20241118102812284" style="zoom:50%;" />

1. 涡流

<img src="/img/phyII/Ch34-OddyCurrent.jpg" alt="image-20241116213521262" style="zoom:67%;" />

2. 电磁炮

​		弹丸中感生电动势导致涡流，与线圈的磁场相互作用导致发射

3. 磁悬浮

<img src="/img/phyII/Ch34-MagneticLevitationTrains.jpg" alt="image-20241116213722044" style="zoom: 67%;" />

4. 发电机

$$
\Phi_B = BA\cos{\omega t}\\
\epsilon = BA\omega \sin{\omega t}
$$

<img src="/img/phyII/Ch35-Generator.jpg" alt="image-20241116215315244" style="zoom:50%;" />

5. 电子加速器

![image-20241116222744286](/img/phyII/Ch34-Betatron.jpg)

- B 和 v都在变化，最终呈现效果是 R 没变
- 因为会反向增加所以产出不持续

![image-20241116223458502](/img/phyII/Ch34-Summary.jpg)

6. 变压器

​		利用 $M_{12} = M_{21}$ 得到 $V_2=\frac{N_2}{N_1}V_1$

![image-20241116223859645](/img/phyII/Ch35-Transformer.jpg)

## 一些杂七杂八我并看不懂的东西

- 轨道磁矩 $\vec{\mu_l} = -\frac{e}{2m}\vec{L}$
  - 其中 $\vec{L}=\sqrt{L(L+1)}\frac{h}{2\pi}$
  - $\hbar = \frac{h}{2\pi}$
- 自旋磁矩
  - 费米子 $s=\frac{2k+1}{2}  \hbar$
  - 玻色子 $s=k\hbar$
- 铁磁材料的磁滞回线
  - 铁磁材料内存在若干分块（磁畴），分块内部磁偶极矩方向相同
  - 施加磁场能让磁偶极矩方向相同，即使退磁后也不能完全恢复到随机化，因而 $B\neq 0$ （称为剩磁）
    - 剩磁小则为软铁磁体，反之为硬铁磁体

# 总结对比：电与磁

|                        | 电                                                           | 磁                                                           |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 非常重要的常数         | $\epsilon_0\approx 8.86\times 10^{-12}F/m$                   | $\mu_0 = 4\pi \times 10^{-7} H/m$                            |
| 初始安培环路定理       | $\oiint \vec{E}\cdot \vec{dA} = \sum q_{in}$                 | $\oint_l \vec{B}\cdot\vec{dl} = \sum_{inl} i_0$              |
| 初始高斯定律           | $\oint_l \vec{E}\cdot\vec{dl} = 0$                           | $\oiint \vec{B}\cdot\vec{dA} = 0$                            |
| 由于介质引入的新物理量 | 电感应强度 $\vec{D} = \epsilon_0 \vec{E}+\vec{P}$            | 磁场强度 $\vec{H} = \frac{\vec{B}}{\mu_0}-\vec{M}$           |
|                        | 电容 $C=\frac{Q}{V}$                                         | 电感 $L =\frac{\Psi}{i}$                                     |
| 引入介质的安培环路定律 | \                                                            | $\oint_l \vec{H}\cdot\vec{dl} = \sum_{inl} i_0$              |
| 引入介质的高斯定律     | $\oiint \vec{D}\cdot \vec{dA} = \sum q_{in}$                 | \                                                            |
| $\chi$                 | 极化率 $\chi_e$                                              | 磁化率 $\chi_m$                                              |
| $\chi$ 的引入          | 对于一般的*具有各向同性*的材料，有 $P=\chi_e\epsilon_0E$     | 对于磁性材料 $\vec{M} = \chi_m \vec{H}$                      |
| $\kappa$ 的引入        | 插入介质后 $C=\kappa_e C_0$                                  | 插入磁性材料后 $L=\kappa_mL_0$<br>$\vec{B} = \chi_m\mu_0 \vec{H}$ |
| $\kappa$               | 节点常数 $\kappa_e=1+\chi_e$                                 | 磁导率 $\kappa_m = 1+\chi_m$                                 |
| X化强度矢量            | 极化强度矢量 $\vec{P}=\frac{\sum \vec{p_i}}{\Delta V}$       | 磁化强度矢量$\vec{M} =\frac{\sum\vec{\mu_m}}{\Delta V}$      |
| X场能量密度            | 电场能量密度$u_E=\frac{1}{2}\epsilon_0E^2=\frac{1}{2}\vec{D}\cdot\vec{E}$ | 磁场能量密度 $u_B=\frac{1}{2}\frac{B^2}{\mu_0} = \frac{1}{2}\vec{B}\cdot\vec{H}$ |

# Chapter 38 麦克斯韦方程组

## 公式推导

**新的安培环路定律**

![image-20241118105541330](/img/phyII/Ch38-Ampere.jpg)
$$
\oint\vec{H}\cdot\vec{dl} = \iint_{S_2} \vec{j_0}\cdot\vec{dA}=-\iint_{S_1} \vec{j_0}\cdot\vec{dA} = i_0\\
\Rightarrow\oiint_{S}\vec{j_0}\cdot\vec{dA}=\iint_{S_2} \vec{j_0}\cdot\vec{dA}+\iint_{S_1} \vec{j_0}\cdot\vec{dA} = 0
$$
同时根据stolz公式我们又有
$$
\oint\vec{H}\cdot\vec{dl} = \iint_{S_2} (\nabla\times\vec{H})\cdot\vec{dA}
$$
**但是存在问题：在电容的情况下不成立（如图中闭合曲面3）**

![image-20241118110248459](/img/phyII/Ch38-AmpereProblem.jpg)

$\Rightarrow$ 变化的电场应当算入其中！

引入变量：

- 电位移通量 $\Phi_D=\iint \vec{D}\cdot\vec{dA}$  , 位移电流 $i_D=\frac{d\Phi_D}{dt} =\iint$

  

- $\oint\vec{H}\cdot\vec{dl} = i_0+i_D = \iint (\vec{j_0}+\frac{\partial\vec{D}}{\partial t})\cdot \vec{dA}$









# Chapter39 

中间漏了好多，有空补上

- 横波：传播方向 E & H 为常数0

- 纵波：$\vec{E} \perp \vec{H}$

#### 电磁波的能流密度(Energy Flux Density)与动量

$$
\begin{aligned}
\frac{dU}{dt} &= \frac{d}{dt}\iiint (\frac{1}{2}\vec{D}\cdot\vec{E}+\frac{1}{2}\vec{B}\cdot\vec{H})\\
&=\frac{1}{2}\iiint\frac{\partial }{\partial t}(\vec{D}\cdot\vec{E}+\vec{B}\cdot\vec{H})dv
\end{aligned}
$$
$$
\begin{aligned}
\frac{\partial }{\partial t}(\vec{D}\cdot\vec{E}+\vec{B}\cdot\vec{H}) &= \kappa_e\epsilon_0\frac{\partial }{\partial t}(\vec{E}\cdot\vec{E})+\kappa_m\mu_0\frac{\partial }{\partial t}(\vec{H}\cdot\vec{H})\\
&=2\kappa_e\epsilon_0\vec{E}\cdot\frac{\partial \vec{E}}{\partial t}+2\kappa_m\mu_0\vec{H}\cdot\frac{\partial \vec{H}}{\partial t}\\
&=2\vec{E}\cdot\frac{\partial\vec{D}}{\partial t}+2\vec{H}\cdot\frac{\partial\vec{B}}{\partial t}
\end{aligned}
$$

由麦克斯韦方程组
$$
\frac{\partial\vec{D}}{\partial t}=\\
\frac{\partial\vec{B}}{\partial t}=
$$
