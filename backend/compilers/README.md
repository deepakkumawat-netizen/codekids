# CodeKids Bundled Compilers

## Overview
CodeKids is a **completely self-contained system** - all 10 programming language compilers are bundled in this directory. No external installations or internet connection required.

## Bundled Compilers (10 Languages)

### 1. Python 3.12+
- **Path**: `python/python.exe`
- **Source**: Official Python portable version
- **Download**: https://www.python.org/downloads/
- **Size**: ~50MB
- **Status**: ✓ Required

### 2. Node.js (JavaScript/TypeScript)
- **Path**: `node/node.exe`
- **Source**: Official Node.js portable
- **Download**: https://nodejs.org/
- **Size**: ~40MB
- **Status**: ✓ Required

### 3. Java (OpenJDK 21)
- **Path**: `java/bin/javac.exe`, `java/bin/java.exe`
- **Source**: Adoptium OpenJDK 21
- **Download**: https://adoptium.net/temurin/releases/
- **Size**: ~200MB
- **Status**: ✓ Required

### 4. GCC (C/C++)
- **Path**: `gcc/bin/gcc.exe`, `gcc/bin/g++.exe`
- **Source**: MinGW-w64 portable
- **Download**: https://www.mingw-w64.org/
- **Size**: ~150MB (GCC), ~150MB (G++)
- **Status**: ✓ Required

### 5. C# (Roslyn)
- **Path**: `csharp/csc.exe`
- **Source**: Roslyn Compiler (NuGet)
- **Download**: https://github.com/dotnet/roslyn/releases
- **Size**: ~50MB
- **Status**: ✓ Required

### 6. PHP
- **Path**: `php/php.exe`
- **Source**: Official PHP portable for Windows
- **Download**: https://windows.php.net/
- **Size**: ~30MB
- **Status**: ✓ Required

### 7. Ruby
- **Path**: `ruby/bin/ruby.exe`
- **Source**: RubyInstaller portable
- **Download**: https://rubyinstaller.org/
- **Size**: ~100MB
- **Status**: ✓ Required

### 8. Go
- **Path**: `go/bin/go.exe`
- **Source**: Official Go portable
- **Download**: https://go.dev/dl/
- **Size**: ~200MB
- **Status**: ✓ Required

### 9. Rust
- **Path**: `rust/bin/rustc.exe`
- **Source**: Official Rust portable
- **Download**: https://www.rust-lang.org/
- **Size**: ~1GB
- **Status**: ✓ Required

### 10. (Reserved for future)
- Currently all 10 languages are bundled
- Total Size: ~2GB (compressed: ~800MB)

---

## Directory Structure

```
compilers/
├── python/                  (Python 3.12+)
├── node/                    (Node.js)
├── java/                    (OpenJDK 21)
│   └── bin/
│       ├── javac.exe
│       └── java.exe
├── gcc/                     (MinGW-w64)
│   └── bin/
│       ├── gcc.exe
│       ├── g++.exe
│       ├── [other GCC files]
├── csharp/                  (Roslyn)
│   └── csc.exe
├── php/                     (PHP)
│   └── php.exe
├── ruby/                    (Ruby)
│   └── bin/
│       └── ruby.exe
├── go/                      (Go)
│   └── bin/
│       └── go.exe
├── rust/                    (Rust)
│   └── bin/
│       └── rustc.exe
├── compilers.py             (Python executor module)
└── README.md                (This file)
```

---

## Installation Instructions

### For Teachers/Admins (One-Time Setup)

1. **Download each compiler** using the links above
2. **Extract to proper directories** following the structure above
3. **Verify installations**:
   ```bash
   python/python.exe --version
   node/node.exe --version
   java/bin/javac.exe -version
   gcc/bin/gcc.exe --version
   php/php.exe -version
   ruby/bin/ruby.exe --version
   go/bin/go.exe version
   rust/bin/rustc.exe --version
   ```

4. **Test CodeKids**:
   ```bash
   cd C:\codekids
   python run-codekids.bat
   ```

### For Students
- **Nothing to install!** Compilers are pre-bundled
- Just run: `C:\codekids\run-codekids.bat`
- Works completely offline

---

## Updating Compilers

To update a specific compiler:

1. Download the latest **portable** version
2. Backup the old version: `gcc_old/`
3. Replace with new version maintaining directory structure
4. Test with CodeKids to verify

---

## Troubleshooting

### "Compiler not found" Error
- Check if compiler directory exists
- Verify executable path matches `compilers.py`
- Make sure it's a Windows portable/standalone version

### Code won't execute
- Check backend console for missing compiler warnings
- Verify compiler path in `C:\codekids\backend\compilers.py`

### Large file size
- Use 7-Zip or WinRAR to compress `C:\codekids\` (~800MB compressed)
- Can be distributed on USB drives or network shares

---

## For Distribution

### Enterprise Package
```
codekids-enterprise.zip (800MB compressed)
├── codekids/
│   ├── frontend/
│   ├── backend/
│   │   └── compilers/      (All 10 bundled)
│   ├── run-codekids.bat
│   └── COMPLETE_SETUP.md
└── INSTALL.txt
```

### System Requirements
- **OS**: Windows 7+ (preferably Windows 10/11)
- **CPU**: Any modern processor
- **RAM**: 2GB minimum (4GB recommended)
- **Disk**: 2GB free space (1GB for CodeKids + 1GB for temporary files)
- **Internet**: Not required (completely offline)

### Deployment
1. Extract `codekids-enterprise.zip` to network drive or USB
2. Give schools `run-codekids.bat` shortcut
3. Students double-click, everything works!
4. No admin rights needed for end users

---

## Compiler License Notes

- **Python**: PSF License (free)
- **Node.js**: MIT License (free)
- **Java (OpenJDK)**: GPLv2 + CE (free, open source)
- **GCC**: GPLv3 (free, open source)
- **C# (Roslyn)**: MIT License (free, open source)
- **PHP**: PHP License (free, open source)
- **Ruby**: Ruby License (free, open source)
- **Go**: BSD License (free, open source)
- **Rust**: MIT/Apache 2.0 (free, open source)

All bundled compilers are **free and open source** - suitable for educational distribution.

---

## Support

For issues with specific compilers:
- Python: https://www.python.org/
- Node.js: https://nodejs.org/
- Java: https://adoptium.net/
- GCC: https://www.mingw-w64.org/
- PHP: https://www.php.net/
- Ruby: https://www.ruby-lang.org/
- Go: https://go.dev/
- Rust: https://www.rust-lang.org/

For CodeKids issues: Contact development team

---

**Last Updated**: 2026-04-08
**Version**: 1.0 (Complete Self-Contained System)
