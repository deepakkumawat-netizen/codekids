"""
Code Execution - supports Python, Java, JavaScript, C++, Go
Uses system compilers with graceful fallback messages
"""

import os
import shutil
import subprocess
import tempfile


def _run(cmd, timeout=10, cwd=None, env=None):
    try:
        result = subprocess.run(
            cmd, capture_output=True, text=True,
            timeout=timeout, cwd=cwd, env=env
        )
        return {"stdout": result.stdout, "stderr": result.stderr, "exit_code": result.returncode}
    except subprocess.TimeoutExpired:
        return {"stdout": "", "stderr": "Execution timed out (10s limit).", "exit_code": 1}
    except FileNotFoundError as e:
        return {"stdout": "", "stderr": f"Compiler not found: {e}", "exit_code": 1}
    except Exception as e:
        return {"stdout": "", "stderr": str(e), "exit_code": 1}


def execute_python(code: str) -> dict:
    python = shutil.which("python3") or shutil.which("python")
    if not python:
        return {"stdout": "", "stderr": "Python not found.", "exit_code": 1}
    return _run([python, "-c", code])


def execute_javascript(code: str) -> dict:
    node = shutil.which("node") or shutil.which("nodejs")
    if not node:
        return {"stdout": "", "stderr": "JavaScript (Node.js) is not available in the cloud version. Try Python instead!", "exit_code": 1}
    return _run([node, "-e", code])


def execute_java(code: str) -> dict:
    javac = shutil.which("javac")
    java = shutil.which("java")
    if not javac or not java:
        return {"stdout": "", "stderr": "Java compiler not found on this server. Try Python instead!", "exit_code": 1}

    with tempfile.TemporaryDirectory() as tmpdir:
        # Rename class to Main
        lines = []
        for line in code.split("\n"):
            if "public class" in line and "{" in line:
                before = line[:line.find("public class")]
                after = line[line.find("{"):]
                line = before + "public class Main " + after
            lines.append(line)
        fixed = "\n".join(lines)

        java_file = os.path.join(tmpdir, "Main.java")
        with open(java_file, "w") as f:
            f.write(fixed)

        compile_res = _run([javac, java_file], cwd=tmpdir, timeout=15)
        if compile_res["exit_code"] != 0:
            return compile_res

        result = _run([java, "-cp", tmpdir, "Main"], cwd=tmpdir, timeout=10)

        # Detect interactive input (Scanner) — not supported in cloud execution
        if "NoSuchElementException" in result["stderr"] or "NoSuchElementException" in result["stdout"]:
            result["stderr"] = (
                "This program uses Scanner for user input, which is not supported "
                "in the cloud runner.\n"
                "Tip: Remove Scanner and hardcode values to test your logic.\n\n"
                "Example: instead of 'int num = scanner.nextInt();'\n"
                "use: 'int num = 10;'"
            )
            result["exit_code"] = 1

        return result


def execute_cpp(code: str) -> dict:
    gpp = shutil.which("g++")
    if not gpp:
        # Try Rextester online fallback
        try:
            import urllib.request, urllib.parse, json as _json
            data = urllib.parse.urlencode({
                "LanguageChoiceEnum": "6",
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
            return {"stdout": stdout, "stderr": stderr, "exit_code": 0 if not stderr else 1}
        except Exception as e:
            return {"stdout": "", "stderr": f"C++ not available: {str(e)}", "exit_code": 1}

    with tempfile.TemporaryDirectory() as tmpdir:
        src = os.path.join(tmpdir, "code.cpp")
        exe = os.path.join(tmpdir, "code")
        with open(src, "w") as f:
            f.write(code)
        compile_res = _run([gpp, src, "-o", exe, "-std=c++17"], timeout=15)
        if compile_res["exit_code"] != 0:
            return compile_res
        return _run([exe], timeout=10)


def execute_go(code: str) -> dict:
    go = shutil.which("go")
    if not go:
        return {"stdout": "", "stderr": "Go compiler not found on this server. Try Python instead!", "exit_code": 1}

    with tempfile.TemporaryDirectory() as tmpdir:
        go_file = os.path.join(tmpdir, "main.go")
        with open(go_file, "w") as f:
            f.write(code)
        env = os.environ.copy()
        env["GOCACHE"] = os.path.join(tmpdir, "cache")
        return _run([go, "run", go_file], cwd=tmpdir, env=env, timeout=30)


def execute_code_local(code: str, language: str) -> dict:
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
        return {
            "stdout": "",
            "stderr": f"Language '{language}' is not supported for execution.",
            "exit_code": 1
        }


def verify_bundled_compilers() -> dict:
    compilers = ["python3", "python", "javac", "java", "node", "g++", "go"]
    return {c: shutil.which(c) or "not found" for c in compilers}
