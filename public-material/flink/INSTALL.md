# RocksDB安装手册
> 刘新春 2016年11月11日

## 1.  gcc-4.7+

RocksDB的一些特性需要C++11的支持，因此需要安装gcc-4.7+或clang。本手册以gcc-5.2.0为例，手动编译安装gcc。gcc-5.2.0需要三个组件的支持，分别是gmp、mpfr以及mpc。以下为本手册安装gcc-5.2.0所需的软件包列表：

| 软件包名称 | 软件包版本号 | 软件包全称             |
| ----- | ------ | ----------------- |
| gmp   | 6.1.0  | gmp-6.1.0.tar.bz2 |
| mpfr  | 3.1.3  | mpfr-3.1.3.tar.gz |
| mpc   | 1.0.3  | mpc-1.0.3.tar.gz  |
| gcc   | 5.2.0  | gcc-5.2.0.tar.gz  |

安装过程如下：

* 安装gmp-6.1.0
  * tar xfv gmp-6.1.0.tar.bz2
  * cd gmp-6.1.0
  * ./configure --prefix=/usr/local/gmp-6.1.0
  * make
  * make install
* 安装mpfr-3.1.3
  * tar zxvf mpfr-3.1.3.tar.gz
  * cd mpfr-3.1.3
  * ./configure --prefix=/usr/local/mpfr-3.1.3 --with-gmp=/usr/local/gmp-6.1.0
  * make
  * make install
* 安装mpc-1.0.3
  * tar zxvf mpc-1.0.3.tar.gz
  * cd mpc-1.0.3
  * ./configure --prefix=/usr/local/mpc-1.0.3 --with-gmp=/usr/local/gmp-6.1.0 --with-mpfr=/usr/local/mpfr-3.1.3
  * make
  * make install
* 安装gcc-5.2.0
  *   设置以上软件包的lib，在终端下输入：    
        export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/gmp-6.1.0/lib:/usr/local/mpfr-3.1.3/lib:/usr/local/mpc-1.0.3/lib

        否则gcc编译过程中会报告找不到以上lib的错误。为保险在/etc/ld.so.conf中也将以上lib添加上（每条一行）：
      * /usr/local/gmp-6.1.0/lib
      * /usr/local/mpfr-3.1.3/lib
      * /usr/local/mpc-1.0.3/lib
      
        保存退出并运行ldconfig。
  *   tar zxvf gcc-5.2.0.tar.gz
  *   cd gcc-5.2.0
  *   ./configure --prefix=/usr/local/gcc-5.2.0 --enable-threads=posix --disable-checking --disable-multilib --enable-languages=c,c++ --with-gmp=/usr/local/gmp-6.1.0 --with-mpfr=/usr/local/mpfr-3.1.3 --with-mpc=/usr/local/mpc-1.0.3
  *   make
  *   make install
                  等待比较久的时间（具体视编译机器的性能半个小时到半天不等）编译成功。
  *   再次打开/etc/ld.so.conf，将/usr/local/gcc-5.2.0/lib加入到其中，保存退出并运行ldconfig。
  *   修改/usr/bin目录下gcc版本，一般有cc、c++、gcc、g++，分别将原来的cc、c++、gcc、g++备份：
      * mv cc cc.bak
      * mv c++ c++.bak
      * mv gcc gcc.bak
      * mv g++ gcc.bak
  *   创建新的软连接，指向gcc-5.2.0:
      * ln -s /usr/local/gcc-5.2.0/bin/cc cc
      * ln -s /usr/local/gcc-5.2.0/bin/c++ c++
      * ln -s /usr/local/gcc-5.2.0/bin/gcc gcc
      * ln -s /usr/local/gcc-5.2.0/bin/g++ g++
     

        至此gcc-5.2.0已经安装完成。

## 2. RocksDB安装
官方安装说明如下：
* 你可以使用以下压缩库来连接RocksDB
  *  zlib - a library for data compression.
  *  bzip2 - a library for data compression.
  *  snappy - a library for fast data compression.
* RocksDB所有的工具 均依赖于
  * gflags - a library that handles command line flags processing. You can compile rocksdb library even if you don't have gflags installed.
 
   
本手册安装所使用的软件包及版本号如下：

| 软件包名称  | 软件包版本号 | 软件包全称               |
| ------ | ------ | ------------------- |
| zlib   | 1.2.8  | zlib-1.2.8.tar.gz   |
| bzip2  | 1.0.6  | bzip2-1.0.6.tar.gz  |
| snappy | 1.1.3  | snappy-1.1.3.tar.gz |
| gflag  | 2.0    | gflag-2.0.tar.gz    |
安装过程如下：
* zlib-1.2.8安装
  * tar zxvf zlib-1.2.8.tar.gz
  * cd zlib-1.2.8    
  * ./configure
  * make
  * make install  

* bzip2-1.0.6
  *  tar zxvf bzip2-1.0.6.tar.gz
  *  cd bzip2-1.0.6 
  *  打开Makefile文件，将第24行添加 -fPIC即：将CFLAGS=-Wall -Winline -O2 -g \$(BIGFILES)改为CFLAGS=-Wall -Winline -O2 -g \$(BIGFILES) -fPIC，目的：防止在rocksdbjava编译过程中无法以shared方式编译
  *  make install

* snappy-1.1.3
  * tar zxvf snappy-1.1.3.tar.gz
  * cd snappy-1.1.3
  * ./configure
  * make
  * make install

* gflag-2.0
  *  tar zxvf gflag-2.0.tar.gz
  *  cd gflag-2.0
  *  ./configure
  *  make
  *  make install
 

  以上软件包中均含有README或INSTALL，安装的步骤在里面都有详细描述。

* 安装RocksDB
  * 从github上将RocksDBclone下来： git clone https://github.com/facebook/rocksdb.git 
  * 进入rocksdb目录，cd rocksdb
  * 在编译过程中可能碰到许多奇葩错误，如 没有执行权限，c++11特性不支持以及/bin/sh\^M不识别等。逐一解决以上问题：
    * build_tools/build_detect_platform：执行权限不够
      * 解决方法：进入build_tools/，将所有文件赋予可执行权限：chmod +x *
    * 编译器C++11特性不支持
      * 解决方法：我们在前文已经安装了gcc-5.2.0，已经支持c++11特性，但需要在编译时指定。打开rocksdb根目录下Makefile文件，找到CXXFLAGS变量，本版本在第156行，将`CXXFLAGS += -g`修改为`CXXFLAGS += -g -std=c++11`
    * /bin/sh\^M命令不识别
      * 解决方法：这可能是由于build_tools/目录下的文件均在windows下编写的，具有windows隐藏的换行符\^M，使用dos2unix命令将该目录下所有文件变成unix格式：dos2unix *
  * 按照官方的建议编译成静态库：make static_lib
  * 编译过程中可能报告很多告警信息，经查看大部分是代码书写风格的问题，不需要关注。也可以在Makefile文件中修改WARNING_GLAGS选项将其屏蔽掉，本版本在Makefile第216行. 
  * 最后会在根目录下生成librocksdb.a静态库
  

    至此，RocksDB的c++版本已经编译好了。下面介绍编译RocksDBJava.

* RocksDBJava编译
  * 根目录下运行make rocksdbjava
  * 在java/目录下会生成rocksdbjni.-\*.tar和librocksdbjni-*.so文件
  

    注意：编译过程中可能会报告找不到jar包的情况。主要是无法下载所依赖的jar包，且本地maven仓库中没有相关jar包，解决方法：在一个本地maven仓库比较齐全的机器上编译。