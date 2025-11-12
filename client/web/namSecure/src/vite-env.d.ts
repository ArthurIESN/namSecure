store/// <reference types="vite/client" />

// Declare module for CSS imports
// avoid typescript errors when importing css files
declare module '*.css'
{
    const content: { [className: string]: string  };
    export default content;
}
