---
title: 加密算法-pbkdf2
date: "2025-01-15"
excerpt: encrption util
tags:
  - encription
  - java
coverEmoji: 
---

# 手把手教你给密码“加盐哈希”——PBKDF2 实战笔记

&gt; 密码到底怎么存才安心？  
&gt; 明文？→ 黑客一笑。  
&gt; MD5？→ 彩虹表一秒破。  
&gt; 今天聊聊“记忆型”哈希——PBKDF2，附完整 Spring Boot 工具类，复制即可用。

---

## 01 / 为什么选 PBKDF2

| 优点 | 说明 |
|---|---|
| 算法老，但久经考验 | PKCS #5、RFC 8018 标准 |
| Java 标准库自带 | 零依赖 |
| 可调节迭代次数 | 想多慢就多慢，暴力破解成本直线上升 |

&gt; 如果你追求极致抗 GPU，可以考虑 **Argon2 / bcrypt**；  
&gt; 但老系统迁移、轻量级项目，PBKDF2 仍是“够用且合规”的首选。

---

## 02 / 核心思路：盐 + 迭代 + 长哈希

1. **盐（Salt）**——随机、每次不同，防止彩虹表。  
2. **迭代（Iterations）**——故意变慢，拖垮暴力破解。  
3. **长哈希（512 bit）**——输出更长，降低碰撞概率。

---

## 03 / 直接上代码

下面这个 `PBKDF2Util` 已经封装了“生成盐 → 哈希 → 验证”完整链路，复制进 Spring Boot 即可 `@Autowired` 使用。

```java
package com.example.plantmarket.utils;

import org.springframework.stereotype.Component;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;

@Component
public class PBKDF2Util {

    public static final String PBKDF2_ALGORITHM = "PBKDF2WithHmacSHA1";
    public static final int SALT_BYTE_SIZE      = 16;   // 16 字节盐
    public static final int HASH_BIT_SIZE       = 512;  // 512 bit 输出
    public static final int PBKDF2_ITERATIONS   = 10_000; // 生产建议 ≥ 1 万

    /* ========== 1. 生成盐 ========== */
    public String generateSalt() throws NoSuchAlgorithmException {
        SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
        byte[] salt = new byte[SALT_BYTE_SIZE];
        random.nextBytes(salt);
        return toHex(salt);
    }

    /* ========== 2. 密码 → 哈希 ========== */
    public String getEncryptedPassword(String password, String salt)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        KeySpec spec = new PBEKeySpec(password.toCharArray(),
                                      fromHex(salt),
                                      PBKDF2_ITERATIONS,
                                      HASH_BIT_SIZE);
        SecretKeyFactory factory = SecretKeyFactory.getInstance(PBKDF2_ALGORITHM);
        return toHex(factory.generateSecret(spec).getEncoded());
    }

    /* ========== 3. 验证密码 ========== */
    public boolean authenticate(String attemptedPassword,
                                String encryptedPassword,
                                String salt) throws NoSuchAlgorithmException, InvalidKeySpecException {
        String encryptedAttempt = getEncryptedPassword(attemptedPassword, salt);
        return encryptedAttempt.equals(encryptedPassword);
    }

    /* ========== 工具：字节 ↔ HEX ========== */
    private static String toHex(byte[] array) {
        BigInteger bi = new BigInteger(1, array);
        String hex = bi.toString(16);
        int padding = (array.length * 2) - hex.length();
        return (padding &gt; 0) ? String.format("%0" + padding + "d", 0) + hex : hex;
    }

    private static byte[] fromHex(String hex) {
        byte[] binary = new byte[hex.length() / 2];
        for (int i = 0; i &lt; binary.length; i++) {
            binary[i] = (byte) Integer.parseInt(hex.substring(2 * i, 2 * i + 2), 16);
        }
        return binary;
    }
}

安全调优清单
✅ 迭代次数 ≥ 10 000（2024 年推荐 20 000+）
✅ 盐必须 随机 + 全局唯一
✅ 哈希算法可升级至 PBKDF2WithHmacSHA256（换算法名即可）
✅ 不要用“密码+盐”再 MD5 做二次哈希，直接存 PBKDF2 输出
✅ 登录失败延迟：同一 IP 连续错误 5 次后，休眠 3 秒，防止在线暴力

结语
密码安全没有“绝对”，只有“够贵”。
把迭代次数拉高、把盐管好、把泄露响应做好，
黑客一算成本“不划算”，你的用户就安全了。

    现在，去把数据库里那些 md5(password) 翻出来改一波吧 😉