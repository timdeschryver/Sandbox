---
description: 'Conventional commit message structure instructions'
---

# Conventional Commit Instructions

When creating commit messages, please follow the Conventional Commits specification to ensure clarity and consistency. The commit message should be structured as follows:

```cmd
<type>[optional scope]: <description> <emoji>
```

## Commit Message Structure

Limit the first line to 72 characters or less.

- **Type**: Describes the nature of the commit. Common types include:
    - `feat`: A new feature
    - `fix`: A bug fix
    - `docs`: Documentation changes
    - `style`: Code style changes (formatting, missing semi-colons, etc.)
    - `refactor`: Code changes that neither fix a bug nor add a feature
    - `test`: Adding or updating tests
    - `chore`: Changes to the build process or auxiliary tools and libraries
- **Scope** (optional): A noun describing the section of the codebase affected (e.g., `auth`, `api`, `ui`).
- **Description**: A brief summary of the changes made in the commit.
- **Emoji**: An emoji that represents the commit.

## Examples

- `feat(auth): add OAuth2 support 🚀`
- `fix(api): resolve null pointer exception 🐛`
- `docs(readme): update installation instructions 📚`
- `feat(ui): implement dark mode 🌙`
