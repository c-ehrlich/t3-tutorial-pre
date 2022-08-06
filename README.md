# t3 stack tutorial

## Who am I
- Full stack developer
- Self taught
- Before that teacher/lecturer
- Contributor to create-t3-app which we will be using to bootstrap the project
- TKTK other stuff to make people want to follow this video
- This is my first time teaching WEB DEV, so if you decide to watch this and follow along I'd love your feedback in the end

## Who is this for?
- New developers with a bit of self teaching Web Dev experience (freeCodeCamp etc)
  - You should have beginner level understanding of both frontend and backend (for example you have made a React app and an Express API in the past)
- More experienced web developers who are new to the T3 stack (you might want to fast forward in a few places)
- Experienced non-web Developers who want to learn a web stack that is modern but easy

## If you're not there yet
- If you don't know React yet - Jack Herrington's series
- If you don't know TypeScript yet - also Jack Herrington's series, or just follow along here anyway
- If you don't know APIs yet - FreeCodeCamp, and TomDoesTech

## What will this cover?
- Not just code-along, but also explaining concepts!
- All the main parts of the t3 stack
  - TypeScript - but we won't be writing much of it - hopefully this makes it less scary
  - Full stack Next.js - we use it on the frontend and backend
  - tRPC v10 - creating an end-to-end typesafe API
  - React Query (wrapped by tRPC) - consuming that API, and some advanced patterns
  - Prisma - ORM, CRUD operations
  - Next-Auth - using the GitHub Provider
  - Tailwind - very basic usage
- Deploying to Vercel

## What will this not cover?
- Nice styling/UI/UX
- Production database (I'd recommend PlanetScale or Amazon RDS)
- Testing
- Advanced Next-Auth patterns
- Websockets (due to Lambdas - use an external service!)
- Other deployment options
- Let me know if you are interested in a follow-up that covers 

## What will we be doing?
- Take a look at the finished app
- Introduce tech stack
- Build the app, explain concepts where necessary
- Deploy the app to Vercel (this won't take long!)

## What do you need?
- a package manager (we will use yarn classic, but you can also use npm or pnpm)
- a postgres database for development (see TKTK link)

## Links
- Docs
  - Next.js
  - tRPC
  - React Query
  - TKDodo
  - Tailwind
  - Next-Auth
  - Zod

Features to show
- Next.js
  - [x] _app.tsx
  - [x] pages
  - [x] components
  - senior folder structure
- tRPC
  - [x] Routing
  - [x] Queries & Mutations
  - [ ] Protected routes
  - [x] inferQueryOutput
- Next-Auth
  - [x] Discord Provider
  - Add another provider
  - [x] Login, logout
  - [x] Custom login page
- Prisma
  - [x] Making models
  - [x] Using Postgres
  - CRUD
  - Prisma Studio
  - Aggregate
- React Query
  - [x] Query
  - [x] Mutation
  - [x] Optimistic Updates
  - [x] Infinite Query
  - [ ] A query that doesn't fire automatically
- Zod
  - [x] creating a schema
  - [ ] inferring a type from it (hard to find a use for this in t3)
- Tailwind
  - not much

GitHub-Twitter
- [x] Auth
- [x] Custom Auth Page
- [x] Post schema
- [x] Create a post
- [x] get all posts - timeline on homepage
- [x] invalidate posts onComplete
  - [*] afterwards show in video that its stil slow on 3g
- [x] actual optimistic update
- [x] textbox styling
- [x] get all posts, this time with pagination (maybe do this later?)
  - [*] https://alpha.trpc.io/docs/useInfiniteQuery (www instead of alpha on final?)
- [x] bugfix: make post update the data again
- Dashboard
  - Not logged in: posts by public accounts, and a login button
  - Logged in: all posts
- User
  - Their avatar, Name, how many followers
  - a list of their posts with how many likes they have and a button to like them
  - click button: a popup for how many users have liked their posts in aggregate (prisma aggregate + delayed query)
- Post
  - Post
  - Created at
  - Edited if it has been edited
  - Button to edit it if the user owns the post
    - also protect the backend route