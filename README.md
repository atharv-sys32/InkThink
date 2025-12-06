# InkThink - Blog Management Platform

A full-stack blog management platform built with **NestJS**, **GraphQL**, **React**, and **PostgreSQL**. Features a modern admin panel for content management and a public-facing blog for readers.

## Features

### Admin Panel
- **Posts Management**: Create, edit, delete, and publish blog posts with rich content
- **Categories & Tags**: Organize content with categories and tags
- **Comments Moderation**: View and moderate comments (mark as spam/not spam)
- **Image Uploads**: Upload images via Supabase Storage
- **User-specific Content**: Admins can only see and manage their own content

### Viewer/Blog Mode
- **Public Blog**: Browse published posts by category or tag
- **Commenting System**: Logged-in viewers can leave comments on posts
- **Responsive Design**: Mobile-friendly interface

### Authentication & Authorization
- **JWT-based Authentication**: Secure login and registration
- **Role-based Access Control**: Three user roles:
  - `admin` - Full admin panel access
  - `user` - Content creator access (can access admin panel)
  - `viewer` - Can view blog and comment on posts
- **Protected Routes**: Role-based route protection

## Tech Stack

### Backend (Server)
- **NestJS** - Progressive Node.js framework
- **GraphQL** with Apollo Server
- **TypeORM** - Database ORM
- **PostgreSQL** - Relational database
- **Passport JWT** - Authentication
- **Class Validator** - Input validation

### Frontend (Client)
- **React 18** with Vite
- **Material-UI (MUI)** - UI component library
- **Apollo Client** - GraphQL client
- **React Router v6** - Routing
- **Supabase JS** - File storage
- **Formik + Yup** - Form handling and validation

## Project Structure

```
inkthink/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── graphql/        # GraphQL queries and mutations
│   │   ├── layout/         # Layout components (Dashboard, Blog)
│   │   ├── pages/          # Page components
│   │   │   ├── authentication/  # Admin login/register
│   │   │   ├── viewer-auth/     # Viewer login/register
│   │   │   ├── blog/            # Public blog pages
│   │   │   ├── posts/           # Post management
│   │   │   ├── categories/      # Category management
│   │   │   ├── tags/            # Tag management
│   │   │   └── comments/        # Comment management
│   │   ├── routes/         # Route definitions
│   │   └── utils/          # Utility functions
│   └── .env                # Environment variables
│
├── server/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── user/           # User module
│   │   ├── post/           # Post module
│   │   ├── category/       # Category module
│   │   ├── tag/            # Tag module
│   │   ├── comment/        # Comment module
│   │   └── common/         # Shared constants and enums
│   └── .env                # Environment variables
│
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** (>= 18.x)
- **PostgreSQL** (>= 14.x)
- **npm** or **yarn**
- **Supabase Account** (for image storage)

### Database Setup

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE inkthink;
   ```

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=your-db-user
   DATABASE_PASSWORD=your-db-password
   DATABASE_NAME=inkthink
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

   The GraphQL playground will be available at `http://localhost:5000/graphql`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server:
   ```bash
   npm run start
   ```

   The application will be available at `http://localhost:3000`

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Create a storage bucket (e.g., `InkThink-img`)

3. Set up bucket policies for public access:
   - Enable SELECT for public access (to view images)
   - Enable INSERT for authenticated/anon users (to upload images)

4. Upload your logo as `inkthink-logo.png` in the bucket

## Usage

### Landing Page
Visit `http://localhost:3000` to see the landing page with options to:
- **View Blogs** - Go to the public blog
- **Admin Panel** - Access the content management system

### Admin Panel
1. Register a new admin account at `/admin/register`
2. Login at `/admin/login`
3. Access the dashboard to manage:
   - Posts (create, edit, delete, publish)
   - Categories (organize posts)
   - Tags (label posts)
   - Comments (moderate user comments)

### Viewer/Blog
1. Register a viewer account at `/viewer/register`
2. Login at `/viewer/login`
3. Browse posts at `/blog`
4. Leave comments on individual posts

## API Endpoints

The backend exposes a GraphQL API at `/graphql`. Key operations include:

### Queries
- `posts` - Get all posts
- `post(id)` - Get a single post
- `categories` - Get all categories
- `tags` - Get all tags
- `comments` - Get all comments
- `users` - Get all users

### Mutations
- `createPost` / `updatePost` / `removePost`
- `createCategory` / `updateCategory` / `removeCategory`
- `createTag` / `updateTag` / `removeTag`
- `createComment` / `updateComment` / `removeComment`
- `createUser` - User registration
- `login` - User authentication

## Environment Variables

### Server (.env)
| Variable | Description |
|----------|-------------|
| `DATABASE_HOST` | PostgreSQL host |
| `DATABASE_PORT` | PostgreSQL port |
| `DATABASE_USER` | Database username |
| `DATABASE_PASSWORD` | Database password |
| `DATABASE_NAME` | Database name |
| `JWT_SECRET` | Secret key for JWT tokens |

### Client (.env)
| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |

## Scripts

### Server
```bash
npm run start:dev    # Start development server with hot reload
npm run start:prod   # Start production server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test         # Run tests
```

### Client
```bash
npm run start        # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- UI Template based on [Mantis Free React Admin Template](https://github.com/codedthemes/mantis-free-react-admin-template)
- Icons from [Ant Design Icons](https://ant.design/components/icon)
