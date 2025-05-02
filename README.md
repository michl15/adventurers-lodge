Codebase for https://adventurers-lodge.web.app/#/ (WIP)

# Welcome to Adventurer's Lodge

## Environment
- yarn v1.22.22
- npm v10.9.2

## Running Locally
1. Fork and clone the repository
2. Run `yarn` to install dependencies
3. Run `yarn start` to run the local development server
4. Navigate to `localhost:3000` to view the locally running app.

## Scripts

### `yarn`
Install dependencies based on `yarn.lock` file

### `yarn start`
Start a local development server at `localhost:3000`

### `yarn test`
Run Jest unit tests.
Common options:
- `yarn test a` Run all unit tests, regardless of file changes. This must succeed prior to every `git push`.
- `yarn test --coverage` Generate a coverage report.

### `yarn pretty`
Runs [Prettier](https://prettier.io/) to format code and overwrite files. This is run prior to every commit.

### `yarn build`
Create a production build. This must succeed prior to every `git push`.

### `yarn lint`
Runs [ESLint](https://eslint.org/). This must succeed prior to every `git push`.

## Made possible by
- [DnD 5e API](https://www.dnd5eapi.co/)
- [React Bootstrap](https://react-bootstrap.netlify.app/)

## Contribution
1. Fork and clone the repository
2. Use `git branch -b <feature-name>` to create a new branch, give it a descriptive name to indicate what kind of changes are being made.
3. Make your changes on that local branch. Make sure to test locally and verify your changes.
4. Push up your changes and open up a PR.
5. Request a code review. When it is approved and merged, it will automatically be deployed to the production environment.

## Tools used to build this web app
- ReactJS
- Typescript
- HTML/CSS
- Create React App
