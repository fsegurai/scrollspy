# 🙌 Contributing to Scrollspy

Thanks for your interest in improving the **Scrollspy** project! Whether it's fixing bugs, improving documentation, or suggesting new features—your help is welcome 🙏

---

## 🚀 Getting Started

> **Requirements**
> Ensure you're using **Node.js v24.x** and **Bun v1.4.x** or higher.

### 1. Clone the Repository

```bash
git clone https://github.com/fsegurai/scrollspy.git
cd scrollspy
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Build the Library

```bash
bun run build:packages
```

### 4. Start Development Server

```bash
bun run start
```

This will start the demo in watch mode for development.

---

## 🧪 Running Tests

To run the full test suite:

```bash
bun test
```

### 🐞 Debug Mode

If you encounter issues, run tests in verbose mode for detailed output:

```bash
bun test --verbose
```

---

## 🧼 Linting

> Linting is enforced as part of the CI pipeline. Please ensure your code is clean before pushing:

```bash
bun run lint
bun run format:audit   # Read-only check (Biome, covers lint + format)
```

You can also lint specific parts:
- Demo: `bun run lint:demo`
- Packages: `bun run lint:packages`

Run `bun run lint:fix` to auto-fix formatting issues before committing (it is the same command as `format`).

**Git hooks (Husky)** are installed automatically via the `prepare` script on `bun install`:
- `pre-commit` runs `bun run lint:fix` and re-stages your files, so fixes land inside the commit.
- `pre-push` runs `bun run format:audit` as a read-only gate that blocks the push if anything is dirty.
- Bypass with `git commit -n` / `git push -n` (or `HUSKY=0` for everything).

---

## ✍️ Commit Message Convention

This project follows **[Conventional Commits](https://www.conventionalcommits.org/)**.

| Type        | Description                           |
|-------------|---------------------------------------|
| `feat:`     | New feature                           |
| `fix:`      | Bug fix                               |
| `docs:`     | Documentation only changes            |
| `refactor:` | Code refactoring (no behavior change) |
| `test:`     | Adding or fixing tests                |
| `chore:`    | Maintenance tasks, build config       |
| `del:`      | File or code removal                  |

Example:

```bash
git commit -m "feat: add new markdown extension for spoilers"
```

---

## 🔀 Submitting a Pull Request

Please follow these steps to ensure a smooth review:

1. **Merge** the latest changes from `main` into your branch:
   ```bash
   git checkout main
   git pull origin main
   git checkout your-feature-branch
   git merge main
   ```

2. Make sure all tests pass:
   ```bash
   bun test
   ```

3. Build and verify your changes:
   ```bash
   bun run build:packages
   bun run build:demo
   ```

4. If you've added functionality:
	- Include **unit tests**.
	- Update the **README.md** or relevant documentation.
	- Add extension previews if applicable.

5. Reference any related issues in your PR comment:
   > Example: _"Closes #12"_

6. Ensure your PR title follows the **conventional commit** format.

---

## 🐛 Reporting Bugs

When submitting a bug report, please include:

- A **clear description** of the issue.
- The **expected vs actual behavior**.
- A **minimal reproducible example** (CodeSandbox or StackBlitz is ideal).
- Details about:
	- Browser(s) and OS
	- Node and Bun versions
	- Marked Extension version
	- Which extension is affected

---

## 💬 Need Help?

Open a [discussion](https://github.com/fsegurai/scrollspy/discussions)
or [create an issue](https://github.com/fsegurai/scrollspy/issues) and we'll do our best to assist!

---

Thanks for contributing to scrollspy! ✨
