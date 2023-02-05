# Webtech Blogging App - BEnzMa

## Introduction

This is our ECE Webtech repository. On one hand, you can find the labs we did through the semester. On the other hand, you will find our project.

We did the labs and project together always on one computer for simplification purpose. It is therefore normal to find more pronounced commits on one account than on the other depending on the period.

## Project

### Installation instructions

- You can access to our website online at: https://ece-webtech-blogging-app-sigma.vercel.app

- To test it locally, follow the instructions below:

1. Clone our repository by running the following command on your terminal:

```bash
git clone https://github.com/enzo2346/webtech-project.git
```

or (if you want to use SSH)

```bash
git clone git@github.com:enzo2346/webtech-project.git
```

2. On you terminal, go to the root directory of the application (inside the /app folder) and run:

```bash
npm i
```

3. Once the command done, run the final commands:

```bash
npm run build
npm start
```

### Usage

After following the local installation instructions, you can access the application at: http://localhost:3000

To test the application, you can either create your own account (using github account for example) or take one of the below:

1. user:

```bash
matthieu.b.92400@gmail.com
```

```bash
matthieu.brice@edu.ece.fr
```

```bash
enzogallos91@gmail.com
```

2. admin:

```bash
steamallguys@gmail.com
```

The password is the same for all accounts:

```bash
123456
```

### Comments

| Functionnality                  | Anonymous | User | Admin  | Comments                                                                                                                                                  |
|---------------------------------|-----------|------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| see articles/comments           | ✓         | ✓    | ✓      | allow everyone to see articles and comments                                                                                                               |
| create personal articles        | ✗         | ✓    | ✗      | only authentificated users can create article                                                                                                             |
| Update/delete personal articles | ✗         | ✓    | ✗      | users can manage their own articles                                                                                                                       |
| Update/delete all articles      | ✗         | ✗    | ✓      | only admin can manage all articles to moderate them                                                                                                       |
| likes on articles               | ✗         | ✓    | ✓      | users and admins can like articles to support their creator                                                                                               |
| create personal comments        | ✗         | ✓    | ✓      | only authentificated users can create comments   -   we decide to remove this privilege for anonymous users beause this is commonly the case for websites                                                                                                       |
| Update/delete personal comments | ✗         | ✓    | ✓      | users can manage their own comments                                                                                                                       |
| Update/delete all comments      | ✗         | ✗    | ✓      | only admins can manage all comments to moderate them                                                                                                      |
| contact us                      | ✓         | ✓    | ✗      | only anonymous and users can send contact us form to ask questions to admins or to give feedback                                                          |
| see/delete contact us form      | ✗         | ✗    | ✓      | only admins can see and delete the form send by users and anonymous                                                                                       |
| home page                       | ✓         | ✓    | ✓      | allow everyone to access the home page which guide to login page and to articles page                                                                     |
| about us page                   | ✓         | ✓    | ✓      | allow everyone to access the about us page which introduce the application and our team                                                                   |
| dark mode                       | ✓         | ✓    | ✓      | allow everyone to change the dark/light mode   -   by default, the mode used is the one of the system   -   the mode selected will be used on every pages |
| profile page                    | ✗         | ✓    | ✓      | only users and admins can have access to their profile page to see their personals informations                                                           |
| update personal profile         | ✗         | ✓    | ✓      | only users and admins can manage their profile page to manage the informations given                                                                      |
| update all users profiles       | ✗         | ✗    | ✓      | only admins can manage all users' profile page to moderate them                                                                                           |
| gravatar integration            | ✗         | ✓    | ✓      | only users and admins have a gravatar icon which is unique   -   if the user have a gravatar account, it will display his icon instead                    |

Here are screenshots showing that RLS is enabled in all our tables in supabase:

![rls-1](/images/rls-1.png)
![rls-1](/images/rls-2.png)
![rls-1](/images/rls-3.png)

### Self-Evaluation

| Tasks                            | Validity  | Self. grade |
|:---------------------------------|:---------:|:-----------:|
| Naming convention                |     ✓     |     2/2     |
| Project structure                |     ✓     |     2/2     |
| Git                              |     ✓     |     2/2     |
| Code quality                     |     ✓     |     3/4     |
| Design, UX, and content	         |     ✓     |     4/4     |
| Home page                        |     ✓     |     2/2     |
| Login and profile page           |     ✓     |     4/4     |
| New articles creation            |     ✓     |     6/6     |
| New comment creation             |     ✓     |     4/4     |
| Resource access control          |     ✓     |     6/6     |
| Article modification             |     ✓     |     4/4     |
| Article removal                  |     ✓     |     2/2     |
| Comment modification             |     ✓     |     2/2     |
| Comment removal                  |     ✓     |     2/2     |
| Account settings                 |     ✓     |     4/4     |
| WYSIWYG integration              |     ✗     |     0/2     |
| Gravatar integration             |     ✓     |     2/2     |
| Light/dark theme                 |     ✓     |     2/2     |
| Accent color selection           |     ✗     |     0/4     |
| Total (without bonus)            |           |    53/60    |

| Bonus                                                                             | Validity  |
|:----------------------------------------------------------------------------------|:---------:|
| Likes on articles                                                                 |     ✓     |
| Users' profile pages display user information, their articles and comments        |     ✓     |
| Website is entirely responsive                                                    |     ✓     |
| Admin (update/delete any users articles/comments, update any users' profile, ...) |     ✓     |

## Authors

- GALLOS Enzo

- BRICE Matthieu

## Sources

https://codepen.io/dcode-software/pen/qBbGrLz
https://stackoverflow.com/questions/63519548/wait-for-dom-element-then-react-reactjs
https://tailwindui.com/components/marketing/sections/feature-sections
https://tailwindui.com/components/application-ui/forms/form-layouts
https://tailwindui.com/components/marketing/sections/cta-sections
https://tailwindui.com/components/marketing/sections/heroes
www.svgrepo.com
