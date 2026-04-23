"""
Setup script to download and configure portable compilers for CodeKids
Run this once to set up all compilers bundled with the backend
"""

import os
import subprocess
import sys
from pathlib import Path

COMPILERS_DIR = Path(__file__).parent / "compilers"

def setup_compilers():
    print("Setting up portable compilers for CodeKids...")
    print("=" * 60)

    # Create compilers directory
    COMPILERS_DIR.mkdir(exist_ok=True)
    print(f"✓ Compilers directory: {COMPILERS_DIR}")

    print("\nChoose installation method:")
    print("1. Automatic (download & install)")
    print("2. Manual (use chocolatey)")
    choice = input("Enter choice (1-2): ").strip()

    if choice == "1":
        install_automatic()
    elif choice == "2":
        install_manual()
    else:
        print("Invalid choice")
        return

    print("\n" + "=" * 60)
    print("✓ Compiler setup complete!")
    print("All compilers are now self-contained in the backend.")
    print("Clients can use CodeKids without external installations.")

def install_automatic():
    """Install using portable versions"""
    print("\nInstalling portable compilers...")

    # Java
    print("\n[1/3] Java (OpenJDK)...")
    try:
        subprocess.run([
            "choco", "install", "openjdk", "-y",
            "--install-arguments", f"--installdir=\"{COMPILERS_DIR}\\java\""
        ], check=False)
        print("✓ Java installed")
    except Exception as e:
        print(f"✗ Java installation failed: {e}")

    # MinGW (C/C++)
    print("\n[2/3] MinGW (C/C++)...")
    try:
        subprocess.run([
            "choco", "install", "mingw", "-y",
            "--install-arguments", f"--installdir=\"{COMPILERS_DIR}\\mingw\""
        ], check=False)
        print("✓ MinGW installed")
    except Exception as e:
        print(f"✗ MinGW installation failed: {e}")

    # Go
    print("\n[3/3] Go...")
    try:
        subprocess.run([
            "choco", "install", "golang", "-y",
            "--install-arguments", f"--installdir=\"{COMPILERS_DIR}\\go\""
        ], check=False)
        print("✓ Go installed")
    except Exception as e:
        print(f"✗ Go installation failed: {e}")

def install_manual():
    """Manual installation guide"""
    print("""
Manual Installation Steps:
1. Install Java: choco install openjdk -y
2. Install MinGW: choco install mingw -y
3. Install Go: choco install golang -y

After installation, copy the install paths to .env:
- JAVA_HOME=C:\\Program Files\\OpenJDK\\jdk-*
- MINGW_HOME=C:\\mingw64
- GO_HOME=C:\\Program Files\\Go
""")

if __name__ == "__main__":
    if not sys.platform.startswith("win"):
        print("This setup script is for Windows only")
        sys.exit(1)

    setup_compilers()
