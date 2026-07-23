# Database Package

The Prisma schema is located at:

```txt
packages/db/prisma/schema.prisma
```

Set the production database URL in:

```txt
packages/db/.env
apps/api/.env.local
```

Run all commands from the project root:

```txt
C:\Users\Admin\Desktop\event
```

## After Changing the Schema

After editing `schema.prisma`:

```bash
npm run db:push
npm run db:generate

npx prisma studio --schema packages/db/prisma/schema.prisma
```

- `db:push` updates database tables to match the schema.
- `db:generate` regenerates Prisma Client.

## Pulling the Schema from the Database

If tables or columns were changed directly in the database:

```bash
npm run db:pull
npm run db:generate
```

- `db:pull` writes the current database structure to `schema.prisma`.
- `db:generate` generates Prisma Client from the pulled schema.

## Validation and Studio

```bash
npm run db:validate
npm run db:studio
```

- `db:validate` checks whether the schema is valid.
- `db:studio` opens the database UI in the browser.
