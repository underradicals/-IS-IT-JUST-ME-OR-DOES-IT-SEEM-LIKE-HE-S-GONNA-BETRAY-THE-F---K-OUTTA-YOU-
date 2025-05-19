# -IS-IT-JUST-ME-OR-DOES-IT-SEEM-LIKE-HE-S-GONNA-BETRAY-THE-F---K-OUTTA-YOU-

---

## 🛡️ **HTTPS Development Certificate Generation Script (PowerShell + OpenSSL)**

This PowerShell script automates the process of creating a local Certificate Authority (CA) and generating HTTPS certificates for development purposes.

### 📁 **Step 1: Set Up Certificate Directory**

```powershell
$certDir = "<Your-Directory>"
New-Item -Path $certDir -ItemType Directory
Set-Location -Path $certDir
```

- Creates a directory at `<Your-Directory>` to store all certificates.
- Changes the working directory to this folder.

---

### 🔐 **Step 2: Generate Private Key for the Root CA**

```bash
openssl genrsa -out rootCA.key 2048
```

- Generates a **2048-bit RSA private key** for the root Certificate Authority (CA).
- The private key is saved as `rootCA.key`.

---

### 🏛️ **Step 3: Create a Self-Signed Root Certificate**

```bash
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 3650 -out rootCA.pem -subj "/C=US/ST=Local/L=Localhost/O=Dev CA/CN=Dev Local CA" -config "<Path-To-Your-OpenSSL-Cnf>"
```

- Generates a self-signed X.509 certificate using the previously created CA private key.
- Valid for **10 years (3650 days)**.
- The `-subj` flag defines the distinguished name for the certificate.
- Output file: `rootCA.pem`.

---

### 🔑 **Step 4: Generate a Private Key for localhost**

```bash
openssl genrsa -out localhost.key 2048
```

- Generates a **2048-bit private key** for `localhost`, to be used in SSL communications.
- Output file: `localhost.key`.

---

### 📝 **Step 5: Create Certificate Extensions File**

```powershell
@"
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
... (other IP.*)
"@ | Set-Content -Encoding ascii -Path "localhost.ext"
```

- Defines an **extension file** (`localhost.ext`) for the localhost certificate.
- Sets the `subjectAltName` (SAN) with multiple IPs and DNS names for local development.

---

### 🧾 **Step 6: Create a Certificate Signing Request (CSR)**

```bash
openssl req -new -key localhost.key -out localhost.csr -subj "/CN=localhost" -config "<Path-To-Your-OpenSSL-Cnf>"
```

- Generates a **CSR** using the `localhost` private key.
- The `-subj` flag provides the Common Name (`CN=localhost`) for the certificate.

---

### ✅ **Step 7: Sign the localhost CSR with the Root CA**

```bash
openssl x509 -req -in localhost.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out localhost.crt -days 825 -sha256 -extfile localhost.ext
```

- Signs the `localhost.csr` with the root CA to generate a valid certificate (`localhost.crt`).
- Valid for **825 days** (maximum for modern browsers before warning about long expiry).
- Includes the SANs from `localhost.ext`.

---

### 📂 **Output Files**

- `rootCA.key` – Private key for the root CA
- `rootCA.pem` – Self-signed root CA certificate
- `rootCA.srl` – CA serial file created automatically
- `localhost.key` – Private key for `localhost`
- `localhost.csr` – Certificate signing request for `localhost`
- `localhost.ext` – Extensions (SANs) used during signing
- `localhost.crt` – Signed certificate for `localhost`

---

### 🧪 **Usage Tips**

- Import `rootCA.pem` into your system/browser trust store to avoid security warnings during local development.
- Use `localhost.crt` and `localhost.key` in your local HTTPS servers (like Kestrel, NGINX, etc.).
- Rotate or regenerate certificates periodically or as needed.

---
