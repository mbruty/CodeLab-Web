# CodeLab - Website
## Navigation
Website

[API](https://github.com/mbruty/mike-CodeLab-Graphql)

[CodeEngine](https://github.com/mbruty/mike-CodeLab-CodeEngine)

[Docker Scheduler](https://github.com/mbruty/mike-CodeLab-Scheduler)

## Project Vision
Many software developers rely on online coding platforms, such as LeetCode, to enhance their knowledge. These platforms have been successful with students who want to expand their learning beyond what is taught. These platforms could also be helpful in educational institutions to teach software development. However, the current platform’s lack the ability for teachers to create tasks and courses, and they do not provide enough insight into the effects of optimisations on the users' code.

The CodeLab platform aims to bring online coding platforms to the education sector. CodeLab offers the same features as the majority of online coding platforms. CodeLab also offers a way for teachers to create tasks, and group the into modules. For students, CodeLab offers more detailed utilisation statistics than other platform. CodeLab also does not limit usage to only algorithm-style questions and facilitates a wider bredth of teaching.
## Development Setup
Ensure that you have Node.js version 18 or newer.
 1. Clone the repository
 2. Run `npm install`
 3. Run `npm run start`
### Building
Run `npm run build`

## Setup
Ensure that you have yout GitHub personal-access-token linked to docker.

### Docker
 1. Run `docker pull ghcr.io/mbruty/mike-codelab-web/code-labs-web:latest`.
 2. Run `docker run --rm ghcr.io/mbruty/mike-codelab-web/code-labs-web:latest`

### Docker Compose
Run `docker pull ghcr.io/mbruty/mike-codelab-web/code-labs-web:latest`.
```yaml
web:
    image: ghcr.io/mbruty/mike-codelab-web/code-labs-web:latest
    restart: always
    ports:
        - 3000:3000
```

## Technologies uesd
|Name|Version|
|--|--|
|Node.js|18.2.0|
| @apollo/client | ^3.7.0 |
|@chakra-ui/react|^2.4.9|
|@fortawesome/react-fontawesome|^0.2.0|
|@graphql-codegen/cli|^2.13.7|
|@monaco-editor/react|^4.4.6|
|@uiw/react-markdown-editor|^5.11.1|
|chart.js|^3.9.1|
|cypress|^10.11.0|
|eslint|^8.2.0|
|eslint-config-airbnb-typescript|^17.0.0|
|eslint-plugin-cypress|^2.12.1|
|eslint-plugin-react|^7.28.0|
|graphql|^16.6.0|
|guid-typescript|^1.0.9|
|react|^18.2.0|
|typescript|^4.8.4|
|yup|0.32.11"|

