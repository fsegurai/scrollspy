# 🙌 Contributing to ScrollSpy

Thanks for your interest in improving the **ScrollSpy** project! Whether it's fixing bugs, improving documentation, or
suggesting new features—your help is welcome 🙏

---

## 🚀 Getting Started

> **Requirements**  
> Ensure you're using **Node.js v20.x** and **Bun v1.1.x** or higher.

### 1. Clone the Repository

```bash
git clone https://github.com/fsegurai/scrollspy.git
cd scrollspy
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Start Development Server (if applicable)

```bash
bun start
```

---

## 🧪 Running Tests

To run the full test suite:

```bash
bun test
```

### 🐞 Debug Mode

If you encounter issues, run tests in verbose mode for detailed output:

```bash
bun test
```

---

## 🧼 Linting

> Linting is enforced as part of the CI pipeline. Please ensure your code is clean before pushing:

```bash
bun lint
```

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
git commit -m "feat: add offset option to scrollspy config"
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

3. If you've added functionality:
    - Include **unit tests**.
    - Update the **README.md** or relevant documentation.

4. Reference any related issues in your PR comment:
   > Example: _"Closes #12"_

5. Ensure your PR title follows the **conventional commit** format.

---

## 🐛 Reporting Bugs

When submitting a bug report, please include:

- A **clear description** of the issue.
- The **expected vs actual behavior**.
- A **minimal reproducible example** (CodeSandbox or StackBlitz is ideal).
- Details about:
    - Browser(s) and OS
    - Node and Bun versions

---

## 💬 Need Help?

Open a [discussion](https://github.com/fsegurai/scrollspy/discussions)
or [create an issue](https://github.com/fsegurai/scrollspy/issues) and we'll do our best to assist!

---

Thanks for contributing to ScrollSpy! ✨
