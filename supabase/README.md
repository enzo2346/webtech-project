# Local database

## Instructions

To use a local instance of supabase you need to follow the steps below:

1. Clone this repository and navigate to the [supabase](https://github.com/enzo2346/webtech-project/tree/main/supabase) folder in your terminal.

2. Copy the "./supabase/.env.example" file into "./supabase/.env"

3. run the docker-compose:

```bash
docker compose -f ./docker-compose.yml -f ./dev/docker-compose.dev.yml up
```

4. From the [Supabase Studio](http://localhost:3001), go to the table editor and click on the "New Table" button.
Fill the necessary tables by following the screenshots below. On each of these tables, "Is identity" is checked on each primary key, and when the setting wheel is indicating 1 "Is nullable" is checked (except in the primary key).

![articles](/images/articles-table.png)
![comments](/images/comments-table.png)
![contacts](/images/contacts-table.png)
![likes](/images/likes-table.png)
![profiles](/images/profiles-table.png)

5. You need to add foreign keys by editing the column uid and id_article in each table by following the steps below:

![edit](/images/edit-table.png)
![add-fk](/images/add-fk.png)

For id_article:

![id_article](/images/id-article.png)

For uid:

![uid](/images/uid.png)

6. Finally in your [app/.env](https://github.com/enzo2346/webtech-project/blob/main/app/.env) file replace the url and anon key by your local one. These key can be found in Supabase Studio in settings/api

You can then use our application freely with a local database.
