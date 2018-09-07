# Flink Release版本发布包编译小手册    
> 刘新春       
> 2017年1月10日      

**本手册成文时为2017年1月10日，基于最新flink master分支滚动版本，后续版本有改动请酌情修改，本文仅作参考**     

flink release版本发布包发布工具在flink源码根目录下的tools文件中，主要由create_release_flies.sh脚本来完成。由于编译时需要从外网下载一个完整的源代码，编译板子没有连接外网，因此魁修改了一下编译脚本，可以直接设置源代码的git远程仓库。 修改的代码需要先上传到自己的git远程仓库（或直接将源代码拷贝到tools/flink目录下，具体没有测试这个方法，拷贝后tools/flink/目录详情见下图）。  
![toolsflink](./pictures/toolsflink.png)       

## 所需软件
| 软件名称 | 软件版本 |     
| ---- | ---- |     
|maven | 3.3以下版本（本文使用3.0.5） |      
| gpg  | 本文使用2.0.22 |     

## 使用GPG生成key
* 生成密钥    
  * 命令：`gpg --gen-key`
  * 选择key的方式：默认即可。    
    ```shell
    Please select what kind of key you want:
      (1) RSA and RSA (default)
      (2) DSA and Elgamal
      (3) DSA (sign only)
      (4) RSA (sign only)
    Your selection?
   ```
   * 选择长度，默认：
   ```shell
   RSA keys may be between 1024 and 4096 bits long.
   What keysize do you want? (2048)
   ```
   * 设置key的有效时间（0代表无限长），选择默认0
   ```shell
   Please specify how long the key should be valid.
            0 = key does not expire
         <n>  = key expires in n days
         <n>w = key expires in n weeks
         <n>m = key expires in n months
         <n>y = key expires in n years
   Key is valid for? (0) 0
   ```
   * 问你上述选择是否正确？当然正确了
   ```shell
   Key does not expire at all
   Is this correct? (y/N)
   ```
   * 要求你填写名字、email、陈述：(陈述空着即可)     
   ```shell    
   GnuPG needs to construct a user ID to identify your key.
   Real name: XXXXX
   Email address: YYYYY
   Comment:ZZZZ
   You selected this USER-ID:
       XXXXX <YYYYY>
      ZZZ
   Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit?
   ```    

   * 选择O，会弹出对话框要求你输入PassPhrase    
   ```shell
   Enter PassPhrase
   Passphrase_____________________
   <OK>          <Cancel>
   ```
   * 记住刚才填写的PassPhrase,完成后会输出一堆信息如下：    
   ```
   We need to generate a lot of random bytes. It is a good idea to perform
   some other action (type on the keyboard, move the mouse, utilize the
   disks) during the prime generation; this gives the random number
   generator a better chance to gain enough entropy.
   We need to generate a lot of random bytes. It is a good idea to perform
   some other action (type on the keyboard, move the mouse, utilize the
   disks) during the prime generation; this gives the random number
   generator a better chance to gain enough entropy.
   gpg: key 1471837D marked as ultimately trusted
   public and secret key created and signed.
   gpg: checking the trustdb
   gpg: 3 marginal(s) needed, 1 complete(s) needed, PGP trust model
   gpg: depth: 0  valid:   3  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 3u
   pub   2048R/1471837D 2017-01-10
         Key fingerprint = D2B0 7429 B3B7 785A E3F1  B4A9 7761 9980 1471 837D
   uid                 XXXXX <YYYYY>
   sub   2048R/7BFE2B63 2017-01-10
   ```

   倒数第9行`gpg: key 1471837D`即为产生的key：1471837D。

   到此为止产生了PassPhrase和key。

## 编译release大包     
例如，最新的版本为1.3-SNAPSHOT，从master分支编译,候选发布版本为rc1，下载代码的路径为http://code.huawei.com/l00354552/flink.git  
命令如下：     
```shell
[liuxch@xxxxxx]$ sonatype_user=APACHEID sonatype_pw=APACHEIDPASSWORD \
  NEW_VERSION=1.3.0 \
  RELEASE_CANDIDATE="rc1" RELEASE_BRANCH=master \
  OLD_VERSION=1.3-SNAPSHOT \
 USER_NAME=APACHEID \
 GPG_PASSPHRASE=****** GPG_KEY=1471837D \
  GIT_AUTHOR="`git config --get user.name` <`git config --get user.email`>" \
 IS_LOCAL_DIST=true GIT_REPO="code.huawei.com/l00354552/flink.git" \
 ./create_release_files.sh --scala-version 2.11 --hadoop-version 2.7.2
```
上面sonatype_user及sonatype_pw USER_NAME没有必要设置，GPG_PASSPHRASE和GPG_KEY分别设置为刚才gpg填写和生成的key，GIT_REPO设置为下载代码的仓库。
