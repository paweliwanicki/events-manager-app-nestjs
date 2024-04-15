### Project description

The event manager allows the user to register an account, invite friends and manage events (CRUD principle).

Frontend is made in ReactJS with Typescript.

#### Used libraries in frontend project:

#### 1. ReactJS

https://react.dev/

React is a framework that employs a bundler to automatically compile React, JSX, and ES6 code while handling CSS file prefixes. React is a JavaScript-based UI development library in SPA (single page app) principle. Although React is a library rather than a language, it is widely used in web development. The library first appeared in May 2013 and is now one of the most commonly used frontend libraries for web development.

React events various extensions for entire application architectural support, such as Flux and React Native, beyond mere UI.

##### Why React?

React’s popularity today has eclipsed that of all other front-end development frameworks. Here is why:

- Easy creation of dynamic applications: React makes it easier to create dynamic web applications because it requires less coding and events more functionality, as opposed to JavaScript, where coding often gets complex very quickly.
  Improved performance: React uses Virtual DOM, thereby creating web applications faster. Virtual DOM compares the components’ previous states and updates only the items in the Real DOM that were changed, instead of updating all of the components again, as conventional web applications do.

- Reusable components: Components are the building blocks of any React application, and a single app usually consists of multiple components. These components have their logic and controls, and they can be reused throughout the application, which in turn dramatically reduces the application’s development time.

- Unidirectional data flow: React follows a unidirectional data flow. This means that when designing a React app, developers often nest child components within parent components. Since the data flows in a single direction, it becomes easier to debug errors and know where a problem occurs in an application at the moment in question.

- Small learning curve: React is easy to learn, as it mostly combines basic HTML and JavaScript concepts with some beneficial additions. Still, as is the case with other tools and frameworks, you have to spend some time to get a proper understanding of React’s library.
  It can be used for the development of both web and mobile apps: We already know that React is used for the development of web applications, but that’s not all it can do. There is a framework called React Native, derived from React itself, that is hugely popular and is used for creating beautiful mobile applications. So, in reality, React can be used for making both web and mobile applications.

- Dedicated tools for easy debugging: Facebook has released a Chrome extension that can be used to debug React applications. This makes the process of debugging React web applications faster and easier.

##### React advantages:

- React.js builds a customized virtual DOM. Because the JavaScript virtual DOM is quicker than the conventional DOM, this will enhance the performance of apps.
- ReactJS makes an amazing UI possible.
- Search - engine friendly ReactJS.
- Modules and valid data make larger apps easier to manage by increasing readability.
- React integrates various architectures.
- React makes the entire scripting environment process simpler.
- It makes advanced maintenance easier and boosts output.
- Guarantees quicker rendering
- The availability of a script for developing mobile apps is the best feature of React.
- ReactJS is supported by a large community.

#### 2. Typescript

https://www.typescriptlang.org/

TypeScript is a syntactic superset of JavaScript which adds static typing.

This basically means that TypeScript adds syntax on top of JavaScript, allowing developers to add types.

JavaScript is a loosely typed language. It can be difficult to understand what types of data are being passed around in JavaScript.

In JavaScript, function parameters and variables don't have any information! So developers need to look at documentation, or guess based on the implementation.

TypeScript allows specifying the types of data being passed around within the code, and has the ability to report errors when the types don't match .e.g TypeScript will report an error when passing a string into a function that expects a number JavaScript will not.

TypeScript uses compile time type checking. Which means it checks if the specified types match before running the code, not while running the code.

#### 3. React Leaflet

https://react-leaflet.js.org/

React Leaflet provides bindings between React and Leaflet. It does not replace Leaflet, but leverages it to abstract Leaflet layers as React components.

**Leaflet** is the leading open-source JavaScript library for mobile-friendly interactive maps. Weighing just about 42 KB of JS, it has all the mapping features most developers ever need.

Leaflet is designed with simplicity, performance and usability in mind. It works efficiently across all major desktop and mobile platforms, can be extended with lots of plugins, has a beautiful, easy to use and well-documented API and a simple, readable source code that is a joy to contribute to. It use **OpenStreetMap** as a map provider under the hood.

###### DOM rendering

React does not render Leaflet layers to the DOM, this rendering is done by Leaflet itself. React only renders a <div> element when rendering the MapContainer component and the contents of UI layers components.

###### Component properties

The properties passed to the components are used to create the relevant Leaflet instance when the component is rendered the first time and should be treated as immutable by default.

During the first render, all these properties should be supported as they are by Leaflet, however they will not be updated in the UI when they change unless they are explicitly documented as being mutable.

Mutable properties changes are compared by reference (unless stated otherwise) and are applied calling the relevant method on the Leaflet element instance.

###### Leaflet elements references

Unless stated otherwise, all components exported by React Leaflet support refs exposing the created Leaflet element instance or DOM element (for panes).

This allows applications to access Leaflet's imperative APIs when required, but may create inconsistencies with props being set and should be used carefully.

###### React context

React Leaflet uses React's context API to make some Leaflet elements instances available to children elements that need it.

Each Leaflet map instance has its own React context, created by the MapContainer component. Other components and hooks provided by React Leaflet can only be used as descendants of a MapContainer.

###### Lifecycle process

1. The MapContainer renders a container div element for the map. If the placeholder prop is set, it will be rendered inside the container div.
2. The MapContainer instantiates a Leaflet Map for the created <div> with the component properties and creates the React context containing the map instance.
3. he MapContainer renders its children components.
4. Each child component instantiates the matching Leaflet instance for the element using the component properties and context, and adds it to the map.
5. When a child component is rendered again, changes to its supported mutable props are applied to the map.
6. When a component is removed from the render tree, it removes its layer from the map as needed.

###### Limitations

- Leaflet makes direct calls to the DOM when it is loaded, therefore React Leaflet is not compatible with server-side rendering.
- The components exposed are abstractions for Leaflet layers, not DOM elements. Some of them have properties that can be updated directly by calling the setters exposed by Leaflet while others should be completely replaced, by setting an unique value on their key property so they are properly handled by React's algorithm.

#### 4. history

https://www.npmjs.com/package/history

The history library lets you easily manage session history anywhere JavaScript runs. A history object abstracts away the differences in various environments and provides a minimal API that lets you manage the history stack, navigate, and persist state between sessions.

It's used by react-router package to navigate and manage history of your navigation in application.

#### 5. jwt-decode

https://www.npmjs.com/package/jwt-decode

This library is used to just decode jwt token getting from the backend after user is logged in. It provides an automated process for decoding the information contained in the token e.g. username, firstName etc.

#### 6. motion-hooks

https://github.com/tanvesh01/motion-hooks

A React Hooks wrapper over **Motion One**, An animation library, built on the Web Animations API for the smallest filesize and the fastest performance.

###### Motion One

https://motion.dev/

An animation library, built on the Web Animations API for the smallest filesize and the fastest performance.

Motion One is the smallest fully-featured animation library for the web.

It can animate HTML or SVG elements using the Web Animations API, which means some animations can run off the main thread. These animations will remain smooth, even while your website is busy rendering or processing.

Additionally, it can animate anything by passing it a custom function, like innerText or Three.js.

#### 7. react-datepicker

https://www.npmjs.com/package/react-datepicker

A simple and reusable Datepicker component for React. It provides a reusable input component and allows user to use and pick the date and time.

#### 8. react-modal

https://www.npmjs.com/package/react-modal / https://reactcommunity.org/react-modal/

Accessible modal dialog component for React.JS. It provides a a reusable modal component with any custom content.

#### 9. react-router

https://reactrouter.com/en/main/start/concepts

React Router enables "client side routing".

In traditional websites, the browser requests a document from a web server, downloads and evaluates CSS and JavaScript assets, and renders the HTML sent from the server. When the user clicks a link, it starts the process all over again for a new page.

Client side routing allows your app to update the URL from a link click without making another request for another document from the server. Instead, your app can immediately render some new UI and make data requests with fetch to update the page with new information.

This enables faster user experiences because the browser doesn't need to request an entirely new document or re-evaluate CSS and JavaScript assets for the next page. It also enables more dynamic user experiences with things like animation.

React Router isn't just about matching a url to a function or component: it's about building a full user interface that maps to the URL, so it might have more concepts in it than you're used to. We'll go into detail on the three main jobs of React Router:

- Subscribing and manipulating the history stack
- Matching the URL to your routes
- Rendering a nested UI from the route matches

#### 10. react-select

https://react-select.com/

A flexible and beautiful Select Input control for ReactJS with multiselect, autocomplete, async and creatable support.

#### 11. eslint

https://eslint.org/

ESLint statically analyzes your code to quickly find problems. It is built into most text editors and you can run ESLint as part of your continuous integration pipeline.

#### 12. Sass

https://sass-lang.com/

###### Why use sass?

Stylesheets are getting larger, more complex, and harder to maintain. This is where a CSS pre-processor can help.

Sass lets you use features that do not exist in CSS, like variables, nested rules, mixins, imports, inheritance, built-in functions, and other stuff:

- stands for Syntactically Awesome Stylesheet
- is an extension to CSS
- is a CSS pre-processor
- is completely compatible with all versions of CSS
- reduces repetition of CSS and therefore saves time
- was designed by Hampton Catlin and developed by Natalie Weizenbaum in 2006
- is free to download and use

#### 13. vite

https://vitejs.dev/

Vite (French word for "quick", pronounced /vit/, like "veet") is a build tool that aims to provide a faster and leaner development experience for modern web projects. It's a bundler which wraps each of used dependencies in the project and provide features as:

1. Instant Server Start
   On demand file serving over native ESM, no bundling required!
2. Lightning Fast HMR
   Hot Module Replacement (HMR) that stays fast regardless of app size.
3. Rich Features
   Out-of-the-box support for TypeScript, JSX, CSS and more.
4. Optimized Build
   Pre-configured Rollup build with multi-page and library mode support.
5. Universal Plugins
   Rollup-superset plugin interface shared between dev and build.
6. Fully Typed APIs
   Flexible programmatic APIs with full TypeScript typing.

###### Browser Support

During development, Vite sets esnext as the transform target, because we assume a modern browser is used and it supports all of the latest JavaScript and CSS features. This prevents syntax lowering, letting Vite serve modules as close as possible to the original source code.

For the production build, by default Vite targets browsers that support native ES Modules, native ESM dynamic import, and import.meta. Legacy browsers can be supported via the official @vitejs/plugin-legacy. See the Building for Production section for more details.
