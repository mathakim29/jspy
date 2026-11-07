<div align="center">
    <h1>jspy</h1>
    <i>Manage your python dependencies through package.json </i>
</div>



<br>

A lightweight Bun wrapper for `uv` that manages your local Python virtual environment (`.venv`) and syncs dependencies directly with `package.json`.

---

## Setup

Add `python_version` and `python_deps` to your `package.json`:

```json
{
  "python_version": "3.11",
  "python_deps": [
    "fastapi",
    "uvicorn"
  ]
}

```

---

## Usage

Run without arguments to auto-create `.venv` and install everything listed in `python_deps`:

```bash
./jspy

```

Install packages into `.venv` and automatically append them to `package.json`:

```bash
./jspy install fastapi uvicorn
# or short form:
./jspy i torch
```


Pass any standard `uv` subcommand directly to target the `.venv`:

```bash
# Run a Python script inside .venv
./jspy run main.py

# Inspect installed packages
./jspy pip list

# Freeze current environment
./jspy pip freeze

```

```

```