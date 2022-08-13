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
  - you've learned the basics but now it feels like there's a huge gap stopping you from making 'real' apps
  - You should have basic understanding of both frontend, backend, and databases (for example you have made a React app, and an Express API that talks to a SQL or Mongo database in the past)
- More experienced web developers who are new to the T3 stack (you might want to fast forward in a few places)
- Experienced non-web Developers who want to learn a web stack that is modern but easy

## If you're not there yet
- If you don't know React yet - Jack Herrington's series
- If you don't know TypeScript yet - also Jack Herrington's series, or just follow along here anyway
- If you don't know APIs yet - FreeCodeCamp, and TomDoesTech
- If you don't know DBs yet - Also FreeCodeCamp? Or CS50x

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
- Let me know if you are interested in a follow-up that covers any of these things

## What will we be doing?
- Take a look at the finished app
- Introduce tech stack
- Build the app, explain concepts where necessary
- Deploy the app to Vercel (this won't take long!)

## What do you need?
- a package manager (we will use yarn classic, but you can also use npm or pnpm)
- a postgres (or mysql but you have to change it in the schema) database for development (see TKTK link)
- if you want to deploy it, a postgres (or other sql) database

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
- Next.js / React
  - [x] _app.tsx
  - [x] pages
  - [x] components
  - [x] custom hooks
- tRPC
  - [x] Routing
  - [x] Queries & Mutations
  - [x] Protected routes
  - [x] inferQueryOutput
  - [x] custom inferred types w/ generics
- React Query
  - [x] Query
  - [x] Mutation
  - [x] Optimistic Updates
  - [x] Infinite Query
  - [x] A query that doesn't fire automatically
- Next-Auth
  - [x] Discord Provider
  - [x] Login, logout
  - [x] Custom login page
- Prisma
  - [x] Making models
  - [x] Using Postgres
  - [x] CRUD
  - [x] Prisma Studio
  - [x] Aggregate
  - [x] Add/remove relations
- Zod
  - [x] creating schema
  - [x] inferring types from schema
  - [x] using variables in schema
- Tailwind
  - [x] Just basic stuff

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
- [x] user profile
  - [x] with temp posts
  - [x] with create post box if we're on our own profile
  - [x] load in real posts later as infinite query and invalidate the right thing on new post
  - [x] proper error on nonexistent user
- [x] fix console error (breaking hooks rules?)
- [x] edit post
  - [x] without optimistic update
  - [x] with optimistic update
- [x] make infinite query limit global
- [x] count of followers, following, posts on profile - use prisma count
- [x] you can follow other users, including optimistic updates
- [x] you can unfollow other users, including optimistic updates
- [x] FIX: follow button visible on own profile
- [x] view timeline of only posts by people you're following
- [x] Search
  - [x] Basic
  - [x] Infinite Query  
- [x] Show some TS generic stuff to simplify trpc inferred types
- [x] can like/unlike posts
  - [x] with optimistic updates
- [x] Extract some mutations into hooks (explain why you might want to do this)
- [] Refactor DB access code
  - [x] Paginated Searches
  - [x] CreatePost
  - [ ] All Searches

HOMEWORK after watching the video

- [ ] can reply to posts, add a single post view page that shows replies
- [ ] post can show how many replies it has and what it is a reply to
- [ ] add count of how many liked posts a user has, clicking this opens /user/[...id]/liked
- [ ] a page /user/[...id]/liked that shows anyone's liked posts
- [ ] pages or modals that shows who a user's followers are, or who a user is following
- [ ] make the app look good
- [ ] Likes: Having to modify prisma calls in 4 different functions shows that there's probably a better way to generalize some of this stuff