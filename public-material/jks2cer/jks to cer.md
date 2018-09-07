# jks to cer

### 从`jks`文件中提取`cer`证书

- 显示keystore中所有证书

  - ```shell
    keytool -list -v -keystore {keystore.jks}
    ```

    - keystore和truststore都用`-keystore`参数

  - 输出结果如下：

    - ```s
      Enter keystore password:
      Keystore type: JKS
      Keystore provider: SUN

      Your keystore contains 1 entry

      Alias name: carootforserver
      Creation date: Mar 19, 2018
      Entry type: trustedCertEntry

      Owner: CN=zjdex, OU=zjdex, O=zjdex, L=HZ, ST=ZJ, C=CN
      Issuer: CN=zjdex, OU=zjdex, O=zjdex, L=HZ, ST=ZJ, C=CN
      Serial number: 7b5374de
      Valid from: Tue Jan 09 19:13:29 CST 2018 until: Wed Jan 09 19:13:29 CST 2019
      Certificate fingerprints:
               MD5:  CA:EA:59:4F:DF:34:F1:82:0A:7D:7E:76:A5:C1:67:9C
               SHA1: 42:59:FC:8B:9D:8B:D8:E6:13:64:96:64:15:C6:CA:A1:09:42:04:01
               SHA256: CC:64:C4:E2:C3:60:01:DD:67:35:88:11:C7:DD:38:5E:66:16:C9:96:6E:CE:8B:D3:AD:A9:5D:61:12:09:A1:F3
      Signature algorithm name: SHA256withRSA
      Subject Public Key Algorithm: 2048-bit RSA key
      Version: 3


      *******************************************
      *******************************************

      ```

    - 结果中的**别名（Alias Name）**在提取`cer`时需要用

- 提取证书

  - ```shell
    keytool -exportcert -rfc -alias {alias} -file {cert_name.cer} -keystore {keystore.jks} -storepass {password}
    ```

  - 输出文件为`{cert_name.cer}`

  ​

### java中使用`cer`文件

基于现有代码，把`cer`文件导入`keystore`中最方便

代码如下（来自[stackoverflow][1]）：

```java
import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
//VERY IMPORTANT.  SOME OF THESE EXIST IN MORE THAN ONE PACKAGE!
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;

KeyStore readKeyStoreFromCerFile(String certFileName) {
    //Put everything after here in your function.
    KeyStore trustStore  = KeyStore.getInstance(KeyStore.getDefaultType());
    trustStore.load(null);//Make an empty store
    // InputStream fis = /* insert your file path here */;
    InputStream fis = new FIleInputStream(certFileName);
    BufferedInputStream bis = new BufferedInputStream(fis);

    CertificateFactory cf = CertificateFactory.getInstance("X.509");

    while (bis.available() > 0) {
        Certificate cert = cf.generateCertificate(bis);
        trustStore.setCertificateEntry("fiddler"+bis.available(), cert);
    }
    return trustStore
}
```





[1]: https://stackoverflow.com/questions/4325263/how-to-import-a-cer-certificate-into-a-java-keystore