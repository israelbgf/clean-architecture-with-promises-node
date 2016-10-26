# Clean Architecture with Promises + Node.js (version 6+)

This sample project, shows a proposal of how implement the Clean Architecture with Node.js, ES6 Promises and simple functions.
 
![](https://8thlight.com/blog/assets/posts/2012-08-13-the-clean-architecture/CleanArchitecture-8b00a9d7e2543fa9ca76b81b05066629.jpg)
 
- **Entity:** Any pure function shared across the usecases.
- **Usecase:** Just a function with arguments. Gateways are inject as simple function arguments (`Currying` can help to avoid some verbosity). It should return a Promise because the gateways are probably going to be async too.
- **Gateways:** Non-pure functions that are passed as arguments to the usecase.
- **Presenter:** Implemented as the `resolve` method of the usecase Promise. We can pass an object to it with the action name and the data related to the event.
- **Controller:** Anything that will invoke the Usecase (Browser or Node)

But, there's a gotcha: Breaking promises chain is not quite straightforward. So far, it seems that the only way (without ES7 or external libraries) is just throwing a custom exception. As alternative I could just chain the promises, but that would be the infamous "callback hell" with a new syntax (Promises exist to solve this problem too, right?).

Any ideas? Make a PR and let discuss. :)


## Test

```bash
npm install 
npm run test
```

You can swap the usecase implementation of the test easily in the source code, play with it!

**Rembember! you need to use the latest Node version that support ES6 syntax**
