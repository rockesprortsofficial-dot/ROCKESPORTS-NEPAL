# ROCK ESPORTS — Online Owner CMS

This is the production-ready website structure for:
- Secure Supabase owner login
- Website-internal owner editor
- 8 management slots with photo/name/position/bio
- 16 member slots with photo/name/role/bio
- Online news CRUD
- Online tournament CRUD
- Home/About/Social editing
- Supabase Storage for photos
- Public website reading the same online database
- SEO metadata and responsive professional design

## One-time setup
1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase_schema.sql`.
3. Create ONE owner account under Authentication > Users.
4. Copy `config.example.js` to `config.js`.
5. Put your Supabase project URL and publishable anon key in `config.js`.
6. Upload the entire folder to the root of your GitHub Pages repository.
7. Open `/admin.html`, login with the owner account, and edit/save.

Never put a Supabase service_role key in `config.js`.
