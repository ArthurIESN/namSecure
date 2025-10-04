# namSecure

# Shared

Shared is a folder containing resources and utilities that are shared across backend, client web and client mobile projects.

## Types
Shared/types contains TypeScript type definitions that are used throughout the app. this package must be linked and compiled to be used in other projects.

## Link
Run the following command in the ``` /Shared ``` directory to initialize the link for npm packages.
```
npm link
```

To use this shared package in other projects, run the following command in the target project directory to link the shared package.
```
npm link @namSecure/shared
```

This will automatically update the package when changes are made in the Shared directory.

# TypeScript Compilation

To compile the TypeScript files in the project directory, run the following command:

(as react & react-native projects already have their own build processes, this is only necessary for backend and shared projects)
```
npx tsc
```

if you want to watch for changes and recompile automatically, use (only if the package.json has a watch script):
```
run npm watch
```