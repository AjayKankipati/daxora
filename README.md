## Tech Stack

- **Frontend**: Next.js (React)
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma
- **Authentication**: NextAuth.js
- **Styling**: TailwindCSS

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd Daxora_TakeHome
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

4. Initialize the database and seed data:
```bash
npx prisma db push
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000` 

## Test Users

1. John Doe
   - Email: john@example.com
   - Password: password123

2. Jane Smith
   - Email: jane@example.com
   - Password: password456

3. Bob Wilson
   - Email: bob@example.com
   - Password: password789

## API Routes

- `GET /api/user` - Fetch logged-in user details
- `GET /api/subscriptions` - Fetch user's subscriptions


## Database Schema

The application uses SQLite with Prisma ORM. The schema includes:

- User model (id, name, email, password)
- Subscription model (id, name, status, amount, nextBillingDate)

