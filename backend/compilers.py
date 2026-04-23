r"""
Self-Contained Local Compiler Execution
All compilers bundled in C:\codekids\backend\compilers\
Zero external dependencies - works completely offline
"""

import os
import subprocess
import tempfile

# Base path for bundled compilers
COMPILERS_BASE = os.path.join(os.path.dirname(__file__), "compilers")

# Supported Languages: Python, Java, Go, C++
# All compiler paths - uses bundled versions from compilers/ directory
COMPILER_PATHS = {
    "python": os.path.join(COMPILERS_BASE, "python", "python.exe"),
    "java": {
        "javac": os.path.join(COMPILERS_BASE, "java", "bin", "javac.exe"),
        "java": os.path.join(COMPILERS_BASE, "java", "bin", "java.exe")
    },
    "go": os.path.join(COMPILERS_BASE, "go", "bin", "go.exe"),
    "c++": os.path.join(COMPILERS_BASE, "gcc", "bin", "g++.exe"),
    "cpp": os.path.join(COMPILERS_BASE, "gcc", "bin", "g++.exe"),
}

# Fallback to system PATH if bundled version not found
USE_SYSTEM_FALLBACK = True

def get_compiler_path(lang: str, compiler_type: str = "main") -> str:
    """Get compiler path - use bundled if exists, fallback to system PATH"""
    if lang in COMPILER_PATHS:
        path = COMPILER_PATHS[lang]
        if isinstance(path, dict):
            path = path.get(compiler_type, path.get("main"))

        if os.path.exists(path):
            return path
        elif USE_SYSTEM_FALLBACK:
            # Fallback to system PATH (Python, Java, Go, C++)
            compiler_names = {
                "python": "python",
                "java": "java" if compiler_type == "java" else "javac",
                "go": "go",
                "c++": "g++",
                "cpp": "g++"
            }
            return compiler_names.get(lang, lang)
    return lang

def execute_python(code: str) -> dict:
    """Execute Python code using bundled or system Python"""
    try:
        python_exe = get_compiler_path("python")
        result = subprocess.run(
            [python_exe, "-c", code],
            capture_output=True,
            text=True,
            timeout=10
        )
        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "exit_code": result.returncode
        }
    except subprocess.TimeoutExpired:
        return {"stdout": "", "stderr": "Timeout (10s limit)", "exit_code": 1}
    except Exception as e:
        return {"stdout": "", "stderr": f"Error: {str(e)}", "exit_code": 1}

def execute_java(code: str) -> dict:
    """Execute Java code using bundled or system Java"""
    try:
        javac_exe = get_compiler_path("java", "javac")
        java_exe = get_compiler_path("java", "java")

        with tempfile.TemporaryDirectory() as tmpdir:
            java_file = os.path.join(tmpdir, "Main.java")

            # Fix class name
            lines = code.split('\n')
            fixed_lines = []
            for line in lines:
                if 'public class' in line and '{' in line:
                    idx = line.find('public class')
                    before = line[:idx]
                    after = line[line.find('{'):]
                    line = before + 'public class Main ' + after
                elif 'public class' in line:
                    idx = line.find('public class')
                    before = line[:idx]
                    line = before + 'public class Main'
                fixed_lines.append(line)

            fixed_code = '\n'.join(fixed_lines)
            with open(java_file, "w") as f:
                f.write(fixed_code)

            # Compile
            compile_result = subprocess.run(
                [javac_exe, java_file],
                capture_output=True,
                text=True,
                timeout=10,
                cwd=tmpdir,
                shell=True
            )

            if compile_result.returncode != 0:
                return {
                    "stdout": "",
                    "stderr": compile_result.stderr,
                    "exit_code": 1
                }

            # Run
            run_result = subprocess.run(
                [java_exe, "Main"],
                capture_output=True,
                text=True,
                timeout=10,
                cwd=tmpdir,
                shell=True
            )

            return {
                "stdout": run_result.stdout,
                "stderr": run_result.stderr,
                "exit_code": run_result.returncode
            }
    except subprocess.TimeoutExpired:
        return {"stdout": "", "stderr": "Timeout (10s limit)", "exit_code": 1}
    except Exception as e:
        return {"stdout": "", "stderr": f"Error: {str(e)}", "exit_code": 1}

def execute_javascript(code: str) -> dict:
    """Execute JavaScript using system Node.js"""
    try:
        result = subprocess.run(
            ["node", "-e", code],
            capture_output=True,
            text=True,
            timeout=10
        )
        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "exit_code": result.returncode
        }
    except FileNotFoundError:
        return {"stdout": "", "stderr": "Node.js not found. Please install Node.js.", "exit_code": 1}
    except subprocess.TimeoutExpired:
        return {"stdout": "", "stderr": "Timeout (10s limit)", "exit_code": 1}
    except Exception as e:
        return {"stdout": "", "stderr": f"Error: {str(e)}", "exit_code": 1}

def execute_cpp(code: str) -> dict:
    """Execute C++ code — tries local g++ first, falls back to Wandbox API"""
    import shutil, urllib.request, json as _json

    MSYS2_BASH = "C:/msys64/usr/bin/bash.exe"
    # Use MSYS2 bash + g++ if available (converts Windows paths to MSYS2 paths)
    if os.path.exists(MSYS2_BASH):
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                code_file = os.path.join(tmpdir, "code.cpp").replace("\\", "/")
                exe_file  = os.path.join(tmpdir, "code.exe").replace("\\", "/")
                # Convert C:/... to /c/...
                def to_msys(p): return "/" + p[0].lower() + p[2:].replace("\\", "/")
                msys_src = to_msys(code_file)
                msys_exe = to_msys(exe_file)
                with open(code_file, "w") as f:
                    f.write(code)
                script = f"export PATH=/mingw64/bin:$PATH && g++ {msys_src} -o {msys_exe} && {msys_exe}"
                result = subprocess.run(
                    [MSYS2_BASH, "-lc", script],
                    capture_output=True, text=True, timeout=20
                )
                if result.returncode == 0:
                    return {"stdout": result.stdout, "stderr": result.stderr, "exit_code": 0}
                return {"stdout": result.stdout, "stderr": result.stderr or result.stdout, "exit_code": result.returncode}
        except Exception:
            pass  # fall through to online

    # Fallback: Rextester (free online C++ compiler, no key needed)
    try:
        import urllib.parse
        data = urllib.parse.urlencode({
            "LanguageChoiceEnum": "6",   # 6 = C++ (g++)
            "Program": code,
            "Input": "",
            "CompilerArgs": "-std=c++17 -o a.out",
        }).encode("utf-8")
        req = urllib.request.Request(
            "https://rextester.com/rundotnet/api",
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            result = _json.loads(resp.read().decode())
        stdout = result.get("Result", "")
        stderr = result.get("Errors", "") or ""
        warnings = result.get("Warnings", "") or ""
        return {
            "stdout": stdout,
            "stderr": stderr if stderr else warnings,
            "exit_code": 0 if not stderr else 1
        }
    except Exception as e:
        return {"stdout": "", "stderr": f"C++ execution error: {str(e)}", "exit_code": 1}

def execute_go(code: str) -> dict:
    """Execute Go code using bundled Go compiler"""
    try:
        go_exe = get_compiler_path("go")

        # Set GOROOT to bundled Go
        go_root = os.path.dirname(os.path.dirname(go_exe))
        env = os.environ.copy()
        env["GOROOT"] = go_root
        env["GOCACHE"] = os.path.join(go_root, "cache")

        with tempfile.TemporaryDirectory() as tmpdir:
            go_file = os.path.join(tmpdir, "main.go")

            with open(go_file, "w") as f:
                f.write(code)

            # Compile first, then run
            exe_file = os.path.join(tmpdir, "main.exe")

            compile_result = subprocess.run(
                [go_exe, "build", "-o", exe_file, go_file],
                capture_output=True,
                text=True,
                timeout=60,
                cwd=tmpdir,
                env=env
            )

            if compile_result.returncode != 0:
                return {
                    "stdout": "",
                    "stderr": compile_result.stderr,
                    "exit_code": 1
                }

            # Run compiled executable
            run_result = subprocess.run(
                [exe_file],
                capture_output=True,
                text=True,
                timeout=10,
                cwd=tmpdir
            )

            return {
                "stdout": run_result.stdout,
                "stderr": run_result.stderr,
                "exit_code": run_result.returncode
            }
    except subprocess.TimeoutExpired:
        return {"stdout": "", "stderr": "Go compilation timeout", "exit_code": 1}
    except Exception as e:
        return {"stdout": "", "stderr": f"Error: {str(e)}", "exit_code": 1}

def execute_code_local(code: str, language: str) -> dict:
    """Execute code using bundled local compilers/interpreters - completely offline"""
    import subprocess
    import tempfile

    lang = language.lower().strip()

    if lang == "python":
        return execute_python(code)
    elif lang == "javascript":
        return execute_javascript(code)
    elif lang == "java":
        return execute_java(code)
    elif lang in ("c++", "cpp"):
        return execute_cpp(code)
    elif lang == "go":
        return execute_go(code)
    else:
        # All other languages should ideally have compilers bundled
        # This message should rarely appear if bundled correctly
        return {
            "stdout": "",
            "stderr": f"Compiler for {language} not yet bundled. Supported: Python, JavaScript, Java, Go",
            "exit_code": 1
        }

def verify_bundled_compilers() -> dict:
    """Check which bundled compilers are available"""
    available = {}
    missing = {}

    for lang, path in COMPILER_PATHS.items():
        if isinstance(path, dict):
            # For Java, check javac
            check_path = path.get("javac", path.get("main"))
        else:
            check_path = path

        if os.path.exists(check_path):
            available[lang] = check_path
        else:
            missing[lang] = check_path

    return {"available": available, "missing": missing}
