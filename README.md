# Franco's Pizza Restaurant and Bar

A four page demonstration website designed and built by **Sirius Ascent** for
Franco's Pizza Restaurant and Bar, Villieria, Pretoria.

**Live demo:** <https://strauss3-coder.github.io/francos-pizza-restaurant-bar/>

Plain HTML, CSS and JavaScript. No build step, no framework, no dependencies.

---

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, dining experience, pizzas, bar, weekly specials, event nights, why visit, full gallery, hours, contact preview |
| `about.html` | About: who we are, what we stand for, services, location |
| `menu.html` | Menu and services: eight service cards, seven day specials board, full drinks list, event nights, ordering |
| `contact.html` | Contact: details, WhatsApp enquiry form, map area, full opening hours |

## Structure

```
.
├── index.html
├── about.html
├── menu.html
├── contact.html
├── css/
│   └── style.css          Design tokens + all site styles, in 16 labelled sections
├── js/
│   └── main.js            Nav, reveals, hours, lightbox, tabs, WhatsApp forms, easter eggs
└── assets/
    └── img/
        ├── brand/         Logo and favicon, cropped from the supplied artwork
        ├── food/          Food photography extracted from the supplied posters
        ├── specials/      All 19 supplied posters, sized for the lightbox
        └── thumbs/        Smaller versions of the same posters for grids
```

## Running it

Any static server works. From the repository root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Opening `index.html` directly from the file system also works.

## Deploying

This repository is the website. It is deployed on GitHub Pages from the `main`
branch root, so any push to `main` republishes the live demo within a minute or
two. It will also run as-is on Netlify, Vercel or Cloudflare Pages.

## Photography

The supplied images were marketing posters rather than plain photographs. The
food photography inside those posters was extracted at full resolution and is
used for the editorial imagery across the site (pizza, ribs, schnitzel, pork
chops, burger, wings and flatty chicken). The posters themselves are shown whole
and uncropped in the specials boards and the gallery, where they are the actual
content. The logo was cropped from the supplied artwork.

---

## WhatsApp enquiry system

There are no email forms anywhere on the site. Every enquiry route goes to WhatsApp.

The contact form collects **name, phone, email, subject and message**, validates
them in the browser, then opens WhatsApp with the message already written. The
visitor only has to press send.

The number lives in one place, at the top of `js/main.js`:

```js
var CONFIG = {
  whatsapp: '27826180225',   // full international format, digits only
  ...
};
```

Change that value and every form, button and floating action button follows.
The `wa.me/27826180225` links inside the HTML would also need updating if the
number ever changes.

## Opening hours

Hours are defined once in `js/main.js` under `CONFIG.hours`, in 24 hour decimal
form (`23.5` means 11:30 PM). The site uses them to:

- highlight today's row in the hours tables,
- show a live "Open now until…" or "Opens today at…" indicator in the top bar,
- open the specials board on the current day.

Times are calculated in `Africa/Johannesburg`, so they stay correct no matter
where the visitor is.

---

## Before this goes live

A short list of things that need the owner's input. Everything else is finished.

1. **Facebook and Instagram URLs.** No profile addresses were supplied, so the
   social buttons currently show a short message instead of guessing a link.
   Search for `data-placeholder` in the HTML and replace those anchors with the
   real `href` values.
2. **Google Map.** The contact page has a styled map panel with working "Open in
   Google Maps" and "Get directions" buttons pointing at the correct address. An
   embedded map iframe can be dropped into `.map-placeholder` once the Google
   Business profile is linked.
3. **Full food menu.** Only the specials boards were supplied, so no pizza names
   or prices have been invented. The menu page is built so a full menu section
   can be added without redesigning anything.
4. **Specials and prices.** These were read off the supplied posters and are
   shown with a note that they may change. Confirm they are current.
5. **Demo badge.** The footer reads `Designed by Sirius Ascent | Demo`. When the
   site goes live, remove the `<span class="badge-demo">Demo</span>` from the
   footer of all four pages.

---

## Notes on accuracy

Nothing on this site was invented. Every detail comes from either the written
brief or the supplied poster images:

- Name, address, phone number, category, services and opening hours: from the brief.
- Specials, prices, drinks lists, Quiz Night, Bingo Night and the Uber Eats and
  Mr D delivery mentions: read off the supplied posters.

There are no fabricated reviews, testimonials, staff members, awards, founding
dates or company history anywhere in the site.

Where the supplied posters contained obvious spelling slips, the wording has
been corrected for the website (for example "everday" to "every day"). Product
names and prices were not changed.

One conflict is worth flagging: the posters say "open every day 10 AM to
11:30 PM", while the brief gives Tuesday as 10:00 AM to 10:30 PM. The brief has
been treated as authoritative.

---

Designed and built by Sirius Ascent.
