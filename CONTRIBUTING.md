# Contributing to NeoConnect

Thanks for your interest in contributing! Here's how to get started.

## 🛠️ Getting Started

1. **Fork** this repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/neo_connect.git
   cd neo_connect
   ```
3. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feat/your-feature-name
   ```
4. **Set up the project** — follow the [Quick Start](README.md#-quick-start) guide in the README

## 📝 Branch Naming

| Prefix    | Use for                    |
| --------- | -------------------------- |
| `feat/`   | New features               |
| `fix/`    | Bug fixes                  |
| `docs/`   | Documentation changes      |
| `refactor/` | Code refactoring         |
| `chore/`  | Build, tooling, or config  |

## ✅ Before Submitting a PR

- Make sure your code runs without errors
- Test both frontend (`npm run dev` in `frontend/`) and backend (`npm run dev` in `backend/`)
- Keep commits focused — one logical change per commit
- Write clear commit messages (e.g., `fix: resolve poll voting race condition`)
- **Never commit `.env` or `.env.local` files** — use the `.env.example` files as reference

## 🔀 Pull Request Process

1. Push your branch to your fork
2. Open a Pull Request against the `main` branch of this repo
3. Describe **what** you changed and **why**
4. Link any related issues (e.g., `Closes #12`)
5. Wait for review — a maintainer will review and provide feedback

## 💡 Ideas for Contributions

- Bug reports and fixes
- UI/UX improvements
- New features (please open an issue to discuss first)
- Documentation improvements
- Performance optimizations
- Test coverage

## 📜 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
