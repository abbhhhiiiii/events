# Database Package

Prisma schema yahan hai:

```txt
packages/db/prisma/schema.prisma
```

Real database URL yahan set karo:

```txt
packages/db/.env
apps/api/.env.local
```

Saare commands root se run karo:

```txt
C:\Users\Admin\Desktop\event
```

## Agar Schema Change Kiya

`schema.prisma` edit karne ke baad:

```bash
npm run db:push
npm run db:generate
```

- `db:push` database tables ko schema ke hisaab se update karta hai.
- `db:generate` Prisma Client regenerate karta hai.

## Agar Database Se Schema Pull Karna Ho

Database me direct table/column changes kiye ho to:

```bash
npm run db:pull
npm run db:generate
```

- `db:pull` database ka current structure `schema.prisma` me laata hai.
- `db:generate` pulled schema ke hisaab se Prisma Client banata hai.

## Check Aur Studio

```bash
npm run db:validate
npm run db:studio
```

- `db:validate` schema valid hai ya nahi check karta hai.
- `db:studio` browser me database UI open karta hai.
