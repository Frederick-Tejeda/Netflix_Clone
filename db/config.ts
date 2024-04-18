import { defineDb, column, defineTable } from 'astro:db';

// watching: column.text(),
// watchList: column.text(),
// favorites: column.text(),

const Users = defineTable({
  columns: {
    id: column.number({unique: true}),
    user: column.text({unique: true}),
    name: column.text(),
    keepLoggedIn: column.boolean()
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: { Users }
});
