import JSEncrypt from 'jsencrypt/bin/jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMuGUo6i1YsRD0YwJZoMLBiAt/teDJppcsaXdkWyzfjU/d9ZqvoX0pUxC9rv6fzNsZT40MVQ7+cPVMiIwQDgY30CAwEAAQ=='

const privateKey = 'MIIBVgIBADANBgkqhkiG9w0BAQEFAASCAUAwggE8AgEAAkEAy4ZSjqLVixEPRjAlmgwsGIC3+14Mmmlyxpd2RbLN+NT931mq+hfSlTEL2u/p/M2xlPjQxVDv5w9UyIjBAOBjfQIDAQABAkEAhad6Q81PavoTC8bGirl/o7+0EtEaebTR+PSyaOcZOFSLbpwOHT1wVVFUX6RRYMx3ilCp//Y7Pgag61dobv7aCQIhAOUdQL4tHn+1sAYNb8475X6MjsZBuA6lvWb22lpyxAVPAiEA42hXctGLeWzM4FjNzFN7+abNcjAhVkqBP1uMI99/r3MCIQDSFtvqRzdDRhgtxJ50Tyomu76j/1lGXSZrRwp8i+ZBMwIhAN2rGQsQHV+4YaESj1Dr0/5PzRXQur5Nk905lMpnEyTnAiBpW0cx56+qsYtfw2f5OLbkvvDIgUJL4w6XSQ9ac63//w=='

// 加密
export function encrypt(txt) {
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey) // 设置公钥
    return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt(txt) {
    const encryptor = new JSEncrypt()
    encryptor.setPrivateKey(privateKey)
    return encryptor.decrypt(txt)
}