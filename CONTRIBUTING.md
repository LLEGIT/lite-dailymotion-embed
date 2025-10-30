# Contributing to Lite Dailymotion Embed

Thank you for your interest in contributing to Lite Dailymotion Embed! We appreciate your help in making this project better.

## Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm 10 or higher

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/lite-dailymotion-embed.git
   cd lite-dailymotion-embed
   ```

3. Install pnpm if you haven't already:
   ```bash
   npm install -g pnpm@latest
   ```

4. Install dependencies:
   ```bash
   pnpm install
   ```

5. Create a new branch:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## Development Workflow

### Running Tests

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run e2e tests
pnpm test:e2e
```

### Running the Dev Server

```bash
pnpm dev
```

### Type Checking

```bash
pnpm typecheck
```

### Linting and Formatting

```bash
# Check for linting issues
pnpm lint

# Fix linting issues automatically
pnpm lint:fix

# Format code
pnpm format
```

### Building

```bash
# Build all formats (ESM, UMD, types, CSS)
pnpm build

# Build individual formats
pnpm build:types
pnpm build:esm
pnpm build:umd
pnpm build:css
```

## Code Standards

- Write clean, readable, and maintainable code
- Follow the existing code style (enforced by ESLint and Prettier)
- Write meaningful commit messages (see [Commit Message Guidelines](#commit-message-guidelines))
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting a PR

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates, etc.
- `ci`: CI/CD configuration changes

### Examples

```
feat(player): add support for custom thumbnails
fix(embed): resolve issue with autoplay on mobile devices
docs(readme): update installation instructions
test(utils): add tests for extractVideoId function
chore(deps): update dependencies to latest versions
```

## Pull Request Process

1. Ensure your code passes all checks:
   ```bash
   pnpm typecheck
   pnpm lint
   pnpm test
   pnpm build
   ```

2. Update the README.md or documentation if needed

3. Create a pull request with a clear title and description

4. Link any related issues in the PR description

5. Wait for review and address any feedback

6. Once approved, your PR will be merged!

## Testing Guidelines

- Write unit tests for utility functions and components
- Write E2E tests for user interactions and workflows
- Aim for good test coverage (but don't obsess over 100%)
- Test edge cases and error scenarios
- Use descriptive test names that explain what is being tested

## Documentation

- Update the README.md if you add new features or change existing behavior
- Add JSDoc comments for public APIs
- Include code examples for new features
- Update type definitions if needed

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help create a welcoming environment for all contributors

## Questions?

If you have questions or need help, feel free to:

- Open an issue with the "question" label
- Reach out to the maintainers
- Check existing issues and pull requests

## License

By contributing to Lite Dailymotion Embed, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
